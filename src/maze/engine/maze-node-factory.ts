import type { MazeNode } from "../types";

interface BuildNodeArrayProps {
  rows: number;
  cols: number;
  spacing: number;
}

interface AddSiblingProps extends BuildNodeArrayProps {
  nodeArray: MazeNode[];
}

interface BuildNodeArrayWithoutSpacingProps {
  rows: number;
  cols: number;
}

function buildNodeArray({ rows, cols, spacing }: BuildNodeArrayProps) {
  const arrayOfNodes: MazeNode[] = [];
  const offset = spacing / 2;
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const x = i * spacing + offset;
      const y = j * spacing + offset
      arrayOfNodes.push(
        ({
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

function connectSiblings({ rows, cols, spacing, nodeArray }: AddSiblingProps) {

  const offset = Math.round(spacing / 2);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + offset;
      const y = row * spacing + offset;

      const primaryNodeRef = nodeArray.find(n => n.key === `${x}.${y}`);
      const rightSibRef = nodeArray.find(n => n.key === `${x + spacing}.${y}`);
      const bottomSibRef = nodeArray.find(n => n.key === `${x}.${y + spacing}`);

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
export function getBlankNodesForEngine({ rows, cols, spacing }: BuildNodeArrayProps): MazeNode[] {
  const nodeArray = buildNodeArray({ rows, cols, spacing });
  return connectSiblings({
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
export function getBlankNodesForEngineWithoutSpacing({ rows, cols }: BuildNodeArrayWithoutSpacingProps): MazeNode[] {
  // we will let the spacing be '2', as this will cause the offset to be '1', so the initial coordinates will retain simple integer math
  const spacing = 2;
  const nodeArray = buildNodeArray({ rows, cols, spacing });
  return connectSiblings({
    rows,
    cols,
    spacing,
    nodeArray,
  });
}
