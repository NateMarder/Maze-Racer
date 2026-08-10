import { afterEach, describe, expect, it, vi } from "vitest";
import { MazeCodec } from "@/maze/codec/maze-codec";
import PrimEngine from "@/maze/engine/prim-engine";
import type { MazeAlgorithm } from "@/maze/types";
import { apolloServer } from "./server";

const GENERATE_MAZE_QUERY = `#graphql
  query GenerateSandboxMaze($input: GenerateSandboxMazeInput!) {
    generateSandboxMaze(input: $input)
  }
`;

type GenerateMazeResult = {
  generateSandboxMaze: string;
};

type GenerateMazeVariables = {
  input: {
    algorithm: MazeAlgorithm | string;
    rows: number;
    cols: number;
  };
};

async function executeGeneration(variables: GenerateMazeVariables) {
  const response = await apolloServer.executeOperation<
    GenerateMazeResult,
    GenerateMazeVariables
  >({
    query: GENERATE_MAZE_QUERY,
    variables,
  });

  if (response.body.kind !== "single") {
    throw new Error("Expected a single GraphQL response.");
  }

  return response.body.singleResult;
}

describe("generateSandboxMaze GraphQL query", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(["DFS", "ELLER", "PRIM"] as const)(
    "returns a raw canonical ID for %s",
    async (algorithm) => {
      const result = await executeGeneration({
        input: {
          algorithm,
          rows: 4,
          cols: 5,
        },
      });
      const canonicalId = result.data?.generateSandboxMaze;

      expect(result.errors).toBeUndefined();
      expect(canonicalId).toBeTypeOf("string");
      expect(canonicalId?.startsWith("v1:")).toBe(true);
      expect(canonicalId?.startsWith("maze=")).toBe(false);
      expect(canonicalId?.startsWith("?")).toBe(false);
      expect(canonicalId?.startsWith("/sandbox")).toBe(false);
      expect(canonicalId).not.toContain("&s=");

      const encoded = MazeCodec.parseCanonicalId(canonicalId ?? "", {
        spacing: 40,
      });
      const decoded = MazeCodec.decode(encoded);

      expect(encoded.rows).toBe(4);
      expect(encoded.cols).toBe(5);
      expect(decoded.allPaths).toHaveLength(19);
    },
  );

  it.each([
    { rows: 2, cols: 4, message: "at least 3" },
    { rows: 4, cols: 2, message: "at least 3" },
    { rows: 21, cols: 4, message: "cannot exceed 20" },
    { rows: 4, cols: 21, message: "cannot exceed 20" },
  ])("rejects invalid dimensions: $rows x $cols", async (input) => {
    const result = await executeGeneration({
      input: {
        algorithm: "DFS",
        rows: input.rows,
        cols: input.cols,
      },
    });

    expect(result.data).toBeNull();
    expect(result.errors?.[0].extensions?.code).toBe("BAD_USER_INPUT");
    expect(result.errors?.[0].message).toContain(input.message);
  });

  it("rejects an unknown algorithm during GraphQL coercion", async () => {
    const result = await executeGeneration({
      input: {
        algorithm: "KRUSKAL",
        rows: 4,
        cols: 4,
      },
    });

    expect(result.data).toBeUndefined();
    expect(result.errors?.[0].message).toContain(
      'Value "KRUSKAL" does not exist in "MazeAlgorithm" enum',
    );
  });

  it("executes generation for every identical operation", async () => {
    const primRun = vi.spyOn(PrimEngine.prototype, "run");
    const variables = {
      input: {
        algorithm: "PRIM" as const,
        rows: 4,
        cols: 4,
      },
    };

    await executeGeneration(variables);
    await executeGeneration(variables);

    expect(primRun).toHaveBeenCalledTimes(2);
  });
});
