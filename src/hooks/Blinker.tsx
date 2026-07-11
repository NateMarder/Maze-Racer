'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';


// 1. Custom hook to handle interval logic safely
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(null);

  // Remember the latest callback if it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        if (savedCallback.current) savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 2. Props interface for Blinky
interface BlinkyProps {
  children: ReactNode;
  interval?: number; // Optional prop, defaults to 500ms
}

// 3. The Blinky component
export default function Blinker({ children, interval = 500 }: BlinkyProps) {
  const [, setIsVisible] = useState(true);

  // Toggle visibility at the requested interval rate
  useInterval(() => {
    setIsVisible((prev) => !prev);
  }, interval);

  return (
    // <div style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.1s' }}>
    //   {children}
    // </div>


    <>
      {children}
    </>
  );
}