import React, { useState, useEffect } from "react";
import axios from "axios";
import { TransportOrder } from "../types";

const Reports: React.FC = () => {
  const [orders, setOrders] = useState<TransportOrder[]>([]);
  const [reportType, setReportType] = useState<string>("");
  const [reportContent, setReportContent] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [orderId, setOrderId] = useState("");
  const [distance, setDistance] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("transportOrders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const generateLocalReport = () => {
    let filteredOrders = orders;
    if (dateFrom && dateTo) {
      filteredOrders = orders.filter(
        (order) =>
          new Date(order.deliveryDate) >= new Date(dateFrom) &&
          new Date(order.deliveryDate) <= new Date(dateTo)
      );
    }

    switch (reportType) {
      case "financial":
        const totalRevenue = filteredOrders.reduce((sum, order) => {
          const distance = order.distance || 0;
          const rate = order.vehicleType === "Van" ? 0.5 : 1.2;
          return sum + (distance * rate);
        }, 0);
        setReportContent(
          `Raport finansowy (${dateFrom || "od zawsze"} - ${dateTo || "do teraz"}):\n` +
          `Liczba zleceń: ${filteredOrders.length}\n` +
          `Całkowity przychód: ${totalRevenue.toFixed(2)} zł (0.5 zł/km dla busa, 1.2 zł/km dla ciężarówki)`
        );
        break;
      case "efficiency":
        const completedOrders = filteredOrders.filter((o) => o.status === "Zakończone").length;
        const efficiency = (completedOrders / filteredOrders.length) * 100 || 0;
        setReportContent(
          `Raport efektywności (${dateFrom || "od zawsze"} - ${dateTo || "do teraz"}):\n` +
          `Liczba zleceń: ${filteredOrders.length}\n` +
          `Zakończonych: ${completedOrders}\n` +
          `Efektywność: ${efficiency.toFixed(2)}%`
        );
        break;
      default:
        setReportContent("Wybierz typ raportu.");
    }
  };

  const handleGenerateMicroserviceReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setReportContent("");

    try {
      const distanceNum = parseFloat(distance);
      if (isNaN(distanceNum) || distanceNum < 0) {
        throw new Error("Odległość musi być liczbą dodatnią");
      }
      const response = await axios.get(
        `http://localhost:8002/report/${orderId}/${distanceNum}/${encodeURIComponent(destination)}`
      );
      setReportContent(response.data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd podczas generowania raportu");
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Raporty</h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setReportType("financial")}
          className={`px-4 py-2 rounded ${reportType === "financial" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Finansowe
        </button>
        <button
          onClick={() => setReportType("efficiency")}
          className={`px-4 py-2 rounded ${reportType === "efficiency" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Efektywność
        </button>
        <button
          onClick={() => setReportType("custom")}
          className={`px-4 py-2 rounded ${reportType === "custom" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Własne (mikroserwis)
        </button>
      </div>

      {reportType && reportType !== "custom" && (
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="dateFrom" className="block text-sm font-medium">Od</label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="dateTo" className="block text-sm font-medium">Do</label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            onClick={generateLocalReport}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generuj raport
          </button>
        </div>
      )}

      {reportType === "custom" && (
        <form onSubmit={handleGenerateMicroserviceReport} className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium">ID Zlecenia</label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="distance" className="block text-sm font-medium">Odległość (km)</label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="destination" className="block text-sm font-medium">Miejsce docelowe</label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-1 w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Generuj raport
          </button>
        </form>
      )}

      {reportContent && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Wygenerowany raport</h3>
          <pre className="whitespace-pre-wrap">{reportContent}</pre>
        </div>
      )}
    </section>
  );
};

export default Reports;