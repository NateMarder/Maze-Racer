export type NodeKey = string;
export type WallKey = string;

export type MazeNode = {
  key: NodeKey;
  siblingKeys: NodeKey[];
  isStart: boolean;
  isDest: boolean;
  isVisited: boolean;
  distFromStart: number;
  discoveredBy?: string;
  pathDirections?: any[];
  [key: string]: any; // Allows other dynamic properties inside node objects
};

export type MazeWall = {
  id: WallKey;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type MazePath = {
  id: string;
  key: string;
  nodeKeys: [NodeKey, NodeKey];
  crossWall: WallKey;
};

export type NodeAdjacencyMap = Record<NodeKey, Record<NodeKey, 1>>;

export type MazeState = {
  level: number;
  rows: number;
  cols: number;
  width: number;
  height: number;
  spacing: number;

  nodes: MazeNode[];
  walls: MazeWall[];
  inactiveWallKeys: WallKey[];
  allPaths: MazePath[];

  destNodeX: string;
  destNodeY: string;
};