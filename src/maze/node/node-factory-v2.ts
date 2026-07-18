import { EngineNode, MazeNode, MazeState } from "../types";
import NodeFactory from "./node-factory";


/**
 * We are currently using this file as to pull over peices of the original 'node factory' 
 *   in a 'peice-by-peice' method - on function at a time.
 */

const nodeFactory = new NodeFactory();

 /** 
  * This is currently called from maze-graph, as well as the 'levelOne' from the maze-engine
  */
 export function getNodes({rows, cols, spacing}:MazeState ):MazeNode[] {
    let nodeArray = nodeFactory.buildNodeArray({ rows, cols, spacing });

    return nodeFactory.addSiblings({
      rows,
      cols,
      spacing,
      nodeArray,
    });
  }


/**
 * This returns an array of nodes, with all the possible siblings addeed - like a maze
 * with zero-walls, just paths.
 */
export function getBlankNodesForEngine({rows, cols, spacing}:MazeState): EngineNode[] {
    let nodeArray = nodeFactory.buildNodeArray({ rows, cols, spacing });
    return nodeFactory.addSiblings({
      rows,
      cols,
      spacing,
      nodeArray,
    });
}