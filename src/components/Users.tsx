import React, { useState, useEffect } from "react";
import { User, Branch } from "../types";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user" as "admin" | "user",
    branchId: "",
  });

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedBranches = localStorage.getItem("branches");
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedBranches) setBranches(JSON.parse(storedBranches));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `U${Math.floor(Math.random() * 10000)}`,
      username: formData.username,
      password: formData.password, // W rzeczywistym systemie należy hashować hasła!
      role: formData.role,
      branchId: formData.role === "admin" ? undefined : formData.branchId,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setFormData({ username: "", password: "", role: "user", branchId: "" });
    setIsModalOpen(false);
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Użytkownicy</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj użytkownika
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Nazwa użytkownika</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Rola</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Oddział</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Brak użytkowników</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{user.username}</td>
                  <td className="p-4 text-gray-800">{user.role === "admin" ? "Administrator" : "Użytkownik"}</td>
                  <td className="p-4 text-gray-800">
                    {user.branchId ? branches.find((b) => b.id === user.branchId)?.name || "-" : "Brak"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Dodaj nowego użytkownika</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium">Nazwa użytkownika</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium">Hasło</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium">Rola</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  >
                    <option value="admin">Administrator</option>
                    <option value="user">Użytkownik</option>
                  </select>
                </div>
                {formData.role === "user" && (
                  <div>
                    <label htmlFor="branchId" className="block text-sm font-medium">Oddział</label>
                    <select
                      id="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border rounded"
                      required
                    >
                      <option value="">Wybierz oddział</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Zapisz
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Users;