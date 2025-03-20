import React, { useState, useEffect } from "react";
import { TransportOrder, Vehicle, Driver, User, Branch } from "../types";

interface OrderModalProps {
  closeModal: () => void;
  addOrUpdateOrder: (order: TransportOrder) => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  branches: Branch[];
  editingOrder: TransportOrder | null;
  currentUser: User;
}

const OrderModal: React.FC<OrderModalProps> = ({
  closeModal,
  addOrUpdateOrder,
  vehicles,
  drivers,
  branches,
  editingOrder,
  currentUser,
}) => {
  const [formData, setFormData] = useState<{
    clientName: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupDate: string;
    deliveryDate: string;
    cargoType: string;
    cargoWeight: string;
    vehicleType: string;
    vehicleId: string;
    driverId: string;
    branchId: string;
    distance: string; // Nowe pole
    status: "Oczekujące" | "W realizacji" | "Zakończone";
  }>({
    clientName: "",
    pickupAddress: "",
    deliveryAddress: "",
    pickupDate: "",
    deliveryDate: "",
    cargoType: "",
    cargoWeight: "",
    vehicleType: "",
    vehicleId: "",
    driverId: "",
    branchId: currentUser.role === "admin" ? "" : currentUser.branchId || "",
    distance: "",
    status: "Oczekujące",
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        clientName: editingOrder.clientName,
        pickupAddress: editingOrder.pickupAddress,
        deliveryAddress: editingOrder.deliveryAddress,
        pickupDate: editingOrder.pickupDate.slice(0, 16),
        deliveryDate: editingOrder.deliveryDate.slice(0, 16),
        cargoType: editingOrder.cargoType,
        cargoWeight: editingOrder.cargoWeight.toString(),
        vehicleType: editingOrder.vehicleType,
        vehicleId: editingOrder.vehicleId || "",
        driverId: editingOrder.driverId || "",
        branchId: editingOrder.branchId || "",
        distance: editingOrder.distance?.toString() || "",
        status: editingOrder.status,
      });
    }
  }, [editingOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: TransportOrder = {
      id: editingOrder ? editingOrder.id : `ORD${Math.floor(Math.random() * 10000)}`,
      clientName: formData.clientName,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      pickupDate: formData.pickupDate,
      deliveryDate: formData.deliveryDate,
      cargoType: formData.cargoType,
      cargoWeight: parseFloat(formData.cargoWeight),
      vehicleType: formData.vehicleType,
      status: formData.status,
      vehicleId: formData.vehicleId || undefined,
      driverId: formData.driverId || undefined,
      branchId: formData.branchId,
      distance: parseFloat(formData.distance) || undefined,
    };
    addOrUpdateOrder(order);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editingOrder ? "Edytuj zlecenie" : "Nowe zlecenie transportowe"}
          </h2>
          <button onClick={closeModal} className="text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium">Klient</label>
              <input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="pickupAddress" className="block text-sm font-medium">Adres odbioru</label>
              <input
                type="text"
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium">Adres dostawy</label>
              <input
                type="text"
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium">Data odbioru</label>
              <input
                type="datetime-local"
                id="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium">Data dostawy</label>
              <input
                type="datetime-local"
                id="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="cargoType" className="block text-sm font-medium">Typ ładunku</label>
              <input
                type="text"
                id="cargoType"
                value={formData.cargoType}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="cargoWeight" className="block text-sm font-medium">Waga ładunku (kg)</label>
              <input
                type="number"
                id="cargoWeight"
                value={formData.cargoWeight}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="distance" className="block text-sm font-medium">Odległość (km)</label>
              <input
                type="number"
                id="distance"
                value={formData.distance}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium">Typ pojazdu</label>
              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              >
                <option value="">Wybierz typ pojazdu</option>
                <option value="Van">Van</option>
                <option value="Ciężarówka">Ciężarówka</option>
                <option value="Naczepa">Naczepa</option>
              </select>
            </div>
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium">Pojazd</label>
              <select
                id="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
              >
                <option value="">Wybierz pojazd</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>{`${vehicle.registration} (${vehicle.type})`}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="driverId" className="block text-sm font-medium">Kierowca</label>
              <select
                id="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
              >
                <option value="">Wybierz kierowcę</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>{driver.fullName}</option>
                ))}
              </select>
            </div>
            {currentUser.role === "admin" && (
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
            <div>
              <label htmlFor="status" className="block text-sm font-medium">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
                required
              >
                <option value="Oczekujące">Oczekujące</option>
                <option value="W realizacji">W realizacji</option>
                <option value="Zakończone">Zakończone</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingOrder ? "Zapisz zmiany" : "Zapisz"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;