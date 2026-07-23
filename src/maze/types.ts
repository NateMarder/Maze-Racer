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
  pathDirections?: string[];
  x: number;
  y: number;
};

export type EngineNode = Pick<MazeNode, 'discoveredBy' | 'siblingKeys' | 'isStart' | 'isDest' | 'distFromStart' | 'key' | 'isVisited' | 'x' | 'y'>;

export type Coordinate = {
  x: number,
  y: number
}

export type GridCoordinate = Coordinate;
export type SvgCoordinate = Coordinate;
export type MazeCodecVersion = 0 | 1;

type EncodedMazeBase = {
  serialized: string;
  rows: number;
  cols: number;
  level: number;
  spacing: number;
};

export type LegacyEncodedMaze = EncodedMazeBase & {
  version: 0;
  start: SvgCoordinate;
  destination: SvgCoordinate;
};

export type EncodedMazeV1 = EncodedMazeBase & {
  version: 1;
  start: GridCoordinate;
  destination: GridCoordinate;
};

export type EncodedMaze = LegacyEncodedMaze | EncodedMazeV1;

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
export type MazeNodeMap = Record<string,MazeNode>;
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
  start?: SvgCoordinate;
  algorithm?: AlgorithmKey;
  codecVersion?: MazeCodecVersion;
  canonicalId?: string;
};
export type GetHexFromNodesProps = Pick<MazeState, 'nodes' | 'cols' | 'rows' | 'spacing'>;
export type EncoderProps = Omit<MazeState, 'serialized' | 'height' | 'width'>;
export type AlgorithmKey = 'dfs' | 'prim' | 'eller';
