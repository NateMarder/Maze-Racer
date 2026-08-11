// Rendering and decoding maze state

export type NodeKey = string;
export type WallKey = string;

export interface Coordinate {
  x: number;
  y: number;
}

export type GridCoordinate = Coordinate;
export type SvgCoordinate = Coordinate;

export interface MazeNode {
  key: NodeKey;
  siblingKeys: NodeKey[];
  isStart: boolean;
  isDest: boolean;
  isVisited: boolean;
  distFromStart: number;
  discoveredBy?: NodeKey;
  x: number;
  y: number;
}

export interface MazeWall {
  id: WallKey;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface MazePath {
  id: string;
  key: string;
  nodeKeys: [NodeKey, NodeKey];
  crossWall: WallKey;
}

export interface MazeState extends MazeEncodingInput {
  allPaths: MazePath[];
  height: number;
  inactiveWallKeys: WallKey[];
  walls: MazeWall[];
  width: number;
  serialized?: string;
  codecVersion?: EncodedMaze["version"];
  canonicalId?: string;
}

export type AlgorithmSelection = MazeAlgorithm | "";

// Engine and canonical encoding

export type MazeAlgorithm = "DFS" | "ELLER" | "PRIM";

export interface MazeGenerationOptions {
  algorithm: MazeAlgorithm;
  rows: number;
  cols: number;
}

export interface MazeEngineInput {
  nodes: MazeNode[];
  spacing: number;
}

export interface MazeEngineResult {
  route: WallKey[];
  destNodeKey: NodeKey;
}

export interface MazeEncodingInput {
  rows: number;
  cols: number;
  spacing: number;
  nodes: MazeNode[];
  destination: SvgCoordinate;
  start?: SvgCoordinate;
}

export type MazeNodeMap = Record<NodeKey, MazeNode>;

interface EncodedMazeBase {
  serialized: string;
  rows: number;
  cols: number;
  spacing: number;
}

export interface LegacyEncodedMaze extends EncodedMazeBase {
  version: 0;
  start: SvgCoordinate;
  destination: SvgCoordinate;
}

export interface EncodedMazeV1 extends EncodedMazeBase {
  version: 1;
  start: GridCoordinate;
  destination: GridCoordinate;
}

export type EncodedMaze = LegacyEncodedMaze | EncodedMazeV1;

// GraphQL contract

export interface GenerateSandboxMazeVariables {
  input: MazeGenerationOptions;
}

export interface GenerateSandboxMazeData {
  generateSandboxMaze: string;
}
