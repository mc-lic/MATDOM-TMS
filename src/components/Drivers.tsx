import React, { useState, useEffect } from "react";
import { Driver } from "../types";

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    status: "Dostępny" as "Dostępny" | "W trasie" | "Na urlopie",
  });

  useEffect(() => {
    const storedDrivers = localStorage.getItem("drivers");
    if (storedDrivers) setDrivers(JSON.parse(storedDrivers));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Driver = {
      id: `D${Math.floor(Math.random() * 10000)}`,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      status: formData.status,
    };
    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    setFormData({ fullName: "", phoneNumber: "", status: "Dostępny" });
    setIsModalOpen(false);
  };

  const availableDriversCount = drivers.filter((driver) => driver.status === "Dostępny").length;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Kierowcy</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj kierowcę
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Imię i nazwisko</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Telefon</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">Brak kierowców</td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{driver.fullName}</td>
                  <td className="p-4 text-gray-800">{driver.phoneNumber}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        driver.status === "Dostępny"
                          ? "bg-green-100 text-green-800"
                          : driver.status === "W trasie"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Dostępni kierowcy: <span className="font-semibold">{availableDriversCount}</span>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Dodaj nowego kierowcę</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium">Imię i nazwisko</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium">Telefon</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium">Status</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  >
                    <option value="Dostępny">Dostępny</option>
                    <option value="W trasie">W trasie</option>
                    <option value="Na urlopie">Na urlopie</option>
                  </select>
                </div>
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

export default Drivers;