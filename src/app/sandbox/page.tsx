'use client';

import styles from "../page.module.css";
import SandBoxMazeGraph from '../../maze/maze-graphs/sandbox-maze-graph';

export default function SandBox() {

  return (
    <div className={styles.page}>
      <div className="column">
        <SandBoxMazeGraph
          className="mz-container"
          height={600}
          width={600}
          spacing={40}
        />
    </div>
    </div>
  );
}
