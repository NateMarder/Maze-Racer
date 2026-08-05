
import { GraphQLError } from "graphql";
import { GenerateSandboxMazeArgs } from '@/maze/types';
import { getSolvableMazeWithoutSpacing, GeneratedSandboxMaze } from '@/maze/engine/engine-utils';


function validateMazeDimensions(rows: number, cols: number): void {
  if (rows < 2 || cols < 2) {
    throw new GraphQLError(
      "Maze rows and columns must both be at least 2.",
      {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      },
    );
  }

  if (rows > 20 || cols > 20) {
    throw new GraphQLError(
      "Maze rows and columns cannot exceed 20.",
      {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      },
    );
  }
}

export const resolvers = {
  Query: {
    generateSandboxMaze: (
      _parent: unknown,
      { input }: GenerateSandboxMazeArgs,
    ) => {
      validateMazeDimensions(input.rows, input.cols);

      /*
       * Next:
       *
       * 1. Map input.algorithm to the maze-engine algorithm.
       * 2. Generate the maze.
       * 3. Assert that it is playable.
       * 4. Encode it.
       */
      const result:GeneratedSandboxMaze = getSolvableMazeWithoutSpacing({ rows: input.rows, cols: input.cols, algorithm: input.algorithm });
      //assertCanonicalTopology(result.canonicalId, result.cols, result.rows);
      return result;

      //   throw new Error(
      //     `generateSandboxMaze is not implemented: ${JSON.stringify(input)}`,
      //   );
    },
  },
};