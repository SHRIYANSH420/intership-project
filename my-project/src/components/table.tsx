import React, { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  age: number;
  hobbies: string[];
}

const Table: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  //fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  //delete user
  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      alert("User deleted successfully");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert("Failed to delete user. Try again!");
    }
  };

  //edit user
  const editUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  //update user
  const updateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      alert("User updated successfully");
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setShowForm(false);
      setEditingUser(null);
    } catch (err: any) {
      alert("Failed to update user. Try again!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Age</th>
                  <th className="border border-gray-300 px-4 py-2">Hobbies</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {user.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {user.age}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.hobbies.join(", ")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => editUser(user)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && editingUser && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(editingUser);
                }}
              >
                <div className="mb-4">
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                    className="border border-gray-300 rounded w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Age</label>
                  <input
                    type="number"
                    value={editingUser.age}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, age: Number(e.target.value) })
                    }
                    className="border border-gray-300 rounded w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Hobbies</label>
                  <input
                    type="text"
                    value={editingUser.hobbies.join(", ")}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        hobbies: e.target.value.split(",").map((hobby) => hobby.trim()),
                      })
                    }
                    className="border border-gray-300 rounded w-full p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
