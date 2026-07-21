import { EngineNode, MazeNode, MazeState } from "../types";
import mazeNode from "./maze-node";

type BuildNodeArrayProps = Pick<MazeState, 'rows' | 'cols' | 'spacing'>;
type addSiblingProps = BuildNodeArrayProps & {
  nodeArray: any[]
}

function buildNodeArray({ rows, cols, spacing }: BuildNodeArrayProps) {
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

function connectSiblings({ rows, cols, spacing, nodeArray }: addSiblingProps) {

  const offset = Math.round(spacing / 2);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + offset;
      const y = row * spacing + offset;

      const primaryNodeRef = nodeArray.find(n => n.key === `${x}.${y}`);          // primary maze-node we are binding
      const rightSibRef = nodeArray.find(n => n.key === `${x + spacing}.${y}`);   // sibling on the right of primary
      const bottomSibRef = nodeArray.find(n => n.key === `${x}.${y + spacing}`);  // sibling on left of primary

      if (primaryNodeRef && rightSibRef) {
        primaryNodeRef.siblingKeys.push(rightSibRef.key);
        rightSibRef.siblingKeys.push(primaryNodeRef.key);
      }

      if (primaryNodeRef && bottomSibRef) {
        primaryNodeRef.siblingKeys.push(bottomSibRef.key);
        bottomSibRef.siblingKeys.push(primaryNodeRef.key);
      }
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
  return connectSiblings({
    rows,
    cols,
    spacing,
    nodeArray,
  });
}