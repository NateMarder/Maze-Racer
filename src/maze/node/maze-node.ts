'use client';
import { MazeNode as MazeNodeProps } from '../types'


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
