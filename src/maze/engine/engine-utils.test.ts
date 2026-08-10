import { afterEach, describe, expect, it, vi } from "vitest";
import { MazeCodec } from "../codec/maze-codec";
import DfsEngine from "./dfs-engine";
import EllerEngine from "./eller-engine";
import { generateCanonicalMaze } from "./engine-utils";
import PrimEngine from "./prim-engine";

describe("generateCanonicalMaze", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches each algorithm to its matching engine", () => {
    const engineResult = {
      route: [],
      destNodeKey: "1.1",
    };
    const dfsRun = vi
      .spyOn(DfsEngine.prototype, "run")
      .mockReturnValue(engineResult);
    const ellerRun = vi
      .spyOn(EllerEngine.prototype, "run")
      .mockReturnValue(engineResult);
    const primRun = vi
      .spyOn(PrimEngine.prototype, "run")
      .mockReturnValue(engineResult);

    generateCanonicalMaze({
      rows: 2,
      cols: 2,
      algorithm: "DFS",
    });
    expect(dfsRun).toHaveBeenCalledOnce();
    expect(ellerRun).not.toHaveBeenCalled();
    expect(primRun).not.toHaveBeenCalled();

    vi.clearAllMocks();
    generateCanonicalMaze({
      rows: 2,
      cols: 2,
      algorithm: "ELLER",
    });
    expect(dfsRun).not.toHaveBeenCalled();
    expect(ellerRun).toHaveBeenCalledOnce();
    expect(primRun).not.toHaveBeenCalled();

    vi.clearAllMocks();
    generateCanonicalMaze({
      rows: 2,
      cols: 2,
      algorithm: "PRIM",
    });
    expect(dfsRun).not.toHaveBeenCalled();
    expect(ellerRun).not.toHaveBeenCalled();
    expect(primRun).toHaveBeenCalledOnce();
  });

  it.each(["DFS", "ELLER", "PRIM"] as const)(
    "generates a canonical maze with %s",
    (algorithm) => {
      const canonicalId = generateCanonicalMaze({
        rows: 4,
        cols: 4,
        algorithm,
      });
      expect(canonicalId.startsWith("v1:")).toBe(true);
      expect(canonicalId.startsWith("maze=")).toBe(false);

      const encoded = MazeCodec.parseCanonicalId(canonicalId, {
        spacing: 2,
      });
      const decoded = MazeCodec.decode(encoded);

      expect(encoded.cols).toBe(4);
      expect(encoded.rows).toBe(4);
      expect(decoded.allPaths).toHaveLength(15);
    },
  );
});
