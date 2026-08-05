import { describe, expect, it } from "vitest";
import { MazeCodec } from "./maze/codec/maze-codec";
import { simpleMaze } from "./maze/codec/fixtures/simple-dfs-maze";
import {
    getEncodedMazeDataFromSearchParams,
    getSearchParamsFromEncodedMaze,
} from "./web-utilities";

describe("maze URL utilities", () => {
    it("writes and reads a v1 canonical maze URL", () => {
        const encoded = MazeCodec.encode(simpleMaze());
        const canonicalId = MazeCodec.getCanonicalId(encoded);
        const searchParams = getSearchParamsFromEncodedMaze(encoded);
        const parsed = getEncodedMazeDataFromSearchParams(searchParams);

        expect(searchParams.get("maze")).toBe(canonicalId);
        expect(searchParams.get("s")).toBe("60");
        expect(searchParams.has("l")).toBe(false);
        expect(searchParams.has("dx")).toBe(false);
        expect(searchParams.has("dy")).toBe(false);
        expect(parsed).toEqual(encoded);
    });

    it("continues to read unversioned legacy maze URLs and ignores retired level data", () => {
        const searchParams = new URLSearchParams(
            "h=69a9dc28&c=4&r=4&l=7&dx=30&dy=210&s=60",
        );
        const parsed = getEncodedMazeDataFromSearchParams(searchParams);

        expect(parsed).toEqual({
            version: 0,
            serialized: "69a9dc28",
            cols: 4,
            rows: 4,
            spacing: 60,
            start: { x: 30, y: 30 },
            destination: { x: 30, y: 210 },
        });
    });

    it("ignores retired level data in existing v1 URLs", () => {
        const encoded = MazeCodec.encode(simpleMaze());
        const searchParams = getSearchParamsFromEncodedMaze(encoded);
        searchParams.set("l", "7");

        expect(getEncodedMazeDataFromSearchParams(searchParams)).toEqual(
            encoded,
        );
    });
});
