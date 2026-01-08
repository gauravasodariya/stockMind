import React, { useState } from "react";
import { Upload, Plus, Search, Eye, ShoppingCart } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const enableProductMgmt =
    import.meta.env.VITE_ENABLE_PRODUCT_MANAGEMENT === "true";
  const [products] = useState([
    {
      id: 1,
      name: "Wireless Mechanical Keyboard",
      sku: "KB-992-WL",
      region: "North America",
      stock: 1240,
      predicted: 1450,
      reorder: 1300,
      status: "Low Stock",
    },
    {
      id: 2,
      name: "USB-C Hub Multiport",
      sku: "HB-442-US",
      region: "Europe",
      stock: 450,
      predicted: 200,
      reorder: 150,
      status: "Healthy",
    },
    {
      id: 3,
      name: "Noise Cancelling Headphones",
      sku: "AU-202-NC",
      region: "Asia Pacific",
      stock: 85,
      predicted: 120,
      reorder: 150,
      status: "Critical",
    },
    {
      id: 4,
      name: "Monitor Stand Adjustable",
      sku: "MS-101-AD",
      region: "North America",
      stock: 800,
      predicted: 650,
      reorder: 400,
      status: "Healthy",
    },
    {
      id: 5,
      name: "Webcam 4K Pro",
      sku: "WC-400-PR",
      region: "Europe",
      stock: 120,
      predicted: 60,
      reorder: 80,
      status: "Low Stock",
    },
  ]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrichedProducts = filteredProducts.map((p) => ({
    ...p,
    needsReorder: p.predicted <= p.reorder,
  }));

  const reorderAlerts = enrichedProducts.filter((p) => p.needsReorder);

  const handleAction = (action, row) => {
    console.log(`${action} -> ${row.name} (${row.sku})`);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Inventory Management
          </h1>
        </div>
        {enableProductMgmt && (
          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Upload size={18} />
              Import CSV
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add Product
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full md:w-96"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Forecast vs Reorder"
            subtitle="Predicted demand compared to reorder point"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrichedProducts} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sku" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="predicted"
                  name="Predicted Demand"
                  fill="#0ea5e9"
                />
                <Bar dataKey="reorder" name="Reorder Point" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <div className="card h-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Reorder alerts
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-300">
                Triggered when predicted demand is at or below the reorder
                point.
              </p>
            </div>
            {reorderAlerts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-300">
                No alerts. Forecasts are above thresholds.
              </p>
            ) : (
              <ul className="space-y-3">
                {reorderAlerts.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-slate-300">
                        SKU: {item.sku}
                      </div>
                    </div>
                    <div className="text-right text-sm text-danger font-semibold">
                      {item.predicted} &lt;= {item.reorder}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ChartCard title="Products">
        <DataTable
          columns={[
            { key: "name", label: "Product Name" },
            { key: "sku", label: "SKU" },
            { key: "region", label: "Region" },
            { key: "stock", label: "Current Stock" },
            { key: "predicted", label: "Predicted Demand" },
            { key: "reorder", label: "Reorder Point" },
            {
              key: "status",
              label: "Status",
              render: (status) => (
                <span
                  className={`badge ${
                    status === "Healthy" || status === "In Stock"
                      ? "badge-success"
                      : status === "Low Stock"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {status}
                </span>
              ),
            },
            {
              key: "action",
              label: "Action",
              render: (_value, row) => (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <button
                    className="text-primary hover:underline inline-flex items-center gap-1"
                    onClick={() => handleAction("View", row)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                  {row.needsReorder ? (
                    <button
                      className="text-danger hover:underline inline-flex items-center gap-1"
                      onClick={() => handleAction("Reorder", row)}
                    >
                      <ShoppingCart size={14} />
                      Reorder
                    </button>
                  ) : (
                    <span className="text-gray-400">Within threshold</span>
                  )}
                </div>
              ),
            },
          ]}
          data={enrichedProducts}
        />
      </ChartCard>
    </div>
  );
}

export default Inventory;
