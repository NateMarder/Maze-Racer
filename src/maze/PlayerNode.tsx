'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { eventServer, events } from '../events/events';

// --- TypeScript Interfaces ---
interface MazeNode {
  key: string;
  siblingKeys: string[];
}

interface MoveArgs {
  x?: number;
  y?: number;
}

interface SendHomeArgs {
  x: number;
  y: number;
  graph: React.RefObject<SVGSVGElement | HTMLElement | null>;
}

interface PlayerNodeProps {
  cx: number;
  cy: number;
  r: number;
  offset: number;
  map: MazeNode[];
  destnodekey: string;
  mzgraphref: React.RefObject<SVGSVGElement | HTMLElement | null>;
}

const PlayerNode: React.FC<PlayerNodeProps> = (props) => {
  const { cx, cy, r, offset, map, destnodekey, mzgraphref } = props;

  // DOM Refs
  const userNodeRef = useRef<SVGCircleElement | null>(null);

  // Game state held in refs to prevent layout-thrashing re-renders
  const currentCoords = useRef({ x: cx, y: cy });
  const startCoords = useRef({ x: cx, y: cy });
  const targetKey = useRef<string>(destnodekey);
  const nodeMap = useRef<Record<string, Record<string, number>>>({});

  // Cooldown & Input states
  const cooldown = useRef<boolean>(false);
  const keyboardCoolDown = useRef<boolean>(false);
  const keyIsDown = useRef<boolean>(false);

  // Replaces the sequential .then() chain with a performant GSAP Timeline
  const sendPlayerHome = ({ x, y, graph }: SendHomeArgs) => {
    cooldown.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        cooldown.current = false;
        keyboardCoolDown.current = false;
        currentCoords.current = { x, y };
      }
    });

    // Spin the board (GPU-accelerated layout rotation)
    if (graph.current) {
      tl.to(graph.current, {
        rotation: '+=720',
        duration: 1.2,
        ease: 'power2.inOut',
      });
    }

    // Move player back to start position instantly/smoothly
    if (userNodeRef.current) {
      tl.to(userNodeRef.current, {
        x: 0, // Reset transform offsets back to initial base cx/cy
        y: 0,
        duration: 0.5,
        ease: 'power1.inOut',
      });
    }
  };

  const determineNextMove = (current: string, backwardsKey: string) => {
    const siblingKeys = Object.keys(nodeMap.current[current] || {});
    
    if (siblingKeys.length !== 2) {
      cooldown.current = false;
      return;
    }

    cooldown.current = true;
    const nextKey = siblingKeys.find(k => k !== backwardsKey);
    if (!nextKey) return;

    const [newX, newY] = nextKey.split('.').map(Number);
    const [oldX, oldY] = current.split('.').map(Number);

    if (newX !== oldX) {
      move({ x: newX < oldX ? -offset : offset });
    } else if (newY !== oldY) {
      move({ y: newY < oldY ? -offset : offset });
    }
  };

  const move = ({ x, y }: MoveArgs) => {
    const { x: curX, y: curY } = currentCoords.current;
    const currentKey = `${curX}.${curY}`;

    const nextX = curX + (x || 0);
    const nextY = curY + (y || 0);
    const newKey = `${nextX}.${nextY}`;

    // Wall collision detection check
    if (!nodeMap.current[currentKey]?.[newKey]) {
      return;
    }

    currentCoords.current = { x: nextX, y: nextY };

    // High performance GPU animation: animate layout offset via x/y instead of updating cx/cy DOM attributes
    const pixelOffsetX = nextX - startCoords.current.x;
    const pixelOffsetY = nextY - startCoords.current.y;

    gsap.to(userNodeRef.current, {
      x: pixelOffsetX,
      y: pixelOffsetY,
      duration: 0.05, // matches velocity 50ms speed
      ease: 'none',
      onComplete: () => {
        if (newKey === targetKey.current) {
          eventServer.emit(
            events.MAZEGAME.DESTFOUND,
            { x: startCoords.current.x, y: startCoords.current.y, graph: mzgraphref },
            sendPlayerHome
          );
        } else {
          determineNextMove(newKey, currentKey);
        }
      }
    });
  };

  const keyDownListener = (event: React.KeyboardEvent<SVGCircleElement>) => {
    if (cooldown.current || keyboardCoolDown.current || keyIsDown.current) return;

    keyboardCoolDown.current = true;
    keyIsDown.current = true;

    // Use standard event.key modern web standards instead of deprecated 'which'
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        move({ y: -offset });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        move({ y: offset });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        move({ x: offset });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        move({ x: -offset });
        break;
    }

    setTimeout(() => {
      keyboardCoolDown.current = false;
    }, 250);
  };

  useEffect(() => {
    if (!map) return;
    targetKey.current = destnodekey;

    if (userNodeRef.current) {
      userNodeRef.current.focus();
    }

    // Build optimized multi-dimensional graph adjacency map
    const builtMap: Record<string, Record<string, number>> = {};
    map.forEach((n) => {
      builtMap[n.key] = {};
      n.siblingKeys.forEach((k) => {
        builtMap[n.key][k] = 1;
      });
    });
    nodeMap.current = builtMap;
  }, [map, destnodekey]);

  return (
    <circle
      ref={userNodeRef}
      onKeyDown={keyDownListener}
      onKeyUp={() => { keyIsDown.current = false; }}
      onBlur={() => userNodeRef.current?.focus()}
      className="mz-node user-node"
      cx={cx}
      cy={cy}
      r={r}
      tabIndex={0}
      style={{ outline: 'none' }}
    />
  );
};

export default PlayerNode;