import { MazeNode, NodeFactory } from "../node";
import { binaryFromHex } from "./compressionHandler";


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
    let arrayOfNodes: MazeNode[] = [];
    //const nodeMap = new Map<string, MazeNode>();

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
            //nodeMap.set(key, nextNode);
            arrayOfNodes.push(nextNode);
        }
    }
    return arrayOfNodes;
}

// note that each char in the binString can be a 1 or 0, 
// 1 means there's a traversable path, i.e. there should be an inactiveWallKey representing this wall
// from left to right here's what each number represents:
//   [a,b,c,d] 
//    a --> left node's right-side sibling 
//    b --> left node's bottom-side sibling
//    c --> right node's right-side sibling 
//    d --> right node's bottom-side sibling

export const getWallKeyFromSmallBinaryString = (binString: string, cx: number, cy: number, spacing: number) => {
    // [a, b]
    // a --> node's righthand side inactive wall
    // b --> node's bottom side inactive wall
    let offset = spacing / 2;
    const a = binString.charAt(0);
    const b = binString.charAt(1);
    const inactiveWallKeys: string[] = []
    let ax1, ay1, ax2, ay2; // possible wall 'a'
    let bx1, by1, bx2, by2; // possible wall 'b'

    if (a === "1") {
        // we need an inactive wall key on this maze node's right side
        ax1 = offset + cx;
        ay1 = offset - cy;
        ax2 = offset + cx;
        ay2 = offset + cy;
        inactiveWallKeys.push(`${ax1}.${ay1}.${ax2}.${ay2}`)
    }

    if (b === "1") {
        // we need an inactive wall key on this maze node's bottom side
        bx1 = cx - offset;
        by1 = cy + offset;
        bx2 = cx + offset;
        by2 = cy + offset;
        inactiveWallKeys.push(`${bx1}.${by1}.${bx2}.${by2}`)
    }

}

export const getInactiveWallFromBinaryString = (binString: string, leftNodeCx: number, leftNodeCy: number, rightNodeCx: number, rightNodeCy: number, spacing: number) => {
    const inactiveWallKeys: string[] = []
    const offset = spacing / 2;
    let a = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }
    let b = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }
    let c = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }
    let d = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }

    // a === 1  (LeftHand Node: right Wall)
    if (binString.charAt(0) === "1") {
        a.x1 = leftNodeCx + offset;
        a.y1 = leftNodeCy - offset;
        a.x2 = leftNodeCx + offset;
        a.y2 = leftNodeCy + offset;
        inactiveWallKeys.push(`${a.x1}.${a.y1}.${a.x2}.${a.y2}`);
    }
    // b === 1  (Lefthand Node: bottom wall)
    if (binString.charAt(1) === "1") {
        b.x1 = leftNodeCx - offset;
        b.y1 = leftNodeCy + offset;
        b.x2 = leftNodeCx + offset;
        b.y2 = leftNodeCy + offset;
        inactiveWallKeys.push(`${b.x1}.${b.y1}.${b.x2}.${b.y2}`);
    }
    // c === 1  (Righthand Node: right wall)
    if (binString.charAt(2) === "1") {
        c.x1 = rightNodeCx + offset;
        c.y1 = rightNodeCy - offset;
        c.x2 = rightNodeCx + offset;
        c.y2 = rightNodeCy + offset;
        inactiveWallKeys.push(`${c.x1}.${c.y1}.${c.x2}.${c.y2}`);
    }
    // d === 1  (Righthand Node: bottom wall)
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

    //const nodeCache: MazeNode[] = new NodeFactory().getNodes({ rows: rows, cols: cols, spacing: spacing });
    //console.log('nodes are:', nodeCache);
    let inactiveKeys: string[] = [];
    let hexCounter = 0;
    let offset = spacing / 2;
    for (let i = 0; i < rows - 1; i += 1) {
        for (let j = 0; j < cols - 1; j += 2) {

            const nextHexChar = encodedMazeHex.charAt(hexCounter++);

            const binaryValue = binaryFromHex(nextHexChar);

            const node1X = i * spacing + offset;
            const node1Y = j * spacing + offset;
            const node2X = node1X + spacing;
            const node2Y = j * spacing + offset;

            const key1 = `${node1X}.${node1Y}`;
            const key2 = `${node2X}.${node2Y}`;

            //console.log(`working on column=${actualRowVal},row=${actualColVal} with binary value: ${binaryValue} (${nextHexChar})`);
            // console.log(`   node1 -->${key1} ::\n   node2 -->${key2}`)
            const groupOfInactiveWallKeys = getInactiveWallFromBinaryString(binaryValue, node1X, node1Y, node2X, node2Y, spacing);
            //const firstNodesInactiveWalls = getWallKeyFromSmallBinaryString(`${parseInt(binaryValue.charAt(0))}`)
            console.log(`   ${nextHexChar} --> ${binaryValue} --> ${groupOfInactiveWallKeys.toLocaleString()}`);

            groupOfInactiveWallKeys.forEach((key) => {
                inactiveKeys.push(key);
            })
            // at this point we have 4 possible inactive walls to add...
            // [0,0,0,0] --> no walls
            // [1,1,1,1] --> 4 inactive walls 
            // [lhNode.R, LhNode.B, RhNode.R, RhNode.B] --> read lhNode.R as left-hand node, right-side wall should be inactive

        }
    }

    return inactiveKeys;
}


// let hexCounter = 0;

