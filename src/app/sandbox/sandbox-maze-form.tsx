"use client";

import type { CSSProperties, FormEvent } from "react";
import type { AlgorithmKey } from "@/maze/types";

export type AlgorithmSelection = AlgorithmKey | "";

type SandboxMazeFormProps = {
  algorithm: AlgorithmSelection;
  cols: number;
  isGenerating: boolean;
  onAlgorithmChange: (algorithm: AlgorithmSelection) => void;
  onColsChange: (cols: number) => void;
  onRefresh: () => void;
  onRowsChange: (rows: number) => void;
  rows: number;
};

const MIN_DIMENSION = 3;
const MAX_DIMENSION = 20;
const dimensionOptions = Array.from(
  { length: MAX_DIMENSION - MIN_DIMENSION + 1 },
  (_, index) => MIN_DIMENSION + index,
);

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "whitesmoke"
};

const selectStyle: CSSProperties = {
  fontSize: "16px",
  minWidth: "130px",
  padding: "6px",
};

function hasSelectableDimension(value: number): boolean {
  return value >= MIN_DIMENSION && value <= MAX_DIMENSION;
}

function CurrentUrlDimension({ value }: { value: number }) {
  if (hasSelectableDimension(value)) {
    return null;
  }

  return (
    <option disabled value={value}>
      {value} (from URL)
    </option>
  );
}

export default function SandboxMazeForm({
  algorithm,
  cols,
  isGenerating,
  onAlgorithmChange,
  onColsChange,
  onRefresh,
  onRowsChange,
  rows,
}: SandboxMazeFormProps) {
  const canRefresh = algorithm !== ""
    && hasSelectableDimension(rows)
    && hasSelectableDimension(cols);

  const submitForm = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (canRefresh && !isGenerating) {
      onRefresh();
    }
  };

  return (
    <form
      onSubmit={submitForm}
      style={{ clear: "both", marginTop: "28px" }}
    >
      <fieldset
        disabled={isGenerating}
        style={{
          alignItems: "end",
          border: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          margin: 0,
          padding: 0,
        }}
      >
        <label style={fieldStyle}>
          Algorithm
          <select
            aria-label="Maze algorithm"
            onChange={(event) => onAlgorithmChange(
              event.target.value as AlgorithmSelection,
            )}
            style={selectStyle}
            value={algorithm}
          >
            <option value="">Select algorithm</option>
            <option value="dfs">DFS</option>
            <option value="prim">Prim</option>
            <option value="eller">Eller</option>
          </select>
        </label>
        <label style={fieldStyle}>
          Rows
          <select
            aria-label="Maze rows"
            onChange={(event) => onRowsChange(Number(event.target.value))}
            style={selectStyle}
            value={rows}
          >
            <CurrentUrlDimension value={rows} />
            {dimensionOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          Columns
          <select
            aria-label="Maze columns"
            onChange={(event) => onColsChange(Number(event.target.value))}
            style={selectStyle}
            value={cols}
          >
            <CurrentUrlDimension value={cols} />
            {dimensionOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <button
          disabled={!canRefresh || isGenerating}
          style={{
            cursor: canRefresh && !isGenerating ? "pointer" : "not-allowed",
            fontSize: "16px",
            padding: "7px 14px",
          }}
          type="submit"
        >
          {isGenerating ? "refreshing..." : "refresh"}
        </button>
      </fieldset>
    </form>
  );
}
