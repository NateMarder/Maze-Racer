// src/app/api/graphql/schema.ts

export const typeDefs = `#graphql
  enum MazeAlgorithm {
    DFS
    ELLER
    PRIM
  }

  input GenerateSandboxMazeInput {
    algorithm: MazeAlgorithm!
    rows: Int!
    cols: Int!
  }

  type GeneratedSandboxMaze {
    serialized: String!
    algorithm: MazeAlgorithm!
    rows: Int!
    cols: Int!
  }

  type Query {
    generateSandboxMaze(
      input: GenerateSandboxMazeInput!
    ): GeneratedSandboxMaze!
  }
`;