import React, { useState } from 'react';

interface SidebarProps {
  availableHobbies: string[];
  onDragStart: (event: React.DragEvent, hobby: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ availableHobbies, onDragStart }) => {
  const [search, setSearch] = useState('');

  const filteredHobbies = availableHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
            onDragStart={(event) => onDragStart(event, hobby)}
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
  );
};

export default Sidebar;
