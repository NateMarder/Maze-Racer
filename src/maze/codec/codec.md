# MazeCodec Design

## Purpose

MazeCodec defines the canonical identity of a maze. It enables deterministic
reconstruction, shareable URLs, and compatibility across serialized format
versions without coupling maze identity to a particular renderer.

Its primary responsibilities are:

1. Encode a generated `MazeEncodingInput` into topology and logical coordinates.
2. Produce and parse the compact, versioned canonical maze ID.
3. Reconstruct an equivalent `MazeState` using client-provided presentation
   spacing.
4. Continue decoding previously supported formats whenever practical.

## Canonical identity and presentation

The v1 canonical ID contains only the information required to identify the maze:

```text
v1:<cols>x<rows>:<hex-topology>:start=<x>,<y>:end=<x>,<y>
```

The start and destination use zero-based logical grid coordinates. The topology
stores passages as hexadecimal characters and is normalized to lowercase.

### Topology encoding

Topology is traversed in row-major order. Within each row, one hexadecimal
character describes up to two adjacent cells, beginning at columns `0`, `2`,
`4`, and so on. Its four bits, from most significant to least significant,
represent these passages:

1. Left cell to the cell on its right.
2. Left cell to the cell below it.
3. Right cell to the cell on its right.
4. Right cell to the cell below it.

Only rightward and downward passages are stored, so every shared wall is encoded
once. A valid topology contains exactly `rows * ceil(cols / 2)` hexadecimal
characters. Bits that would create a passage beyond the final row or column must
be zero, including bits associated with the missing second cell of an odd-width
row.

Spacing requires a precise distinction:

- `MazeCodec.encode` uses the source maze's spacing to translate SVG coordinates
  into logical grid coordinates.
- `MazeCodec.parseCanonicalId` receives spacing as separate presentation input.
- `MazeCodec.decode` uses that spacing to reconstruct SVG nodes, walls, paths,
  dimensions, and coordinates.
- `MazeCodec.getCanonicalId` excludes spacing, so the same topology, start, and
  destination have the same canonical identity at every rendering scale.

Colors, animation state, zoom, viewport position, and other UI settings are not
handled by MazeCodec.

## Supported API flow

The canonical encoding flow is:

```text
MazeEncodingInput -> MazeCodec.encode -> EncodedMazeV1
EncodedMazeV1 -> MazeCodec.getCanonicalId -> canonical ID
canonical ID + spacing -> MazeCodec.parseCanonicalId -> EncodedMazeV1
EncodedMazeV1 -> MazeCodec.decode -> MazeState
```

`MazeCodec.updateNodeSiblings` and `MazeCodec.getWallsFromInactiveWallKeys` are
reconstruction helpers used by `decode`. Although they are currently exposed on
the `MazeCodec` object, they are not part of the canonical format contract.

## Determinism and invariants

MazeCodec must preserve these properties:

- Encoding followed by decoding produces an equivalent maze topology, start, and
  destination.
- Decoding and re-encoding v1 data produces the same canonical ID.
- Decoding and re-encoding legacy v0 data preserves the maze while migrating it
  to the current v1 representation; it does not reproduce the legacy URL format.
- Node or sibling ordering does not affect the canonical ID.
- Changing only SVG spacing does not affect the canonical ID.
- Dimensions and logical coordinates are validated before a canonical ID is
  accepted or emitted.
- Topology has the exact hexadecimal length required by its dimensions and cannot
  describe passages outside the logical grid.
- Previously supported formats remain decodable whenever practical.

The dedicated codec tests protect v1 round trips, spacing independence, ordering
independence, odd-width mazes, malformed identifiers, and legacy-to-v1
migration. URL tests cover both canonical and legacy query parameters, while the
GraphQL resolver tests exercise rectangular `4x5` generation and decoding. The
complete test suite runs locally with `npm run test:run` and through the Husky
pre-push hook.

## Validation boundaries

- Canonical parsing validates the identifier grammar, codec version, positive
  integer dimensions, exact topology length, boundary passages, and logical
  start and destination bounds.
- Encoding validates positive integer dimensions, grid-centered SVG
  coordinates, positive finite spacing during coordinate translation, and start
  and destination bounds.
- Decoding v1 data requires positive finite presentation spacing when logical
  coordinates are translated back into SVG coordinates.
- MazeCodec does not impose the sandbox's `3` through `20` row and column limits.
  Those product constraints belong to the GraphQL and UI boundaries; the codec
  accepts any positive integer dimensions that form a valid encoding.

## Stable URLs and legacy data

The canonical ID is stored in the `maze` URL parameter. Presentation spacing is
stored separately in `s`. Consequently, changing spacing does not change maze
identity.

The URL adapter in `src/web-utilities.ts` parses the legacy unversioned fields
`h`, `c`, `r`, `sx`, `sy`, `dx`, `dy`, and `s` into a `LegacyEncodedMaze`.
MazeCodec then decodes that typed value using its SVG coordinates.

Legacy migration is explicit: passing the decoded `MazeState` through
`MazeCodec.encode` produces a v1 encoding. Loading or decoding a legacy URL alone
does not rewrite the URL or otherwise migrate the stored representation.

## Versioning

- Every canonical ID begins with its format version.
- The current encoder emits v1 only.
- Parsers reject unknown canonical versions rather than guessing their meaning.
- A future version may improve compression or add canonical metadata, but it must
  use a new version identifier when its serialized meaning changes.
- See the [MazeCodec changelog](./codec-changelog.md) for supported formats.

## Separation of concerns

MazeCodec has no dependency on React, Next.js, GraphQL, GSAP, input handling, or
animation. It translates between canonical grid data and the SVG-coordinate maze
model, but it does not choose the presentation spacing or render the result.

MazeCodec intentionally does not attempt to maximize theoretical compression,
encode rendering state, optimize for human readability, support arbitrary graph
structures, or replace a general-purpose serialization format.
