import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  GenerateSandboxMazeData,
  GenerateSandboxMazeVariables,
} from "@/maze/types";

export const GENERATE_SANDBOX_MAZE: TypedDocumentNode<
  GenerateSandboxMazeData,
  GenerateSandboxMazeVariables
> = gql`
  query GenerateSandboxMaze($input: GenerateSandboxMazeInput!) {
    generateSandboxMaze(input: $input)
  }
`;
