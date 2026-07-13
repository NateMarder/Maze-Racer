import { describe, expect, it } from "vitest";
import { MazeCodec } from "./maze-codec";
import type { MazeState } from "../types";
import { simpleMaze } from "./fixtures/simple-dfs-maze";

describe("MazeCodec", () => {
  it("encodes and decodes a maze without losing its structural identity", () => {
    const maze:MazeState = simpleMaze();
    const encoded = MazeCodec.encode(maze);
    const decoded = MazeCodec.decode(encoded);
    expect(decoded.rows).toBe(maze.rows);
    expect(decoded.cols).toBe(maze.cols);
    expect(decoded.level).toBe(maze.level);
    expect(decoded.destination).toEqual(maze.destination);


    expect(decoded.nodes.map((node) => ({
      key: node.key,
      siblingKeys: [...node.siblingKeys].sort(),
    }))).toEqual(
      maze.nodes.map((node) => ({
        key: node.key,
        siblingKeys: [...node.siblingKeys].sort(),
      }))
    );
  });

  it("produces a stable encoded representation after a round trip", () => {
    const maze: MazeState = simpleMaze();
    const firstEncoding = MazeCodec.encode(maze);
    const decoded = MazeCodec.decode(firstEncoding);
    const secondEncoding = MazeCodec.encode(decoded);

    expect(secondEncoding).toEqual(firstEncoding);
  });
});
