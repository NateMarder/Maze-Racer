import {
  GetHexFromNodesProps,
  MazeNode,
} from "../types";
import { toGridCoordinate } from "./coordinate-utilities";

/**
 * Compresses two logical cells into each hexadecimal character. Each bit
 * records one right or down passage, so shared walls are encoded exactly once:
 * [left-right, left-down, right-right, right-down].
 */
export function getHexFromNodes({
  nodes,
  rows,
  cols,
  spacing,
}: GetHexFromNodesProps): string {
  let serialized = "";
  const nodesByOriginalKey = new Map(
    nodes.map((node) => [node.key, node]),
  );
  const nodesByGridKey = new Map<string, MazeNode>();

  nodes.forEach((node) => {
    const coordinate = toGridCoordinate(node, spacing);
    nodesByGridKey.set(
      `${coordinate.x},${coordinate.y}`,
      node,
    );
  });

  const hasPassage = (
    fromNode: MazeNode | undefined,
    toNode: MazeNode | undefined,
  ): boolean => Boolean(
    fromNode
    && toNode
    && nodesByOriginalKey.has(toNode.key)
    && fromNode.siblingKeys.includes(toNode.key),
  );

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 2) {
      const leftNode = nodesByGridKey.get(`${x},${y}`);
      const rightNode = nodesByGridKey.get(`${x + 1},${y}`);
      const binary = [
        hasPassage(
          leftNode,
          nodesByGridKey.get(`${x + 1},${y}`),
        ),
        hasPassage(
          leftNode,
          nodesByGridKey.get(`${x},${y + 1}`),
        ),
        hasPassage(
          rightNode,
          nodesByGridKey.get(`${x + 2},${y}`),
        ),
        hasPassage(
          rightNode,
          nodesByGridKey.get(`${x + 1},${y + 1}`),
        ),
      ].map((isOpen) => isOpen ? "1" : "0").join("");

      serialized += Number.parseInt(binary, 2).toString(16);
    }
  }

  return serialized;
}

export function binaryFromHex(input: string): string {
  const value = Number.parseInt(input, 16);
  return Number.isNaN(value)
    ? "0000"
    : value.toString(2).padStart(4, "0");
}
