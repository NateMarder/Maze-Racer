# Maze Racer

A modern TypeScript / Next.js implementation of a procedurally generated maze game.

## Engineering Highlights
*MazeCodec*. One of the more interesting aspects of this project is the MazeCodec, which serializes an entire randomly generated maze into a compact hexadecimal string suitable for embedding directly in a URL. The decoder reconstructs the original maze from that representation, allowing deterministic sharing of mazes without requiring server-side persistence.

### MazeCodec Description

![small maze](./docs/images/small-maze.png)

- The fully encoded / serialized representation of this maze would be: `h=69a9dc28&c=4&r=4&l=1&dx=30&dy=210&s=60`
  - `'h'`   --> hex string with path data
  - `'c'`   --> column count
  - `'r'`   --> row count
  - `'s'`   --> spacing
  - `'dy'`  --> destination node y-postion
  - `'dx'`  --> destination node x-position

## Features

- 🧩 Random maze generation using graph algorithms
- 📦 Custom MazeCodec that serializes an entire maze into a compact hexadecimal URL
- 🔄 Deterministic encode/decode with round-trip tests
- ⚡ GSAP-powered animations - enabling the viewer to look for the ending with a 'user control node'
- 🧪 Vitest unit tests protecting codec invariants
- ⚡ NextJs TurboPack for speedy development


## Screenshots

### Large Maze Example
![large maze](./docs/images/large-maze.png)
