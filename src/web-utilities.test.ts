import { afterEach, describe, expect, it, vi } from "vitest";
import { MazeCodec } from "./maze/codec/maze-codec";
import { simpleMaze } from "./maze/codec/fixtures/simple-dfs-maze";
import {
    encodeCanonicalIdForUrlParams,
    getEncodedMazeDataFromSearchParams,
    getRandomEngine,
    getSearchParamsFromEncodedMaze,
} from "./web-utilities";

describe("maze URL utilities", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each([
        { randomValue: 0, expected: "DFS" },
        { randomValue: 0.34, expected: "PRIM" },
        { randomValue: 0.67, expected: "ELLER" },
    ])(
        "selects $expected from random value $randomValue",
        ({ randomValue, expected }) => {
            vi.spyOn(Math, "random").mockReturnValue(randomValue);

            expect(getRandomEngine()).toBe(expected);
        },
    );

    it("encodes a canonical ID as an appendable maze query string", () => {
        const canonicalId =
            "v1:4x4:e8e1cda0:start=0,0:end=3,3";
        const queryString = encodeCanonicalIdForUrlParams(canonicalId);
        const url = new URL(`https://maze.test/sandbox?${queryString}`);

        expect(queryString).toBe(
            "maze=v1%3A4x4%3Ae8e1cda0%3Astart%3D0%2C0%3Aend%3D3%2C3",
        );
        expect(url.searchParams.get("maze")).toBe(canonicalId);
        expect([...url.searchParams.keys()]).toEqual(["maze"]);
    });

    it("rejects an invalid canonical ID when creating URL params", () => {
        expect(() => encodeCanonicalIdForUrlParams(
            "v1:4x4:not-hex:start=0,0:end=3,3",
        )).toThrow("invalid canonical maze identifier");
    });

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

    it("keeps canonical identity stable across presentation spacings", () => {
        const canonicalId = MazeCodec.getCanonicalId(
            MazeCodec.encode(simpleMaze()),
        );
        const compactPresentation = MazeCodec.parseCanonicalId(
            canonicalId,
            { spacing: 40 },
        );
        const largePresentation = MazeCodec.parseCanonicalId(
            canonicalId,
            { spacing: 80 },
        );
        const compactParams = getSearchParamsFromEncodedMaze(
            compactPresentation,
        );
        const largeParams = getSearchParamsFromEncodedMaze(
            largePresentation,
        );

        expect(compactParams.get("maze")).toBe(canonicalId);
        expect(largeParams.get("maze")).toBe(canonicalId);
        expect(compactParams.get("s")).toBe("40");
        expect(largeParams.get("s")).toBe("80");
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
