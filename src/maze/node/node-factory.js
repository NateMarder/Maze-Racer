import mazeNode from './maze-node';

export default class NodeFactory {
  buildNodeArray = ({ rows, cols, spacing }) => {
    const arrayOfNodes = [];
    const offset = spacing / 2;
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const x = i * spacing + offset;
        const y = j * spacing + offset
        arrayOfNodes.push(
          new mazeNode({
            x: x,
            y: y,
            isStart: i + j === 0,
            isDest: false,
            isVisited: false,
            key: `${x}.${y}`
          }),
        );
      }
    }
    return arrayOfNodes;
  };

  addSiblings = ({ rows, cols, spacing, nodeArray }) => {
    let x1;
    let x2;
    let y1;
    let y2;

    const offset = Math.round(spacing / 2);
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows - 1; j += 1) {
        const x = i * spacing + offset;
        y1 = j * spacing + offset;
        y2 = y1 + spacing;
        this.bindNodes([`${x}.${y1}`, `${x}.${y2}`], nodeArray);
      }
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols - 1; j += 1) {
        const y = i * spacing + offset;
        x1 = j * spacing + offset;
        x2 = x1 + spacing;
        this.bindNodes([`${x1}.${y}`, `${x2}.${y}`], nodeArray);
      }
    }

    return nodeArray;
  };

  bindNodes = ([key1, key2], nodeArray) => {
    const nodeRef1 = nodeArray.find(n => n.key === key1);
    const nodeRef2 = nodeArray.find(n => n.key === key2);

    nodeRef1.siblingKeys.push(nodeRef2.key);
    nodeRef2.siblingKeys.push(nodeRef1.key);
    nodeRef1.siblingKeys = [...new Set(nodeRef1.siblingKeys)]
    nodeRef2.siblingKeys = [...new Set(nodeRef2.siblingKeys)]
  };

  getNodes({ rows, cols, spacing }) {
    let nodeArray = this.buildNodeArray({ rows, cols, spacing });

    return this.addSiblings({
      rows,
      cols,
      spacing,
      nodeArray,
    });
  }

  getNodesWithoutSiblings({ rows, cols, spacing }) {
    const nodeArray = this.buildNodeArray({ rows, cols, spacing });
    return nodeArray;
  }
}
