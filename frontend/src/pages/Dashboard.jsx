import React, { useState, useRef, useEffect } from "react";
import { Download, Upload } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  showSuccessToast,
  showErrorToast,
} from "../utils/toastNotification.jsx";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";

function Dashboard() {
  const dashboardRef = useRef();
  const csvInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: "₹124,500",
    revenueChange: 12.5,
    totalOrders: "2,847",
    ordersChange: 8.2,
    activeProducts: "486",
    productsChange: -3.1,
    avgOrderValue: "₹43.75",
    avgOrderChange: 5.8,
  });

  const [chartData, setChartData] = useState([
    { month: "Jan", forecast: 4000, actual: 2400 },
    { month: "Feb", forecast: 3000, actual: 1398 },
    { month: "Mar", forecast: 2000, actual: 9800 },
    { month: "Apr", forecast: 2780, actual: 3908 },
    { month: "May", forecast: 1890, actual: 4800 },
    { month: "Jun", forecast: 2390, actual: 3800 },
  ]);

  useEffect(() => {
    const shouldUseDynamic =
      import.meta.env.VITE_ENABLE_DYNAMIC_METRICS === "true";
    if (!shouldUseDynamic) return;

    const loadSummary = async () => {
      try {
        const res = await fetch("/api/metrics/summary");
        if (!res.ok) return;
        const data = await res.json();
        setStats({
          totalRevenue: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: data.currency || "USD",
          }).format(data.totalRevenue || 0),
          revenueChange: Number((data.revenueChange || 0).toFixed(1)),
          totalOrders: String(data.totalOrders || 0),
          ordersChange: Number((data.ordersChange || 0).toFixed(1)),
          activeProducts: String(data.activeProducts || 0),
          productsChange: Number((data.productsChange || 0).toFixed(1)),
          avgOrderValue: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: data.currency || "USD",
          }).format(data.avgOrderValue || 0),
          avgOrderChange: Number((data.avgOrderChange || 0).toFixed(1)),
        });
      } catch (e) {}
    };

    const loadTimeseries = async () => {
      try {
        const res = await fetch("/api/metrics/timeseries?months=6");
        if (!res.ok) return;
        const json = await res.json();
        if (json && Array.isArray(json.data)) {
          setChartData(
            json.data.map((d) => ({
              month: d.month,
              forecast: d.forecast,
              actual: d.actual,
            }))
          );
        }
      } catch (e) {}
    };

    loadSummary();
    loadTimeseries();
  }, []);

  const [recentOrders] = useState([
    {
      id: "ORD-001",
      product: "Wireless Mechanical Keyboard",
      date: "2024-01-15",
      status: "Completed",
      amount: "₹234.99",
      quantity: 12,
    },
    {
      id: "ORD-002",
      product: "USB-C Hub Multiport",
      date: "2024-01-14",
      status: "Pending",
      amount: "₹156.50",
      quantity: 8,
    },
    {
      id: "ORD-003",
      product: "Noise Cancelling Headphones",
      date: "2024-01-13",
      status: "Shipped",
      amount: "₹499.99",
      quantity: 24,
    },
  ]);

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: "#f5f5f5",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.text("Inventory Forecast Dashboard Report", 10, 10);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 18);

      pdf.addImage(imgData, "PNG", 10, 25, imgWidth, Math.min(imgHeight, 250));

      const yPos = 25 + Math.min(imgHeight, 250) + 10;
      if (yPos < 280) {
        pdf.setFontSize(12);
        pdf.text("Summary Statistics", 10, yPos);
        pdf.setFontSize(10);
        pdf.text(`Total Revenue: ${stats.totalRevenue}`, 15, yPos + 8);
        pdf.text(`Total Orders: ${stats.totalOrders}`, 15, yPos + 15);
        pdf.text(`Active Products: ${stats.activeProducts}`, 15, yPos + 22);
        pdf.text(`Average Order Value: ${stats.avgOrderValue}`, 15, yPos + 29);
      }

      const filename = `dashboard-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(filename);
      showSuccessToast(
        `Dashboard exported as PDF successfully! File: ${filename}`
      );
    } catch (error) {
      console.error("PDF export error:", error);
      showErrorToast("Failed to export PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCSV = () => {
    csvInputRef.current?.click();
  };

  const handleCSVFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const csv = event.target?.result;

        const lines = csv.split("\n").filter((line) => line.trim());
        if (lines.length < 2) {
          showErrorToast("CSV file must contain headers and data rows");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          if (values.length === headers.length) {
            const row = {};
            headers.forEach((h, idx) => {
              row[h] = values[idx];
            });
            data.push(row);
          }
        }

        const response = await fetch("/api/sales/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sales: data }),
        });

        const result = await response.json();
        if (response.ok) {
          showSuccessToast(
            `CSV imported successfully! ${data.length} rows imported to database`
          );
        } else {
          showErrorToast(`Import failed: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("CSV import error:", error);
        showErrorToast("Failed to import CSV: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleImportCSV}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={18} />
            Import CSV
          </button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVFileUpload}
            className="hidden"
          />
          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={18} />
            {loading ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        ref={dashboardRef}
      >
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          isPositive={true}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          isPositive={true}
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          change={stats.productsChange}
          isPositive={false}
        />
        <StatCard
          title="Avg Order Value"
          value={stats.avgOrderValue}
          change={stats.avgOrderChange}
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard
            title="Sales Forecast vs Actual"
            subtitle="Last 6 months comparison"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  name="Forecast"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#17a697"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Latest transactions" subtitle="Recent orders">
        <DataTable
          columns={[
            { key: "id", label: "Order ID" },
            { key: "product", label: "Product" },
            { key: "date", label: "Date" },
            { key: "quantity", label: "Quantity" },
            {
              key: "status",
              label: "Status",
              render: (status) => (
                <span
                  className={`badge ${
                    status === "Completed"
                      ? "badge-success"
                      : status === "Pending"
                      ? "badge-warning"
                      : "badge-info"
                  }`}
                >
                  {status}
                </span>
              ),
            },
            { key: "amount", label: "Amount" },
          ]}
          data={recentOrders}
        />
      </ChartCard>
    </div>
  );
}

export default Dashboard;
