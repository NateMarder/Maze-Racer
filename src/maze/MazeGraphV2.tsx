'use client'

import React from 'react';
import { mazeGraphDefaults as DEFAULTS, defaultColumnCount, defaultRowCount } from '../utilities';
import { NodeFactory, PlayerNode } from './node/index';
import DestinationNode from './DestinationNode';
import { createPathsFromInactiveWalls } from './path/index';
import { MazeWall, MazeWallFactory } from './wall/index';
import LevelOne from '../maze/engine/levelOneEngine';
import { getHexRepresentationOfNodeArray, hydratePathDirections } from './codec/compressionHandler';
import { MazeNode, WallKey } from '../../src/maze/types';

// ==========================================
// 1. Interfaces & Types Definition
// ==========================================

// Define the shape of your external DEFAULTS configuration
interface MazeDefaults {
    desktopSpacing: number;
    cols: number;
    rows: number;
}

// Declare external globals if they aren't imported explicitly in your file
// declare const DEFAULTS: MazeDefaults;
// declare const NodeFactory: any; 
// declare const LevelOne: any;
// declare const MazeWallFactory: (state: MazeGraphState) => MazeWall[];
// declare const createPathsFromInactiveWalls: (keys: string[]) => MazePath[];
// declare const hydratePathDirections: (nodes: MazeNode[]) => MazeNode[];
// declare const getHexRepresentationOfNodeArray: (nodes: MazeNode[]) => string;

// Placeholder components (replace imports with your actual component paths)
// declare const PlayerNode: React.ComponentType<any>;
// declare const MazeWall: React.ComponentType<any>;
// declare const DestinationNode: React.ComponentType<any>;


export interface MazeWall {
  id: WallKey;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface MazePath {
    nodeKeys: [string, string];
}

export interface MazeGraphProps {
    height: number;
    width: number;
    className?: string;
    handleswipebindings: any; // Consider typing this to your specific callback function signature
    cols?: number;
    rows?: number;
}

export interface MazeGraphState {
    height: number;
    width: number;
    spacing: number;
    cols: number;
    rows: number;
    nodes: MazeNode[] | null;
    allPaths: MazePath[];
    walls: MazeWall[];
    inactiveWallKeys: string[];
    destNodeX: string | number;
    destNodeY: string | number;
    hexString: string;
    debugStatement: string;
    currentLevel?: number;
}

// ==========================================
// 2. Strongly-Typed React Class Component
// ==========================================

export default class MazeGraphV2 extends React.Component<MazeGraphProps, MazeGraphState> {
    // Properly type the React ref container
    private mazeGraphRef: React.RefObject<HTMLDivElement | null>;
    private currentLevel?: number;

    constructor(props: MazeGraphProps) {
        super(props);
        this.state = {
            height: props.height,
            width: props.width,
            spacing: DEFAULTS.desktopSpacing,
            cols: props.cols || defaultColumnCount,
            rows: props.rows || defaultRowCount,
            nodes: [],
            allPaths: [],
            walls: [],
            inactiveWallKeys: [],
            destNodeX: 0,
            destNodeY: 0,
            hexString: '',
            debugStatement: ""
        };
        this.mazeGraphRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount = (): void => {
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
        const mazeCreator = new LevelOne();
        const result = mazeCreator.run(this.state);
        const [x, y] = result.destNodeKey.split('.');

        this.setState({
            inactiveWallKeys: result.route || [],
            destNodeX: x,
            destNodeY: y,
        }, () => {
            // step 5
            this.setState(prevState => ({
                walls: MazeWallFactory(prevState),
            }), () => {
                this.setState(prevState => ({
                    allPaths: createPathsFromInactiveWalls(prevState.inactiveWallKeys || []),
                }), () => { // Removed unused state param to appease compiler
                    this.updateSiblingsUsingPaths();
                });
            });
        });
    };

    updateSiblingsUsingPaths = (): void => {
        if (!this.state.nodes) return;

        const clonedNodes: MazeNode[] = JSON.parse(JSON.stringify(this.state.nodes));

        clonedNodes.forEach((n) => {
            n.siblingKeys = [];
        });

        this.state.allPaths.forEach((mazePath) => {
            const [node1Key, node2Key] = mazePath.nodeKeys;
            const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
            const nodeRef2 = clonedNodes.find(n => n.key === node2Key);

            if (nodeRef1 && nodeRef2) {
                nodeRef1.siblingKeys.push(nodeRef2.key);
                nodeRef2.siblingKeys.push(nodeRef1.key);
            }
        });

        this.setState(() => ({ // Cleaned unused parameters
            nodes: clonedNodes,
        }), () => {

            let hydratedNodes = hydratePathDirections(clonedNodes);
            let h = getHexRepresentationOfNodeArray(hydratedNodes);

            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("h", h);
            currentUrl.searchParams.set("c", String(this.state.cols));
            currentUrl.searchParams.set("r", String(this.state.rows));

            window.history.replaceState(null, '', currentUrl.toString());

            this.setState(() => ({ // Cleaned unused parameters
                debugStatement: h
            }));
        });
    };

    getUserControlNode = (): React.JSX.Element => (
        <PlayerNode
            cx={Math.round(DEFAULTS.desktopSpacing / 2)}
            cy={Math.round(DEFAULTS.desktopSpacing / 2)}
            r={Math.round(DEFAULTS.desktopSpacing * 0.10)}
            map={this.state.nodes || []}
            destnodekey={`${this.state.destNodeX}.${this.state.destNodeY}`}
            offset={DEFAULTS.desktopSpacing}
            mzgraphref={this.mazeGraphRef}
        />
    );

    getInnerWalls = (): React.JSX.Element[] =>
        this.state.walls.map((wall) => {
            const { id, x1, y1, x2, y2 } = wall;
            return <MazeWall
                key={id}
                id={id}
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

    render = (): React.JSX.Element => {
        const { destNodeX, destNodeY, width, height } = this.state;
        return (
            <div ref={this.mazeGraphRef}>
                <svg width={width} height={height} id="mz-svg">
                    {this.getOutterWalls()}
                    {this.getInnerWalls()}
                    {this.getUserControlNode()}
                    <DestinationNode x={destNodeX} y={destNodeY} r={Math.round(DEFAULTS.desktopSpacing * 0.10)} />
                </svg>
                <br />
                <div className="debug-output">
                    {this.state.debugStatement}
                </div>
            </div>
        );
    };
}