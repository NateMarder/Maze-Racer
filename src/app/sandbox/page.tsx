"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { GraphQLProvider } from "@/graphql/GraphQLProvider";
import { GENERATE_SANDBOX_MAZE } from "@/graphql/operations/generateSandboxMaze";
import { MazeCodec } from "@/maze/codec/maze-codec";
import SandBoxMazeGraph from "@/maze/maze-graphs/sandbox-maze-graph";
import SandboxMazeForm, {
  type AlgorithmSelection,
} from "./sandbox-maze-form";
import type {
  AlgorithmKey,
  MazeAlgorithm,
  MazeState,
} from "@/maze/types";
import {
  getEncodedMazeDataFromUrlParams,
  getRandomEngine,
  safeToRenderWithUrlParams,
  updateWindowUrlWithoutReload,
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

function SandboxController() {
  const [maze, setMaze] = useState<MazeState | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmSelection>("");
  const [selectedRows, setSelectedRows] = useState(SANDBOX_ROWS);
  const [selectedCols, setSelectedCols] = useState(SANDBOX_COLS);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
  const initialLoadStarted = useRef(false);
  const requestInFlight = useRef(false);
  const pendingShareableUrl = useRef<{
    encodedMaze: ReturnType<typeof MazeCodec.parseCanonicalId>;
    maze: MazeState;
  } | null>(null);
  const [requestMaze, { loading }] = useLazyQuery(
    GENERATE_SANDBOX_MAZE,
    {
      fetchPolicy: "no-cache",
    },
  );

  const generateMaze = useCallback(async (
    nextAlgorithm: AlgorithmKey,
    rows: number,
    cols: number,
  ): Promise<void> => {
    if (requestInFlight.current) {
      return;
    }

    requestInFlight.current = true;
    try {
      const result = await requestMaze({
        variables: {
          input: {
            algorithm: GRAPHQL_ALGORITHM[nextAlgorithm],
            rows,
            cols,
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

      pendingShareableUrl.current = {
        encodedMaze,
        maze: decodedMaze,
      };
      setMaze(decodedMaze);
      setInitialLoadFailed(false);
    } catch {
      setInitialLoadFailed(true);
      window.alert(GENERATION_ERROR_MESSAGE);
    } finally {
      requestInFlight.current = false;
    }
  }, [requestMaze]);

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
          const decodedMaze = decodeMazeFromCurrentUrl();

          setMaze(decodedMaze);
          setSelectedAlgorithm("");
          setSelectedRows(decodedMaze.rows);
          setSelectedCols(decodedMaze.cols);
        } catch {
          setInitialLoadFailed(true);
          window.alert(DECODE_ERROR_MESSAGE);
        }
        return;
      }

      const defaultAlgorithm = getRandomEngine();
      setSelectedAlgorithm(defaultAlgorithm);
      void generateMaze(
        defaultAlgorithm,
        SANDBOX_ROWS,
        SANDBOX_COLS,
      );
    }, 0);

    return () => window.clearTimeout(initializeTimer);
  }, [generateMaze]);

  useEffect(() => {
    const pendingUrl = pendingShareableUrl.current;

    if (!maze || !pendingUrl || pendingUrl.maze !== maze) {
      return;
    }

    updateWindowUrlWithoutReload(pendingUrl.encodedMaze);
    pendingShareableUrl.current = null;
  }, [maze]);

  const refreshMaze = useCallback((): void => {
    if (selectedAlgorithm === "") {
      return;
    }

    void generateMaze(selectedAlgorithm, selectedRows, selectedCols);
  }, [generateMaze, selectedAlgorithm, selectedCols, selectedRows]);

  const retryInitialLoad = useCallback((): void => {
    const retryAlgorithm = selectedAlgorithm || getRandomEngine();
    setSelectedAlgorithm(retryAlgorithm);
    void generateMaze(retryAlgorithm, selectedRows, selectedCols);
  }, [generateMaze, selectedAlgorithm, selectedCols, selectedRows]);

  const seeState = (): void => {
    console.log("\nstate:", maze);
  };

  if (!maze) {
    return (
      <div className={styles.page}>
        <div className="column">
          {initialLoadFailed ? (
            <button
              disabled={loading}
              onClick={retryInitialLoad}
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
        <div className={styles.mazeStage}>
          <SandBoxMazeGraph
            className="mz-container"
            maze={maze}
          />
        </div>
        <SandboxMazeForm
          algorithm={selectedAlgorithm}
          cols={selectedCols}
          isGenerating={loading}
          onAlgorithmChange={setSelectedAlgorithm}
          onColsChange={setSelectedCols}
          onRefresh={refreshMaze}
          onRowsChange={setSelectedRows}
          rows={selectedRows}
        />
        <button
          onClick={seeState}
          style={{
            color: "magenta",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "12px",
            padding: "5px",
          }}
          type="button"
        >
          print state
        </button>
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
