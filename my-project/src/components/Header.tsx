import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div>
      <button
          onClick={() => navigate("/table")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Users Table
        </button>
        <button
          onClick={() => navigate("/userform")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Add User
        </button>
        <button
          onClick={() => navigate("/flow")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          User Flow
        </button>
      </div>
    </header>
  );
};

export default Header;
