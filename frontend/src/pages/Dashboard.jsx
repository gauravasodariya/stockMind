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
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yPosition = 20;

      const colors = {
        primary: [25, 118, 210],
        accent: [66, 165, 245],
        dark: [13, 71, 161],
      };

      // Header Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(...colors.dark);
      pdf.text("INVENTORY FORECAST SYSTEM", pageWidth / 2, yPosition, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Dashboard Report", pageWidth / 2, yPosition + 6, {
        align: "center",
      });

      yPosition += 14;
      pdf.setDrawColor(...colors.primary);
      pdf.setLineWidth(0.8);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      // Report Details
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      pdf.setFillColor(245, 247, 250);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yPosition, pageWidth - 30, 10, "FD");
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 18, yPosition + 3);
      pdf.text(`Report Type: Dashboard Overview`, 18, yPosition + 7);
      yPosition += 15;

      // Dashboard Screenshot
      pdf.addImage(
        imgData,
        "PNG",
        10,
        yPosition,
        imgWidth,
        Math.min(imgHeight, 120)
      );
      yPosition += Math.min(imgHeight, 120) + 10;

      // Summary Statistics Table
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("SUMMARY STATISTICS", 15, yPosition);
      yPosition += 6;

      // Professional Table
      const tableX = 15;
      const tableWidth = pageWidth - 30;
      const colWidth1 = tableWidth * 0.65;
      const colWidth2 = tableWidth * 0.35;
      const rowHeight = 7;

      // Table Header
      pdf.setFillColor(...colors.primary);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(tableX, yPosition, colWidth1, rowHeight, "FD");
      pdf.rect(tableX + colWidth1, yPosition, colWidth2, rowHeight, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Metric", tableX + 2, yPosition + 5);
      pdf.text("Value", tableX + colWidth1 + 2, yPosition + 5);
      yPosition += rowHeight;

      // Table Data
      const metrics = [
        {
          label: "Total Revenue",
          value: stats.totalRevenue.replace(/₹/g, "Rs "),
        },
        { label: "Total Orders", value: stats.totalOrders },
        { label: "Active Products", value: stats.activeProducts },
        {
          label: "Average Order Value",
          value: stats.avgOrderValue.replace(/₹/g, "Rs "),
        },
      ];

      pdf.setFont("helvetica", "normal");
      metrics.forEach((metric, idx) => {
        if (idx % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
        } else {
          pdf.setFillColor(255, 255, 255);
        }

        pdf.setDrawColor(220, 220, 220);
        pdf.rect(tableX, yPosition, colWidth1, rowHeight, "FD");
        pdf.rect(tableX + colWidth1, yPosition, colWidth2, rowHeight, "FD");

        pdf.setTextColor(50, 50, 50);
        pdf.text(metric.label, tableX + 2, yPosition + 5);
        pdf.setTextColor(...colors.dark);
        pdf.setFont("helvetica", "bold");
        pdf.text(metric.value, tableX + tableWidth - 2, yPosition + 5, {
          align: "right",
        });
        pdf.setFont("helvetica", "normal");

        yPosition += rowHeight;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);
      pdf.text(
        "This report was automatically generated by the Inventory Forecast System",
        pageWidth / 2,
        pageHeight - 7,
        { align: "center" }
      );
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()} | ©2026 All Rights Reserved`,
        pageWidth / 2,
        pageHeight - 3,
        { align: "center" }
      );

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
