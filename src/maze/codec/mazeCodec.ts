
import { NodeFactory } from "../node";
import { createPathsFromInactiveWalls } from "../path";
import { EncodedMaze, MazeState, EncoderProps, MazeNode, MazePath } from "../types";
import { getWallsFromInactiveWallKeys } from "../wall/MazeWall";
import { getHexRepresentationOfNodeArray, hydratePathDirections } from "./compressionHandler";
import { getFreshMazeNodes, getInactiveWallsFromHex } from "./decoder";


export const MazeCodec = {
    encode(maze: EncoderProps): EncodedMaze {
        const { cols, rows, level, destination, spacing, start, nodes } = maze;
        const hydratedNodes = hydratePathDirections(nodes);
        const hexRepresentationOfMaze = getHexRepresentationOfNodeArray(hydratedNodes, rows, cols);
        const encoded: EncodedMaze = {
            rows: rows,
            cols: cols,
            destination: destination,
            level: level,
            serialized: hexRepresentationOfMaze,
            spacing: spacing,
            start: start || { x: (spacing / 2), y: (spacing / 2) }
        }

        return encoded;
    },

    updateNodeSiblings(mazePaths: MazePath[], mazeNodes: MazeNode[]) {

        const clonedNodes:MazeNode[] = [...mazeNodes];

        clonedNodes.forEach((n: MazeNode) => {
            n.siblingKeys = []; // eslint-disable-line no-param-reassign
        });

        mazePaths.forEach((mazePath:MazePath) => {
            const [node1Key, node2Key] = mazePath.nodeKeys;
            const nodeRef1:MazeNode|undefined = clonedNodes.find((n) => n.key === node1Key);
            const nodeRef2:MazeNode|undefined= clonedNodes.find((n) => n.key === node2Key);
            if (nodeRef1 && nodeRef2) {
                nodeRef1.siblingKeys.push(nodeRef2.key);
                nodeRef2.siblingKeys.push(nodeRef1.key);
            }
        });

        return clonedNodes;
    },

    decode(encoded: EncodedMaze): MazeState {
        const { cols, rows, level, destination, spacing, start, serialized } = encoded;

        interface TranslateHexProps {
            encodedMazeHex: string,
            rows: number,
            cols: number,
            spacing: number
        }
        const props:TranslateHexProps = {
            encodedMazeHex: serialized,
            rows: rows,
            cols: cols,
            spacing: spacing
        }
        const inactiveWallKeys = [...new Set (getInactiveWallsFromHex(props))]
        const activeWalls = [...new Set (getWallsFromInactiveWallKeys({
            rows: rows,
            cols: cols,
            spacing: spacing,
            inactiveWallKeys: inactiveWallKeys
        }))];


       const paths = [...new Set (createPathsFromInactiveWalls(inactiveWallKeys))];

       //console.log("all Paths: ", paths);

       const freshNodes = [...new Set (getFreshMazeNodes(encoded))];

       const nodesWithSiblintgs = this.updateNodeSiblings(paths,  freshNodes)

        const decoded: MazeState = {
            rows: rows,
            cols: cols,
            destination: destination,
            level: level,
            serialized,
            spacing: spacing,
            start: start,
            allPaths: paths, // we need to calculate
            inactiveWallKeys: inactiveWallKeys, // we need to calculate
            destNodeX: destination.x.toString(),
            destNodeY: destination.y.toString(),
            height: spacing * rows,
            width: spacing * cols,
            nodes: nodesWithSiblintgs,
            walls: activeWalls // we need to calculate
        }

        return decoded;
    }
};