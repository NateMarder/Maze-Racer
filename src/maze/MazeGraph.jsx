'use client'

import React from 'react';
import { mazeGraphDefaults as DEFAULTS } from '../utilities';
import { NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getEncodedMazeDataFromUrlParams } from './codec/decodeUtilities';
import { getFullySerializedMazeForUrl, updateWindowUrlWithoutReload } from './codec/encodeUtilities';
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
      level: props.level || DEFAULTS.level || 1
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

    for (let i = 0; i < clonedNodes.length; i++) {
      clonedNodes[i].siblingKeys = [];
    }

    for (let p = 0; p < clonedPaths.length; p++) {
      const [node1Key, node2Key] = clonedPaths[p].nodeKeys;
      const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
      const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
      nodeRef1.siblingKeys.push(nodeRef2.key);
      nodeRef2.siblingKeys.push(nodeRef1.key);
    }

    this.setState({ nodes: clonedNodes });
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
    const encodedMaze = getFullySerializedMazeForUrl(this.state);
    updateWindowUrlWithoutReload(encodedMaze)
  }

  runDecoder = () => {
    const encoded = getEncodedMazeDataFromUrlParams();
    const decodeResult = MazeCodec.decode(encoded);
    this.setState({
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