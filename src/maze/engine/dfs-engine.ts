/**
 * Functionally equivalent to the original level one algorithm
 * however the typescript version relies on nodes crafted intentionally 
 * for use with the engine, so they don't need all the properties that 
 * are needed by the
 */

import { MazeNode, MazeState, WallKey, MazeNodeMap } from "../types";
import { getOrthogonalKey, shuffle } from "./utils";

export default class LevelOne {

    private route: WallKey[] = [];
    private destNodeKey = '';
    private maxDx = 0;
    private startNode: MazeNode | undefined;
    private nodeMap: MazeNodeMap;

    constructor(maze: MazeState) {
        const { nodes } = maze;
        this.nodeMap = {};
        nodes.forEach((n) => {
            const clonedNode = {...n}
            const clonedKeys = [...n.siblingKeys];
            clonedNode.siblingKeys = shuffle(clonedKeys);
            clonedNode.discoveredBy = "";
            clonedNode.distFromStart = 0;
            this.nodeMap[n.key] = clonedNode;
        });

        const offset = Math.round(maze.spacing / 2);
        const startNodeKey = `${offset}.${offset}`
        this.startNode = nodes.find(n => n.key === startNodeKey || n.isStart);

        if (this.startNode) {
            this.startNode.isVisited = true;
            this.nodeMap[this.startNode.key].isVisited = true;
        } else {
            throw new Error('unable to identify start-node');
        }
    }


    run() {
        this.generateMazeWithDfs();
        return {
            route: this.route,
            destNodeKey: this.destNodeKey,
        };
    }

    updateCount = (w: MazeNode): void => {
        w.siblingKeys.forEach((sibKey) => {
            const sib = this.nodeMap[sibKey];
            sib.distFromStart = !sib.isVisited ? w.distFromStart + 1 : sib.distFromStart;
            if (sib.distFromStart > this.maxDx) {
                this.maxDx = sib.distFromStart;
                this.destNodeKey = sib.key;
            }
        });
    }

    generateMazeWithDfs = () => {
        const stack = [];
        stack.push(this.startNode);
        while (stack.length) {
            const w = stack.pop();
            if (w) {
                this.visit(w);
                this.updateCount(w);

                w.siblingKeys.forEach((sibKey) => {
                    if (!this.nodeMap[sibKey].isVisited) {
                        this.nodeMap[sibKey].discoveredBy = w.key;
                        if (w.isStart) {
                            this.nodeMap[sibKey].distFromStart = 1;
                        } else if (!w.isStart) {
                            this.nodeMap[sibKey].distFromStart = w.distFromStart + 1;
                        }
                        stack.push(this.nodeMap[sibKey]); // push
                    }
                });
            }


        }
    }

    visit = (n: MazeNode) => {
        if (n.isVisited === false) {
            n.isVisited = true;
            if (typeof n.discoveredBy === 'undefined') {
                n.discoveredBy = '';
            }
            const [discX, discY] = n.discoveredBy.split('.');
            const [nX, nY] = n.key.split('.');
            const { x1, y1, x2, y2 } = {
                x1: parseInt(discX, 10),
                y1: parseInt(discY, 10),
                x2: parseInt(nX, 10),
                y2: parseInt(nY, 10),
            };
            const correspondingWallToInactivate = getOrthogonalKey(x1, y1, x2, y2);
            this.route.push(correspondingWallToInactivate);
        }
    }
}