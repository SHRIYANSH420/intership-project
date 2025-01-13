import React from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface NodeData {
  label: string;
}

const userData: User[] = [
  { id: '1', username: 'Alice', age: 25, hobbies: ['Reading', 'Cycling'] },
  { id: '2', username: 'Bob', age: 30, hobbies: ['Cooking', 'Gaming'] },
  { id: '3', username: 'Charlie', age: 22, hobbies: ['Swimming', 'Hiking'] },
];

const createNodesAndEdges = (): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  userData.forEach((user, index) => {
    // Add user node
    nodes.push({
      id: `user-${user.id}`,
      type: 'default',
      data: { label: `${user.username}, Age: ${user.age}` },
      position: { x: 100, y: index * 150 },
    });

    // Add hobby nodes and edges
    user.hobbies.forEach((hobby, hobbyIndex) => {
      const hobbyId = `hobby-${user.id}-${hobbyIndex}`;
      nodes.push({
        id: hobbyId,
        type: 'default',
        data: { label: hobby },
        position: { x: 300, y: index * 150 + hobbyIndex * 50 },
      });

      edges.push({
        id: `edge-${user.id}-${hobbyIndex}`,
        source: `user-${user.id}`,
        target: hobbyId,
      });
    });
  });

  return { nodes, edges };
};

const UserFlow: React.FC = () => {
  const { nodes, edges } = createNodesAndEdges();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow<NodeData>
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default UserFlow;
