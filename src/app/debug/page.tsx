'use client';

import styles from "../page.module.css";
import MazeGraph from '../../maze/maze-graph';

export default function Home() {

  return (
    <div className={styles.page}>
      <div className="column">
        <MazeGraph
          className="mz-container"
          height={800}
          width={800}
          level={1}
          spacing={60}
        />
    </div>
    </div>
  );
}
