import React from 'react';
import Blinker from '../hooks/Blinker';

interface DestinationProps {
  x: number,
  y: number,
  r: number
}
export function DestinationNode({ x, y, r }: DestinationProps) {
  return (
    <Blinker interval={600}>
      <circle className="mz-node dest-node" cx={x} cy={y} r={r} />
    </Blinker>
  )
}
