import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";

function Reports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Monthly Sales Report",
      type: "Sales",
      created: "2024-01-15",
      period: "January 2024",
      status: "Ready",
    },
    {
      id: 2,
      name: "Inventory Analysis",
      type: "Inventory",
      created: "2024-01-10",
      period: "Q1 2024",
      status: "Ready",
    },
    {
      id: 3,
      name: "Forecast Accuracy Report",
      type: "Forecast",
      created: "2024-01-05",
      period: "December 2023",
      status: "Ready",
    },
  ]);

  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const newReport = {
        id: reports.length + 1,
        name: `${
          reportType.charAt(0).toUpperCase() + reportType.slice(1)
        } Report - ${new Date().toLocaleDateString()}`,
        type: reportType.charAt(0).toUpperCase() + reportType.slice(1),
        created: new Date().toISOString().split("T")[0],
        period: `${startDate} to ${endDate}`,
        status: "Ready",
      };
      setReports([newReport, ...reports]);
      alert(`Report generated successfully!\n${newReport.name}`);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      const colors = {
        blue: {
          primary: [0, 102, 204],
          accent: [51, 153, 255],
          dark: [0, 51, 102],
        },
        green: {
          primary: [0, 128, 0],
          accent: [102, 205, 0],
          dark: [0, 76, 0],
        },
        purple: {
          primary: [128, 0, 128],
          accent: [186, 85, 211],
          dark: [75, 0, 130],
        },
        orange: {
          primary: [255, 140, 0],
          accent: [255, 165, 0],
          dark: [204, 85, 0],
        },
      };
      const typeKey = (report.type || "sales").toLowerCase();
      const autoThemeMap = {
        sales: "blue",
        inventory: "green",
        forecast: "purple",
        comprehensive: "orange",
      };
      const autoTheme = autoThemeMap[typeKey] || "blue";
      const selectedColor = colors[autoTheme];

      pdf.setFontSize(14);
      pdf.setTextColor(
        selectedColor.dark[0],
        selectedColor.dark[1],
        selectedColor.dark[2]
      );
      pdf.text("INVENTORY FORECAST SYSTEM", 15, yPosition);
      pdf.setFontSize(10);
      pdf.text("Analytics & Reporting Module", 15, yPosition + 5);
      yPosition += 12;

      pdf.setDrawColor(
        selectedColor.primary[0],
        selectedColor.primary[1],
        selectedColor.primary[2]
      );
      pdf.setLineWidth(0.5);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 6;

      pdf.setFontSize(20);
      pdf.setTextColor(
        selectedColor.primary[0],
        selectedColor.primary[1],
        selectedColor.primary[2]
      );
      pdf.text(`${report.type} Report`, 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, yPosition);
      yPosition += 4;
      pdf.text(`Report ID: #${report.id}`, 15, yPosition);
      yPosition += 4;
      pdf.text(`Period: ${report.period}`, 15, yPosition);
      yPosition += 4;
      pdf.text(
        `Layout: Professional • Theme: Auto (${autoTheme})`,
        15,
        yPosition
      );
      yPosition += 8;

      pdf.setFillColor(240, 248, 255);
      pdf.rect(15, yPosition, pageWidth - 30, 20, "F");
      pdf.setFontSize(11);
      pdf.setTextColor(
        selectedColor.primary[0],
        selectedColor.primary[1],
        selectedColor.primary[2]
      );
      pdf.setFont(undefined, "bold");
      pdf.text("EXECUTIVE SUMMARY", 18, yPosition + 6);
      pdf.setFont(undefined, "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      pdf.text(
        `This ${report.type.toLowerCase()} covers the period from ${
          report.period
        }`,
        18,
        yPosition + 12
      );
      pdf.text(
        "with comprehensive analysis and actionable insights for decision making.",
        18,
        yPosition + 16
      );
      yPosition += 24;

      pdf.setFontSize(12);
      pdf.setTextColor(
        selectedColor.dark[0],
        selectedColor.dark[1],
        selectedColor.dark[2]
      );

      const addSection = (title, metrics) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.setFont(undefined, "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(
          selectedColor.primary[0],
          selectedColor.primary[1],
          selectedColor.primary[2]
        );
        pdf.text(title, 15, yPosition);
        yPosition += 6;

        pdf.setFont(undefined, "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(50, 50, 50);
        metrics.forEach((metric, idx) => {
          pdf.text(`${metric.label}: ${metric.value}`, 18, yPosition);
          yPosition += 5;
        });
        yPosition += 3;
      };

      switch (report.type.toLowerCase()) {
        case "sales":
          addSection("📊 Sales Overview", [
            { label: "Total Sales Revenue", value: "₹1,24,500" },
            { label: "Total Orders Processed", value: "2,847" },
            { label: "Average Order Value", value: "₹43.75" },
            { label: "Top Performing Region", value: "North India" },
            { label: "Growth Rate", value: "+12.5% YoY" },
          ]);
          addSection("🎯 Performance Metrics", [
            { label: "Order Completion Rate", value: "98.5%" },
            { label: "Average Processing Time", value: "2.3 hours" },
            { label: "Customer Satisfaction", value: "4.8/5.0" },
            { label: "Return Rate", value: "1.2%" },
          ]);
          break;

        case "inventory":
          addSection("📦 Inventory Summary", [
            { label: "Total Products in Catalog", value: "486" },
            { label: "Low Stock Items", value: "42 (8.6%)" },
            { label: "Critical Stock Items", value: "8 (1.6%)" },
            { label: "Average Stock Level", value: "245 units" },
            { label: "Stock Turnover Rate", value: "4.2x/year" },
          ]);
          addSection("⚠️ Risk Assessment", [
            { label: "High Risk Items", value: "12" },
            { label: "Medium Risk Items", value: "38" },
            { label: "Inventory Value at Risk", value: "₹2,45,000" },
            { label: "Recommended Action", value: "Reorder 156 units" },
          ]);
          break;

        case "forecast":
          addSection("🤖 Forecast Accuracy", [
            { label: "Model Accuracy", value: "94.2%" },
            { label: "MAPE (Mean Absolute % Error)", value: "5.8%" },
            { label: "Confidence Score", value: "92%" },
            { label: "Forecast Horizon", value: "6 weeks" },
            { label: "Last Model Update", value: "2 hours ago" },
          ]);
          addSection("📈 Category Performance", [
            { label: "Electronics", value: "95.8% accurate" },
            { label: "Accessories", value: "92.3% accurate" },
            { label: "Footwear", value: "89.5% accurate" },
            { label: "Apparel", value: "91.2% accurate" },
            { label: "Sports", value: "93.7% accurate" },
          ]);
          break;

        case "comprehensive":
          addSection("💰 Sales Metrics", [
            { label: "Total Revenue", value: "₹1,24,500" },
            { label: "Total Orders", value: "2,847" },
            { label: "Growth YoY", value: "+12.5%" },
            { label: "Top Region", value: "North India" },
          ]);
          addSection("📦 Inventory Metrics", [
            { label: "Total Products", value: "486" },
            { label: "Low Stock Items", value: "42" },
            { label: "Critical Items", value: "8" },
            { label: "Avg Stock Level", value: "245 units" },
          ]);
          addSection("🤖 Forecast Metrics", [
            { label: "Model Accuracy", value: "94.2%" },
            { label: "MAPE Error", value: "5.8%" },
            { label: "Confidence", value: "92%" },
            { label: "Best Performer", value: "Electronics (95.8%)" },
          ]);
          break;

        default:
          pdf.text("Report Data", 15, yPosition);
          yPosition += 8;
          pdf.setFontSize(10);
          pdf.text(`Report Type: ${report.type}`, 20, yPosition);
      }

      yPosition += 8;

      // Recommendations section
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(
        selectedColor.primary[0],
        selectedColor.primary[1],
        selectedColor.primary[2]
      );
      pdf.text("💡 Recommendations", 15, yPosition);
      yPosition += 6;

      pdf.setFont(undefined, "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      const recommendations = [
        "1. Review and optimize inventory levels for low-stock items",
        "2. Implement automated alerts for critical stock threshold",
        "3. Analyze sales trends to improve demand forecasting",
        "4. Monitor forecast accuracy and retrain models monthly",
        "5. Schedule regular inventory audits and reconciliation",
      ];
      recommendations.forEach((rec) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.text(rec, 18, yPosition);
        yPosition += 5;
      });

      yPosition += 8;

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
      pdf.text(
        "This report was automatically generated by the Inventory Forecast System",
        15,
        pageHeight - 10
      );
      pdf.text(
        `Report Generated: ${new Date().toLocaleDateString()} | ©2026 All Rights Reserved`,
        pageWidth - 70,
        pageHeight - 10
      );

      // Save PDF with custom filename
      const filename = `report-${report.type.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }-auto.pdf`;
      pdf.save(filename);
      alert(`✅ Report downloaded successfully!\nFile: ${filename}`);
    } catch (error) {
      console.error("Report download error:", error);
      alert("❌ Failed to download report: " + error.message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Reports
        </h1>
      </div>

      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Generate New Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input w-full"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="forecast">Forecast Report</option>
              <option value="comprehensive">Comprehensive Report</option>
            </select>
          </div>
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
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      <ChartCard title="Generated Reports">
        <DataTable
          columns={[
            { key: "name", label: "Report Name" },
            { key: "type", label: "Type" },
            { key: "period", label: "Period" },
            { key: "created", label: "Created" },
            {
              key: "status",
              label: "Status",
              render: (status) => (
                <span className="badge badge-success">{status}</span>
              ),
            },
            {
              key: "id",
              label: "Action",
              render: (_val, row) => (
                <button
                  onClick={() => handleDownloadReport(row)}
                  className="flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
              ),
            },
          ]}
          data={reports}
        />
      </ChartCard>
    </div>
  );
}

export default Reports;
