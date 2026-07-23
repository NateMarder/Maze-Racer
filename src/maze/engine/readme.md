# Engine Architecture

## Current Algorithms

| algorithm | file | Description |
|-----------|------|-------------|
| dfs (depth-first search) | [dfs-engine.ts](src/maze/engine/dfs-engine.ts) | Long windy paths with lots of shorter dead-end options |
| prim | [prim-engine.ts](src/maze/engine/prim-engine.ts) | no long cooridors of maze cells - many turns needed to complete |
| eller | [eller-engine.ts](src/maze/engine/eller-engine.ts) | Row-by-row generation with a mix of horizontal and vertical passages |
| eller | [prim-engine.ts](src/maze/engine/eller-engine.ts) | no long cooridors of maze cells - many turns needed to complete - super hard to complete |

## Future Algorithms
- Kruskal's Algorithm
- Recursive Division
- Wilson's Algorithm
- Aldous–Broder
- Growing Tree


### Resources
- [the professor's github page](https://professor-l.github.io/mazes/)
