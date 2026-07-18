import { EngineNode, MazeNode, MazeState } from "../types";
import mazeNode from "./maze-node";
import NodeFactory from "./node-factory";


/**
 * We are currently using this file as to pull over peices of the original 'node factory' 
 *   in a 'peice-by-peice' method - on function at a time.
 */

const nodeFactory = new NodeFactory();



type BuildNodeArrayProps = Pick<MazeState, 'rows' | 'cols' | 'spacing'>;
type addSiblingProps = BuildNodeArrayProps & {
    nodeArray: any[]
}

function buildNodeArray({ rows, cols, spacing }:BuildNodeArrayProps) {
    const arrayOfNodes = [];
    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const x = i * spacing + offset;
        const y = j * spacing + offset
        arrayOfNodes.push(
          new mazeNode({
            x: x,
            y: y,
            isStart: i + j === 0,
            isDest: false,
            isVisited: false,
            key: `${x}.${y}`,
            siblingKeys: [],
            distFromStart: 0
          }),
        );
      }
    }
    return arrayOfNodes;
  };



function addSiblings({ rows, cols, spacing, nodeArray }: addSiblingProps) {
    let x1;
    let x2;
    let y1;
    let y2;

    const offset = Math.round(spacing / 2);

    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols - 1; j += 1) {
            const x = i * spacing + offset;
            const y = j * spacing + offset;
            x1 = j * spacing + offset;
            x2 = x1 + spacing;
            y1 = j * spacing + offset;
            y2 = y1 + spacing;
            nodeFactory.bindNodes([`${x1}.${y}`, `${x2}.${y}`], nodeArray); // bind nodes should take two 'unbound' nodes and return updated nodes that are bound (pure function)
            nodeFactory.bindNodes([`${x}.${y1}`, `${x}.${y2}`], nodeArray);
        }
    }

    return nodeArray;
};

/**
 * This returns an array of nodes, with all the possible siblings addeed - like a maze
 * with zero-walls, just paths.
 */
export function getBlankNodesForEngine({ rows, cols, spacing }: BuildNodeArrayProps): EngineNode[] {
    let nodeArray = buildNodeArray({ rows, cols, spacing });
    return nodeFactory.addSiblings({
        rows,
        cols,
        spacing,
        nodeArray,
    });
}