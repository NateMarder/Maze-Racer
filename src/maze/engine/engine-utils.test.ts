import { afterEach, describe, expect, it, vi } from "vitest";
import { MazeCodec } from "../codec/maze-codec";
import LevelOne from "./dfs-engine";
import EllerEngine from "./eller-engine";
import { getSolvableMazeWithoutSpacing } from "./engine-utils";
import PrimEngine from "./prim-engine";

describe("getSolvableMazeWithoutSpacing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches each algorithm to its matching engine", () => {
    const engineResult = {
      route: [],
      destNodeKey: "1.1",
    };
    const dfsRun = vi
      .spyOn(LevelOne.prototype, "run")
      .mockReturnValue(engineResult);
    const ellerRun = vi
      .spyOn(EllerEngine.prototype, "run")
      .mockReturnValue(engineResult);
    const primRun = vi
      .spyOn(PrimEngine.prototype, "run")
      .mockReturnValue(engineResult);

    getSolvableMazeWithoutSpacing({
      rows: 2,
      cols: 2,
      algorithm: "DFS",
    });
    expect(dfsRun).toHaveBeenCalledOnce();
    expect(ellerRun).not.toHaveBeenCalled();
    expect(primRun).not.toHaveBeenCalled();

    vi.clearAllMocks();
    getSolvableMazeWithoutSpacing({
      rows: 2,
      cols: 2,
      algorithm: "ELLER",
    });
    expect(dfsRun).not.toHaveBeenCalled();
    expect(ellerRun).toHaveBeenCalledOnce();
    expect(primRun).not.toHaveBeenCalled();

    vi.clearAllMocks();
    getSolvableMazeWithoutSpacing({
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
      const result = getSolvableMazeWithoutSpacing({
        rows: 4,
        cols: 4,
        algorithm,
      });
      const urlParams = new URLSearchParams(result.canonicalId);
      const canonicalId = urlParams.get("maze");

      expect(canonicalId).not.toBeNull();
      expect([...urlParams.keys()]).toEqual(["maze"]);

      const encoded = MazeCodec.parseCanonicalId(canonicalId ?? "", {
        spacing: 2,
      });
      const decoded = MazeCodec.decode(encoded);

      expect(encoded.cols).toBe(result.cols);
      expect(encoded.rows).toBe(result.rows);
      expect(decoded.allPaths).toHaveLength(15);
    },
  );
});
