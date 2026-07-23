import { afterEach, describe, expect, it, vi } from "vitest";
import { getBlankNodesForEngine } from "../node/maze-node-factory";
import { MazeNode, MazeState, NodeKey, WallKey } from "../types";
import EllerEngine from "./eller-engine";
import { getOrthogonalKey } from "./utils";

function createMazeState(rows = 4, cols = 4, spacing = 20): MazeState {
    return {
        allPaths: [],
        cols,
        destination: { x: 0, y: 0 },
        height: rows * spacing,
        inactiveWallKeys: [],
        level: 3,
        nodes: getBlankNodesForEngine({ rows, cols, spacing }),
        rows,
        spacing,
        walls: [],
        width: cols * spacing,
    };
}

function getCarvedAdjacency(
    nodes: MazeNode[],
    route: WallKey[],
): Map<NodeKey, NodeKey[]> {
    const adjacency = new Map<NodeKey, NodeKey[]>(
        nodes.map((node) => [node.key, []]),
    );
    const nodesByKey = new Map(nodes.map((node) => [node.key, node]));
    const nodeKeysByWall = new Map<WallKey, [NodeKey, NodeKey]>();

    nodes.forEach((node) => {
        node.siblingKeys.forEach((siblingKey) => {
            const sibling = nodesByKey.get(siblingKey);

            if (sibling) {
                nodeKeysByWall.set(
                    getOrthogonalKey(node.x, node.y, sibling.x, sibling.y),
                    [node.key, siblingKey],
                );
            }
        });
    });

    route.forEach((wallKey) => {
        const nodeKeys = nodeKeysByWall.get(wallKey);
        expect(nodeKeys).toBeDefined();

        if (nodeKeys) {
            const [firstKey, secondKey] = nodeKeys;
            adjacency.get(firstKey)?.push(secondKey);
            adjacency.get(secondKey)?.push(firstKey);
        }
    });

    return adjacency;
}

function getDistancesFromStart(
    startNodeKey: NodeKey,
    adjacency: Map<NodeKey, NodeKey[]>,
): Map<NodeKey, number> {
    const distances = new Map<NodeKey, number>([[startNodeKey, 0]]);
    const queue = [startNodeKey];

    while (queue.length > 0) {
        const nodeKey = queue.shift();

        if (!nodeKey) {
            continue;
        }

        adjacency.get(nodeKey)?.forEach((siblingKey) => {
            if (!distances.has(siblingKey)) {
                distances.set(
                    siblingKey,
                    (distances.get(nodeKey) ?? 0) + 1,
                );
                queue.push(siblingKey);
            }
        });
    }

    return distances;
}

describe("EllerEngine", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each([
        { rows: 4, cols: 4, randomValue: 0.25 },
        { rows: 4, cols: 4, randomValue: 0.75 },
        { rows: 1, cols: 5, randomValue: 0.25 },
        { rows: 5, cols: 1, randomValue: 0.75 },
        { rows: 1, cols: 1, randomValue: 0.25 },
    ])(
        "returns a perfect $rows x $cols maze when random is $randomValue",
        ({ rows, cols, randomValue }) => {
            vi.spyOn(Math, "random").mockReturnValue(randomValue);
            const maze = createMazeState(rows, cols);
            const originalNodes = structuredClone(maze.nodes);

            const result = new EllerEngine(maze).run();

            expect(Object.keys(result).sort()).toEqual([
                "destNodeKey",
                "route",
            ]);
            expect(result.route).toHaveLength(maze.nodes.length - 1);
            expect(new Set(result.route).size).toBe(result.route.length);
            expect(maze.nodes).toEqual(originalNodes);

            const adjacency = getCarvedAdjacency(
                maze.nodes,
                result.route,
            );
            const startNode = maze.nodes.find((node) => node.isStart);
            expect(startNode).toBeDefined();

            if (!startNode) {
                return;
            }

            const distances = getDistancesFromStart(
                startNode.key,
                adjacency,
            );
            expect(distances.size).toBe(maze.nodes.length);

            const maxDistance = Math.max(...distances.values());
            expect(distances.get(result.destNodeKey)).toBe(maxDistance);
        },
    );

    it("throws the same start-node error as the other engines", () => {
        const maze = createMazeState(1, 1);
        maze.nodes[0] = {
            ...maze.nodes[0],
            isStart: false,
            key: "not-the-default-start",
        };

        expect(() => new EllerEngine(maze)).toThrow(
            "unable to identify start-node",
        );
    });
});
