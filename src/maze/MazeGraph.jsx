'use client'

import React from 'react';
import { defaultColumnCount, defaultRowCount, mazeGraphDefaults as DEFAULTS } from '../utilities';
import { NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getHexRepresentationOfNodeArray, hydratePathDirections } from './codec/compressionHandler';
import { getFreshMazeNodes, getInactiveWallsFromHex } from '../maze/codec/decoder';
import { MazeCodec } from './codec/mazeCodec';
import { getWallsFromInactiveWallKeys } from './wall/MazeWall';
import { useRouter, usePathname } from 'next/navigation';
import { throwIfDisallowedDynamic } from 'next/dist/server/app-render/dynamic-rendering';

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

    this.setState((prevState, props) => ({
      currentLevel: this.currentLevel || 1,
      width: DEFAULTS.desktopSpacing * prevState.cols,
      height: DEFAULTS.desktopSpacing * prevState.rows,
      nodes: new NodeFactory().getNodes(prevState),
    }));

    // step 4
    this.setState((prevState) => {
      const result = new LevelOne().run(prevState);
      const [x, y] = result.destNodeKey.split('.');
      return {
        inactiveWallKeys: result.route,
        destination: { x, y }
      };
    });

    // step 5
    this.setState(prevState => ({
      walls: getWallsFromInactiveWallKeys(prevState),
      allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys),
    }), (prevState) => {
      this.updateSiblingsUsingPaths();
    });
  };

  updateSiblingsUsingPaths = () => {
    const clonedNodes = JSON.parse(JSON.stringify(this.state.nodes));
    clonedNodes.forEach((n) => {
      n.siblingKeys = []; // eslint-disable-line no-param-reassign
    });

    this.state.allPaths.forEach((mazePath) => {
      const [node1Key, node2Key] = mazePath.nodeKeys;
      const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
      const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
      nodeRef1.siblingKeys.push(nodeRef2.key);
      nodeRef2.siblingKeys.push(nodeRef1.key);
    });

    this.setState((prevState, props) => ({
      nodes: clonedNodes,
    }));
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

  /**
   * Currently there is no logic to simply render directly from the URL. 
   * to see the decoder work, we need to hit the 'refresh from hex' button
   * in the UI, which kicks off this function / logic
   */
  originalDecode = () => {
    console.clear();
    console.log(`clearing walls and nodes for rebuild with... ${this.state.hexString}`);

    // clear state
    this.clearNodes();
    this.clearWallsAndPaths();

    const urlParams = new URLSearchParams(window.location.search);
    const hexString = urlParams.get('h');
    const colsValue = urlParams.get('c');
    const rowsValue = urlParams.get('r');
    const levelValue = urlParams.get('l');
    const destinationX = urlParams.get('dx');
    const destinationY = urlParams.get('dy');

    this.setState({
      cols: colsValue,
      rows: rowsValue,
      level: levelValue,
      walls: [],
      nodes: [],
      allPaths: [],
      inactiveWallKeys: [],
      destNodeX: null,
      destNodeY: null,
      hexString
    })

    const mazeBundle = {
      encodedMazeHex: hexString,
      rows: parseInt(rowsValue),
      cols: parseInt(colsValue),
      spacing: parseInt(DEFAULTS.desktopSpacing)
    }

    this.setState({
      nodes: getFreshMazeNodes(mazeBundle),
      destNodeX: parseInt(destinationX),
      destNodeY: parseInt(destinationY),
      destination: { x: parseInt(destinationX), y: parseInt(destinationY) }
    });

    const wallProps = {
      rows: mazeBundle.rows,
      cols: mazeBundle.cols,
      spacing: mazeBundle.spacing,
      inactiveWallKeys: getInactiveWallsFromHex(mazeBundle)
    }

    const activeWalls = getWallsFromInactiveWallKeys(wallProps);

    this.updateSiblingsUsingPaths();

    this.setState({ walls: activeWalls, level: levelValue, hexString });

    console.log("....done!")
    console.log("setting small timeout so we can see the maze was actually removed...");
  }

  lightDecode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hexString = urlParams.get('h');
    const colsValue = urlParams.get('c');
    const rowsValue = urlParams.get('r');
    const levelValue = urlParams.get('l');
    const destinationX = urlParams.get('dx');
    const destinationY = urlParams.get('dy');
    const spacing = urlParams.get('s');

    this.setState({
      cols: colsValue,
      rows: rowsValue,
      level: levelValue,
      walls: [],
      nodes: [],
      allPaths: [],
      inactiveWallKeys: [],
      destNodeX: null,
      destNodeY: null,
      hexString
    })

    //.  const { cols, rows, level, destination, spacing, start, serialized } = encoded;
    const encodedMaze = {
      cols: colsValue,
      rows: rowsValue,
      level: levelValue,
      destination: { x: destinationX, y: destinationY },
      spacing: spacing,
      start: { x: spacing / 2, y: spacing / 2 },
      serialized: hexString
    }

    const decodeResult = MazeCodec.decode(encodedMaze);
    // console.log("sending this data to decode into proper state: ", encodedMaze)
    // console.log("\ndecode result: ", decodeResult);
    this.setState({
      ...decodeResult
    }, () => {
      console.log("\ndecode result: ", decodeResult);
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
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "red" }} onClick={this.clearNodes}> clear nodes </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "red" }} onClick={this.clearWallsAndPaths}> clearWallsAndPaths </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runEncoder}> encode! </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.originalDecode}>decode!</button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.refresh}> refresh </button>
        <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.seeState}> state </button>
      </div>
    );
  };
}