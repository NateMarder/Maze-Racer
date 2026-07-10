import { EncodedMaze, MazeState } from "../types";
import { MazeCodec } from "./mazeCodec";

export const getFullySerializedMazeForUrl = (mazeState: MazeState) => {
    const dataForEncoding = { ...mazeState };
    console.log("data we are seinding to encoder: ", dataForEncoding);
    const encodeResult = MazeCodec.encode(dataForEncoding);
    return encodeResult;
}

export const updateWindowUrlWithoutReload = (encoded: EncodedMaze) => {
    if (typeof window === 'object') {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("h", encoded.serialized);        // serialized hex representation of maze
        currentUrl.searchParams.set("c", encoded.cols.toString());              // col count
        currentUrl.searchParams.set("r", encoded.rows.toString());              // row count
        currentUrl.searchParams.set("l", encoded.level.toString());             // current level
        currentUrl.searchParams.set("dx", encoded.destination.x.toString());    // maze-finish x
        currentUrl.searchParams.set("dy", encoded.destination.y.toString());    // maze-finish y
        currentUrl.searchParams.set("s", encoded.spacing.toString());           // maze spacing (width of the paths, also same as measuring center of mazeNode to center of neighboring mazeNode)

        // 3. Update the browser URL bar without refreshing
        window.history.replaceState(null, '', currentUrl.toString());     // add the data to the URL, don't reload,
    }
}