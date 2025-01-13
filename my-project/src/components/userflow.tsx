import React, { useState, useEffect } from 'react';
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
  id: string;
}

const initialUsers: User[] = [
  { id: '1', username: 'Shriyansh', age: 22, hobbies: ['Reading', 'Cycling'] },
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
    nodes.push({
      id: `user-${user.id}`,
      type: 'default',
      data: { label: `${user.username}, Age: ${user.age}`, id: user.id },
      position: { x: 50, y: index * 150 },
    });

    user.hobbies.forEach((hobby, hobbyIndex) => {
      const hobbyId = `hobby-${user.id}-${hobbyIndex}`;
      nodes.push({
        id: hobbyId,
        type: 'default',
        data: { label: hobby, id: hobby },
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
  const [search, setSearch] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Track selected node

  const filteredHobbies = availableHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (event: React.DragEvent, hobby: string) => {
    event.dataTransfer.setData('hobby', hobby);
  };

  const handleDrop = (event: React.DragEvent) => {
    const hobby = event.dataTransfer.getData('hobby');
    const reactFlowBounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    // Assume the first user gets the hobby
    const userId = users[0]?.id;
    if (userId && hobby) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, hobbies: [...user.hobbies, hobby] } : user
        )
      );
    }
  };

  // Handle Backspace key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace' && selectedNodeId) {
      const { nodes, edges } = createNodesAndEdges(users);

      // Check if the selected node is a hobby node
      const hobbyNode = nodes.find((node) => node.id === selectedNodeId);
      if (hobbyNode && hobbyNode.id.startsWith('hobby-')) {
        const userId = hobbyNode.id.split('-')[1]; // Extract the userId from hobby node ID
        const hobbyIndex = hobbyNode.id.split('-')[2]; // Extract the hobby index from hobby node ID

        // Remove the hobby from the user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, hobbies: user.hobbies.filter((_, index) => index !== parseInt(hobbyIndex)) }
              : user
          )
        );

        // Remove the hobby node and associated edge
        const newNodes = nodes.filter((node) => node.id !== selectedNodeId);
        const newEdges = edges.filter((edge) => edge.source !== hobbyNode.id && edge.target !== hobbyNode.id);

        // Set new nodes and edges
        // ReactFlow state update
        setNodes(newNodes);
        setEdges(newEdges);
      }
    }
  };

  const { nodes, edges } = createNodesAndEdges(users);

  // Set up keydown listener on mount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNodeId, users]);

  // Handle node click to select
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', padding: '10px', background: '#f4f4f4' }}>
        <h3>Available Hobbies</h3>
        <input
          type="text"
          placeholder="Search hobbies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '5px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredHobbies.map((hobby) => (
            <li
              key={hobby}
              draggable
              onDragStart={(event) => handleDragStart(event, hobby)}
              style={{
                padding: '5px',
                margin: '5px 0',
                background: '#ddd',
                cursor: 'grab',
                borderRadius: '5px',
              }}
            >
              {hobby}
            </li>
          ))}
        </ul>
      </div>

      {/* React Flow */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          fitView
          onNodeClick={onNodeClick} // Track selected node
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
