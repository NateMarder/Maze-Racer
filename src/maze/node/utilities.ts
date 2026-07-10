import { MazeNode, MazeState, NodeKey } from "../types";

export const getNodesWithConnectedSiblingsBasedOnPath = ({ nodes, allPaths }: MazeState): MazeNode[] => {

    const clonedNodes: MazeNode[] = [...new Set(nodes)].map(mazeNode => {
        return { ...mazeNode, siblingKeys: [] };
    })

    for (let p = 0; p < allPaths.length; p++) {
        const [node1Key, node2Key] = allPaths[p].nodeKeys.map(String);
        const nodeRef1 = clonedNodes.find(n => n.key === node1Key);
        const nodeRef2 = clonedNodes.find(n => n.key === node2Key);
        if (nodeRef1 && nodeRef2) {
            const newKey1: NodeKey = nodeRef1.key;
            const newKey2: NodeKey = nodeRef2.key;
            nodeRef1.siblingKeys.push(newKey2);
            nodeRef2.siblingKeys.push(newKey1);
        }
    }

    return clonedNodes;
}