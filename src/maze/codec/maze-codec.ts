import { createPathsFromInactiveWalls } from "../path/path-factory";
import {
    EncodedMaze,
    EncodedMazeV1,
    GridCoordinate,
    MazeNode,
    MazePath,
    MazeState,
} from "../types";
import {
    assertGridCoordinateInBounds,
    toGridCoordinate,
    toSvgCoordinate,
} from "./coordinate-utilities";
import { getFreshMazeNodes, getInactiveWallsFromHex } from "./decode-utilities";
import { getHexFromNodes } from "./encode-utilities";

interface GetWallsFromInactiveKeysProps {
    rows: number;
    cols: number;
    spacing: number;
    inactiveWallKeys: string[];
}

interface MazePresentation {
    spacing: number;
    level: number;
}

export const CURRENT_MAZE_CODEC_VERSION = 1 as const;

const CANONICAL_ID_PATTERN =
    /^v(\d+):(\d+)x(\d+):([0-9a-f]*):start=(\d+),(\d+):end=(\d+),(\d+)$/i;

function assertValidDimensions(cols: number, rows: number): void {
    if (
        !Number.isInteger(cols)
        || !Number.isInteger(rows)
        || cols <= 0
        || rows <= 0
    ) {
        throw new Error(`invalid maze dimensions: ${cols}x${rows}`);
    }
}

function assertValidTopology(serialized: string): void {
    if (!/^[0-9a-f]*$/i.test(serialized)) {
        throw new Error("maze topology must contain only hexadecimal characters");
    }
}

function assertCanonicalTopology(
    serialized: string,
    cols: number,
    rows: number,
): void {
    assertValidTopology(serialized);

    const expectedLength = rows * Math.ceil(cols / 2);

    if (serialized.length !== expectedLength) {
        throw new Error(
            `maze topology must contain exactly ${expectedLength} hexadecimal characters`,
        );
    }

    let hexIndex = 0;

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 2) {
            const value = Number.parseInt(serialized.charAt(hexIndex++), 16);
            const allowedBits =
                (x + 1 < cols ? 0b1000 : 0)
                | (y + 1 < rows ? 0b0100 : 0)
                | (x + 2 < cols ? 0b0010 : 0)
                | (x + 1 < cols && y + 1 < rows ? 0b0001 : 0);

            if ((value & ~allowedBits) !== 0) {
                throw new Error(
                    "maze topology contains a passage outside the logical grid",
                );
            }
        }
    }
}

function getGridStart(maze: MazeState): GridCoordinate {
    const start = maze.start
        ?? maze.nodes.find((node) => node.isStart)
        ?? {
            x: maze.spacing / 2,
            y: maze.spacing / 2,
        };

    return toGridCoordinate(start, maze.spacing);
}

export const MazeCodec = {
    encode(maze: MazeState): EncodedMazeV1 {
        const {
            cols,
            rows,
            level,
            destination,
            spacing,
            nodes,
        } = maze;

        assertValidDimensions(cols, rows);

        const serialized = getHexFromNodes({
            ...maze,
            nodes,
        }).toLowerCase();
        const start = getGridStart(maze);
        const logicalDestination = toGridCoordinate(destination, spacing);

        assertGridCoordinateInBounds(start, cols, rows, "start");
        assertGridCoordinateInBounds(
            logicalDestination,
            cols,
            rows,
            "end",
        );

        return {
            version: CURRENT_MAZE_CODEC_VERSION,
            rows,
            cols,
            destination: logicalDestination,
            level,
            serialized,
            spacing,
            start,
        };
    },

    getCanonicalId(encoded: EncodedMazeV1): string {
        const {
            version,
            cols,
            rows,
            serialized,
            start,
            destination,
        } = encoded;

        if (version !== CURRENT_MAZE_CODEC_VERSION) {
            throw new Error(`unsupported maze codec version: ${version}`);
        }

        assertValidDimensions(cols, rows);
        assertCanonicalTopology(serialized, cols, rows);
        assertGridCoordinateInBounds(start, cols, rows, "start");
        assertGridCoordinateInBounds(destination, cols, rows, "end");

        return [
            `v${version}`,
            `${cols}x${rows}`,
            serialized.toLowerCase(),
            `start=${start.x},${start.y}`,
            `end=${destination.x},${destination.y}`,
        ].join(":");
    },

    parseCanonicalId(
        canonicalId: string,
        presentation: MazePresentation,
    ): EncodedMazeV1 {
        const match = CANONICAL_ID_PATTERN.exec(canonicalId);

        if (!match) {
            throw new Error("invalid canonical maze identifier");
        }

        const [
            ,
            versionValue,
            colsValue,
            rowsValue,
            serialized,
            startXValue,
            startYValue,
            endXValue,
            endYValue,
        ] = match;
        const version = Number(versionValue);

        if (version !== CURRENT_MAZE_CODEC_VERSION) {
            throw new Error(`unsupported maze codec version: ${version}`);
        }

        const encoded: EncodedMazeV1 = {
            version,
            cols: Number(colsValue),
            rows: Number(rowsValue),
            serialized: serialized.toLowerCase(),
            start: {
                x: Number(startXValue),
                y: Number(startYValue),
            },
            destination: {
                x: Number(endXValue),
                y: Number(endYValue),
            },
            spacing: presentation.spacing,
            level: presentation.level,
        };

        // Reuse the canonical writer's validation so parsing and writing cannot
        // disagree about what constitutes a valid identifier.
        this.getCanonicalId(encoded);

        return encoded;
    },

    updateNodeSiblings(
        mazePaths: MazePath[],
        mazeNodes: MazeNode[],
    ): MazeNode[] {
        const clonedNodes: MazeNode[] = [...mazeNodes];

        clonedNodes.forEach((node) => {
            node.siblingKeys = [];
        });

        mazePaths.forEach((mazePath) => {
            const [node1Key, node2Key] = mazePath.nodeKeys;
            const nodeRef1 = clonedNodes.find((node) => node.key === node1Key);
            const nodeRef2 = clonedNodes.find((node) => node.key === node2Key);

            if (nodeRef1 && nodeRef2) {
                nodeRef1.siblingKeys.push(nodeRef2.key);
                nodeRef2.siblingKeys.push(nodeRef1.key);
            }
        });

        return clonedNodes;
    },

    decode(encoded: EncodedMaze): MazeState {
        const {
            cols,
            rows,
            level,
            spacing,
            serialized,
        } = encoded;

        assertValidDimensions(cols, rows);
        assertValidTopology(serialized);

        const start = encoded.version === CURRENT_MAZE_CODEC_VERSION
            ? toSvgCoordinate(encoded.start, spacing)
            : encoded.start;
        const destination = encoded.version === CURRENT_MAZE_CODEC_VERSION
            ? toSvgCoordinate(encoded.destination, spacing)
            : encoded.destination;
        const inactiveWallKeys = getInactiveWallsFromHex({
            encodedMazeHex: serialized,
            rows,
            cols,
            spacing,
        });
        const activeWalls = this.getWallsFromInactiveWallKeys({
            rows,
            cols,
            spacing,
            inactiveWallKeys,
        });
        const paths = [
            ...new Set(createPathsFromInactiveWalls(inactiveWallKeys)),
        ];
        const freshNodes = getFreshMazeNodes({
            rows,
            cols,
            spacing,
            start,
            destination,
        });
        const nodesWithSiblings = this.updateNodeSiblings(paths, freshNodes);
        const canonicalId = encoded.version === CURRENT_MAZE_CODEC_VERSION
            ? this.getCanonicalId(encoded)
            : undefined;

        return {
            rows,
            cols,
            destination,
            level,
            serialized,
            spacing,
            start,
            allPaths: paths,
            inactiveWallKeys,
            height: spacing * rows,
            width: spacing * cols,
            nodes: nodesWithSiblings,
            walls: activeWalls,
            codecVersion: encoded.version,
            canonicalId,
        };
    },

    /**
     * Creates every possible interior wall and filters out the walls crossed
     * by a passage in the decoded maze.
     */
    getWallsFromInactiveWallKeys({
        rows,
        cols,
        spacing,
        inactiveWallKeys,
    }: GetWallsFromInactiveKeysProps) {
        const wallCache = [];

        for (let i = 1; i <= cols - 1; i += 1) {
            for (let j = 0; j < rows; j += 1) {
                const x = i * spacing;
                const y1 = j * spacing;
                const y2 = y1 + spacing;
                wallCache.push({
                    id: `${x}.${y1}.${x}.${y2}`,
                    x1: x,
                    y1,
                    x2: x,
                    y2,
                });
            }
        }

        for (let i = 1; i <= rows - 1; i += 1) {
            for (let j = 0; j < cols; j += 1) {
                const y = i * spacing;
                const x1 = j * spacing;
                const x2 = x1 + spacing;
                wallCache.push({
                    id: `${x1}.${y}.${x2}.${y}`,
                    x1,
                    y1: y,
                    x2,
                    y2: y,
                });
            }
        }

        return wallCache.filter(
            (wall) => !inactiveWallKeys.includes(wall.id),
        );
    },
};
