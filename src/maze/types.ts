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

export type Coordinate = {
  x: number,
  y: number
}

export type EncodedMaze = {
  serialized: string;
  rows: number;
  cols: number;
  level: number;
  start: Coordinate;
  destination: Coordinate;
  spacing: number;
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
  nodeKeys: [NodeKey, NodeKey]
  crossWall: WallKey;
};

export type NodeAdjacencyMap = Record<NodeKey, Record<NodeKey, 1>>;

export type MazeState = {
  allPaths: MazePath[];
  cols: number;
  destination: Coordinate;
  height: number;
  inactiveWallKeys: WallKey[];
  level: number;
  nodes: MazeNode[];
  rows: number;
  spacing: number;
  walls: MazeWall[];
  width: number;
  serialized?: string;
  start?: Coordinate;
};

export type EncoderProps = Omit<MazeState, "serialized" | "height" | "width">;