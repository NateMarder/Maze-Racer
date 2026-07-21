'use client'

import React from 'react';
import { mazeGraphDefaults as DEFAULTS } from '../defaults';
import PlayerNode from '../maze/player-node';
import { getNodesWithConnectedSiblingsBasedOnPath } from './node/utilities';
import { DestinationNode } from './destination-node';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall } from './wall/index';
import LevelOne from './engine/level-one-engine';
import { getEncodedMazeDataFromUrlParams, safeToRenderWithUrlParams, updateWindowUrlWithoutReload } from '../web-utilities';
import { MazeState, EncodedMaze } from './types';
import { getWallsFromInactiveWallKeys } from './wall/maze-wall';
import { MazeCodec } from './codec/maze-codec';
import { getBlankNodesForEngine } from './node/maze-node-factory';



export interface MazeGraphProps {
    height: number;
    width: number;
    className?: string;
    cols?: number;
    rows?: number;
    level: number;
    spacing: number;
}

export default class MazeGraph extends React.Component<MazeGraphProps, MazeState> {
    private mazeGraphRef: React.RefObject<HTMLDivElement | null>;
    constructor(props: MazeGraphProps) {
        super(props);
        const rows = Math.floor((props.height * 0.80) / (props.spacing || DEFAULTS.desktopSpacing));
        const cols = Math.floor((props.width * 0.80) / (props.spacing || DEFAULTS.desktopSpacing));
        const spacing = props.spacing || DEFAULTS.desktopSpacing;
        const height = spacing * rows;
        const width = spacing * cols;
        this.state = {
            height,
            width,
            spacing,
            cols,
            rows,
            nodes: getBlankNodesForEngine({ rows, cols, spacing }),
            allPaths: [],
            walls: [],
            inactiveWallKeys: [],
            destination: { x: 0, y: 0 },
            serialized: '',
            level: props.level
        };;
        this.mazeGraphRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount = (): void => {
        if (safeToRenderWithUrlParams()) {
            const encoded = getEncodedMazeDataFromUrlParams();
            const decodeResult = MazeCodec.decode(encoded);
            this.setState({
                ...decodeResult
            })
        } else {
            const result = new LevelOne().run(this.state);
            const [x, y] = result.destNodeKey.split('.').map(Number);
            if (result?.route) {
                this.setState({
                    inactiveWallKeys: result.route,
                    destination: { x, y }
                });
            }
        }

        // 2 --> get paths and walls for maze rendering
        this.setState(prevState => ({
            walls: getWallsFromInactiveWallKeys(prevState),
            allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys),
        }));

        // 3 --> update nodes with the paths from state
        this.setState(prevState => ({
            nodes: getNodesWithConnectedSiblingsBasedOnPath(prevState)
        }))
    };

    getUserControlNode = (): React.JSX.Element => (
        <PlayerNode
            cx={Math.round(DEFAULTS.desktopSpacing / 2)}
            cy={Math.round(DEFAULTS.desktopSpacing / 2)}
            r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
            map={this.state.nodes || []}
            destnodekey={`${this.state.destination.x}.${this.state.destination.y}`}
            offset={DEFAULTS.desktopSpacing}
            mzgraphref={this.mazeGraphRef}
        />
    );

    getInnerWalls = (): React.JSX.Element[] =>
        this.state.walls.map((wall) => {
            const { id, x1, y1, x2, y2 } = wall;
            return <MazeWall
                id={id}
                key={id}
                x1={x1.toString()}
                x2={x2.toString()}
                y1={y1.toString()}
                y2={y2.toString()}
                className={"insidewall"}
            />;
        });

    getOutterWalls = (): React.JSX.Element => {
        const { height, width } = this.state;
        return (
            <>
                <MazeWall id={"left-edge"} x1={"0"} y1={"0"} x2={"0"} y2={height.toString()} className="outsidewall" />
                <MazeWall id={"top-edge"} x1={"0"} y1={"0"} x2={width.toString()} y2={"0"} className="outsidewall" />
                <MazeWall id={"right-edge"} x1={width.toString()} y1={"0"} x2={width.toString()} y2={height.toString()} className="outsidewall" />
                <MazeWall id={"left-edge"} x1={"0"} y1={height.toString()} x2={width.toString()} y2={height.toString()} className="outsidewall" />
            </>
        );
    };

    refresh = () => {
        console.clear();
        console.log("clearing params from URL and reloading");
        window.location.href = window.location.pathname;
    }

    runEncoder = () => {
        const encodedMaze = MazeCodec.encode(this.state);
        updateWindowUrlWithoutReload(encodedMaze)
    }

    runDecoder = () => {
        const encoded: EncodedMaze = getEncodedMazeDataFromUrlParams();
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
                <br></br>
                <br></br>
                <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runEncoder}> encode </button>
                <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.runDecoder}>decode</button>
                <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px" }} onClick={this.refresh}> refresh </button>
                <button style={{ fontSize: "18px", cursor: "pointer", float: "left", marginRight: "10px", padding: "5px", color: "magenta" }} onClick={this.seeState}> print state </button>             </div>
        );
    };
}
