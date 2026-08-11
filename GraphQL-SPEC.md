# Sandbox GraphQL Maze Generation Specification

## Status

Approved design based on the repository review and product interview. This document specifies implementation work; it does not itself implement the feature.

## Goal

Expose `generateSandboxMaze` through the existing GraphQL endpoint at `/api/graphql`. Every execution must perform a new server-side maze-generation attempt using the requested algorithm, row count, and column count, and must return the maze's raw v1 canonical ID.

The sandbox must stop running DFS, Prim, or Eller generation in the browser. It will request a canonical ID, combine that identity with sandbox-owned presentation settings such as spacing, decode it through `MazeCodec`, and render the resulting `MazeState`.

Example GraphQL result value:

```text
v1:12x12:<topology>:start=0,0:end=<x>,<y>
```

The API must not return a pathname, query string, percent-encoded URL component, `s` parameter, SVG coordinate, width, height, or other presentation value.

## Architectural decisions

1. **Server owns generation.** The sandbox client never instantiates `DfsEngine`, `PrimEngine`, or `EllerEngine` and never generates topology locally.
2. **`MazeCodec` remains the identity boundary.** The server uses it to produce a raw canonical ID; the browser uses it to parse and decode that ID with local spacing.
3. **GraphQL returns a scalar.** `generateSandboxMaze` returns `String!`, not a wrapper object. Algorithm and dimensions are already known from the request, and dimensions are embedded in the canonical ID.
4. **Presentation stays client-side.** The sandbox supplies spacing only to `MazeCodec.parseCanonicalId` and URL utilities. Spacing is not a GraphQL argument.
5. **Every invocation reaches the server.** The Apollo operation uses `fetchPolicy: "no-cache"`, and the UI prevents concurrent duplicate clicks. The Next.js GraphQL route is invoked by POST and is not statically cached.
6. **Fresh means a new generation attempt.** Two identical requests must execute the generator twice. Absolute canonical-ID uniqueness is not guaranteed because randomized generators can theoretically produce the same topology, particularly for small mazes.
7. **Successful state is committed atomically.** The currently displayed maze and browser URL remain unchanged until a response has been received, parsed, validated, and decoded successfully. After the decoded maze renders, the client writes its canonical shareable URL.
8. **Existing shareable URLs keep working.** Loading a supported canonical or legacy maze URL decodes that URL locally rather than replacing it with a newly generated maze. A GraphQL request is made when no encoded maze is present or when the user requests a fresh maze.

## GraphQL contract

The existing endpoint remains:

```text
POST /api/graphql
```

The schema contract is:

```graphql
enum MazeAlgorithm {
  DFS
  ELLER
  PRIM
}

input GenerateSandboxMazeInput {
  algorithm: MazeAlgorithm!
  rows: Int!
  cols: Int!
}

type Query {
  generateSandboxMaze(input: GenerateSandboxMazeInput!): String!
}
```

Example operation:

```graphql
query GenerateSandboxMaze($input: GenerateSandboxMazeInput!) {
  generateSandboxMaze(input: $input)
}
```

Example variables:

```json
{
  "input": {
    "algorithm": "PRIM",
    "rows": 12,
    "cols": 12
  }
}
```

The successful field value is the unescaped canonical ID returned by `MazeCodec.getCanonicalId`. JSON transport escaping is allowed, but URL percent-encoding is not part of the GraphQL value.

### Validation and errors

- `algorithm`, `rows`, and `cols` remain required.
- GraphQL's `Int` and enum coercion handle non-integers, unknown algorithms, nulls, and missing values before resolver execution.
- The resolver retains the current inclusive dimension range of 2 through 20 for both axes.
- A dimension violation returns a `GraphQLError` with `extensions.code = "BAD_USER_INPUT"` and the existing lower/upper-bound message.
- Generation and codec failures are not converted into successful strings. They propagate through GraphQL's error response; because the return field is non-null, the response data is null.
- The endpoint performs no URL construction and imports nothing from `web-utilities.ts`.

## Server generation flow

For every resolver execution:

1. Validate rows and columns.
2. Map the GraphQL enum directly to its matching engine.
3. Build the engine's logical grid using its internal spacing sentinel of `2`. This value exists only to preserve the engines' current integer node-key math; it must not escape into the API response.
4. Run the selected engine exactly once.
5. Convert the returned inactive-wall route into paths and connected nodes.
6. Set the destination returned by the engine.
7. Encode the logical maze with `MazeCodec.encode`.
8. Return `MazeCodec.getCanonicalId(encodedMaze)` unchanged.

The helper's synthetic `height` and `width` should be derived from logical dimensions rather than hard-coded sandbox pixels. The generated perfect maze must contain `rows * cols - 1` passages after decoding.

## Sandbox client flow

### Initial load

1. The sandbox retains its current presentation configuration of a 600-by-600 available area and spacing `40`.
2. Rows and columns are calculated with the existing formula: `floor((availableDimension * 0.80) / spacing)`. With the current values, the request is 12 rows by 12 columns.
3. If the URL contains a supported `maze` canonical ID or legacy `h` representation, parse and decode it with the URL's presentation spacing (falling back through the existing URL utility behavior). Do not call GraphQL for this case.
4. Otherwise, choose an algorithm with the existing random algorithm selection, translate the lowercase UI key to the GraphQL enum, and execute `generateSandboxMaze`.
5. Parse the returned string with `MazeCodec.parseCanonicalId(canonicalId, { spacing })`, then call `MazeCodec.decode`.
6. Only after both calls succeed, commit the new `MazeState` and selected algorithm for rendering.
7. In a post-render effect, write `maze=<percent-encoded canonical ID>&s=40` to the current URL with `history.replaceState`.

The initial request displays a simple generating state in place of the maze. If it fails, show the failure alert and a retry control because no prior maze exists to retain.

### Fresh-maze action

The sandbox exposes one controlled generation form with algorithm, row, and column selects plus a **refresh** submit button.

1. Ignore additional clicks while a request is in flight.
2. Changing a select updates only local form state and never executes GraphQL.
3. The algorithm options are Select algorithm, DFS, Prim, and Eller. Rows and columns each offer every integer from 3 through 20.
4. Submit the selected algorithm, rows, and columns only when the user clicks refresh.
5. Keep the current maze and URL visible while awaiting the response.
6. Parse and decode the response before committing it.
7. On success, replace the visible maze and update the algorithm label.
8. After the new walls render, replace the URL with that maze's canonical shareable URL without reloading the page.
9. On any network, GraphQL, malformed-canonical-ID, or decode failure, retain both the previous maze and the complete previous URL and call:

   ```ts
   window.alert("Unable to generate a maze. Please try again.")
   ```

### Shareable URL behavior

- The sandbox has no manual encode or decode buttons.
- Every successfully generated maze automatically receives `maze=<percent-encoded canonical ID>&s=40` after rendering.
- Refreshing or directly opening that URL decodes it locally and makes no GraphQL request.
- Existing backward-compatible URL parsing remains available during initial page load.
- A URL-loaded maze initializes row and column form values from its canonical dimensions and initializes the algorithm to Select algorithm.
- The canonical ID does not preserve the generation algorithm, so a maze opened from a shared URL does not show an algorithm label unless that information is already available in the current session.
- **print state** remains available but is owned by the sandbox page rather than the maze renderer.

### Loading and concurrency behavior

- Use Apollo Client 4's React exports from `@apollo/client/react` and core exports from `@apollo/client`.
- Use `useLazyQuery` so initial generation, retry, and refresh share one explicit request path.
- Configure the generation operation with `fetchPolicy: "no-cache"`; do not rely on `refetch` or the normalized cache for freshness.
- Guard the initial effect so React development-mode effect replay cannot intentionally initiate two first-load generations.
- Disable the complete generation form while a request is active. A currently displayed maze remains playable and its shareable URL remains unchanged during the request.
- Treat a missing/empty `data.generateSandboxMaze` value as a failure even if no transport exception was thrown.
- Show only one alert for a failed attempt.

## Component ownership

The sandbox page becomes the controller and single owner of generated/decoded maze state:

- It owns GraphQL execution, loading state, successful `MazeState`, form selections, URL initialization, retries, alerts, and the print-state developer action.
- `SandboxMazeForm` receives controlled algorithm, row, and column values and emits selection changes or an explicit refresh submission.
- `SandBoxMazeGraph` becomes a controlled renderer. It receives only a decoded `MazeState` and optional container class.
- `SandBoxMazeGraph` no longer owns generation lifecycle logic and no longer imports any maze engine.
- Player movement remains encapsulated by `PlayerNode`; this change does not move keyboard or animation behavior into the page.

The Apollo provider is scoped to `/sandbox`; the root layout and unrelated pages do not need GraphQL context.

## Exact file changes

### Create

#### `src/app/sandbox/sandbox-maze-form.tsx`

- Render controlled Algorithm, Rows, and Columns selects and a refresh submit button.
- Offer dimension values 3 through 20.
- Keep Select algorithm as an explicit neutral value and disable refresh until a concrete algorithm and selectable dimensions are present.
- Disable the entire fieldset while generation is in flight.
- Do not execute GraphQL from select change handlers.

#### `src/app/api/graphql/resolvers.test.ts`

Add GraphQL-boundary tests using the existing Apollo server's `executeOperation` facility. Cover:

- each enum value returns a parseable raw v1 canonical ID;
- the returned string begins with `v1:` and never begins with `maze=`, `?`, or `/sandbox`;
- the returned string contains no `s` presentation parameter;
- decoded dimensions match the request and the decoded maze has `rows * cols - 1` passages;
- dimensions below 2 and above 20 return `BAD_USER_INPUT`;
- an invalid enum is rejected by GraphQL coercion;
- two identical operations invoke generation twice rather than resolving from client/server cache (test invocation, not guaranteed topology inequality).

### Modify

#### `src/app/api/graphql/schema.ts`

- Keep `MazeAlgorithm` and `GenerateSandboxMazeInput`.
- Remove `GeneratedSandboxMaze`.
- Change `generateSandboxMaze` to return `String!` directly.

#### `src/app/api/graphql/resolvers.ts`

- Keep range validation and error codes.
- Delegate generation to the presentation-independent engine helper.
- Return its raw canonical-ID string directly.
- Remove stale implementation comments, commented-out code, URL-related validation, and wrapper-object handling.
- Do not catch internal errors merely to place their text in a successful GraphQL payload.

#### `src/maze/engine/engine-utils.ts`

- Rename `getSolvableMazeWithoutSpacing` to `generateCanonicalMaze`.
- Return a raw `string` from `MazeCodec.getCanonicalId` rather than a `GeneratedSandboxMaze` wrapper.
- Remove `GeneratedSandboxMaze` and the import/use of `encodeCanonicalIdForUrlParams`.
- Preserve enum-to-engine dispatch and creation of connected nodes before encoding.
- Replace hard-coded 600-pixel synthetic dimensions with values derived from logical rows, columns, and the internal engine spacing sentinel.

#### `src/maze/engine/engine-utils.test.ts`

- Update imports and calls for `generateCanonicalMaze`.
- Parse the result directly with `MazeCodec.parseCanonicalId`; do not pass it through `URLSearchParams`.
- Keep engine-dispatch coverage for DFS, Eller, and Prim.
- For each engine, assert the raw canonical contract, requested dimensions, and perfect-maze passage count.

#### `src/maze/types.ts`

- Rename `GenerateMazeWithoutSpacingInput` to `GenerateSandboxMazeInput` so shared TypeScript terminology matches the GraphQL input and does not imply presentation spacing is accepted.
- Keep `MazeAlgorithm` as the uppercase GraphQL/server enum union and `AlgorithmKey` as the lowercase UI/engine-display union.
- Keep `GenerateSandboxMazeArgs`, updating it to reference `GenerateSandboxMazeInput`.
- Add or export the operation result/variables types needed by the typed Apollo document; the result shape is `{ generateSandboxMaze: string }`.

#### `src/graphql/operations/generateSandboxMaze.ts`

- Change the selection from the obsolete object fields to the scalar `generateSandboxMaze` field.
- Type the document with `TypedDocumentNode` using the shared result and variables types.
- Keep the operation name `GenerateSandboxMaze` and exported constant `GENERATE_SANDBOX_MAZE`.

#### `src/graphql/client.ts`

- Populate the existing empty file with one browser Apollo client.
- Use `HttpLink` with the relative URI `/api/graphql` and an `InMemoryCache`.
- Do not configure credentials, auth, persistence, SSR hydration, polling, retries, or global no-cache behavior. Freshness is specific to the generation operation.

#### `src/graphql/GraphQLProvider.tsx`

- Mark the existing empty file as a client module.
- Render Apollo Client 4's `ApolloProvider` around `children` using the shared client.
- Keep the provider free of maze-specific behavior.

#### `src/app/sandbox/page.tsx`

- Scope `GraphQLProvider` around the sandbox controller.
- Own `useLazyQuery`, the no-cache policy, request variables, initial URL decoding, successful maze state, rendered algorithm, controlled form selections, initial loading/retry UI, post-render URL updates, response validation, and failure alerts.
- Preserve the existing page layout and the current 600/600/40 presentation configuration.
- Pass decoded state to the controlled graph and form state/callbacks to `SandboxMazeForm`.
- Write the canonical shareable URL only after a generated maze has been successfully decoded and rendered.

#### `src/maze/maze-graphs/sandbox-maze-graph.tsx`

- Convert the component from generation-owning state to a controlled maze renderer (class or function is acceptable, but it must not copy props into an independently divergent generation state).
- Remove `DfsEngine`, `PrimEngine`, `EllerEngine`, `getBlankNodesForEngine`, `getRandomEngine`, and mount-time generation imports/logic.
- Render walls, nodes, player, and destination from the decoded `MazeState` supplied by the page.
- Remove the encode and decode controls.
- Keep generation controls outside the renderer in `SandboxMazeForm`.
- Remove print-state handling from the renderer and preserve gameplay and SVG behavior.

#### `src/web-utilities.test.ts`

- Retain existing canonical and legacy URL coverage.
- Add coverage that parses the same raw canonical ID at two presentation spacings and passes each value through the existing `getSearchParamsFromEncodedMaze` helper. Assert that the `maze` parameter stays identical while only `s` changes.
- Do not change the canonical URL format.

### Intentionally unchanged

- `src/app/api/graphql/route.ts`: keep the typed Next.js App Router GET/POST wrappers around the integration handler; the sandbox uses POST through `HttpLink`.
- `src/app/api/graphql/server.ts`: the existing Apollo server assembly remains valid.
- `src/app/layout.tsx`: the provider is sandbox-scoped rather than global.
- `src/maze/codec/maze-codec.ts` and codec helpers: canonical parsing, validation, encoding, legacy decoding, and presentation separation already provide the required boundary.
- `src/web-utilities.ts`: its existing parse/write helpers already keep the canonical ID and presentation spacing separate.
- `src/maze/maze-graphs/primary-maze-graph.tsx`: client generation on the non-sandbox demo path is outside this feature.
- `package.json`: the required Apollo Client, Apollo Server, Next integration, GraphQL, React, and Vitest packages are already installed.

## Acceptance criteria

1. Opening `/sandbox` with no maze parameters makes one GraphQL request and renders the returned maze.
2. The browser sandbox bundle does not import or execute any maze-generation engine through `sandbox-maze-graph.tsx` or `sandbox/page.tsx`.
3. The GraphQL result is a raw canonical ID and contains no presentation or URL formatting.
4. The rendered rows, columns, topology, start, and destination match the returned canonical ID.
5. Spacing changes affect rendering and the `s` URL parameter but do not change the canonical ID.
6. Changing algorithm, row, or column selections performs no GraphQL request.
7. Repeated identical inputs reach server generation each time.
8. Clicking refresh performs one no-cache GraphQL request with the selected algorithm, rows, and columns.
9. A generated maze writes `maze=...&s=...` only after its rendered state commits.
10. Refreshing or opening a valid canonical or legacy shared URL renders that maze without generating a replacement and populates its dimensions in the form.
11. URL-loaded mazes show Select algorithm until the user selects one.
12. Any generation failure displays the specified alert and does not change an existing maze or URL.
13. Invalid GraphQL inputs return GraphQL errors rather than encoded error strings.
14. `npm run test:run` and `npm run lint` pass.
15. `npm run build` passes in an environment that can resolve the existing `next/font` Google font downloads; changing font behavior is not part of this work.

## Explicitly out of scope

- Database storage, canonical-ID deduplication, seeds, reproducible random generation, or global uniqueness guarantees.
- Authentication, authorization, rate limiting, quotas, observability, or persisted GraphQL operations.
- GraphQL subscriptions, mutations, polling, batching, SSR data prefetching, or cache persistence.
- Adding spacing, dimensions in pixels, colors, animation state, viewport data, or URL strings to the GraphQL response.
- Adding free-form dimension inputs, dimensions outside 3–20 for new requests, or broader sandbox styling changes beyond the generation form.
- Replacing `window.alert` with a toast system or broader notification framework.
- Changing the v1 codec format, removing legacy URL decoding, or introducing codec v2.
- Refactoring the primary/demo maze graph to use GraphQL.
- Guaranteeing that two independent random attempts cannot coincidentally yield the same canonical ID.
- Adding a new browser end-to-end testing framework or fixing the repository's external Google Fonts build dependency.
- Modifying the pre-existing staged changes in `src/defaults.ts` or the unrelated comment-only staged change in `src/maze/engine/engine-utils.ts`; implementation must preserve user-owned work when touching overlapping files.
