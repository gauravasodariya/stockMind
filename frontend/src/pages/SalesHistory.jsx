import React, { useState } from "react";
import { Download, Filter } from "lucide-react";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";

function SalesHistory() {
  const [sales] = useState([
    {
      id: 1,
      date: "2024-01-15",
      product: "Laptop Pro",
      quantity: 3,
      price: "₹2,49,999",
      customer: "Aarav Mehta",
      region: "North",
    },
    {
      id: 2,
      date: "2024-01-14",
      product: "Wireless Mouse",
      quantity: 25,
      price: "₹62,480",
      customer: "Innova Retail",
      region: "South",
    },
    {
      id: 3,
      date: "2024-01-13",
      product: "USB-C Cable",
      quantity: 100,
      price: "₹1,05,000",
      customer: "Sapphire Stores",
      region: "East",
    },
    {
      id: 4,
      date: "2024-01-12",
      product: "Monitor 4K",
      quantity: 5,
      price: "₹1,62,499",
      customer: "TechNova Pvt Ltd",
      region: "West",
    },
  ]);

  const [selectedRegion, setSelectedRegion] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let dateMatch = true;
    if (start) dateMatch = dateMatch && saleDate >= start;
    if (end) dateMatch = dateMatch && saleDate <= end;

    const regionMatch =
      selectedRegion === "All" || sale.region === selectedRegion;

    return dateMatch && regionMatch;
  });

  const handleApplyFilter = () => {
    console.log(
      `Filtered sales from ${startDate} to ${endDate} in ${selectedRegion}`
    );
  };

  const handleExportCSV = () => {
    if (!filteredSales.length) {
      alert("No sales records to export for the selected filters.");
      return;
    }

    const headers = [
      "Date",
      "Product",
      "Quantity",
      "Customer",
      "Region",
      "Amount",
    ];
    const rows = filteredSales.map((s) => [
      s.date,
      s.product,
      s.quantity,
      s.customer,
      s.region,
      s.price,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales-history-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Sales History
        </h1>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">
            Filters
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input w-full"
            >
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyFilter}
              className="btn btn-primary w-full"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <p className="text-gray-500 dark:text-slate-300 text-sm font-medium uppercase mb-2">
            Total Sales
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            ₹7,048.67
          </p>
          <p className="text-sm text-success mt-2">↑ 12.5% from last period</p>
        </div>
        <div className="card">
          <p className="text-gray-500 dark:text-slate-300 text-sm font-medium uppercase mb-2">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            4
          </p>
          <p className="text-sm text-success mt-2">↑ 8% from last period</p>
        </div>
        <div className="card">
          <p className="text-gray-500 dark:text-slate-300 text-sm font-medium uppercase mb-2">
            Avg Order Value
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            ₹1,762.17
          </p>
          <p className="text-sm text-success mt-2">↑ 5% from last period</p>
        </div>
      </div>

      <ChartCard title="Sales Transactions">
        <DataTable
          columns={[
            { key: "date", label: "Date" },
            { key: "product", label: "Product" },
            { key: "quantity", label: "Quantity" },
            { key: "customer", label: "Customer" },
            { key: "region", label: "Region" },
            { key: "price", label: "Amount" },
          ]}
          data={filteredSales}
        />
      </ChartCard>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleExportCSV}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Download size={18} />
          Export to CSV
        </button>
      </div>
    </div>
  );
}

export default SalesHistory;
