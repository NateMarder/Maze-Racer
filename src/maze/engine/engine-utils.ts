import { getNodesWithConnectedSiblingsBasedOnPath } from "../node/utilities";
import { createPathsFromInactiveWalls } from "./path/path-utils";
import type {
  EncodedMazeV1,
  MazeEncodingInput,
  MazeEngineInput,
  MazeEngineResult,
  MazeGenerationOptions,
} from "../types";
import DfsEngine from "./dfs-engine";
import EllerEngine from "./eller-engine";
import { getBlankNodesForEngineWithoutSpacing } from "./maze-node-factory";
import PrimEngine from "./prim-engine";
import { MazeCodec } from "../codec/maze-codec";

export function shuffle<T>(array: T[]): T[] {
  const result: T[] = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function getOrthogonalKey(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  if (x1 === x2) {
    const high = Math.max(y1, y2);
    const low = Math.min(y1, y2);
    const distance = (high - low) / 2;
    const wallY = high - distance;

    return `${x1 - distance}.${wallY}.${x1 + distance}.${wallY}`;
  }

  const high = Math.max(x1, x2);
  const low = Math.min(x1, x2);
  const distance = (high - low) / 2;
  const wallX = high - distance;

  return `${wallX}.${y1 - distance}.${wallX}.${y1 + distance}`;
}

export function generateCanonicalMaze({
  rows,
  cols,
  algorithm,
}: MazeGenerationOptions): string {
  const engineSpacing = 2;
  const dataForMazeEngine: MazeEngineInput = {
    spacing: engineSpacing,
    nodes: getBlankNodesForEngineWithoutSpacing({ rows, cols }),
  };
  let engineResult: MazeEngineResult;

  switch (algorithm) {
    case "DFS":
      engineResult = new DfsEngine(dataForMazeEngine).run();
      break;
    case "ELLER":
      engineResult = new EllerEngine(dataForMazeEngine).run();
      break;
    case "PRIM":
      engineResult = new PrimEngine(dataForMazeEngine).run();
      break;
  }

  const { destNodeKey, route } = engineResult;
  const allPaths = createPathsFromInactiveWalls(route);
  const nodes = getNodesWithConnectedSiblingsBasedOnPath({
    nodes: dataForMazeEngine.nodes,
    allPaths,
  });
  const [x, y] = destNodeKey.split('.').map(Number);
  const updatedState: MazeEncodingInput = {
    ...dataForMazeEngine,
    rows,
    cols,
    nodes,
    destination: { x, y },
  };
  const encodedMaze: EncodedMazeV1 = MazeCodec.encode(updatedState);

  return MazeCodec.getCanonicalId(encodedMaze);
}
