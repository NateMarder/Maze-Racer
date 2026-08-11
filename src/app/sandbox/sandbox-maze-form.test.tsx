import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SandboxMazeForm from "./sandbox-maze-form";

const defaultProps = {
  algorithm: "" as const,
  cols: 12,
  isGenerating: false,
  onAlgorithmChange: vi.fn(),
  onColsChange: vi.fn(),
  onRefresh: vi.fn(),
  onRowsChange: vi.fn(),
  rows: 12,
};

describe("SandboxMazeForm", () => {
  it("renders neutral algorithm and dimension options from 3 through 20", () => {
    const markup = renderToStaticMarkup(
      <SandboxMazeForm {...defaultProps} />,
    );

    expect(markup).toContain("Select algorithm");
    expect(markup.match(/value="3"/g)).toHaveLength(2);
    expect(markup.match(/value="20"/g)).toHaveLength(2);
    expect(markup).not.toContain('value="2"');
    expect(markup).toMatch(/<button[^>]*disabled=""/);
  });

  it("shows URL dimensions outside the selectable range without enabling refresh", () => {
    const markup = renderToStaticMarkup(
      <SandboxMazeForm {...defaultProps} cols={2} rows={2} />,
    );

    expect(markup.match(/2 \(from URL\)/g)).toHaveLength(2);
    expect(markup).toMatch(/<button[^>]*disabled=""/);
  });

  it("disables the complete fieldset while generation is in flight", () => {
    const markup = renderToStaticMarkup(
      <SandboxMazeForm
        {...defaultProps}
        algorithm="PRIM"
        isGenerating
      />,
    );

    expect(markup).toMatch(/<fieldset[^>]*disabled=""/);
    expect(markup).toContain("refreshing...");
  });
});
