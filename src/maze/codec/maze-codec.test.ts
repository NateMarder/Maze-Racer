import { describe, expect, it } from "vitest";
import type {
  LegacyEncodedMaze,
  MazeNode,
  MazeState,
  SvgCoordinate,
} from "../types";
import { getBlankNodesForEngine } from "../node/maze-node-factory";
import { simpleMaze } from "./fixtures/simple-dfs-maze";
import { MazeCodec } from "./maze-codec";

function getNodeIdentity(node: MazeNode) {
  return {
    key: node.key,
    siblingKeys: [...node.siblingKeys].sort(),
  };
}

function rescaleCoordinate(
  coordinate: SvgCoordinate,
  oldSpacing: number,
  newSpacing: number,
): SvgCoordinate {
  const gridX = (coordinate.x - oldSpacing / 2) / oldSpacing;
  const gridY = (coordinate.y - oldSpacing / 2) / oldSpacing;

  return {
    x: gridX * newSpacing + newSpacing / 2,
    y: gridY * newSpacing + newSpacing / 2,
  };
}

function rescaleMaze(maze: MazeState, newSpacing: number): MazeState {
  const oldSpacing = maze.spacing;
  const keyMap = new Map(
    maze.nodes.map((node) => {
      const coordinate = rescaleCoordinate(
        node,
        oldSpacing,
        newSpacing,
      );

      return [node.key, `${coordinate.x}.${coordinate.y}`];
    }),
  );
  const nodes = maze.nodes.map((node) => {
    const coordinate = rescaleCoordinate(
      node,
      oldSpacing,
      newSpacing,
    );

    return {
      ...node,
      ...coordinate,
      key: keyMap.get(node.key) ?? node.key,
      siblingKeys: node.siblingKeys.map(
        (siblingKey) => keyMap.get(siblingKey) ?? siblingKey,
      ),
    };
  });

  return {
    ...maze,
    spacing: newSpacing,
    height: maze.rows * newSpacing,
    width: maze.cols * newSpacing,
    destination: rescaleCoordinate(
      maze.destination,
      oldSpacing,
      newSpacing,
    ),
    start: maze.start
      ? rescaleCoordinate(maze.start, oldSpacing, newSpacing)
      : undefined,
    nodes,
  };
}

function createOpenMaze(
  rows: number,
  cols: number,
  spacing: number,
): MazeState {
  const nodes = getBlankNodesForEngine({ rows, cols, spacing });
  const offset = spacing / 2;

  return {
    allPaths: [],
    cols,
    destination: {
      x: (cols - 1) * spacing + offset,
      y: (rows - 1) * spacing + offset,
    },
    height: rows * spacing,
    inactiveWallKeys: [],
    level: 1,
    nodes,
    rows,
    spacing,
    walls: [],
    width: cols * spacing,
  };
}

describe("MazeCodec", () => {
  it("encodes logical coordinates and restores SVG coordinates on decode", () => {
    const maze = simpleMaze();
    const encoded = MazeCodec.encode(maze);
    const decoded = MazeCodec.decode(encoded);

    expect(encoded.version).toBe(1);
    expect(encoded.start).toEqual({ x: 0, y: 0 });
    expect(encoded.destination).toEqual({ x: 2, y: 5 });
    expect(decoded.start).toEqual({ x: 30, y: 30 });
    expect(decoded.destination).toEqual(maze.destination);
    expect(decoded.rows).toBe(maze.rows);
    expect(decoded.cols).toBe(maze.cols);
    expect(decoded.level).toBe(maze.level);
    expect(decoded.nodes.map(getNodeIdentity)).toEqual(
      maze.nodes.map(getNodeIdentity),
    );
    expect(
      decoded.nodes.find((node) => node.isStart)?.key,
    ).toBe("30.30");
    expect(
      decoded.nodes.find((node) => node.isDest)?.key,
    ).toBe("150.330");
  });

  it("produces a stable canonical representation after a round trip", () => {
    const maze = simpleMaze();
    const firstEncoding = MazeCodec.encode(maze);
    const canonicalId = MazeCodec.getCanonicalId(firstEncoding);
    const decoded = MazeCodec.decode(firstEncoding);
    const secondEncoding = MazeCodec.encode(decoded);

    expect(secondEncoding).toEqual(firstEncoding);
    expect(MazeCodec.getCanonicalId(secondEncoding)).toBe(canonicalId);
    expect(canonicalId).toBe(
      `v1:10x10:${firstEncoding.serialized}:start=0,0:end=2,5`,
    );
  });

  it("uses the same canonical identity at different SVG spacings", () => {
    const originalMaze = simpleMaze();
    const rescaledMaze = rescaleMaze(originalMaze, 40);
    const originalEncoding = MazeCodec.encode(originalMaze);
    const rescaledEncoding = MazeCodec.encode(rescaledMaze);

    expect(rescaledEncoding.spacing).toBe(40);
    expect(originalEncoding.spacing).toBe(60);
    expect(rescaledEncoding.serialized).toBe(
      originalEncoding.serialized,
    );
    expect(MazeCodec.getCanonicalId(rescaledEncoding)).toBe(
      MazeCodec.getCanonicalId(originalEncoding),
    );
  });

  it("is independent of node and sibling ordering", () => {
    const maze = simpleMaze();
    const reorderedMaze: MazeState = {
      ...maze,
      nodes: [...maze.nodes]
        .reverse()
        .map((node) => ({
          ...node,
          siblingKeys: [...node.siblingKeys].reverse(),
        })),
    };

    expect(
      MazeCodec.getCanonicalId(MazeCodec.encode(reorderedMaze)),
    ).toBe(
      MazeCodec.getCanonicalId(MazeCodec.encode(maze)),
    );
  });

  it("round-trips logical topology for odd-width mazes", () => {
    const maze = createOpenMaze(3, 3, 40);
    const encoded = MazeCodec.encode(maze);
    const decoded = MazeCodec.decode(encoded);

    expect(encoded.serialized).toHaveLength(
      maze.rows * Math.ceil(maze.cols / 2),
    );
    expect(decoded.nodes.map(getNodeIdentity)).toEqual(
      maze.nodes.map(getNodeIdentity),
    );
  });

  it("parses a canonical ID with presentation settings kept separate", () => {
    const encoded = MazeCodec.encode(simpleMaze());
    const canonicalId = MazeCodec.getCanonicalId(encoded);
    const parsed = MazeCodec.parseCanonicalId(canonicalId, {
      spacing: 40,
      level: 7,
    });
    const decoded = MazeCodec.decode(parsed);

    expect(parsed.spacing).toBe(40);
    expect(parsed.level).toBe(7);
    expect(parsed.start).toEqual({ x: 0, y: 0 });
    expect(parsed.destination).toEqual({ x: 2, y: 5 });
    expect(decoded.start).toEqual({ x: 20, y: 20 });
    expect(decoded.destination).toEqual({ x: 100, y: 220 });
    expect(MazeCodec.getCanonicalId(parsed)).toBe(canonicalId);
  });

  it("decodes legacy SVG coordinates and migrates them to v1", () => {
    const maze = simpleMaze();
    const legacyParams = new URLSearchParams(maze.serialized);
    const legacy: LegacyEncodedMaze = {
      version: 0,
      serialized: legacyParams.get("h") ?? "",
      cols: Number(legacyParams.get("c")),
      rows: Number(legacyParams.get("r")),
      level: Number(legacyParams.get("l")),
      destination: {
        x: Number(legacyParams.get("dx")),
        y: Number(legacyParams.get("dy")),
      },
      start: { x: 30, y: 30 },
      spacing: Number(legacyParams.get("s")),
    };

    const decoded = MazeCodec.decode(legacy);
    const migrated = MazeCodec.encode(decoded);

    expect(decoded.codecVersion).toBe(0);
    expect(decoded.start).toEqual({ x: 30, y: 30 });
    expect(decoded.destination).toEqual({ x: 150, y: 330 });
    expect(migrated.version).toBe(1);
    expect(migrated.start).toEqual({ x: 0, y: 0 });
    expect(migrated.destination).toEqual({ x: 2, y: 5 });
  });

  it("rejects malformed or out-of-bounds canonical identifiers", () => {
    expect(() => MazeCodec.parseCanonicalId(
      "v2:4x4:69a9dc28:start=0,0:end=0,3",
      { spacing: 40, level: 1 },
    )).toThrow("unsupported maze codec version: 2");

    expect(() => MazeCodec.parseCanonicalId(
      "v1:4x4:69a9dc28:start=0,0:end=4,3",
      { spacing: 40, level: 1 },
    )).toThrow("end coordinate 4,3 is outside the 4x4 maze");

    expect(() => MazeCodec.parseCanonicalId(
      "v1:4x4:69a9dc280:start=0,0:end=0,3",
      { spacing: 40, level: 1 },
    )).toThrow("exactly 8 hexadecimal characters");

    expect(() => MazeCodec.parseCanonicalId(
      "v1:4x4:69a9dc29:start=0,0:end=0,3",
      { spacing: 40, level: 1 },
    )).toThrow("passage outside the logical grid");
  });
});
