import {
    MazeNode,
    MazeNodeMap,
    MazeState,
    NodeKey,
    WallKey,
} from "../types";
import { getOrthogonalKey } from "./utils";

type FrontierEdge = {
    fromKey: NodeKey;
    toKey: NodeKey;
};

type PrimResult = {
    route: WallKey[];
    destNodeKey: NodeKey;
};

/**
 * Generates a perfect maze using randomized Prim's algorithm.
 *
 * The public API intentionally matches the DFS engine: construct the engine
 * with a MazeState, then call run() to receive the walls to remove and the
 * key of the node farthest from the start.
 */
export default class PrimEngine {

    private route: WallKey[] = [];
    private destNodeKey: NodeKey;
    private maxDx = 0;
    private startNode: MazeNode;
    private nodeMap: MazeNodeMap;

    constructor(maze: MazeState) {
        this.nodeMap = {};

        maze.nodes.forEach((node) => {
            this.nodeMap[node.key] = {
                ...node,
                siblingKeys: [...node.siblingKeys],
                discoveredBy: "",
                distFromStart: 0,
                isVisited: false,
            };
        });

        const offset = Math.round(maze.spacing / 2);
        const defaultStartNodeKey = `${offset}.${offset}`;
        const startNode = Object.values(this.nodeMap).find(
            (node) => node.key === defaultStartNodeKey || node.isStart,
        );

        if (!startNode) {
            throw new Error("unable to identify start-node");
        }

        this.startNode = startNode;
        this.startNode.isVisited = true;
        this.destNodeKey = this.startNode.key;
    }

    run(): PrimResult {
        this.generateMazeWithPrim();

        return {
            route: this.route,
            destNodeKey: this.destNodeKey,
        };
    }

    private generateMazeWithPrim(): void {
        const frontier: FrontierEdge[] = [];
        this.addFrontierEdges(this.startNode, frontier);

        while (frontier.length > 0) {
            const edgeIndex = Math.floor(Math.random() * frontier.length);
            const [edge] = frontier.splice(edgeIndex, 1);
            const fromNode = this.nodeMap[edge.fromKey];
            const toNode = this.nodeMap[edge.toKey];

            if (!fromNode?.isVisited || !toNode || toNode.isVisited) {
                continue;
            }

            this.visit(fromNode, toNode);
            this.addFrontierEdges(toNode, frontier);
        }
    }

    private addFrontierEdges(
        node: MazeNode,
        frontier: FrontierEdge[],
    ): void {
        node.siblingKeys.forEach((siblingKey) => {
            const sibling = this.nodeMap[siblingKey];

            if (sibling && !sibling.isVisited) {
                frontier.push({
                    fromKey: node.key,
                    toKey: siblingKey,
                });
            }
        });
    }

    private visit(fromNode: MazeNode, toNode: MazeNode): void {
        toNode.isVisited = true;
        toNode.discoveredBy = fromNode.key;
        toNode.distFromStart = fromNode.distFromStart + 1;

        this.route.push(
            getOrthogonalKey(
                fromNode.x,
                fromNode.y,
                toNode.x,
                toNode.y,
            ),
        );

        if (toNode.distFromStart > this.maxDx) {
            this.maxDx = toNode.distFromStart;
            this.destNodeKey = toNode.key;
        }
    }
}
