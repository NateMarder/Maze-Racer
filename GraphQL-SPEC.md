# GraphQL Maze Generation Specification

## Purpose and boundary

The GraphQL API is the exclusive maze-generation boundary for browser clients.
Clients choose an algorithm and dimensions, while the server owns engine
selection, randomized generation, and canonical encoding. The response contains
only a canonical maze ID; rendering concerns such as SVG spacing, colors,
animation, and viewport size remain client responsibilities.

The current endpoint is `/api/graphql`. The Next.js route accepts GraphQL `GET`
and `POST` requests, while the Apollo sandbox client sends its query to that
endpoint and uses a `no-cache` fetch policy.

## Schema

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

## Example request and response

```graphql
query GenerateSandboxMaze($input: GenerateSandboxMazeInput!) {
  generateSandboxMaze(input: $input)
}
```

```json
{
  "input": {
    "algorithm": "PRIM",
    "rows": 4,
    "cols": 4
  }
}
```

A successful response returns the raw canonical ID rather than URL parameters or
a presentation-specific maze object:

```json
{
  "data": {
    "generateSandboxMaze": "v1:4x4:69a9dc28:start=0,0:end=0,3"
  }
}
```

The topology and destination in the example are illustrative because generation
is randomized.

## Validation and generation semantics

- `algorithm` must be one of `DFS`, `ELLER`, or `PRIM`. GraphQL rejects unknown
  enum values during input coercion.
- The server and sandbox UI accept integer `rows` and `cols` from 3 through 20,
  inclusive. Smaller grids are rejected because they do not provide a meaningful
  sandbox puzzle.
- Every query invocation runs the requested randomized engine again; the result
  is not read from Apollo's cache or persisted on the server.
- Fresh generation does not guarantee a globally unique canonical ID. Two runs
  can produce the same topology by chance.
- The start is logical grid coordinate `(0,0)`. The destination is the reachable
  node with the greatest path distance from that start.
- The returned canonical ID contains codec version, dimensions, topology, start,
  and destination. It does not contain spacing or other presentation data.

Rows or columns outside the supported server range produce a GraphQL error with
the extension code `BAD_USER_INPUT`. Other GraphQL validation errors, including
unknown algorithms and missing required fields, use GraphQL's standard error
response.

## Sandbox integration

When `/sandbox` has no encoded maze in its URL, it randomly selects an algorithm
and requests a default 12×12 maze. On success, the client:

1. Parses the canonical ID with sandbox-owned spacing.
2. Decodes and renders the maze.
3. Replaces the browser URL with the canonical ID and spacing after the rendered
   maze state has committed.

When a canonical or supported legacy maze is already present in the URL, the
sandbox decodes it locally and does not call GraphQL. A failed generation request
shows an alert and leaves both the currently rendered maze and URL unchanged. The
algorithm, row, and column controls are disabled while a request is in flight.

## Ownership and scope

- `src/app/api/graphql/schema.ts` defines the public GraphQL contract.
- `src/app/api/graphql/resolvers.ts` validates dimensions and invokes generation.
- `src/maze/engine/engine-utils.ts` selects the engine and returns a canonical ID.
- `src/graphql/operations/generateSandboxMaze.ts` defines the typed client query.
- `src/app/sandbox/page.tsx` owns sandbox request, rendering, error, and URL state.

Authentication, authorization, rate limiting, persistence, global uniqueness,
and presentation configuration are not part of the current query contract.
