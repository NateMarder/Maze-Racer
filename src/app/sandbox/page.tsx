"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { GraphQLProvider } from "@/graphql/GraphQLProvider";
import { GENERATE_SANDBOX_MAZE } from "@/graphql/operations/generateSandboxMaze";
import { MazeCodec } from "@/maze/codec/maze-codec";
import SandBoxMazeGraph from "@/maze/maze-graphs/sandbox-maze-graph";
import type {
  AlgorithmKey,
  MazeAlgorithm,
  MazeState,
} from "@/maze/types";
import {
  getEncodedMazeDataFromUrlParams,
  getRandomEngine,
  safeToRenderWithUrlParams,
} from "@/web-utilities";

const SANDBOX_HEIGHT = 600;
const SANDBOX_WIDTH = 600;
const SANDBOX_SPACING = 40;
const SANDBOX_ROWS = Math.floor(
  (SANDBOX_HEIGHT * 0.8) / SANDBOX_SPACING,
);
const SANDBOX_COLS = Math.floor(
  (SANDBOX_WIDTH * 0.8) / SANDBOX_SPACING,
);

const GRAPHQL_ALGORITHM: Record<AlgorithmKey, MazeAlgorithm> = {
  dfs: "DFS",
  eller: "ELLER",
  prim: "PRIM",
};

const GENERATION_ERROR_MESSAGE =
  "Unable to generate a maze. Please try again.";
const DECODE_ERROR_MESSAGE =
  "Unable to decode the maze URL. Please check the link and try again.";

function decodeMazeFromCurrentUrl(): MazeState {
  const encodedMaze = getEncodedMazeDataFromUrlParams();

  if (!Number.isFinite(encodedMaze.spacing) || encodedMaze.spacing <= 0) {
    throw new Error("Maze spacing must be a positive number.");
  }

  return MazeCodec.decode(encodedMaze);
}

function clearCurrentUrlParams(): void {
  const currentUrl = new URL(window.location.href);
  currentUrl.search = "";
  window.history.replaceState(null, "", currentUrl.toString());
}

function SandboxController() {
  const [maze, setMaze] = useState<MazeState | null>(null);
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>();
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const initialLoadStarted = useRef(false);
  const requestInFlight = useRef(false);
  const [requestMaze, { loading }] = useLazyQuery(
    GENERATE_SANDBOX_MAZE,
    {
      fetchPolicy: "no-cache",
    },
  );

  const generateMaze = useCallback(async (
    clearUrlAfterSuccess: boolean,
  ): Promise<void> => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;
    const nextAlgorithm = getRandomEngine();

    try {
      const result = await requestMaze({
        variables: {
          input: {
            algorithm: GRAPHQL_ALGORITHM[nextAlgorithm],
            rows: SANDBOX_ROWS,
            cols: SANDBOX_COLS,
          },
        },
      });
      const canonicalId = result.data?.generateSandboxMaze;

      if (result.error || !canonicalId) {
        throw result.error ?? new Error(
          "The maze generation response did not include a canonical ID.",
        );
      }

      const encodedMaze = MazeCodec.parseCanonicalId(canonicalId, {
        spacing: SANDBOX_SPACING,
      });
      const decodedMaze = MazeCodec.decode(encodedMaze);

      setMaze(decodedMaze);
      setAlgorithm(nextAlgorithm);
      setInitialLoadFailed(false);

      if (clearUrlAfterSuccess) {
        clearCurrentUrlParams();
      }
    } catch {
      setInitialLoadFailed(true);
      window.alert(GENERATION_ERROR_MESSAGE);
    } finally {
      requestInFlight.current = false;
    }
  }, [requestMaze]);

  const decodeCurrentUrl = useCallback((): void => {
    try {
      const decodedMaze = decodeMazeFromCurrentUrl();

      setMaze(decodedMaze);
      setAlgorithm(undefined);
      setInitialLoadFailed(false);
    } catch {
      window.alert(DECODE_ERROR_MESSAGE);
    }
  }, []);

  useEffect(() => {
    if (initialLoadStarted.current) {
      return;
    }

    const initializeTimer = window.setTimeout(() => {
      if (initialLoadStarted.current) {
        return;
      }

      initialLoadStarted.current = true;

      if (safeToRenderWithUrlParams()) {
        try {
          setMaze(decodeMazeFromCurrentUrl());
        } catch {
          setInitialLoadFailed(true);
          window.alert(DECODE_ERROR_MESSAGE);
        }
        return;
      }

      void generateMaze(false);
    }, 0);

    return () => window.clearTimeout(initializeTimer);
  }, [generateMaze]);

  const requestFreshMaze = useCallback((): void => {
    void generateMaze(true);
  }, [generateMaze]);

  if (!maze) {
    return (
      <div className={styles.page}>
        <div className="column">
          {initialLoadFailed ? (
            <button
              disabled={loading}
              onClick={requestFreshMaze}
              type="button"
            >
              {loading ? "generating..." : "retry"}
            </button>
          ) : (
            <p>Generating maze...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="column">
        <SandBoxMazeGraph
          algorithm={algorithm}
          className="mz-container"
          isGenerating={loading}
          maze={maze}
          onDecode={decodeCurrentUrl}
          onRefresh={requestFreshMaze}
        />
      </div>
    </div>
  );
}

export default function SandBox() {
  return (
    <GraphQLProvider>
      <SandboxController />
    </GraphQLProvider>
  );
}
