'use client';

import styles from "../page.module.css";
import MazeGraph from '../../maze/MazeGraph';

export default function Home() {

  return (
    <div className={styles.page}>
      <div className="column">
        <MazeGraph
          className="mz-container"
          height={800}
          width={800}
          level={1}
        />
    </div>
    </div>
  );
}
