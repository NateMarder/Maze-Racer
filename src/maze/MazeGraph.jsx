'use client'

import React from 'react';
import { defaultColumnCount, defaultRowCount, mazeGraphDefaults as DEFAULTS } from '../utilities';
import { MazeNode, NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall, MazeWallFactory } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getHexRepresentationOfNodeArray, hydratePathDirections, binaryFromHex } from './codec/compressionHandler';


export default class MazeGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      width: props.width,
      spacing: DEFAULTS.desktopSpacing,
      cols: DEFAULTS.cols,
      rows: DEFAULTS.rows,
      nodes: null,
      allPaths: [],
      walls: [],
      inactiveWallKeys: [],
      destNodeX: 0,
      destNodeY: 0,
      hexString: '',
      level: props.level || DEFAULTS.level
    };
    this.mazeGraphRef = React.createRef();
  }

  componentDidMount = () => {
    /**
     *  CURRENTLY... this is where we kick off the maze engine. currently we do the following, and the sequence matters...
     *    step 1: grab the number of cols, rows, and level (level is always 1 for now)
     *    step 2: calculate the actual size of the maze itself
     *    step 3: use the rows, cols, and spacing to get the proper number of maze nodes
     *    step 4: initialize a new mazeEngine (currently being called maze creator) and then call it's 'run' function
     *            which actually shuffles the node-siblings for each node prior to carving out the paths
     *    step 5: iterates through all of walls and paths and ensures all node sibling relationships are set appropriately
     * 
     *  What we want is somethin more like below...
     * 
     *    const maze = generateMaze({
     *      rows: 25,
     *      columns: 25,
     *      algorithm: "dfs",
     *    });
     */


    // step 1
    this.setState((prevState, props) => ({
      cols: Math.floor((props.width * 0.80) / DEFAULTS.desktopSpacing),
      rows: Math.floor((props.height * 0.80) / DEFAULTS.desktopSpacing),
      currentLevel: this.currentLevel || 1,
    }));

    // step 2
    this.setState(prevState => ({
      width: DEFAULTS.desktopSpacing * prevState.cols,
      height: DEFAULTS.desktopSpacing * prevState.rows,
    }));

    // step 3
    this.setState(prevState => ({
      nodes: new NodeFactory().getNodes(prevState),
    }));

    // step 4
    this.setState((prevState) => {
      const mazeCreator = new LevelOne();
      const result = mazeCreator.run(prevState);
      const [x, y] = result.destNodeKey.split('.');
      return {
        inactiveWallKeys: result.route,
        destNodeX: x,
        destNodeY: y,
      };
    });

    // step 5
    this.setState(prevState => ({
      walls: MazeWallFactory(prevState),
    }), () => {
      this.setState(prevState => ({
        allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys),
      }), (prevState) => {
        this.updateSiblingsUsingPaths();
      });
    });
  };

  updateSiblingsUsingPaths = () => {
    const clonedNodes = JSON.parse(JSON.stringify(this.state.nodes));
    //const clonedNodes = [...this.state.nodes];

    clonedNodes.forEach((n) => {
      n.siblingKeys = []; // eslint-disable-line no-param-reassign
    });

    //console.log("this states paths", this.state.allPaths);
    this.state.allPaths.forEach((mazePath) => {
      const [node1Key, node2Key] = mazePath.nodeKeys;
      const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
      const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
      nodeRef1.siblingKeys.push(nodeRef2.key);
      nodeRef2.siblingKeys.push(nodeRef1.key);
    });

    this.setState((prevState, props) => ({
      nodes: clonedNodes,
    }), (prevState) => {
      // console.log('this is state after the update siblings method:', this.state);
      // this.state.hexString = exportNodesAsHex(this.state);

      // console.log(`here are the maze nodes...`)
      let hydratedNodes = hydratePathDirections(clonedNodes);
      let h = getHexRepresentationOfNodeArray(hydratedNodes);
      const currentUrl = new URL(window.location.href);

      // 2. Modify the search parameters
      currentUrl.searchParams.set("h", h);
      currentUrl.searchParams.set("c", this.state.cols);
      currentUrl.searchParams.set("r", this.state.rows);
      currentUrl.searchParams.set("l", this.state.level)

      // 3. Update the browser URL bar without refreshing
      window.history.replaceState(null, '', currentUrl.toString());

      this.setState(prevState => ({ debugStatement: h }));
    });
  };

  getUserControlNode = () => (
    <PlayerNode
      cx={Math.round(DEFAULTS.desktopSpacing / 2)}
      cy={Math.round(DEFAULTS.desktopSpacing / 2)}
      r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
      map={this.state.nodes}
      destnodekey={`${this.state.destNodeX}.${this.state.destNodeY}`}
      offset={DEFAULTS.desktopSpacing}
      mzgraphref={this.mazeGraphRef}
      handleswipebindings={this.props.handleswipebindings}
    />
  );

  getInnerWalls = () => this.state.walls.map((wall) => {
    const { id, x1, y1, x2, y2 } = wall;
    return <MazeWall key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2} className="insidewall" />;
  });

  getOutterWalls = () => {
    const { height, width } = this.state;
    return <>
      <MazeWall x1={0} y1={0} x2={0} y2={height} className="outsidewall" />
      <MazeWall x1={0} y1={0} x2={width} y2={0} className="outsidewall" />
      <MazeWall x1={width} y1={0} x2={width} y2={height} className="outsidewall" />
      <MazeWall x1={0} y1={height} x2={width} y2={height} className="outsidewall" />
    </>;
  };

  announceNodesToConsole = () => {
    console.clear();
    console.log("\n [debug] current state's nodes: ", this.state.nodes);
  }

  announceWallsToConsole = () => {
    console.clear();
    console.log("\n [debug] current state's walls: ", this.state.walls);
  }

  announcePathsToConsole = () => {
    console.clear();
    console.log("\n [debug] current state's paths: ", this.state.allPaths);
  }

  refresh = () => {
    console.clear();
    this.componentDidMount();
  }

  refreshUsingHex = () => {
    console.log(`lets rebuild the maze using hex... ${this.state.hexString}`);
    this.setState({
      cols: defaultColumnCount,
      rows: defaultRowCount,
      level: this.level || 1,
      walls: [],
      nodes: [],
      allPaths: [],
      inactiveWallKeys: [],
      destNodeX: -5,
      destNodeY: -5,
    })

    this.render();

    // things are cleared. but in order for the wall-factory to work we need to pass the 'inactiveWallKeys', which we need to 
    // rebuild from hex.
    console.clear();
    console.log(`rebuilding inactive wall keys...`);
    const queryParams = new URLSearchParams(window.location.search);

    const hexValue = queryParams.get('h');
    const colsValue = queryParams.get('c');
    const rowsValue = queryParams.get('r');
    const levelValue = queryParams.get('l');
    console.log("just found hex: ", hexValue);
    console.log("just found colsValue: ", colsValue);
    console.log("just found rowsValue: ", rowsValue);
    console.log("just found levelValue: ", levelValue);

    // for starters we should just print the binary string for each hex value
    // for (let i = 0; i < hexValue.length - 1; i++) {
    //   const nextHexChar = hexValue.charAt(i);
    //   const binaryValue = binaryFromHex(nextHexChar);
    //   console.log(`${nextHexChar} --> ${binaryValue}`)
    // }

    const offset = DEFAULTS.desktopSpacing / 2;
    const expectedNodeCount = colsValue * rowsValue;
    let hexCounter = 0;

    for (let i = 0; i < defaultRowCount-1; i += 1) {
      for (let j = 0; j < defaultColumnCount-1; j += 2) {

        const nextHexChar = hexValue.charAt(hexCounter++);

        const binaryValue = binaryFromHex(nextHexChar);
        const actualColVal = i === 0 ? 0 : i;
        const actualRowVal = j === 0 ? 0 : j;
        // const node1X = col === 0 ? offset : (col * offset)/20;
        // const node1Y = row === 0 ? offset : row * offset;

        // const node2X = node1X + DEFAULTS.desktopSpacing;
        // const node2Y = node1Y

        console.log(`working on column=${actualRowVal},row=${actualColVal} with binary value: ${binaryValue} (${nextHexChar})`);
        // console.log(`${nextHexChar} --> ${binaryValue} --> nodes = (${node1X},${node1Y}) & (${node2X},${node2Y})`);
      }
    }

    // 
    //     this.setState(prevState => ({
    //   walls: MazeWallFactory(prevState),
    // }), () => {
    //   this.setState(prevState => ({
    //     allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys),
    //   }), (prevState) => {
    //     this.updateSiblingsUsingPaths();
    //   });
    // });

  }

  render = () => {
    const { destNodeX, destNodeY, width, height } = this.state;

    return (
      <div ref={this.mazeGraphRef}>
        <svg width={width} height={height} id="mz-svg">
          {this.getOutterWalls()}
          {this.getInnerWalls()}
          {this.getUserControlNode()}
          <DestinationNode
            x={destNodeX}
            y={destNodeY}
            r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
          />
        </svg>

        <br></br>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.announceNodesToConsole}> nodes </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.announceWallsToConsole}> walls </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.announcePathsToConsole}> paths </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.refresh}> new maze </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.refreshUsingHex}> reconstruct with hex </button>
      </div>
    );
  };
}

