# MazeCodec Design

## Purpose

> MazeCodec is one of the core architectural components of Maze Racer. It defines the canonical representation of every maze and enables deterministic reconstruction, permanent shareable URLs, and long-term compatibility across versions. MazeCodec intentionally does **not** define how a maze is rendered or animated.

### Primary responsibilities

1. Convert a canonical maze into a compact shareable representation.
2. Reconstruct the exact same maze from that representation.
3. Preserve backwards compatibility across future versions.
4. Remain independent of rendering or presentation concerns.


## Design Principles

### Canonical Representation

> The codec operates on a canonical maze representation. This representation contains only information required to reconstruct the maze. Rendering information such as spacing, animation state, colors, zoom level, or viewport position are intentionally excluded. As these could vary in the future depending on format of play. 

### Purpose of the separation:

- multiple renderers
- different display resolutions
- future UI redesigns
- backwards compatibility

## Deterministic

- Encoding a maze and immediately decoding it must produce an equivalent canonical maze.
- Likewise, the Canonical Maze must be able to be encoded fully, and then decoded in a lossless way.
- This invariant is protected by automated tests. Currently they are kicked off through a husky pre-push task.

## Stable URLs

- Every encoded maze represents a permanent identifier.
- Future versions of MazeCodec should preserve the ability to decode previously generated URLs whenever practical.
- This allows shared links to remain functional over time.

## Versioning

- Each serialized maze contains a codec version.
- New versions may introduce more efficient serialization strategies or additional metadata.
- Older versions should continue to decode correctly whenever possible.
- Future encoders should only emit the newest version.
- Please see the [codec-changelog.md](./codec-changelog.md)


## Separation of Concerns

MazeCodec is responsible for serialization. It is intentionally unaware of:

- React
- Next.js
- GSAP
- Rendering
- Coordinate spacing
- Input handling
- Animation

Moreover, the MazeCodec **intentionally** does not attempt to:

- achieve maximum theoretical compression
- encode rendering state
- optimize for human readability
- support arbitrary graph structures
- replace a general-purpose serialization format

## Future Evolution

Future versions may introduce:

- improved compression
- alternative encoding strategies
- additional metadata
- new version identifiers


*Changes should never sacrifice readability, maintainability, or backwards compatibility solely for marginal improvements in encoded size.*