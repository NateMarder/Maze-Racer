import { MazeNode } from "../components/maze/node";

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
    if ('ontouchstart' in document && window.width() < 1500) {
      return this.defaultDesktopSpacing; // desktop
    }

    return this.defaultMobileSpacing; // mobile
  }

  controlSpeed() { return this.defaultControlSpeed; }

  // goHomeSpeed() { return this.defaultGoHomeSpeed; }

  getdeviceTypes() { return this.deviceTypes; }

  levelSpeed() { return this.defaultLevelSpeeds; }
}

export default class compressionHandler {
  constructor(maze) {
    this.shareLink = "";
    if (maze != null) {
      this.maze = maze;
      this.ensureNodesHavePathDirections(this.maze);
      this.hex = this.exportNodesAsHex(this.maze);
      this.shareLink = this.constructUrlFromCurrentMazeData();
      window.history.pushState(null, null, this.shareLink);
    }
    // else {
    //   this.updateBundleWithUrlData();
    // }
  }
  exportNodesAsHex({ nodes }) {
    let hx = "";
    console.log(nodes, typeof nodes);
    let nodeKeys = [];
    nodes.forEach(n => {
      nodeKeys.push(n.key)
    });

    console.log(nodeKeys, typeof nodeKeys);
    // nodes.forEach((T, index) => {
    //   let binary = "";
    //   let n1Paths = T.pathDirections;
    // })

    for (let i = 0; i < nodes.length - 1; i += 2) {
      let binary = "";
      let node1Paths = nodes[i].pathDirections;
      let node2Paths = nodes[i + 1].pathDirections;
      binary += node1Paths.indexOf(directions.Right) > -1 ? "1" : "0";
      binary += node1Paths.indexOf(directions.Down) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Right) > -1 ? "1" : "0";
      binary += node2Paths.indexOf(directions.Down) > -1 ? "1" : "0";
      let numberVal = parseInt(binary, 2);
      hx += getHexFromDecimalString(numberVal);
    }
    return hx;
  }
  constructUrlFromCurrentMazeData() {
    return window.location.href.split("?")[0] +
      "?" +
      ("m=" + this.hex + "&") +
      ("c=" + this.maze.cols + "&") +
      ("r=" + this.maze.rows + "&") +
      ("l=" + this.maze.currentLevel);
  }
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
      // This isn't curren't working
      // nodes[i].transformSiblingKeysToDirections();
    }
  }
}

export const directions = {
  Up: 0,      // [0,0,0,0]
  Right: 1,   // [0,0,0,1]
  Down: 2,    // [0,0,1,0]
  Left: 3,    // [0,0,1,1]
};


// these were instance method living in the mazeNode class 
// we will need to refactor this to not be an instance method anymore
export const transformSiblingKeysToDirections = () => {

  // evidently we really wanted this to just run once per node
  if (this.directionsGenerated) {
    return false;
  }

  for (let sibKey of this.siblings) {
    const split = sibKey.split(".");
    const sibX = parseInt(split[0]);
    const sibY = parseInt(split[1]);

    if (sibX !== this.cx) { // horizontal sibling but keep in mind we iterate from left to right
      if (sibX < this.cx) {
        this.pathDirections.push(directions.Left);
      } else {
        this.pathDirections.push(directions.Right);
      }
    } else if (sibY !== this.cy) { // vertical sibling but keep in mind we iterate from top to bottom
      if (sibY < this.cy) {
        this.pathDirections.push(directions.Up);
      } else {
        this.pathDirections.push(directions.Down);
      }
    }
  }

  this.pathDirections = this.pathDirections.sort();
  return (this.directionsGenerated = true);
}

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