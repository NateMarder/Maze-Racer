
import { createPathsFromInactiveWalls } from "../path";
import { EncodedMaze, MazeState, MazeNode, MazePath } from "../types";
import { getHexFromNodes, getHexRepresentationOfNodeArray, hydratePathDirections } from "./encodeUtilities";
import { getFreshMazeNodes, getInactiveWallsFromHex } from "./decodeUtilities";

interface InactiveWallKey {
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

interface GetWallsFromInactiveKeysProps {
    rows: number,
    cols: number,
    spacing: number,
    inactiveWallKeys: string[]
}

export const MazeCodec = {
    encode(maze: MazeState): EncodedMaze {
        const { cols, rows, level, destination, spacing, start, nodes } = maze;
        const hydratedNodes = hydratePathDirections(nodes);
        const hexRepresentationOfMaze = getHexFromNodes({
            ...maze,
            nodes: hydratedNodes
        });
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

        const clonedNodes: MazeNode[] = [...mazeNodes];

        clonedNodes.forEach((n: MazeNode) => {
            n.siblingKeys = []; // eslint-disable-line no-param-reassign
        });

        mazePaths.forEach((mazePath: MazePath) => {
            const [node1Key, node2Key] = mazePath.nodeKeys;
            const nodeRef1: MazeNode | undefined = clonedNodes.find((n) => n.key === node1Key);
            const nodeRef2: MazeNode | undefined = clonedNodes.find((n) => n.key === node2Key);
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
        const props: TranslateHexProps = {
            encodedMazeHex: serialized,
            rows: rows,
            cols: cols,
            spacing: spacing
        }
        const freshNodes = getFreshMazeNodes(encoded);
        const inactiveWallKeys = getInactiveWallsFromHex(props)
        console.log("\inactiveWallKeys count: ", inactiveWallKeys.length);

        const activeWalls = this.getWallsFromInactiveWallKeys({
            rows,
            cols,
            spacing,
            inactiveWallKeys: inactiveWallKeys
        });

        console.log("\nwall count: ", activeWalls.length);
        const paths = [...new Set(createPathsFromInactiveWalls(inactiveWallKeys))];
        const nodesWithSiblings = this.updateNodeSiblings(paths, freshNodes)

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
            height: spacing * rows,
            width: spacing * cols,
            nodes: nodesWithSiblings,
            walls: activeWalls // we need to calculate
        }

        return decoded;
    },

    /**
     * 
     * @desription we use this to create a new maze - by creating all the possible
     * walls, and then filtering out the wallKeys we know shouldn't be their because
     * the of an orthogonal path crossing. 
     */
    getWallsFromInactiveWallKeys({ rows, cols, spacing, inactiveWallKeys }:GetWallsFromInactiveKeysProps) {
        const wallCache = [];
        let x1;
        let y1;
        let x2;
        let y2;
        for (let i = 1; i <= cols - 1; i += 1) {
            for (let j = 0; j < rows; j += 1) {
                x1 = i * spacing;
                x2 = i * spacing;
                y1 = j * spacing;
                y2 = (j * spacing) + spacing;
                wallCache.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
            }
        }
        for (let i = 1; i <= rows - 1; i += 1) {
            for (let j = 0; j < cols; j += 1) {
                y1 = i * spacing;
                y2 = i * spacing;
                x1 = j * spacing;
                x2 = (j * spacing) + spacing;
                wallCache.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
            }
        }

        // only return
        const slimWallCache = [...new Set(wallCache)];
        const activeWalls = slimWallCache.filter(w => !inactiveWallKeys.includes(w.id));
        return activeWalls;
    }
};