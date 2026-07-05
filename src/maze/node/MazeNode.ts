'use client';
import React from "react";


interface MazeNodeProps {
  x: number;
  y: number;
  isStart: boolean;
  isDest: boolean;
  disoveredBy: any;
  destnodekey: string;
  mzgraphref: React.RefObject<SVGSVGElement | HTMLElement | null>;
  siblingKeys?: string[];
  pathDirections?: string[];
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
