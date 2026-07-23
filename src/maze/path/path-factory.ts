import MazePath from "./maze-path";
import { getOrthogonalKey } from "../engine/utils";
import type { MazePath as MazePathType, NodeKey, WallKey } from "../types";

function wallKeyToNodeKeys(wallKey: WallKey): [NodeKey, NodeKey] {
  const [x1, y1, x2, y2] = wallKey.split(".").map(Number);
  const orthogonalKey = getOrthogonalKey(x1, y1, x2, y2);
  const [nodeX1, nodeY1, nodeX2, nodeY2] = orthogonalKey.split(".");

  return [`${nodeX1}.${nodeY1}`, `${nodeX2}.${nodeY2}`];
}

export function createPathsFromInactiveWalls(
  inactiveWallKeys: WallKey[]
): MazePathType[] {
  return inactiveWallKeys.map((wallKey) => {
    const [nodeKey1, nodeKey2] = wallKeyToNodeKeys(wallKey);
    return new MazePath({ nodeKey1, nodeKey2 });
  });
}
