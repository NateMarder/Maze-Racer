import { gql } from "@apollo/client";

export const GENERATE_SANDBOX_MAZE = gql`
  query GenerateSandboxMaze($input: GenerateSandboxMazeInput!) {
    generateSandboxMaze(input: $input) {
      canonicalId
      algorithm
      rows
      cols
    }
  }
`;