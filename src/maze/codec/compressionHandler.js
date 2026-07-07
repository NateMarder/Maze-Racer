export const directions = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,
};


export class compressionHandler {
  constructor(maze) {
    this.shareLink = "";
    if (maze != null) {
      // this.maze = maze;
      // this actually swaps out sibling keys with pathDirections. current nate disagrees with past nate
      // here. current nate wants to have both of these present and represented in their own fields
      //this.ensureNodesHavePathDirections(this.maze); 
      this.maze = ensureNodesHavePathDirections(maze); // this adds all the path directions
      this.hex = this.exportNodesAsHex(this.maze);
      this.shareLink = this.constructUrlFromCurrentMazeData();
      window.history.pushState(null, null, this.shareLink);
    }
    else {
      this.updateBundleWithUrlData();
    }
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
  // [0,0,0,0] --> toHex --> 0
  // [0,0,0,1] --> toHex --> 1
  // [1,1,1,1] --> toInt:15 --> toHex:f
  // 
  // a couple things to note:
  //  - this creates some limitations with what kind of mazes work (even number of cols!)
  //  - we are taking advantage of the fact that mazeNodes share walls (calculating things 
  //    once by iterating nodes in groups of 2). We're leveraging maze topology.
  //  - if we have a maze with lets say 10 rows x 10 cols, we can represent the maze's 
  //    paths and walls within just 50 hex-characters
  exportNodesAsHex({ nodes }) {
    let hexResult = "";
    //console.log(nodes, typeof nodes);
    let nodeKeys = [];
    nodes.forEach(n => {
      nodeKeys.push(n.key)
    });

    //console.log(nodeKeys, typeof nodeKeys);
    // nodes.forEach((T, index) => {
    //   let binary = "";
    //   let n1Paths = T.pathDirections;
    // })

    for (let i = 0; i < nodes.length - 1; i += 2) {
      let binary = ""; // note this is a string, which we add too, one digit at a time
      let node1Paths = nodes[i].pathDirections;
      let node2Paths = nodes[i + 1].pathDirections;
      binary += node1Paths.indexOf(directions.Right) > -1 ? "1" : "0"; // this needs to be adjusted, it's not currently working right
      binary += node1Paths.indexOf(directions.Down) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Right) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Down) > -1 ? "1" : "0";
      let numberVal = parseInt(binary, 2);
      hexResult = getHexFromDecimalString(numberVal);
    }
    return hexResult;
  }

  getHexFromDecimalString(input) {
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

  // This function take a look at the window.location.href object and then 
  // uses data from a valid mazegraph (hex, number of columns, number of rows, and level)
  // to update the existing URL so that it includes everything needed to 
  // re-render the exact same maze. We use this after running the codec on an un-flattened maze
  constructUrlFromCurrentMazeData() {
    return window.location.href.split("?")[0] +
      "?" +
      ("m=" + this.hex + "&") +
      ("c=" + this.maze.cols + "&") +
      ("r=" + this.maze.rows + "&") +
      ("l=" + this.maze.currentLevel);
  }

  // this function is sort of the 'inverse' of the constructUrlFromCurrentMazeData function
  // it does thie opposite - meaning that it reads the URL, and parses the query params
  // to to create what is called here a 'maze bundle', which can be used to re-render a maze.
  // on page-load if desired, we can read these params and skip the maze-generation phase alltogether
  // and instead, do sort of a maze-reconstruction for an already-generated maze. this way if we have 12
  // racers on a level, we only need generate once, and then just reconstruct. Since it doesn't require
  // any shuffling, it should be much quicker 
  updateBundleWithUrlData() {
    let urlParams = "";
    if (window.location.href.indexOf("?") > -1) {
      urlParams = window.location.href.split("?")[1];
    }
    let data = urlParams.split("&");
    for (let i = 0; i < data.length; i++) {
      let dataParts = data[i].split("=");
      let type = dataParts[0], content = dataParts[1];
      if (type === "m") {
        this.hex = content;
      }
      else if (type === "c") {
        this.cols = +content;
      }
      else if (type === "r") {
        this.rows = +content;
      }
      else if (type === "l") {
        this.level = +content;
      }
    }
    if (this.level == null) {
      this.level = 1;
    }
    this.bundle = {
      hexstring: this.hex,
      cols: this.cols,
      rows: this.rows,
      level: this.level
    };
  }
  getMazeBundle() {
    if (this.bundle == null) {
      this.updateBundleWithUrlData();
    }
    return this.bundle;
  }
  ensureNodesHavePathDirections({ nodes }) {
    let nodekeys = [];
    nodes.forEach(n => {
      nodekeys.push(n.key)
    });
    for (let i = 0; i <= nodekeys.length - 1; i++) {
      nodes[i].transformSiblingKeysToDirections();
    }
  }
}


// this is used during the serialization phase, it's a little confusing
// to read now because it was written as an instance method, but this 
// method is essentially swapping out the maze-graph's sibling keys for
// path directions, which are enums, and therefore easily converted to 
// ones and zeros (binary). 
export const transformSiblingKeysToDirections = () => {

  // evidently we really wanted this to just run once per node
  if (this.directionsGenerated) {
    return false;
  }

  for (let sibKey of this.siblings) {
    const split = sibKey.split(".");
    const x = parseInt(split[0]);
    const y = parseInt(split[1]);

    if (x !== this.cx) { // horizontal sibling but keep in mind we iterate from left to right
      if (x < this.cx) {
        this.pathDirections.push(directions.Left);
      } else {
        this.pathDirections.push(directions.Right);
      }
    } else if (y !== this.cy) { // vertical sibling but keep in mind we iterate from top to bottom
      if (y < this.cy) {
        this.pathDirections.push(directions.Up);
      } else {
        this.pathDirections.push(directions.Down);
      }
    }
  }

  this.pathDirections = this.pathDirections.sort();
  return (this.directionsGenerated = true);
}

// here's another 'inverse' function. this function iterates
// through all the maze-nodes in a mazegraph and replaces the path-directions
// back to sibling-keys.
export const transformDirectionsToSiblingKeys = () => {
  for (let i = 0; i < this.pathDirections.length; i++) {

    let sibX = this.cx;
    let sibY = this.cy;
    let sibKey = "";

    const nextDirection = this.pathDirections[i];
    switch (nextDirection) {
      case directions.Up:
        sibY -= this.spacing;
        break;
      case directions.Right:
        sibX += this.spacing;
        break;
      case directions.Down:
        sibY += this.spacing;
        break;
      case directions.Left:
        sibX -= this.spacing;
        break;
      default:
        break;
    }

    sibKey += sibX + "." + sibY;
    this.siblings.push(sibKey);
  }

  return this;
}


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
export class utilityDefaults {
  constructor() {
    this.defaultDesktopSpacing = 80;
    this.defaultMobileSpacing = 50;
    this.defaultControlSpeed = 50;
    this.goHomeSpeed = 500;
    this.currentLevel = 1;
    this.privateLevel = null;
    this.defaultLevelSpeeds = {
      One: 400,
      Two: 420,
      Three: 440,
      Four: 450,
      Five: 500,
      Six: 510,
      Seven: 520,
      Eight: 600,
      Nine: 700,
      Ten: 800,
    };
    this.directions = {
      Up: 0,
      Right: 1,
      Down: 2,
      Left: 3,
    };
    this.deviceTypes = {
      Mobile: 0,
      Desktop: 1,
      Tablet: 2,
    };
  }

  getDefaultLineSpacing() {
    if ('ontouchstart' in document && 800 < 1500) {
      return this.defaultDesktopSpacing; // desktop
    }

    return this.defaultMobileSpacing; // mobile
  }

  controlSpeed() { return this.defaultControlSpeed; }

  // goHomeSpeed() { return this.defaultGoHomeSpeed; }

  getdeviceTypes() { return this.deviceTypes; }

  levelSpeed() { return this.defaultLevelSpeeds; }
}