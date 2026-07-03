
import { MazeNode } from "../node";
import { directions } from "./compressionHandler";


// takes an individual node and returns a node with path directions
// the codec functions that exist currently are doing a lot of 
// transformations, and they would be more readable with some helper functions
// like this. Also, they were written as class-instance methods
// which isn't necessarily a pattern we will be keeping around
export function getNodeDirections(node: MazeNode) {
    // evidently we really wanted this to just run once per node
    const result = { ...node };
    const siblings = [...node.siblingKeys];
    const [x, y] = [...node.key.split('.')];
    const cx = parseInt(x);
    const cy = parseInt(y);

    for (let sibKey of siblings) {
        const split = sibKey.split(".");
        const sibX = parseInt(split[0]);
        const sibY = parseInt(split[1]);

        if (sibX !== cx) { // horizontal sibling but keep in mind we iterate from left to right
            if (sibX < cx) {
                result.pathDirections.push(directions.Left);
            } else {
                result.pathDirections.push(directions.Right);
            }
        } else if (sibY !== cy) { // vertical sibling but keep in mind we iterate from top to bottom
            if (sibY < cy) {
                result.pathDirections.push(directions.Up);
            } else {
                result.pathDirections.push(directions.Down);
            }
        }
    }

    return result.pathDirections.sort();
}

function getHexFromDecimalString(input: number) {
    switch (input) {
        case 10: return "a";
        case 11: return "b";
        case 12: return "c";
        case 13: return "d";
        case 14: return "e";
        case 15: return "f";
        default: return input.toString();
    }
}

export function getHexRepresentationOfNodePair(node1: MazeNode, node2?: MazeNode):string {
    let hx = "";
    let numberVal = 0;
    let binary = ""; // note this is a string, which we add too, one digit at a time
    let node1Paths = node1.pathDirections;
    binary += node1Paths.indexOf(directions.Right) > -1 ? "1" : "0"; // this needs to be adjusted, it's not currently working right
    binary += node1Paths.indexOf(directions.Down) > -1 ? "1" : "0";

    if (node2) {
        let node2Paths = node2.pathDirections;
        binary += node2Paths.indexOf(directions.Right) > -1 ? "1" : "0";
        binary += node2Paths.indexOf(directions.Down) > -1 ? "1" : "0";
    }

    numberVal = parseInt(binary, 2);
    hx += getHexFromDecimalString(numberVal);

    return hx;
}