
import { GraphQLError } from "graphql";
import type { GenerateSandboxMazeVariables } from '@/maze/types';
import { generateCanonicalMaze } from '@/maze/engine/engine-utils';


function validateMazeDimensions(rows: number, cols: number): void {
  if (rows < 3 || cols < 3) {
    throw new GraphQLError(
      "Maze rows and columns must both be at least 3.",
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
      { input }: GenerateSandboxMazeVariables,
    ) => {
      validateMazeDimensions(input.rows, input.cols);

      return generateCanonicalMaze(input);
    },
  },
};
