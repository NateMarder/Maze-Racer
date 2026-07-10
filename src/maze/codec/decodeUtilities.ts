import { MazeNode } from "../node";
import { binaryFromHex } from "./compressionHandler";
import { MazeNode as MazeNodeType } from "../types";

interface GetFreshNodesProps {
    rows: number,
    cols: number,
    spacing: number
}

interface TranslateHexProps {
    encodedMazeHex: string,
    rows: number,
    cols: number,
    spacing: number
}

export const getFreshMazeNodes = ({ rows, cols, spacing }: GetFreshNodesProps) => {
    let arrayOfNodes: MazeNodeType[] = [];

    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
            const key = `${(i * spacing + offset).toString()}.${(j * spacing + offset).toString()}`;
            const nextNode = new MazeNode({
                x: i * spacing + offset,
                y: j * spacing + offset,
                key: key,
                siblingKeys: [],
                isStart: i + j === 0,
                isDest: i === cols - 1 && j === rows - 1,
                discoveredBy: '',
                isVisited: false,
                distFromStart: 0,
            });
            arrayOfNodes.push(nextNode);
        }
    }
    return arrayOfNodes;
}

export const getInactiveWallFromBinaryString = (binString: string, leftNodeCx: number, leftNodeCy: number, rightNodeCx: number, rightNodeCy: number, spacing: number) => {
    // this can be cleaned up and simplified. It's very 'declarative' right now to help with understanding
    // what's happening and why. each binary string needs to handle four possible inactive walls represented
    // by the objects a,b,c,d below
    //   [a,b,c,d] 
    //    a --> left node's right-side sibling 
    //    b --> left node's bottom-side sibling
    //    c --> right node's right-side sibling 
    //    d --> right node's bottom-side sibling
    const inactiveWallKeys: string[] = []
    const offset = spacing / 2;
    let a = { x1: 0, y1: 0, x2: 0, y2: 0 }
    let b = { x1: 0, y1: 0, x2: 0, y2: 0 }
    let c = { x1: 0, y1: 0, x2: 0, y2: 0 }
    let d = { x1: 0, y1: 0, x2: 0, y2: 0 }

    // wall 'a'
    if (binString.charAt(0) === "1") {
        a.x1 = leftNodeCx + offset;
        a.y1 = leftNodeCy - offset;
        a.x2 = leftNodeCx + offset;
        a.y2 = leftNodeCy + offset;
        inactiveWallKeys.push(`${a.x1}.${a.y1}.${a.x2}.${a.y2}`);
    }

    // wall 'b'
    if (binString.charAt(1) === "1") {
        b.x1 = leftNodeCx - offset;
        b.y1 = leftNodeCy + offset;
        b.x2 = leftNodeCx + offset;
        b.y2 = leftNodeCy + offset;
        inactiveWallKeys.push(`${b.x1}.${b.y1}.${b.x2}.${b.y2}`);
    }

    // wall 'c'
    if (binString.charAt(2) === "1") {
        c.x1 = rightNodeCx + offset;
        c.y1 = rightNodeCy - offset;
        c.x2 = rightNodeCx + offset;
        c.y2 = rightNodeCy + offset;
        inactiveWallKeys.push(`${c.x1}.${c.y1}.${c.x2}.${c.y2}`);
    }

    // wall 'd'
    if (binString.charAt(3) === "1") {
        d.x1 = rightNodeCx - offset;
        d.y1 = rightNodeCy + offset;
        d.x2 = rightNodeCx + offset;
        d.y2 = rightNodeCy + offset;
        inactiveWallKeys.push(`${d.x1}.${d.y1}.${d.x2}.${d.y2}`);
    }

    return inactiveWallKeys;
}

export const getInactiveWallsFromHex = ({ encodedMazeHex, rows, cols, spacing }: TranslateHexProps): string[] => {
    let inactiveKeys: string[] = [];
    let hexCounter = 0;
    let offset = spacing / 2;
    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols - 1; j += 2) {
            const nextHexChar = encodedMazeHex.charAt(hexCounter++);
            const binaryValue = binaryFromHex(nextHexChar);
            const node1X = offset + (j * spacing);
            const node1Y = offset + (i * spacing);
            const node2X = node1X.valueOf() + spacing;
            const node2Y = offset + (i * spacing);
            const groupOfInactiveWallKeys = getInactiveWallFromBinaryString(binaryValue, node1X, node1Y, node2X, node2Y, spacing);
            // careful with this output, it's helpful but massive: console.log(`   ${nextHexChar} --> ${binaryValue} --> ${groupOfInactiveWallKeys}`);
            groupOfInactiveWallKeys.forEach((key) => {
                inactiveKeys.push(key);
            })
        }
    }

    // const deduplicatedKeys:string[] = [...new Set(inactiveKeys)]
    return inactiveKeys;
}
