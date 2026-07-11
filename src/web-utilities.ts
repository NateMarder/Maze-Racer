import { Coordinate, EncodedMaze } from "./maze/types";

export const getEncodedMazeDataFromUrlParams = (): EncodedMaze => {
    const urlParams = new URLSearchParams(window.location.search);
    const hexString = urlParams.get('h');
    const colsValue = urlParams.get('c');
    const rowsValue = urlParams.get('r');
    const levelValue = urlParams.get('l');
    const destinationX = urlParams.get('dx');
    const destinationY = urlParams.get('dy');
    const spacing = urlParams.get('s');

    interface MazeBundle {
        serialized: string,
        rows: number,
        cols: number,
        spacing: number,
        destination: Coordinate,
        level: number,
        start: Coordinate
    }

    const mazeBundle: MazeBundle = {
        serialized: hexString || "",
        rows: parseInt(rowsValue || "0"),
        cols: parseInt(colsValue || "0"),
        spacing: parseInt(spacing || "0"),
        destination: { x: parseInt(destinationX || "0"), y: parseInt(destinationY || "0") },
        level: parseInt(levelValue || "1"),
        start: { x: parseInt(spacing || "60") / 2, y: parseInt(spacing || "60") / 2 }, // since we always start in the top left, this one is calculated for now
    }

    return mazeBundle;
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

export const safeToRenderWithUrlParams = (): boolean => {
    if (typeof window === 'object') {
        const urlParams = new URLSearchParams(window.location.search);
        const hexString = urlParams.get('h') || "";
        return hexString.length > 0
    }

    return false;
}