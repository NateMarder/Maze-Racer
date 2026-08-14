"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { GraphQLProvider } from "@/graphql/GraphQLProvider";
import { GENERATE_SANDBOX_MAZE } from "@/graphql/operations/generateSandboxMaze";
import { MazeCodec } from "@/maze/codec/maze-codec";
import SandBoxMazeGraph from "@/maze/maze-graphs/sandbox-maze-graph";
import SandboxMazeForm from "./sandbox-maze-form";
import type {
  AlgorithmSelection,
  MazeAlgorithm,
  MazeState,
} from "@/maze/types";
import {
  getEncodedMazeDataFromUrlParams,
  getRandomEngine,
  safeToRenderWithUrlParams,
  updateWindowUrlWithoutReload,
} from "@/web-utilities";

const DEFAULT_SPACING = 40;
const DEFAULT_ROW_COL_COUNT = 12;
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
  const [selectedRows, setSelectedRows] =
    useState(DEFAULT_ROW_COL_COUNT);
  const [selectedCols, setSelectedCols] =
    useState(DEFAULT_ROW_COL_COUNT);
  const [initialLoadFailed, setInitialLoadFailed] = useState(false);
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
    nextAlgorithm: MazeAlgorithm,
    rows: number,
    cols: number,
  ): Promise<boolean> => {
    if (requestInFlight.current) {
      return false;
    }

    requestInFlight.current = true;
    try {
      const result = await requestMaze({
        variables: {
          input: {
            algorithm: nextAlgorithm,
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
        spacing: DEFAULT_SPACING,
      });
      const decodedMaze = MazeCodec.decode(encodedMaze);

      pendingShareableUrl.current = {
        encodedMaze,
        maze: decodedMaze,
      };
      setMaze(decodedMaze);
      return true;
    } catch {
      window.alert(GENERATION_ERROR_MESSAGE);
      return false;
    } finally {
      requestInFlight.current = false;
    }
  }, [requestMaze]);

  useEffect(() => {
    const initializeTimer = window.setTimeout(() => {
      if (safeToRenderWithUrlParams()) {
        try {
          const decodedMaze = decodeMazeFromCurrentUrl();

          setMaze(decodedMaze);
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
        DEFAULT_ROW_COL_COUNT,
        DEFAULT_ROW_COL_COUNT,
      ).then((generated) => {
        if (!generated) {
          setInitialLoadFailed(true);
        }
      });
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

  const refreshMaze = (): void => {
    if (selectedAlgorithm === "") {
      return;
    }

    void generateMaze(selectedAlgorithm, selectedRows, selectedCols);
  };

  const retryInitialLoad = (): void => {
    const retryAlgorithm = selectedAlgorithm || getRandomEngine();
    setSelectedAlgorithm(retryAlgorithm);
    void generateMaze(retryAlgorithm, selectedRows, selectedCols);
  };

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
          className="sandbox-print-state-button"
          onClick={seeState}
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
