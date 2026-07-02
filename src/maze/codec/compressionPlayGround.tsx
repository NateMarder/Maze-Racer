import { MazeNode } from "../types";

export const attemptEncoding = (mazeNodes: MazeNode[]): MazeNode[] => {
    const clonedNodes = [...mazeNodes];
    console.log('\nattemptEncoding with:', clonedNodes)
    return clonedNodes;
}