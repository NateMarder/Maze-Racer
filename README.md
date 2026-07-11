# Maze Racer

A modern TypeScript / Next.js implementation of a procedurally generated maze game.

## Engineering Highlights
- One of the more interesting aspects of this project is the MazeCodec, which serializes an entire randomly generated maze into a compact hexadecimal string suitable for embedding directly in a URL. The decoder reconstructs the original maze from that representation, allowing deterministic sharing of mazes without requiring server-side persistence.


## Features

- 🧩 Random maze generation using graph algorithms
- 📦 Custom MazeCodec that serializes an entire maze into a compact hexadecimal URL
- 🔄 Deterministic encode/decode with round-trip tests
- ⚡ GSAP-powered animations
- 🧪 Vitest unit tests protecting codec invariants

## Screenshots

![maze image](./docs/images/maze-image.png)