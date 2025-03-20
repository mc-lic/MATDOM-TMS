import React, { useState, useEffect } from "react";
import { TransportOrder, User, Branch } from "../types";

interface DashboardProps {
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [orders, setOrders] = useState<TransportOrder[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  useEffect(() => {
    const storedOrders = localStorage.getItem("transportOrders");
    const storedBranches = localStorage.getItem("branches");
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    if (storedBranches) setBranches(JSON.parse(storedBranches));
  }, []);

  const filteredOrders = currentUser.role === "admin"
    ? (selectedBranch === "all" ? orders : orders.filter((order) => order.branchId === selectedBranch))
    : orders.filter((order) => order.branchId === currentUser.branchId);

  const activeOrdersCount = filteredOrders.filter(
    (order) => order.status === "Oczekujące" || order.status === "W realizacji"
  ).length;

  const todayDeliveriesCount = filteredOrders.filter((order) => {
    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    return (
      deliveryDate.getDate() === today.getDate() &&
      deliveryDate.getMonth() === today.getMonth() &&
      deliveryDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const monthlyRevenue = filteredOrders
    .filter((order) => {
      const deliveryDate = new Date(order.deliveryDate);
      const today = new Date();
      return (
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, order) => {
      const distance = order.distance || 0;
      const rate = order.vehicleType === "Van" ? 0.5 : 1.2;
      return sum + (distance * rate);
    }, 0);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        {currentUser.role === "admin" && (
          <div className="flex items-center space-x-2">
            <label htmlFor="branch-filter" className="text-sm font-medium">Oddział:</label>
            <select
              id="branch-filter"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">Wszystkie</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-700">Aktywne zlecenia</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activeOrdersCount}</p>
          <p className="text-sm text-gray-500 mt-1">W trakcie realizacji lub oczekujące</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-700">Dzisiejsze dostawy</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{todayDeliveriesCount}</p>
          <p className="text-sm text-gray-500 mt-1">Planowane na dziś</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-700">Przychód miesięczny</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{monthlyRevenue.toFixed(2)} zł</p>
          <p className="text-sm text-gray-500 mt-1">0.5 zł/km (bus), 1.2 zł/km (ciężarówka)</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;