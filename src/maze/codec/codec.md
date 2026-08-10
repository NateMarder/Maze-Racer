# MazeCodec Design

## Purpose

MazeCodec defines the canonical identity of a maze. It enables deterministic
reconstruction, shareable URLs, and compatibility across serialized format
versions without coupling maze identity to a particular renderer.

Its primary responsibilities are:

1. Encode a generated `MazeState` into topology and logical coordinates.
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

## Determinism and invariants

MazeCodec must preserve these properties:

- Encoding followed by decoding produces an equivalent maze topology, start, and
  destination.
- Decoding followed by encoding produces the same canonical representation.
- Node or sibling ordering does not affect the canonical ID.
- Changing only SVG spacing does not affect the canonical ID.
- Dimensions and logical coordinates are validated before a canonical ID is
  accepted or emitted.
- Topology has the exact hexadecimal length required by its dimensions and cannot
  describe passages outside the logical grid.
- Previously supported formats remain decodable whenever practical.

Automated codec tests protect round trips, spacing independence, odd-width and
rectangular mazes, malformed identifiers, and legacy URL migration. The test
suite runs locally with `npm run test:run` and through the Husky pre-push hook.

## Stable URLs and legacy data

The canonical ID is stored in the `maze` URL parameter. Presentation spacing is
stored separately in `s`. Consequently, changing spacing does not change maze
identity.

The decoder also supports the legacy unversioned URL fields. Legacy data is
decoded with its SVG coordinates and is migrated to the current v1 canonical
format the next time it is encoded.

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
