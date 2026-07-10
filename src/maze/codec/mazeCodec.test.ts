import { describe, expect, it } from "vitest";
import { MazeCodec } from "./mazeCodec";
import type { MazeState } from "../types";
import { smallMaze } from "./fixtures/smallMaze";

describe("MazeCodec", () => {
  it("encodes and decodes a maze without losing its structural identity", () => {
    const maze:MazeState = smallMaze();
    const encoded = MazeCodec.encode(maze);
    const decoded = MazeCodec.decode(encoded);
    expect(decoded.rows).toBe(maze.rows);
    expect(decoded.cols).toBe(maze.cols);
    expect(decoded.level).toBe(maze.level);
    expect(decoded.destination).toEqual(maze.destination);
    expect(decoded.nodes.length).toEqual(maze.nodes.length);
    expect(decoded.inactiveWallKeys).toEqual(maze.inactiveWallKeys);
  });
});