import { getHexFromNodes } from "../codec/encode-utilities";
import { getNodesWithConnectedSiblingsBasedOnPath } from "../node/utilities";
import { createPathsFromInactiveWalls } from "./path/path-utils"
import { GenerateMazeWithoutSpacingInput, MazePath, MazeState, WallKey } from "../types";
import LevelOne from "./dfs-engine";
import EllerEngine from "./eller-engine";
import { getBlankNodesForEngineWithoutSpacing } from "./maze-node-factory";
import PrimEngine from "./prim-engine";

export function shuffle<T>(array: T[]): T[] {
  const result: T[] = [...array] // allocate an array of the correct size first
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

export function getSolvableMazeWithoutSpacing({rows, cols, algorithm}:GenerateMazeWithoutSpacingInput) {

        // by leaving spacing as '2', the offset will be '1', which means we can rely on integer math and keep the keys simple for encoding
        const spacing = 2;

        // empty state
        const dataForMazeEngine:MazeState = {
          allPaths: [],
          destination: {
              x:0,
              y:0
          },
          inactiveWallKeys: [],
          spacing,
          walls: [],
          height: 1,
          width: 1, 
          cols,
          rows,
          nodes: getBlankNodesForEngineWithoutSpacing({ rows, cols })
        }
  
        let engineResult;
        
        switch(algorithm) {
          case "DFS":
              engineResult =  new LevelOne(dataForMazeEngine).run();;
          case "ELLER":
              engineResult = new PrimEngine(dataForMazeEngine).run();
          case "PRIM":
              engineResult = new EllerEngine(dataForMazeEngine).run();
        }
  
        const { destNodeKey, route } = engineResult;
        const allPaths = createPathsFromInactiveWalls(route);
        const nodes = getNodesWithConnectedSiblingsBasedOnPath({nodes: dataForMazeEngine.nodes, allPaths:allPaths });
        const hex = getHexFromNodes({nodes, rows, cols, spacing})
  
        // for now..
        return {
          destNodeKey,
          encodedMaze:hex,
          route,
          algorithm,
          rows,
          cols,
        };
}

