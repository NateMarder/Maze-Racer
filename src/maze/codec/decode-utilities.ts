import MazeNode from "../node/maze-node";
import { binaryFromHex } from "./encode-utilities";
import {
    GridCoordinate,
    MazeNode as MazeNodeType,
    SvgCoordinate,
    WallKey,
} from "../types";

interface GetFreshNodesProps {
    rows: number,
    cols: number,
    spacing: number,
    start: SvgCoordinate,
    destination: SvgCoordinate,
}

interface DecodeTopologyProps {
    encodedMazeHex: string,
    rows: number,
    cols: number,
}

interface TranslateHexProps extends DecodeTopologyProps {
    spacing: number
}

export type GridPassage = {
    from: GridCoordinate;
    to: GridCoordinate;
};

export const getFreshMazeNodes = ({
    rows,
    cols,
    spacing,
    start,
    destination,
}: GetFreshNodesProps) => {
    const arrayOfNodes: MazeNodeType[] = [];

    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
            const key = `${(i * spacing + offset).toString()}.${(j * spacing + offset).toString()}`;
            const nextNode = new MazeNode({
                x: i * spacing + offset,
                y: j * spacing + offset,
                key: key,
                siblingKeys: [],
                isStart: key === `${start.x}.${start.y}`,
                isDest: key === `${destination.x}.${destination.y}`,
                discoveredBy: '',
                isVisited: false,
                distFromStart: 0,
            });
            arrayOfNodes.push(nextNode);
        }
    }
    return arrayOfNodes;
}

function isInBounds(
    coordinate: GridCoordinate,
    cols: number,
    rows: number,
): boolean {
    return coordinate.x >= 0
        && coordinate.x < cols
        && coordinate.y >= 0
        && coordinate.y < rows;
}

export const getGridPassagesFromHex = ({
    encodedMazeHex,
    rows,
    cols,
}: DecodeTopologyProps): GridPassage[] => {
    const passages: GridPassage[] = [];
    let hexCounter = 0;

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 2) {
            const nextHexChar = encodedMazeHex.charAt(hexCounter++);
            const binaryValue = binaryFromHex(nextHexChar);
            const candidates: Array<GridPassage & { bit: number }> = [
                {
                    bit: 0,
                    from: { x, y },
                    to: { x: x + 1, y },
                },
                {
                    bit: 1,
                    from: { x, y },
                    to: { x, y: y + 1 },
                },
                {
                    bit: 2,
                    from: { x: x + 1, y },
                    to: { x: x + 2, y },
                },
                {
                    bit: 3,
                    from: { x: x + 1, y },
                    to: { x: x + 1, y: y + 1 },
                },
            ];

            candidates.forEach(({ bit, from, to }) => {
                if (
                    binaryValue.charAt(bit) === "1"
                    && isInBounds(from, cols, rows)
                    && isInBounds(to, cols, rows)
                ) {
                    passages.push({ from, to });
                }
            });
        }
    }

    return passages;
};

function getWallKeyFromGridPassage(
    passage: GridPassage,
    spacing: number,
): WallKey {
    const { from, to } = passage;

    if (from.y === to.y) {
        const wallX = Math.max(from.x, to.x) * spacing;
        const wallY1 = from.y * spacing;
        const wallY2 = wallY1 + spacing;

        return `${wallX}.${wallY1}.${wallX}.${wallY2}`;
    }

    const wallY = Math.max(from.y, to.y) * spacing;
    const wallX1 = from.x * spacing;
    const wallX2 = wallX1 + spacing;

    return `${wallX1}.${wallY}.${wallX2}.${wallY}`;
}

export const getInactiveWallsFromHex = ({
    encodedMazeHex,
    rows,
    cols,
    spacing,
}: TranslateHexProps): WallKey[] =>
    getGridPassagesFromHex({
        encodedMazeHex,
        rows,
        cols,
    }).map((passage) => getWallKeyFromGridPassage(passage, spacing));
