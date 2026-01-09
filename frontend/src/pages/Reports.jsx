import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import {
  showSuccessToast,
  showErrorToast,
} from "../utils/toastNotification.jsx";
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
      showErrorToast("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: reportType,
          startDate: startDate,
          endDate: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const result = await response.json();

      const newReport = {
        id: result.id || reports.length + 1,
        name:
          result.name ||
          `${
            reportType.charAt(0).toUpperCase() + reportType.slice(1)
          } Report - ${new Date().toLocaleDateString()}`,
        type: reportType.charAt(0).toUpperCase() + reportType.slice(1),
        created: result.created || new Date().toISOString().split("T")[0],
        period: `${startDate} to ${endDate}`,
        status: "Ready",
      };
      setReports([newReport, ...reports]);
      showSuccessToast(`Report generated successfully! ${newReport.name}`);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Report generation error:", error);
      showErrorToast(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      const colors = {
        blue: {
          primary: [25, 118, 210],
          accent: [66, 165, 245],
          dark: [13, 71, 161],
        },
        green: {
          primary: [56, 142, 60],
          accent: [102, 187, 106],
          dark: [27, 94, 32],
        },
        purple: {
          primary: [106, 27, 154],
          accent: [171, 71, 188],
          dark: [74, 20, 140],
        },
        orange: {
          primary: [230, 124, 15],
          accent: [255, 152, 0],
          dark: [191, 144, 0],
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

      // Header Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(...selectedColor.dark);
      pdf.text("INVENTORY FORECAST SYSTEM", pageWidth / 2, yPosition, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Analytics & Reporting Module", pageWidth / 2, yPosition + 6, {
        align: "center",
      });

      yPosition += 14;
      pdf.setDrawColor(...selectedColor.primary);
      pdf.setLineWidth(0.8);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(...selectedColor.primary);
      pdf.text(`${report.type} Report`, 15, yPosition);
      yPosition += 10;

      // Report Details Box
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);

      const details = [
        `Generated: ${new Date().toLocaleString()}`,
        `Report ID: #${report.id}`,
        `Period: ${report.period}`,
        `Theme: ${autoTheme.charAt(0).toUpperCase() + autoTheme.slice(1)}`,
      ];

      const boxHeight = 20;
      pdf.setFillColor(245, 247, 250);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yPosition, pageWidth - 30, boxHeight, "FD");

      let detailY = yPosition + 3;
      details.forEach((detail) => {
        pdf.text(detail, 18, detailY);
        detailY += 4.5;
      });
      yPosition += boxHeight + 8;

      // Executive Summary
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...selectedColor.primary);
      pdf.text("EXECUTIVE SUMMARY", 15, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);
      const summaryText = `This ${report.type.toLowerCase()} report covers the period from ${
        report.period
      } and provides comprehensive analysis with actionable insights for strategic decision making.`;
      const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - 30);
      pdf.text(summaryLines, 15, yPosition);
      yPosition += summaryLines.length * 4 + 6;

      // Metrics Section
      const addSection = (title, metrics) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(...selectedColor.primary);
        pdf.text(title, 15, yPosition);
        yPosition += 6;

        // Create metric table
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        metrics.forEach((metric, idx) => {
          if (yPosition > pageHeight - 25) {
            pdf.addPage();
            yPosition = 15;
          }

          // Alternating background
          if (idx % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(15, yPosition - 2, pageWidth - 30, 5, "F");
          }

          pdf.setTextColor(50, 50, 50);
          pdf.text(metric.label, 18, yPosition);
          pdf.setTextColor(...selectedColor.accent);
          pdf.text(metric.value, pageWidth - 25, yPosition, { align: "right" });
          yPosition += 5;
        });

        yPosition += 4;
      };

      // Add metrics based on report type
      switch (report.type.toLowerCase()) {
        case "sales":
          addSection("📊 Sales Overview", [
            { label: "Total Sales Revenue", value: "₹1,24,500" },
            { label: "Total Orders Processed", value: "2,847" },
            { label: "Average Order Value", value: "₹43.75" },
            { label: "Top Performing Region", value: "North India" },
            { label: "Growth Rate (YoY)", value: "+12.5%" },
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
            { label: "MAPE Error", value: "5.8%" },
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
          addSection("Report Data", [
            { label: "Type", value: report.type },
            { label: "Period", value: report.period },
          ]);
      }

      yPosition += 4;

      // Recommendations Section
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...selectedColor.primary);
      pdf.text("💡 Key Recommendations", 15, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);

      const recommendations = [
        "✓ Review and optimize inventory levels for low-stock items",
        "✓ Implement automated alerts for critical stock thresholds",
        "✓ Analyze sales trends to improve demand forecasting",
        "✓ Monitor forecast accuracy and retrain models regularly",
        "✓ Schedule regular inventory audits and reconciliation",
      ];

      recommendations.forEach((rec) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const lines = pdf.splitTextToSize(rec, pageWidth - 30);
        pdf.text(lines, 18, yPosition);
        yPosition += lines.length * 4 + 2;
      });

      yPosition += 4;

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

      // Save PDF
      const filename = `report-${report.type.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(filename);
      showSuccessToast(`Report downloaded successfully! File: ${filename}`);
    } catch (error) {
      console.error("Report download error:", error);
      showErrorToast(`Failed to download report: ${error.message}`);
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
