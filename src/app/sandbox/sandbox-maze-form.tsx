"use client";

import type { FormEvent } from "react";
import type { AlgorithmSelection } from "@/maze/types";

interface SandboxMazeFormProps {
  algorithm: AlgorithmSelection;
  cols: number;
  isGenerating: boolean;
  onAlgorithmChange: (algorithm: AlgorithmSelection) => void;
  onColsChange: (cols: number) => void;
  onRefresh: () => void;
  onRowsChange: (rows: number) => void;
  rows: number;
}

const MIN_DIMENSION = 3;
const MAX_DIMENSION = 20;
const dimensionOptions = Array.from(
  { length: MAX_DIMENSION - MIN_DIMENSION + 1 },
  (_, index) => MIN_DIMENSION + index,
);

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
      className="sandbox-maze-form"
      onSubmit={submitForm}
    >
      <fieldset
        className="sandbox-maze-form-fields"
        disabled={isGenerating}
      >
        <label className="sandbox-maze-form-field">
          Algorithm
          <select
            aria-label="Maze algorithm"
            className="sandbox-maze-form-select"
            onChange={(event) => onAlgorithmChange(
              event.target.value as AlgorithmSelection,
            )}
            value={algorithm}
          >
            <option value="">Select algorithm</option>
            <option value="DFS">DFS</option>
            <option value="PRIM">Prim</option>
            <option value="ELLER">Eller</option>
          </select>
        </label>
        <label className="sandbox-maze-form-field">
          Rows
          <select
            aria-label="Maze rows"
            className="sandbox-maze-form-select"
            onChange={(event) => onRowsChange(Number(event.target.value))}
            value={rows}
          >
            <CurrentUrlDimension value={rows} />
            {dimensionOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <label className="sandbox-maze-form-field">
          Columns
          <select
            aria-label="Maze columns"
            className="sandbox-maze-form-select"
            onChange={(event) => onColsChange(Number(event.target.value))}
            value={cols}
          >
            <CurrentUrlDimension value={cols} />
            {dimensionOptions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
        <button
          className="sandbox-maze-refresh-button"
          disabled={!canRefresh || isGenerating}
          type="submit"
        >
          {isGenerating ? "refreshing..." : "refresh"}
        </button>
      </fieldset>
    </form>
  );
}
