import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background, Node, Edge} from 'reactflow';
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

const availableHobbies = [
    'Photography',
    'Painting',
    'Gardening',
    'Running',
    'Yoga',
    'Writing',
    'Dancing',
];

//for creating nodes and edges
const createNodesAndEdges = (users: User[]): { nodes: Node<NodeData>[]; edges: Edge[] } => {
    const nodes: Node<NodeData>[] = [];
    const edges: Edge[] = [];
    users.forEach((user, index) => {
        nodes.push({
            id: `user-${user.id}`,
            type: 'default',
            data: { label: `${user.name}, Age: ${user.age}`, id: user.id },
            position: { x: 50, y: index * 300 },
        });
        user.hobbies.forEach((hobby, hobbyIndex) => {
            const hobbyId = `hobby-${user.id}-${hobbyIndex}`;
            nodes.push({
                id: hobbyId,
                type: 'default',
                data: { label: hobby, id: hobby },
                position: { x: 300, y: index * 300 + hobbyIndex * 70 },
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

const Flow: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [search, setSearch] = useState('');
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const filteredHobbies = availableHobbies.filter((hobby) =>
        hobby.toLowerCase().includes(search.toLowerCase())
    );

//fetching data from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

// updating data
    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(users);
        setNodes(newNodes);
        setEdges(newEdges);
    }, [users]);

//drag and drop
    const handleDragStart = (event: React.DragEvent, hobby: string) => {
        event.dataTransfer.setData('hobby', hobby);
    };

//updating hobbies
    const handleDrop = async (event: React.DragEvent) => {
        const hobby = event.dataTransfer.getData('hobby');
        const userId = selectedNodeId?.replace('user-', '');
        if (userId && hobby) {
            try {
                const response = await fetch(`http://localhost:3000/users/${userId}/hobbies`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hobby }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API Response Error:', errorData);
                    throw new Error('Failed to update user hobbies');
                }
                const fetchUpdatedUsers = async () => {
                    const updatedResponse = await fetch('http://localhost:3000/users');
                    if (!updatedResponse.ok) throw new Error('Failed to fetch updated users');
                    const updatedUsers: User[] = await updatedResponse.json();
                    setUsers(updatedUsers); // Update the users state with the latest data
                };
                await fetchUpdatedUsers();
            } catch (error) {
                console.error('Failed to update hobby:', error);
                alert('Failed to update the database. Please try again.');
            }
        } else {
            console.warn('Invalid userId or hobby:', { userId, hobby });
        }
    };

//node click event for selecting user id
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        if (node.id.startsWith('user-')) {
            setSelectedNodeId(node.id);
            console.log('Selected user:', node.data.id);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '300px', padding: '10px', background: '#f4f4f4' }}>
                <h3>Available Hobbies</h3>
                <input
                    type="text"
                    placeholder="Search hobbies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
                />
                <ul>
                    {filteredHobbies.map((hobby) => (
                        <li
                            key={hobby}
                            draggable
                            onDragStart={(event) => handleDragStart(event, hobby)}
                            style={{ padding: '5px', cursor: 'grab' }}
                        >
                            {hobby}
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

export default Flow;
