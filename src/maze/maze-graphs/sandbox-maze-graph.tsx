"use client";

import React from "react";
import PlayerNode from "../player-node";
import { DestinationNode } from "../destination-node";
import { MazeWall } from "../wall/maze-wall";
import type { MazeState } from "../types";

export interface SandboxMazeGraphProps {
  className?: string;
  maze: MazeState;
}

export default function SandBoxMazeGraph({
  className,
  maze,
}: SandboxMazeGraphProps) {
  const mazeGraphRef = React.useRef<HTMLDivElement | null>(null);
  const { destination, height, spacing, start, width } = maze;
  const playerStart = start ?? {
    x: Math.round(spacing / 2),
    y: Math.round(spacing / 2),
  };
  const playerKey = [
    maze.codecVersion ?? "legacy",
    maze.serialized ?? maze.canonicalId ?? "maze",
    spacing,
  ].join(":");

  return (
    <div className={className} ref={mazeGraphRef}>
      <svg width={width} height={height} id="mz-svg">
        <MazeWall
          id="left-edge"
          x1="0"
          y1="0"
          x2="0"
          y2={height.toString()}
          className="outsidewall"
        />
        <MazeWall
          id="top-edge"
          x1="0"
          y1="0"
          x2={width.toString()}
          y2="0"
          className="outsidewall"
        />
        <MazeWall
          id="right-edge"
          x1={width.toString()}
          y1="0"
          x2={width.toString()}
          y2={height.toString()}
          className="outsidewall"
        />
        <MazeWall
          id="bottom-edge"
          x1="0"
          y1={height.toString()}
          x2={width.toString()}
          y2={height.toString()}
          className="outsidewall"
        />
        {maze.walls.map((wall) => (
          <MazeWall
            id={wall.id}
            key={wall.id}
            x1={wall.x1.toString()}
            x2={wall.x2.toString()}
            y1={wall.y1.toString()}
            y2={wall.y2.toString()}
            className="insidewall"
          />
        ))}
        <PlayerNode
          key={playerKey}
          cx={playerStart.x}
          cy={playerStart.y}
          r={Math.round(spacing * 0.1)}
          map={maze.nodes}
          destnodekey={`${destination.x}.${destination.y}`}
          offset={spacing}
          mzgraphref={mazeGraphRef}
        />
        <DestinationNode
          x={destination.x}
          y={destination.y}
          r={Math.round(spacing * 0.1)}
        />
      </svg>
    </div>
  );
}
