import {
    GridCoordinate,
    SvgCoordinate,
} from "../types";

/**
 * This file helps us de-couple the canonical representation of a maze from the 
 * presentation details. Serialization uses zero-based grid cells. Presentation logic
 * take the maze-spacing into account while creating the coordinates needed by the SVG 
 * elements. 
 */

function assertValidSpacing(spacing: number): void {
    if (!Number.isFinite(spacing) || spacing <= 0) {
        throw new Error("maze spacing must be a positive number");
    }
}

export function toGridCoordinate(
    coordinate: SvgCoordinate,
    spacing: number,
): GridCoordinate {
    assertValidSpacing(spacing);

    const offset = spacing / 2;
    const x = (coordinate.x - offset) / spacing;
    const y = (coordinate.y - offset) / spacing;

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
        throw new Error(
            `SVG coordinate ${coordinate.x},${coordinate.y} is not centered on the maze grid`,
        );
    }

    return { x, y };
}

export function toSvgCoordinate(
    coordinate: GridCoordinate,
    spacing: number,
): SvgCoordinate {
    assertValidSpacing(spacing);

    const offset = spacing / 2;

    return {
        x: coordinate.x * spacing + offset,
        y: coordinate.y * spacing + offset,
    };
}

export function assertGridCoordinateInBounds(
    coordinate: GridCoordinate,
    cols: number,
    rows: number,
    label: string,
): void {
    const isIntegerCoordinate = Number.isInteger(coordinate.x)
        && Number.isInteger(coordinate.y);
    const isInBounds = coordinate.x >= 0
        && coordinate.x < cols
        && coordinate.y >= 0
        && coordinate.y < rows;

    if (!isIntegerCoordinate || !isInBounds) {
        throw new Error(
            `${label} coordinate ${coordinate.x},${coordinate.y} is outside the ${cols}x${rows} maze`,
        );
    }
}
