'use client'

import React from 'react';
import { mazeGraphDefaults as DEFAULTS } from '../utilities';
import { NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall, MazeWallFactory } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getHexRepresentationOfNodeArray, hydratePathDirections } from './codec/compressionHandler';


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
      hexString: ''
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

    console.log("\n checking if this is CSR or SSR. Window type =", typeof window);

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

    console.log("this states paths", this.state.allPaths);
    this.state.allPaths.forEach((mazePath) => {
      const [node1Key, node2Key] = mazePath.nodeKeys;
      const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
      const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
      nodeRef1.siblingKeys.push(nodeRef2.key);
      nodeRef2.siblingKeys.push(nodeRef1.key);
    });

    this.setState((prevState, props) => ({
      nodes: clonedNodes,
    }), () => {
      // console.log('this is state after the update siblings method:', this.state);
      // this.state.hexString = exportNodesAsHex(this.state);

      console.log(`here are the maze nodes...`)
      let hydratedNodes = hydratePathDirections(clonedNodes);
      let h = getHexRepresentationOfNodeArray(hydratedNodes);
      console.log('hex:', h);
      const currentUrl = new URL(window.location.href);

      // 2. Modify the search parameters
      currentUrl.searchParams.set("h", h);
      currentUrl.searchParams.set("c", this.state.cols);
      currentUrl.searchParams.set("r", this.state.rows);

      // 3. Update the browser URL bar without refreshing
      window.history.replaceState(null, '', currentUrl.toString());
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
        <div className="debug-output">
          debug
        </div>
      </div>
    );
  };
}
