# MazeCodec Changelog

## Format compatibility

| Format | Status | Can decode | Can encode |
| --- | --- | --- | --- |
| Legacy unversioned URLs (v0 internally) | Compatibility only | Yes | No |
| Canonical v1 | Current | Yes | Yes |

## Canonical format v1

### Added

- A versioned canonical ID header.
- Logical grid coordinates for the start and destination.
- A presentation-independent maze identity.

### Changed

- Removed spacing and other presentation details from the canonical ID.
- Moved SVG/grid conversion into
  [coordinate-utilities.ts](./coordinate-utilities.ts).
- New encodings emit v1; decoded legacy URLs migrate to v1 when re-encoded.

### Fixed

- Small-maze encoding.
- Rectangular and odd-width maze encoding.
