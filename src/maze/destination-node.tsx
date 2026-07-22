"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface DestinationProps {
  x: number,
  y: number,
  r: number
}


export function DestinationNode({ x, y, r }: DestinationProps) {

  const svgRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const circle = svgRef.current;

    if (!circle) return;
    
    const context = gsap.context(() => {
      gsap.to(circle, {
        opacity: 0,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, circle);

    return () => context.revert();
  }, [])

  return (<circle ref={svgRef} className="mz-node dest-node" cx={x} cy={y} r={r} />)
}
