# Engine Architecture

The maze engines own topology generation only. Browser clients do not instantiate
an engine directly; they request generation through GraphQL and receive a
canonical maze ID to decode and render.

## Current algorithms

| Algorithm | Implementation | Topology characteristics |
| --- | --- | --- |
| Depth-first search (DFS) | [dfs-engine.ts](./dfs-engine.ts) | Long, winding passages with relatively short dead ends |
| Randomized Prim | [prim-engine.ts](./prim-engine.ts) | Frequent turns and many shorter branches |
| Eller | [eller-engine.ts](./eller-engine.ts) | Row-by-row generation with randomized horizontal and vertical joins |

## Shared engine contract

Each engine is constructed with the same `MazeState`. Its nodes describe the
complete rectangular grid, including orthogonally adjacent sibling nodes, and the
logical top-left cell `(0,0)` is marked as the start.

Calling `run()` returns the same shape for every engine:

```ts
type MazeEngineResult = {
  route: WallKey[];
  destNodeKey: NodeKey;
};
```

`route` contains the wall keys to remove to form passages. `destNodeKey` identifies
the destination selected after generation. Engines must not mutate presentation
configuration or render UI.

The server-facing `generateCanonicalMaze` function in
[engine-utils.ts](./engine-utils.ts) is the shared orchestration entry point. It
accepts an algorithm plus row and column counts, creates a presentation-neutral
logical grid, runs the selected engine, reconstructs node connectivity, and
returns the v1 canonical ID produced by `MazeCodec`.

## Perfect-maze invariants

Every completed engine result must describe a perfect maze:

- Every grid cell is reachable from the start.
- There is exactly one path between any two cells.
- A maze with `rows × cols` cells contains exactly `rows × cols - 1` passages.
- Passage keys are unique and connect only orthogonally adjacent cells within the
  requested grid.

Together, connectivity and the `cells - 1` passage count guarantee that the maze
is a spanning tree: connected and free of cycles. Engine tests protect these
invariants across square, rectangular, single-row, and single-column inputs where
the engine itself supports them. The GraphQL boundary applies its own stricter
dimension limits.

## Destination selection

The start is the logical cell `(0,0)`. After carving the perfect maze, the engine
selects the cell with the greatest graph distance from the start—that is, the
largest number of passages along the unique solution path, rather than the
greatest straight-line distance. The returned `destNodeKey` is converted to the
canonical destination coordinate by the shared orchestration layer.

## Potential future algorithms

- Kruskal's algorithm
- Recursive division
- Wilson's algorithm
- Aldous–Broder
- Growing tree

## Resource

- [Professor L's maze resources](https://professor-l.github.io/mazes/)
