import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'reactflow';
import Sidebar from './Sidebar';
import 'reactflow/dist/style.css';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface NodeData {
  label: string;
  id: string;
}

const initialUsers: User[] = [
  { id: '1', username: 'Alice', age: 25, hobbies: ['Reading', 'Cycling'] },
  { id: '2', username: 'Bob', age: 30, hobbies: ['Cooking', 'Gaming'] },
  { id: '3', username: 'Charlie', age: 22, hobbies: ['Swimming', 'Hiking'] },
  { id: '4', username: 'Shriyansh', age: 22, hobbies: ['killing', 'iking'] },
];

const availableHobbies = [
  'Photography',
  'Painting',
  'Gardening',
  'Running',
  'Yoga',
  'Writing',
  'Dancing',
];

const createNodesAndEdges = (users: User[]): { nodes: Node<NodeData>[]; edges: Edge[] } => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  users.forEach((user, index) => {
    // Add user node
    nodes.push({
      id: `user-${user.id}`,
      type: 'default',
      data: { label: `${user.username}, Age: ${user.age}`, id: user.id },
      position: { x: 100, y: index * 150 },
    });

    // Add hobby nodes and edges
    user.hobbies.forEach((hobby, hobbyIndex) => {
      const hobbyId = `hobby-${user.id}-${hobbyIndex}`;
      nodes.push({
        id: hobbyId,
        type: 'default',
        data: { label: hobby, id: '' },
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
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleDragStart = (event: React.DragEvent, hobby: string) => {
    event.dataTransfer.setData('hobby', hobby);
  };

  const handleDrop = (event: React.DragEvent, nodeId: string) => {
    const hobby = event.dataTransfer.getData('hobby');
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === nodeId ? { ...user, hobbies: [...user.hobbies, hobby] } : user
      )
    );
  };

  const { nodes, edges } = createNodesAndEdges(users);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for draggable hobbies */}
      <Sidebar availableHobbies={availableHobbies} onDragStart={handleDragStart} />
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onDrop: (event: React.DragEvent) => handleDrop(event, node.data.id),
            },
          }))}
          edges={edges}
          onNodeDragStop={(event, node) => {
            if (node.data.id) handleDrop(event, node.data.id);
          }}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default UserFlow;
