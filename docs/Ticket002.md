# Extraction of the Maze Engine

from EM...
```txt
I don't actually want to jump straight into TypeScript.

I want to do something that will make the TypeScript migration much easier.

I think our next ticket should be:

Extract the Maze Engine

Not rewrite it.

Extract it.

Move the maze generation into a plain JavaScript module that has zero React dependencies.

Why?

Because once the engine is independent, converting it to TypeScript becomes a joy instead of a chore.



```


## Acceptance criteria:

1. Remove lodash from levelOneEngine.js.
2. move shuffle and getOrthogonalKey into an engine-friendly utility module, maybe:

src/mazeEngines/engineUtils.js
Ensure levelOneEngine.js imports only from maze-engine-related files.
Do not change maze behavior.
Add comments documenting the engine input and output shape.



### findings

- The maze visual rendering of the maze actually is occuring within setState functions. We can see how this works in the 'componentDidMount' function within the MazeGraph.jsx file. 
- Comments have been added to this function to explain what's happening and what we'd actually prefer

```javascript
  componentDidMount = () => {
    this.setState((prevState, props) => ({
      cols: Math.floor((props.width * 0.80) / DEFAULTS.desktopSpacing),
      rows: Math.floor((props.height * 0.80) / DEFAULTS.desktopSpacing),
      currentLevel: this.currentLevel || 1,
    }));

    this.setState(prevState => ({
      width: DEFAULTS.desktopSpacing * prevState.cols,
      height: DEFAULTS.desktopSpacing * prevState.rows,
    }));

    this.setState(prevState => ({
      nodes: new NodeFactory().getNodes(prevState),
    }));

    this.setState((prevState) => {
      const mazeCreator = new LevelOne();
      const result = mazeCreator.run(prevState);
      const [x, y] = result.destNodeKey.split('.');
      return {
        carvedWallKeys: result.route,
        destNodeX: x,
        destNodeY: y,
      };
    });

    this.setState(prevState => ({
      walls: MazeWallFactory(prevState),
    }), () => {
      this.setState(prevState => ({
        allPaths: pathFactory.useInactiveWalls(prevState),
      }), () => {
        this.updateSiblingsUsingPaths();
      });
    });
  };
  ```