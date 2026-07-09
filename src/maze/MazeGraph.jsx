'use client'

import React from 'react';
import { mazeGraphDefaults as DEFAULTS } from '../utilities';
import { NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getFreshMazeNodes, getMazeBundleFromUrlParams } from './codec/decodeUtilities';
import { MazeCodec } from './codec/mazeCodec';
import { getWallsFromInactiveWallKeys } from './wall/MazeWall';


export default class MazeGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      width: props.width,
      spacing: DEFAULTS.desktopSpacing,
      cols: Math.floor((props.width * 0.80) / DEFAULTS.desktopSpacing),
      rows: Math.floor((props.height * 0.80) / DEFAULTS.desktopSpacing),
      nodes: null,
      allPaths: [],
      walls: [],
      inactiveWallKeys: [],
      destNodeX: "0",
      destNodeY: "0",
      destination: { x: 0, y: 0 },
      hexString: '',
      level: props.level || DEFAULTS.level
    };
    this.mazeGraphRef = React.createRef();
  }

  componentDidMount = () => {

    // 1 --> setup nodes and dimensions
    this.setState((prevState, props) => ({
      currentLevel: this.currentLevel || 1,
      width: DEFAULTS.desktopSpacing * prevState.cols,
      height: DEFAULTS.desktopSpacing * prevState.rows,
      nodes: new NodeFactory().getNodes(prevState),
    }));

    // 2 --> run the algorithm to create the maze
    this.setState((prevState) => {
      const result = new LevelOne().run(prevState);
      const [x, y] = result.destNodeKey.split('.');
      return {
        inactiveWallKeys: result.route,
        destination: { x, y }
      };
    });

    // 3 --> get paths and walls for maze rendering
    this.setState(prevState => ({
      walls: getWallsFromInactiveWallKeys(prevState),
      allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys),
    }), () => {
      this.updateNodeSiblingPaths()
    });
  };

  updateNodeSiblingPaths = () => {
    const clonedNodes = [...this.state.nodes];
    const clonedPaths = [...this.state.allPaths];
    
    for(let i = 0; i < clonedNodes.length; i++){
      clonedNodes[i].siblingKeys = [];
    }

    for(let p = 0; p < clonedPaths.length; p++) {
      const [node1Key, node2Key] = clonedPaths[p].nodeKeys;
      const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
      const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
      nodeRef1.siblingKeys.push(nodeRef2.key);
      nodeRef2.siblingKeys.push(nodeRef1.key);
    }

    this.setState({nodes: clonedNodes});
  };

  getUserControlNode = () => (
    <PlayerNode
      cx={Math.round(DEFAULTS.desktopSpacing / 2)}
      cy={Math.round(DEFAULTS.desktopSpacing / 2)}
      r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
      map={this.state.nodes}
      destnodekey={`${this.state.destination.x}.${this.state.destination.y}`}
      offset={DEFAULTS.desktopSpacing}
      mzgraphref={this.mazeGraphRef}
      handleswipebindings={this.props.handleswipebindings}
    />
  );

  // getMazeBundleFromUrlParams = () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const hexString = urlParams.get('h');
  //   const colsValue = urlParams.get('c');
  //   const rowsValue = urlParams.get('r');
  //   const levelValue = urlParams.get('l');
  //   const destinationX = urlParams.get('dx');
  //   const destinationY = urlParams.get('dy');

  //   const mazeBundle = {
  //     encodedMazeHex: hexString,
  //     rows: parseInt(rowsValue),
  //     cols: parseInt(colsValue),
  //     spacing: parseInt(DEFAULTS.desktopSpacing),
  //     destination: {x: parseInt(destinationX), y: parseInt(destinationY)},
  //     level: parseInt(levelValue)
  //   }

  //   return mazeBundle
  // }

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

  /**
   * Functions below this point are for debugging and dev work
   */
  announceNodesToConsole = () => {
    console.clear();
    console.log("\n [debug] current state's nodes: ", this.state.nodes);
  }

  announceWallsToConsole = () => {
    console.clear();
    console.log("\n [debug] this.state.walls: ", this.state.walls);
    console.log("\n [debug] this.state.inactiveWallKeys: ", this.state.inactiveWallKeys);
  }

  announcePathsToConsole = () => {
    console.clear();
    console.log("\n [debug] this.state.allPaths: ", this.state.allPaths);
  }

  clearWallsAndPaths = () => {
    console.clear();
    console.log("clearing all walls...");

    // first
    this.setState({
      walls: [],
      inactiveWallKeys: [],
      allPaths: []
    }, () => {
      console.log("state now: ", this.state);
    });

  }

  clearNodes = () => {
    console.clear();
    console.log("clearing all nodes...");

    this.setState({
      nodes: []
    }, () => {
      console.log("state now: ", this.state);
    });

  }

  refresh = () => {
    console.clear();
    console.log("clearing params from URL and reloading");
    window.location.href = window.location.pathname;
  }

  runEncoder = () => {
    const dataForEncoding = { ...this.state, serialized: null, height: null, width: null };
    console.log("data we are seinding to encoder: ", dataForEncoding);
    const encodeResult = MazeCodec.encode(dataForEncoding);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("h", encodeResult.serialized);        // serialized hex representation of maze
    currentUrl.searchParams.set("c", encodeResult.cols);              // col count
    currentUrl.searchParams.set("r", encodeResult.rows);              // row count
    currentUrl.searchParams.set("l", encodeResult.level);             // current level
    currentUrl.searchParams.set("dx", encodeResult.destination.x);    // maze-finish x
    currentUrl.searchParams.set("dy", encodeResult.destination.y);    // maze-finish y
    currentUrl.searchParams.set("s", encodeResult.spacing);           // maze spacing (width of the paths, also same as measuring center of mazeNode to center of neighboring mazeNode)

    // 3. Update the browser URL bar without refreshing
    window.history.replaceState(null, '', currentUrl.toString());     // add the data to the URL, don't reload,
    console.log("what we see in the window.location.href now: ", window.location.href)
    console.log("Lets look at the encoding result: ", encodeResult);
  }

  runDecoder = () => {
    const dataFromUrlParams = getMazeBundleFromUrlParams();
    const encoded = {
      cols: dataFromUrlParams.cols,
      rows: dataFromUrlParams.rows,
      level: dataFromUrlParams.level,
      destination: dataFromUrlParams.destination,
      spacing: dataFromUrlParams.spacing,
      start: { x: dataFromUrlParams.spacing / 2, y: dataFromUrlParams.spacing / 2 }, // since we always start in the top left, this one is calculated for now
      serialized: dataFromUrlParams.encodedMazeHex
    }
    const decodeResult = MazeCodec.decode(encoded);
    this.setState({
      nodes: getFreshMazeNodes(encoded),
      ...decodeResult
    })
  }

  seeState = () => {
    console.log("\nstate:", this.state)
  }

  render = () => {
    const { width, height, destination } = this.state;

    return (
      <div ref={this.mazeGraphRef}>
        <svg width={width} height={height} id="mz-svg">
          {this.getOutterWalls()}
          {this.getInnerWalls()}
          {this.getUserControlNode()}
          <DestinationNode
            x={destination.x}
            y={destination.y}
            r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
          />
        </svg>
        <br></br>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runEncoder}> encode </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runDecoder}>decode</button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.refresh}> refresh </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "magenta" }} onClick={this.seeState}> print state </button>
      </div>
    );
  };
}