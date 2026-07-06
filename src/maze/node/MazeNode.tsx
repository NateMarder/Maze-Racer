'use client';
import React, { useRef } from "react";


interface MazeNodeProps {
  x: number;
  y: number;
  isStart: boolean;
  isDest: boolean;
  disoveredBy: any;
  destnodekey: string;
  mzgraphref: React.RefObject<SVGSVGElement | HTMLElement | null>;
  siblingKeys?: string[];
  pathDirections?: number[];
}

export const TestMazeNode = ({ x, y, isStart, isDest, disoveredBy, siblingKeys, pathDirections }: MazeNodeProps) => {
  const currentKey = `${x}.${y}`;
  const stateRef = useRef({key:currentKey, x, y, isStart, isDest, disoveredBy, siblingKeys, pathDirections });

  return (<div onClick={() => console.log(stateRef.current.key)}>{currentKey}</div>);
}

export default class MazeNode {
  key
  isVisited
  isDest
  isStart
  distFromStart
  discoveredBy
  siblingKeys
  pathDirections

  constructor({ x, y, isStart, isDest, disoveredBy, siblingKeys, pathDirections }: MazeNodeProps) {
    this.key = `${+x}.${+y}`;
    this.isVisited = false;
    this.isDest = isDest;
    this.isStart = isStart;
    this.distFromStart = 0;
    this.discoveredBy = disoveredBy;
    this.siblingKeys = siblingKeys ?? [];
    this.pathDirections = pathDirections ?? [];
  }
}
