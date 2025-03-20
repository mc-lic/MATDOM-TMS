import React, { useState, useEffect } from "react";
import OrderModal from "./OrderModal";
import { TransportOrder, Vehicle, Driver, User, Branch } from "../types";

interface OrdersProps {
  currentUser: User;
}

const Orders: React.FC<OrdersProps> = ({ currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<TransportOrder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [editingOrder, setEditingOrder] = useState<TransportOrder | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("transportOrders");
    const storedVehicles = localStorage.getItem("vehicles");
    const storedDrivers = localStorage.getItem("drivers");
    const storedBranches = localStorage.getItem("branches");
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
    if (storedDrivers) setDrivers(JSON.parse(storedDrivers));
    if (storedBranches) setBranches(JSON.parse(storedBranches));
  }, []);

  const userOrders = currentUser.role === "admin"
    ? orders
    : orders.filter((order) => order.branchId === currentUser.branchId);

  const filteredOrders = filter === "all" ? userOrders : userOrders.filter((order) => order.status === filter);

  const addOrUpdateOrder = (order: TransportOrder) => {
    let updatedOrders;
    if (editingOrder) {
      updatedOrders = orders.map((o) => (o.id === order.id ? order : o));
    } else {
      updatedOrders = [...orders, { ...order, branchId: currentUser.role === "admin" ? order.branchId : currentUser.branchId }];
    }
    setOrders(updatedOrders);
    localStorage.setItem("transportOrders", JSON.stringify(updatedOrders));
    setEditingOrder(null);
  };

  const handleEdit = (order: TransportOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć to zlecenie?")) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("transportOrders", JSON.stringify(updatedOrders));
    }
  };

  const calculateRevenue = (order: TransportOrder) => {
    const distance = order.distance || 0;
    const rate = order.vehicleType === "Van" ? 0.5 : 1.2;
    return (distance * rate).toFixed(2);
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Zlecenia transportowe</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="order-status-filter" className="text-sm font-medium">Status:</label>
            <select
              id="order-status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">Wszystkie</option>
              <option value="Oczekujące">Oczekujące</option>
              <option value="W realizacji">W realizacji</option>
              <option value="Zakończone">Zakończone</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingOrder(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Dodaj nowe zlecenie
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Klient</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Trasa</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Data</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Odległość (km)</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Pojazd</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Kierowca</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Przychód</th>
              {currentUser.role === "admin" && (
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Oddział</th>
              )}
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={currentUser.role === "admin" ? 11 : 10} className="p-4 text-center text-gray-500">Brak zleceń</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{order.id}</td>
                  <td className="p-4 text-gray-800">{order.clientName}</td>
                  <td className="p-4 text-gray-800">{`${order.pickupAddress} -> ${order.deliveryAddress}`}</td>
                  <td className="p-4 text-gray-800">{new Date(order.deliveryDate).toLocaleString()}</td>
                  <td className="p-4 text-gray-800">{order.distance || "-"} km</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "Oczekujące"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "W realizacji"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800">
                    {order.vehicleId ? vehicles.find((v) => v.id === order.vehicleId)?.registration || "-" : "-"}
                  </td>
                  <td className="p-4 text-gray-800">
                    {order.driverId ? drivers.find((d) => d.id === order.driverId)?.fullName || "-" : "-"}
                  </td>
                  <td className="p-4 text-gray-800">{calculateRevenue(order)} zł</td>
                  {currentUser.role === "admin" && (
                    <td className="p-4 text-gray-800">
                      {branches.find((b) => b.id === order.branchId)?.name || "-"}
                    </td>
                  )}
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:underline"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <OrderModal
          closeModal={() => {
            setIsModalOpen(false);
            setEditingOrder(null);
          }}
          addOrUpdateOrder={addOrUpdateOrder}
          vehicles={vehicles}
          drivers={drivers}
          branches={branches}
          editingOrder={editingOrder}
          currentUser={currentUser}
        />
      )}
    </section>
  );
};

export default Orders;