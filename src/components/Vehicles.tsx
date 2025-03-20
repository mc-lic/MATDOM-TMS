import React, { useState, useEffect } from "react";
import { Vehicle } from "../types";

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    registration: "",
    type: "",
    capacity: "",
    status: "Dostępny" as "Dostępny" | "W użyciu" | "W naprawie",
  });

  useEffect(() => {
    const storedVehicles = localStorage.getItem("vehicles");
    if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: `V${Math.floor(Math.random() * 10000)}`,
      registration: formData.registration,
      type: formData.type,
      capacity: parseFloat(formData.capacity),
      status: formData.status,
    };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    setFormData({ registration: "", type: "", capacity: "", status: "Dostępny" });
    setIsModalOpen(false);
  };

  const availableVehiclesCount = vehicles.filter((vehicle) => vehicle.status === "Dostępny").length;

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Pojazdy</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj pojazd
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Rejestracja</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Typ</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Ładowność</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Brak pojazdów</td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{vehicle.registration}</td>
                  <td className="p-4 text-gray-800">{vehicle.type}</td>
                  <td className="p-4 text-gray-800">{vehicle.capacity} kg</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === "Dostępny"
                          ? "bg-green-100 text-green-800"
                          : vehicle.status === "W użyciu"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Dostępne pojazdy: <span className="font-semibold">{availableVehiclesCount}</span>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Dodaj nowy pojazd</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="registration" className="block text-sm font-medium">Rejestracja</label>
                  <input
                    type="text"
                    id="registration"
                    value={formData.registration}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium">Typ</label>
                  <input
                    type="text"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium">Ładowność (kg)</label>
                  <input
                    type="number"
                    id="capacity"
                    value={formData.capacity}
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
                    <option value="W użyciu">W użyciu</option>
                    <option value="W naprawie">W naprawie</option>
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

export default Vehicles;