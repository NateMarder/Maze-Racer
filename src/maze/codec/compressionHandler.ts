import { MazeNode } from "../types";
import { verbosity } from '../../defaults';

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
  console.log("type of nodes: ", typeof nodes);
  let clones = [...nodes];

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

  let splitKey = result.key.split('.');
  let cx = parseInt(splitKey[0]);
  let cy = parseInt(splitKey[1]);

  for (let sibKey of siblingKeys) {
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
  let result = [];
  const clone: MazeNode = { ...node };
  const splitKey = clone.key.split('.');
  const cx = parseInt(splitKey[0]);
  const cy = parseInt(splitKey[1]);
  const siblingKeys = [...clone.siblingKeys];

  for (let sibKey of siblingKeys) {
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
export function getHexRepresentationOfNodeArray(nodes: MazeNode[],rowCount:number,colCount:number ) {
  let hexResult = "";
  let clonedNodes = [...nodes];

  for (let row = 0; row < rowCount; row += 1) {
    for (let i = row; i < clonedNodes.length - (colCount - 1); i += 20) {
      let binary = ""; // note this is a string, which we add too, one digit at a time
      let j = i + 10; // right hand node
      let node1Paths = nodes[i].pathDirections ?? [];
      let node2Paths = nodes[j].pathDirections ?? [];
      binary += node1Paths.indexOf(directions.Right.toString()) > -1 ? "1" : "0"; // this needs to be adjusted, it's not currently working right
      binary += node1Paths.indexOf(directions.Down.toString()) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Right.toString()) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Down.toString()) > -1 ? "1" : "0";
      let numberVal = parseInt(binary, 2);
      let hexVal = getHexFromDecimalString(numberVal);
      // if (verbosity !== "quiet") {
      //   console.log(`${nodes[i].key} and ${nodes[j].key} :: gives binary chunk: ${binary} and numberVal: ${numberVal}, and hx value: ${hexVal}`);
      // }
      hexResult += hexVal;
    }
  }

  return hexResult;
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

export function binaryFromHex (input: string): string {
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

// This function take a look at the window.location.href object and then 
// uses data from a valid mazegraph (hex, number of columns, number of rows, and level)
// to update the existing URL so that it includes everything needed to 
// re-render the exact same maze. We use this after running the codec on an un-flattened maze
//  export function constructUrlFromCurrentMazeData(mazegraph:MazeGraph) {
//     return window.location.href.split("?")[0] +
//       "?" +
//       ("m=" + mazegraph.hex + "&") +
//       ("c=" + mazegraph.cols + "&") +
//       ("r=" + mazegraph.rows + "&") +
//       ("l=" + mazegraph.currentLevel);
//   }


// this function is sort of the 'inverse' of the constructUrlFromCurrentMazeData function
// it does thie opposite - meaning that it reads the URL, and parses the query params
// to to create what is called here a 'maze bundle', which can be used to re-render a maze.
// on page-load if desired, we can read these params and skip the maze-generation phase alltogether
// and instead, do sort of a maze-reconstruction for an already-generated maze. this way if we have 12
// racers on a level, we only need generate once, and then just reconstruct. Since it doesn't require
// any shuffling, it should be much quicker 
function getBundleFromUrlData() {
  let result = {};
  let hex: string = "";
  let cols: string = "";
  let rows: string = "";
  let level: string = "";
  let urlParams = "";
  if (window.location.href.indexOf("?") > -1) {
    urlParams = window.location.href.split("?")[1];
  }
  let data = urlParams.split("&");
  for (let i = 0; i < data.length; i++) {
    let dataParts = data[i].split("=");
    let type = dataParts[0], content = dataParts[1];
    if (type === "m") {
      hex = content;
    }
    else if (type === "c") {
      cols = content;
    }
    else if (type === "r") {
      rows = content;
    }
    else if (type === "l") {
      level = content;
    }
  }
  if (level == null) {
    level = "1";
  }
  return {
    hexstring: hex,
    cols: cols,
    rows: rows,
    level: level
  };
}
// getMazeBundle() {
//   if (this.bundle == null) {
//     this.updateBundleWithUrlData();
//   }
//   return this.bundle;
// }

// export class compressionHandler {


// }

// here's another 'inverse' function. this function iterates
// through all the maze-nodes in a mazegraph and replaces the path-directions
// back to sibling-keys.
// export const getDirectionsFromSiblingKeys = (mazeNode:MazeNode[]) => {
//   const resultNodes = [...mazeNode];
//   for (let i = 0; i < resultNodes.length-1; i++) {

//     let sibX = result.cx;
//     let sibY = result.cy;
//     let sibKey = "";

//     const nextDirection = resultNodes[i].pathDirections;
//     switch (nextDirection) {
//       case directions.Up:
//         sibY -= this.spacing;
//         break;
//       case directions.Right:
//         sibX += this.spacing;
//         break;
//       case directions.Down:
//         sibY += this.spacing;
//         break;
//       case directions.Left:
//         sibX -= this.spacing;
//         break;
//       default:
//         break;
//     }

//     sibKey += sibX + "." + sibY;
//     this.siblings.push(sibKey);
//   }
// }


// these functions appear to be part of the codec, but they are currently
// living in another file. I'm including them here, so we can see visually
// what all the parts likely required for the codec logic

// function wallKeyToNodeKeys(wallKey: WallKey): [NodeKey, NodeKey] {
//   const [x1, y1, x2, y2] = wallKey.split(".").map(Number);
//   const orthogonalKey = getOrthogonalKey(x1, y1, x2, y2);
//   const [nodeX1, nodeY1, nodeX2, nodeY2] = orthogonalKey.split(".");

//   return [`${nodeX1}.${nodeY1}`, `${nodeX2}.${nodeY2}`];
// }

// function createPathsFromInactiveWalls(
//   inactiveWallKeys: WallKey[]
// ): MazePathType[] {
//   return inactiveWallKeys.map((wallKey) => {
//     const [nodeKey1, nodeKey2] = wallKeyToNodeKeys(wallKey);
//     return new MazePath({ nodeKey1, nodeKey2 });
//   });
// }





// Everything below this part of the file is just extra utility functions 
// that may not be needed, but we don't want to throw things away quite yet, 
// so we will just leave them here..
// export class utilityDefaults {
//   constructor() {
//     this.defaultDesktopSpacing = 80;
//     this.defaultMobileSpacing = 50;
//     this.defaultControlSpeed = 50;
//     this.goHomeSpeed = 500;
//     this.currentLevel = 1;
//     this.privateLevel = null;
//     this.defaultLevelSpeeds = {
//       One: 400,
//       Two: 420,
//       Three: 440,
//       Four: 450,
//       Five: 500,
//       Six: 510,
//       Seven: 520,
//       Eight: 600,
//       Nine: 700,
//       Ten: 800,
//     };
//     this.directions = {
//       Up: 0,
//       Right: 1,
//       Down: 2,
//       Left: 3,
//     };
//     this.deviceTypes = {
//       Mobile: 0,
//       Desktop: 1,
//       Tablet: 2,
//     };
//   }

//   getDefaultLineSpacing() {
//     if ('ontouchstart' in document && 800 < 1500) {
//       return this.defaultDesktopSpacing; // desktop
//     }

//     return this.defaultMobileSpacing; // mobile
//   }

//   controlSpeed() { return this.defaultControlSpeed; }

//   // goHomeSpeed() { return this.defaultGoHomeSpeed; }

//   getdeviceTypes() { return this.deviceTypes; }

//   levelSpeed() { return this.defaultLevelSpeeds; }
//}