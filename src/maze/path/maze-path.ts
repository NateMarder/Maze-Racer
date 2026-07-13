import { getOrthogonalKey } from "../engine/engine-utils";
import type { MazePath as MazePathType, NodeKey } from "../types";

type MazePathProps = {
  nodeKey1: NodeKey;
  nodeKey2: NodeKey;
};

export default class MazePath implements MazePathType {
  id: string;
  key: string;
  nodeKeys: [NodeKey, NodeKey];
  crossWall: string;

  constructor({ nodeKey1, nodeKey2 }: MazePathProps) {
    this.nodeKeys = [nodeKey1, nodeKey2];
    this.id = `${nodeKey1}.${nodeKey2}`;
    this.key = this.id;

    const [x1, y1] = nodeKey1.split(".").map(Number);
    const [x2, y2] = nodeKey2.split(".").map(Number);

    this.crossWall = getOrthogonalKey(x1, y1, x2, y2);
  }
}
