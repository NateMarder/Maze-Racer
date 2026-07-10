'use client';
import React from "react";
import { MazeNode as MazeNodeProps } from '../types'


// interface MazeNodeProps {
//   x: number;
//   y: number;
//   isStart: boolean;
//   isDest: boolean;
//   disoveredBy?: any;
//   destnodekey: string;
//   mzgraphref: React.RefObject<SVGSVGElement | HTMLElement | null>;
//   siblingKeys?: string[];
//   pathDirections?: string[];
// }

export default class MazeNode {
  key
  isVisited
  isDest
  isStart
  distFromStart
  discoveredBy
  siblingKeys
  pathDirections
  x
  y

  constructor({ x, y, isStart, isDest, discoveredBy, siblingKeys, pathDirections }: MazeNodeProps) {
    this.key = `${+x}.${+y}`;
    this.isVisited = false;
    this.isDest = isDest || false;
    this.isStart = isStart || false;
    this.distFromStart = 0;
    this.discoveredBy = discoveredBy ?? "";
    this.siblingKeys = siblingKeys ?? [];
    this.pathDirections = pathDirections ?? [];
    this.x = x;
    this.y = y;
  }
}
