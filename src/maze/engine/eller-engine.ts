import {
    MazeNode,
    MazeNodeMap,
    MazeState,
    NodeKey,
    WallKey,
} from "../types";
import { getOrthogonalKey, shuffle } from "./utils";

type EllerResult = {
    route: WallKey[];
    destNodeKey: NodeKey;
};

type DownwardCandidate = {
    currentNode: MazeNode;
    nextNode: MazeNode;
};

/**
 * Generates a perfect maze one row at a time using Eller's algorithm.
 *
 * The public API intentionally matches the DFS and Prim engines: construct
 * the engine with a MazeState, then call run() to receive the walls to remove
 * and the key of the node farthest from the start.
 */
export default class EllerEngine {

    private route: WallKey[] = [];
    private destNodeKey: NodeKey;
    private startNode: MazeNode;
    private nodeMap: MazeNodeMap;
    private cellSets = new Map<NodeKey, number>();
    private carvedAdjacency = new Map<NodeKey, NodeKey[]>();
    private nextSetId = 1;

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
            this.carvedAdjacency.set(node.key, []);
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
        this.destNodeKey = this.startNode.key;
    }

    run(): EllerResult {
        this.generateMazeWithEller();
        this.updateDestination();

        return {
            route: this.route,
            destNodeKey: this.destNodeKey,
        };
    }

    private generateMazeWithEller(): void {
        const rows = this.getRows();

        rows.forEach((row, rowIndex) => {
            const isLastRow = rowIndex === rows.length - 1;
            const nextRow = rows[rowIndex + 1];

            this.assignMissingSets(row);
            this.joinHorizontalNeighbors(row, isLastRow);

            if (!isLastRow && nextRow) {
                this.joinRowToNextRow(row, nextRow);
            }
        });
    }

    private getRows(): MazeNode[][] {
        const rowsByY = new Map<number, MazeNode[]>();

        Object.values(this.nodeMap).forEach((node) => {
            const row = rowsByY.get(node.y) ?? [];
            row.push(node);
            rowsByY.set(node.y, row);
        });

        return [...rowsByY.entries()]
            .sort(([firstY], [secondY]) => firstY - secondY)
            .map(([, row]) => row.sort(
                (firstNode, secondNode) => firstNode.x - secondNode.x,
            ));
    }

    private assignMissingSets(row: MazeNode[]): void {
        row.forEach((node) => {
            if (!this.cellSets.has(node.key)) {
                this.cellSets.set(node.key, this.nextSetId);
                this.nextSetId += 1;
            }
        });
    }

    private joinHorizontalNeighbors(
        row: MazeNode[],
        isLastRow: boolean,
    ): void {
        for (let index = 0; index < row.length - 1; index += 1) {
            const currentNode = row[index];
            const nextNode = row[index + 1];
            const currentSet = this.cellSets.get(currentNode.key);
            const nextSet = this.cellSets.get(nextNode.key);
            const areSiblings = currentNode.siblingKeys.includes(nextNode.key);

            if (
                !areSiblings
                || currentSet === undefined
                || nextSet === undefined
                || currentSet === nextSet
            ) {
                continue;
            }

            if (isLastRow || Math.random() < 0.5) {
                this.carve(currentNode, nextNode);
                this.mergeSets(row, nextSet, currentSet);
            }
        }
    }

    private mergeSets(
        row: MazeNode[],
        oldSet: number,
        newSet: number,
    ): void {
        row.forEach((node) => {
            if (this.cellSets.get(node.key) === oldSet) {
                this.cellSets.set(node.key, newSet);
            }
        });
    }

    private joinRowToNextRow(
        row: MazeNode[],
        nextRow: MazeNode[],
    ): void {
        const nodesBySet = new Map<number, MazeNode[]>();
        const nextNodesByX = new Map(
            nextRow.map((node) => [node.x, node]),
        );

        row.forEach((node) => {
            const setId = this.cellSets.get(node.key);

            if (setId !== undefined) {
                const nodes = nodesBySet.get(setId) ?? [];
                nodes.push(node);
                nodesBySet.set(setId, nodes);
            }
        });

        nodesBySet.forEach((nodes, setId) => {
            const candidates = shuffle(
                nodes.flatMap((node): DownwardCandidate[] => {
                    const nextNode = nextNodesByX.get(node.x);

                    if (
                        !nextNode
                        || !node.siblingKeys.includes(nextNode.key)
                    ) {
                        return [];
                    }

                    return [{
                        currentNode: node,
                        nextNode,
                    }];
                }),
            );

            candidates.forEach((candidate, index) => {
                const mustJoin = index === 0;
                const shouldJoin = mustJoin || Math.random() < 0.5;

                if (shouldJoin) {
                    this.carve(
                        candidate.currentNode,
                        candidate.nextNode,
                    );
                    this.cellSets.set(candidate.nextNode.key, setId);
                }
            });
        });
    }

    private carve(firstNode: MazeNode, secondNode: MazeNode): void {
        this.route.push(
            getOrthogonalKey(
                firstNode.x,
                firstNode.y,
                secondNode.x,
                secondNode.y,
            ),
        );
        this.carvedAdjacency.get(firstNode.key)?.push(secondNode.key);
        this.carvedAdjacency.get(secondNode.key)?.push(firstNode.key);
    }

    private updateDestination(): void {
        const queue = [this.startNode];
        let maxDistance = 0;

        this.startNode.isVisited = true;

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (!currentNode) {
                continue;
            }

            this.carvedAdjacency.get(currentNode.key)?.forEach(
                (siblingKey) => {
                    const sibling = this.nodeMap[siblingKey];

                    if (!sibling || sibling.isVisited) {
                        return;
                    }

                    sibling.isVisited = true;
                    sibling.discoveredBy = currentNode.key;
                    sibling.distFromStart = currentNode.distFromStart + 1;
                    queue.push(sibling);

                    if (sibling.distFromStart > maxDistance) {
                        maxDistance = sibling.distFromStart;
                        this.destNodeKey = sibling.key;
                    }
                },
            );
        }
    }
}
