
import { NodeFactory } from "../node";
import { EncodedMaze, MazeState, EncoderProps } from "../types";
import { getHexRepresentationOfNodeArray, hydratePathDirections } from "./compressionHandler";


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

    decode(encoded: EncodedMaze): MazeState {
        const { cols, rows, level, destination, spacing, start, serialized } = encoded;
        const nodes = new NodeFactory().getNodes(encoded);
        const decoded: MazeState = {
            rows: rows,
            cols: cols,
            destination: destination,
            level: level,
            serialized,
            spacing: spacing,
            start: start,
            allPaths: [], // we need to calculate
            inactiveWallKeys: [], // we need to calculate
            destNodeX: destination.x.toString(),
            destNodeY: destination.y.toString(),
            height: spacing * rows,
            width: spacing * cols,
            nodes: nodes,
            walls: [] // we need to calculate
        }

        return decoded;
    }
};