import React from 'react';

interface MazeWallProps {
  id: string,
  x1: string,
  y1: string,
  x2: string,
  y2: string,
  className?:string,
}

export const MazeWall = ({ id, x1, y1, x2, y2, className }:MazeWallProps) => {
  let specialClass = "mz-wall";
  if (className) {
    specialClass = `${specialClass} ${className}`;
  }

  return <line id={id} className={specialClass} x1={x1} y1={y1} x2={x2} y2={y2} />;
}
