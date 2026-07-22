import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/**/*.test.{js,jsx,ts,tsx}",
        "src/**/fixtures/**",
      ],
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "coverage",
    },
  },
});