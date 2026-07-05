import React from 'react';


interface MazeWallProps {
  id: string,
  x1: string,
  y1: string,
  x2: string, 
  y2: string,
  className?:string,
}

interface MazeWallFactoryProps {
  rows: number,
  cols: number,
  spacing: number,
  inactiveWallKeys: string[]
}


export const MazeWall = ({ id, x1, y1, x2, y2, className }:MazeWallProps) => {
  let specialClass = "mz-wall";
  if (className) {
    specialClass = `${specialClass} ${className}`;
  }
  
  return <line id={id} className={specialClass} x1={x1} y1={y1} x2={x2} y2={y2} />;
}

/**
 * 
 * @desription we use this to create a new maze - by creating all the possible
 * walls, and then filtering out the wallKeys we know shouldn't be their because
 * the of an orthogonal path crossing. 
 */
export const MazeWallFactory = ({ rows, cols, spacing, inactiveWallKeys }:MazeWallFactoryProps) => {
  const wallCache = [];
  let x1;
  let y1;
  let x2;
  let y2;
  for (let i = 1; i <= cols - 1; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      x1 = x2 = i * spacing;
      y1 = j * spacing;
      y2 = y1 + spacing;
      wallCache.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
    }
  }
  for (let i = 1; i <= rows - 1; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      y1 = y2 = i * spacing;
      x1 = j * spacing;
      x2 = x1 + spacing;
      wallCache.push({ id: `${x1}.${y1}.${x2}.${y2}`, x1, y1, x2, y2 });
    }
  }

  // only return
  const activeWalls = wallCache.filter(w => !inactiveWallKeys.includes(w.id));
  return activeWalls;
};
