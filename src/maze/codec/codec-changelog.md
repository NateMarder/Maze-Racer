# MazeCodec Changelog

## Compatibility Table 

| Version | Status | Can Decode | Can Encode |
|---------|--------|----------|------------|
| v1 | Current | ✅ | ✅ |
| v2 | Planned | — | — |

## v1.1.0

### Added
- Versioned codec header.
- Canonical maze representation.

### Changed
- Removed presentation-specific details from serialization.
- Coordinate conversion moved to coordinateUtils.ts.

### Fixed
- Small-maze encoding bug.
- Support for arbitrary rectangular mazes.