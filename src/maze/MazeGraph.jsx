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
      destNodeX: "0",
      destNodeY: "0",
      destination: { x: 0, y: 0 },
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
        destination: { x: x, y: y },
        destNodeX: x,
        destNodeY: y,
      };
    });

    // step 5
    this.setState(prevState => ({
      walls: getWallsFromInactiveWallKeys(prevState),
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
    }), (prevState) => {
      //let hydratedNodes = hydratePathDirections(clonedNodes);
      // let h = getHexRepresentationOfNodeArray(hydratedNodes, defaultRowCount, defaultColumnCount);
      // const currentUrl = new URL(window.location.href);
      // currentUrl.searchParams.set("h", h);
      // currentUrl.searchParams.set("c", this.state.cols);
      // currentUrl.searchParams.set("r", this.state.rows);
      // currentUrl.searchParams.set("l", this.state.level);
      // currentUrl.searchParams.set("dx", this.state.destNodeX);
      // currentUrl.searchParams.set("dy", this.state.destNodeY);

      // 3. Update the browser URL bar without refreshing
      //window.history.replaceState(null, '', currentUrl.toString());
    });
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

  // clearParams() {
  //   const router = useRouter();
  //   const pathname = usePathname();

  //   const handleClear = () => {
  //     // Navigates to the current path without any search params
  //     router.push(pathname);
  //   };

  //   return <button onClick={handleClear}>Clear Params & Reload</button>;
  // }

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

  clearWallsPathsAndPlayers = () => {
    console.log("\nthis removes existing walls, paths, players, and url params");

    // first
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
  refreshUsingHex = () => {
    console.clear();
    console.log(`lets rebuild the maze using hex... ${this.state.hexString}`);

    // clear state
    this.setState({
      cols: null,
      rows: null,
      level: null,
      walls: [],
      nodes: [],
      allPaths: [],
      inactiveWallKeys: [],
      destNodeX: null,
      destNodeY: null,
      destination: null
    })

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
      destNodeY: parseInt(destinationY)
    });


    const getWallProps = {
      rows: mazeBundle.rows,
      cols: mazeBundle.cols,
      spacing: mazeBundle.spacing,
      inactiveWallKeys: getInactiveWallsFromHex(mazeBundle)
    }

    const activeWalls = getWallsFromInactiveWallKeys(getWallProps);

    this.updateSiblingsUsingPaths();

    this.setState({ walls: activeWalls, level: levelValue, hexString });

    console.log("....done!")
    console.log("setting small timeout so we can see the maze was actually removed...");
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
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.announceNodesToConsole}> nodes </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.announceWallsToConsole}> walls </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runEncoder}> runEncoder </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.refresh}> refresh </button>
        <button style={{ fontSize: "22px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "green" }} onClick={this.refreshUsingHex}> reconstruct </button>
      </div>
    );
  };
}