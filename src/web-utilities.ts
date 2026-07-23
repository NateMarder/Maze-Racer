import { MazeCodec } from "./maze/codec/maze-codec";
import {
    AlgorithmKey,
    EncodedMaze,
    LegacyEncodedMaze,
} from "./maze/types";

const DEFAULT_MAZE_LEVEL = 1;
const DEFAULT_MAZE_SPACING = 60;

function getNumberParam(
    urlParams: URLSearchParams,
    key: string,
    fallback: number,
): number {
    const value = urlParams.get(key);

    if (value === null || value.trim() === "") {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export const getEncodedMazeDataFromSearchParams = (
    urlParams: URLSearchParams,
): EncodedMaze => {
    const canonicalId = urlParams.get("maze");
    const spacing = getNumberParam(
        urlParams,
        "s",
        DEFAULT_MAZE_SPACING,
    );
    const level = getNumberParam(
        urlParams,
        "l",
        DEFAULT_MAZE_LEVEL,
    );

    if (canonicalId) {
        return MazeCodec.parseCanonicalId(canonicalId, {
            spacing,
            level,
        });
    }

    const legacy: LegacyEncodedMaze = {
        version: 0,
        serialized: urlParams.get("h") ?? "",
        rows: getNumberParam(urlParams, "r", 0),
        cols: getNumberParam(urlParams, "c", 0),
        spacing,
        destination: {
            x: getNumberParam(urlParams, "dx", 0),
            y: getNumberParam(urlParams, "dy", 0),
        },
        level,
        start: {
            x: getNumberParam(urlParams, "sx", spacing / 2),
            y: getNumberParam(urlParams, "sy", spacing / 2),
        },
    };

    return legacy;
};

export const getEncodedMazeDataFromUrlParams = (): EncodedMaze =>
    getEncodedMazeDataFromSearchParams(
        new URLSearchParams(window.location.search),
    );

export const getSearchParamsFromEncodedMaze = (
    encoded: EncodedMaze,
): URLSearchParams => {
    const urlParams = new URLSearchParams();

    if (encoded.version === 1) {
        urlParams.set("maze", MazeCodec.getCanonicalId(encoded));
    } else {
        urlParams.set("h", encoded.serialized);
        urlParams.set("c", encoded.cols.toString());
        urlParams.set("r", encoded.rows.toString());
        urlParams.set("sx", encoded.start.x.toString());
        urlParams.set("sy", encoded.start.y.toString());
        urlParams.set("dx", encoded.destination.x.toString());
        urlParams.set("dy", encoded.destination.y.toString());
    }

    urlParams.set("l", encoded.level.toString());
    urlParams.set("s", encoded.spacing.toString());

    return urlParams;
};

export const updateWindowUrlWithoutReload = (encoded: EncodedMaze): void => {
    if (typeof window !== "object") {
        return;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.search = getSearchParamsFromEncodedMaze(encoded).toString();
    window.history.replaceState(null, "", currentUrl.toString());
};

export const safeToRenderWithUrlParams = (): boolean => {
    if (typeof window !== "object") {
        return false;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const canonicalId = urlParams.get("maze") ?? "";
    const legacyHex = urlParams.get("h") ?? "";

    return canonicalId.length > 0 || legacyHex.length > 0;
};

export const getRandomEngine = (): AlgorithmKey => {
    const possibleAlgorithms: AlgorithmKey[] = [
        "dfs",
        "prim",
        "eller",
    ];
    const randomIndex = Math.floor(Math.random() * possibleAlgorithms.length);

    return possibleAlgorithms[randomIndex];
};
