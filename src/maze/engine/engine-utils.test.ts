import { afterEach, describe, expect, it, vi } from "vitest";
import { assertCanonicalTopology } from "../codec/maze-codec";
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

      expect(() => assertCanonicalTopology(
        result.serialized,
        result.cols,
        result.rows,
      )).not.toThrow();
      expect(result.route).toHaveLength(15);
    },
  );
});
