import { MazeNode, MazeState } from "../types";

export enum directions {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
};

// accepts an array of nodes with siblingKeys, and returns
// the same nodes WITH pathDirections also included. A path direction
// is basically just the orthogonal equivalent of an open wall
export const hydratePathDirections = (nodes: MazeNode[]) => {
  const clones = [...nodes];

  for (let j = 0; j <= clones.length - 1; j++) {
    clones[j] = getNodeWithDirections(clones[j]);
  }

  return clones;
}

// this is used during the serialization phase, it's a little confusing
// to read now because it was written as an instance method, but this 
// method is essentially swapping out the maze-graph's sibling keys for 
// path directions, which are enums, and therefore easily converted to 
// ones and zeros (binary). 
export const getNodeWithDirections = (node: MazeNode): MazeNode => {

  const pathDirections: string[] = []
  const result: MazeNode = { ...node }
  const siblingKeys = [...node.siblingKeys];

  const splitKey = result.key.split('.');
  const cx = parseInt(splitKey[0]);
  const cy = parseInt(splitKey[1]);

  for (const sibKey of siblingKeys) {
    const split = sibKey.split(".");
    const sibX = parseInt(split[0]);
    const sibY = parseInt(split[1]);

    if (sibX !== cx) { // horizontal sibling but keep in mind we iterate from left to right
      if (sibX > cx) {
        pathDirections.push("1"); // right
      } else if (sibX < cx) {
        pathDirections.push("3"); // left
      }
    } else if (sibY !== cy) { // vertical sibling but keep in mind we iterate from top to bottom
      if (sibY > cy) {
        pathDirections.push("2"); // down
      } else if (sibY < cy) {
        pathDirections.push("0"); // up
      }
    }
  }

  result.pathDirections = pathDirections;
  return result;
}

export const getPathDirections = (node: MazeNode) => {
  const result = [];
  const clone: MazeNode = { ...node };
  const splitKey = clone.key.split('.');
  const cx = parseInt(splitKey[0]);
  const cy = parseInt(splitKey[1]);
  const siblingKeys = [...clone.siblingKeys];

  for (const sibKey of siblingKeys) {
    const split = sibKey.split(".");
    const sibX = parseInt(split[0]);
    const sibY = parseInt(split[1]);

    if (sibX !== cx) { // horizontal sibling but keep in mind we iterate from left to right
      if (sibX > cx) {
        result.push(1); // right
      } else if (sibX < cx) {
        result.push(3); // left
      }
    } else if (sibY !== cy) { // vertical sibling but keep in mind we iterate from top to bottom
      if (sibY > cy) {
        result.push(2); // down
      } else if (sibY < cy) {
        result.push(0); // up
      }
    }
  }

  const uniquePaths = new Set(result);

  return uniquePaths;
}


// This is the core of both the serialization and compression. This function iterates
// through all the nodes, 2 at a time. We should split this out into multiple
// steps, but essentially, within 1 for-loop, we are analyzing the node's 
// path-directions (thing of them as the traversable sides that are touching other nodes)
// and depending on the paths vs. walls, we assign that node a specific binary value.
// This binary value, which represents all the paths for the bottom and right sides of BOTH
// the nodes (we are iterating 2 at a time), is then converted into a number value. 
//
// the order/sequence of the binary string is important.
// note that each can be a 1 or 0, 1 means there's a traversable path, 0 means it's a wall)
// from left to right here's what each number represents:
//   [a,b,c,d] 
//    a --> left node's right-side sibling 
//    b --> left node's bottom-side sibling
//    c --> right node's right-side sibling 
//    d --> right node's bottom-side sibling
//
//  From Node Pairs to Hex Serialization/Compression: 
//  [directions enums] [binary]    [int]  [hex]
//  0,0,0,0  ---------> 0000 -----> 0  --> 0
//  0,0,0,1  ---------> 0001 -----> 1  --> 1
//  1,1,1,1  ---------> 1111 -----> 15 --> toHex:f
// This is the core of both the serialization and compression. This function iterates
// through all the nodes, 2 at a time. We should split this out into multiple
// steps, but essentially, within 1 for-loop, we are analyzing the node's 
// path-directions (thing of them as the traversable sides that are touching other nodes)
// and depending on the paths vs. walls, we assign that node a specific binary value.
// This binary value, which represents all the paths for the bottom and right sides of BOTH
// the nodes (we are iterating 2 at a time), is then converted into a number value. 
//
// the order/sequence of the binary string is important.
// note that each can be a 1 or 0, 1 means there's a traversable path, 0 means it's a wall)
// from left to right here's what each number represents:
//   [a,b,c,d] 
//    a --> left node's right-side sibling 
//    b --> left node's bottom-side sibling
//    c --> right node's right-side sibling 
//    d --> right node's bottom-side sibling
//
// examples:
// "0,0,0,0] --> toHex --> 0
// "0,0,0,1] --> toHex --> 1
// "1,1,1,1] --> toInt:15 --> toHex:f
// 
// a couple things to note:
//  - this creates some limitations with what kind of mazes work (even number of cols!)
//  - we are taking advantage of the fact that mazeNodes share walls (calculating things 
//    once by iterating nodes in groups of 2). We're leveraging maze topology.
//  - if we have a maze with lets say 10 rows x 10 cols, we can represent the maze's 
//    paths and walls within just 50 hex-characters
export function getHexFromNodes({ nodes, rows, cols, spacing }: MazeState): string {
  // let tempNodeMap: Map<string, MazeNode> = new Map<string, MazeNode>();
  let serialized = "";
  const clonedNodes = [...new Set(nodes)].sort();

  // hydrates the map of nodes which makes it quicker to find each one as we iterate through 
  // them all
  // for (let i = 0; i < clonedNodes.length; i++) {
  //   const nextMazeNode = clonedNodes[i];
  //   const nextKey = clonedNodes[i].key;
  //   tempNodeMap.set(nextKey, nextMazeNode); // `${x}.${y}` <--- this is what mazeNode key looks like
  // }

  const offset = spacing / 2;

  // r === row count; so this should only change as many times as there are rows
  // c === col count; so if we have 10 nodes in a single row we would need to update 
  //       this value every-other node or 4 times: 
  //            starting with c and r at 0,0 (top left maze cell)
  //            loop-1 (address nodes at indexes 2 and 3)
  //            loop-2 (address nodes at indexes 4 and 5)
  //            loop-3 (address nodes at indexes 6 and 7)
  //            loop-4 (address nodes at indexes 8 and 9) // index 9 is the last index

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c += 2) {
      let leftNodeKey = "";
      let rightNodekey = "";

      // first row, first colum so this happens just once
      if (c === 0 && r === 0) {
        const leftX = offset;
        const leftY = offset;
        leftNodeKey = `${leftX}.${leftY}`

        const rightX = leftX + spacing;
        const rightY = leftY;
        rightNodekey = `${rightX}.${rightY}`
      }

     // right of the first row
     if (c > 0 && r === 0) {
        const leftX = offset + (spacing * c);
        const leftY = offset;
        leftNodeKey = `${leftX}.${leftY}`

        const rightX = leftX + spacing;
        const rightY = leftY;
        rightNodekey = `${rightX}.${rightY}`
      }

      if (c === 0 && r > 0) {// first maze-cell in each row hits this case
        const leftX = offset;
        const leftY = offset + spacing * r;
        leftNodeKey = `${leftX}.${leftY}`;

        const rightX = offset + spacing;
        const rightY = offset + (spacing * r);
        rightNodekey = `${rightX}.${rightY}`
      }

      // for maze-cell pairs that are not at index 0
      if (c > 0 && r > 0) {
        const leftX = offset + spacing * c;
        const leftY = offset + spacing * r;
        leftNodeKey = `${leftX}.${leftY}`

        const rightX = leftX + spacing;
        const rightY = leftY;
        rightNodekey = `${rightX}.${rightY}`
      }


      const leftNodePaths = clonedNodes.find((n) => n.key === leftNodeKey)?.pathDirections;
      const rightNodePaths = clonedNodes.find((n) => n.key === rightNodekey)?.pathDirections;
 
      // now that we have our correct nodes...lets figure out the hex character and append it
      if (leftNodePaths && leftNodePaths.length > 0 && rightNodePaths && rightNodePaths.length > 0) {
        let binary = "";

        binary += leftNodePaths.indexOf(directions.Right.toString()) > -1 ? "1" : "0"; // this needs to be adjusted, it's not currently working right
        binary += leftNodePaths.indexOf(directions.Down.toString()) > -1 ? "1" : "0";
        binary += rightNodePaths.indexOf(directions.Right.toString()) > -1 ? "1" : "0";
        binary += rightNodePaths.indexOf(directions.Down.toString()) > -1 ? "1" : "0";

        const numberVal = parseInt(binary, 2);
        const hexVal = getHexFromDecimalString(numberVal);
        serialized += hexVal;
      }
    }
  }
  return serialized;
}

function getHexFromDecimalString(input: number): string {
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

export function binaryFromHex(input: string): string {
  switch (input) {
    case "0": return "0000";
    case "1": return "0001";
    case "2": return "0010";
    case "3": return "0011";
    case "4": return "0100";
    case "5": return "0101";
    case "6": return "0110";
    case "7": return "0111";
    case "8": return "1000"; //8
    case "9": return "1001"; //9
    case "a": return "1010"; //10
    case "b": return "1011"; //11
    case "c": return "1100"; //12
    case "d": return "1101"; //13
    case "e": return "1110"; //14
    case "f": return "1111"; //15
    default: return "0" // TODO throw err here
  }
}
