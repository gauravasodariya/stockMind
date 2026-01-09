import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import {
  showSuccessToast,
  showErrorToast,
} from "../utils/toastNotification.jsx";
import ChartCard from "../components/ChartCard";
import DataTable from "../components/DataTable";
import { generateReport } from "../utils/api";

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
      const result = await generateReport({
        type: reportType,
        startDate: startDate,
        endDate: endDate,
      });

      // Handle both response formats
      const reportData = result.data?.report || result.data || result;

      const newReport = {
        id: reportData.id || reports.length + 1,
        name:
          reportData.name ||
          `${
            reportType.charAt(0).toUpperCase() + reportType.slice(1)
          } Report - ${new Date().toLocaleDateString()}`,
        type:
          reportData.type ||
          reportType.charAt(0).toUpperCase() + reportType.slice(1),
        created: reportData.created || new Date().toISOString().split("T")[0],
        period: reportData.period || `${startDate} to ${endDate}`,
        status: reportData.status || "Ready",
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
      pdf.text("Analytics & Reporting Module", pageWidth / 2, yPosition + 6, {
        align: "center",
      });

      yPosition += 14;
      pdf.setDrawColor(...colors.primary);
      pdf.setLineWidth(0.8);
      pdf.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 8;

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(...colors.primary);
      pdf.text(`${report.type} Report`, 15, yPosition);
      yPosition += 10;

      // Report Details Box
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);

      const details = [
        `Generated: ${new Date().toLocaleString()}`,
        `Report ID: ${report.id}`,
        `Period: ${report.period}`,
      ];

      const boxHeight = 15;
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
      pdf.setTextColor(...colors.primary);
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

      // Metrics Section with Professional Table
      const addSection = (title, metrics) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(...colors.primary);
        pdf.text(title, 15, yPosition);
        yPosition += 6;

        const tableX = 15;
        const tableWidth = pageWidth - 30;
        const colWidth1 = tableWidth * 0.65;
        const colWidth2 = tableWidth * 0.35;
        const rowHeight = 7;

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

        pdf.setFont("helvetica", "normal");
        metrics.forEach((metric, idx) => {
          if (yPosition > pageHeight - 25) {
            pdf.addPage();
            yPosition = 15;
          }

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

        yPosition += 6;
      };

      switch (report.type.toLowerCase()) {
        case "sales":
          addSection("[SALES OVERVIEW]", [
            {
              label: "Total Sales Revenue",
              value:
                report.metrics?.salesMetrics?.totalRevenue || "Rs 1,24,500",
            },
            {
              label: "Total Orders Processed",
              value: report.metrics?.salesMetrics?.totalOrders || "2,847",
            },
            {
              label: "Average Order Value",
              value: report.metrics?.salesMetrics?.avgOrderValue || "Rs 43.75",
            },
            {
              label: "Top Performing Region",
              value: report.metrics?.salesMetrics?.topRegion || "North India",
            },
            {
              label: "Growth Rate (YoY)",
              value: report.metrics?.salesMetrics?.growthRate || "+12.5%",
            },
          ]);
          addSection("[PERFORMANCE METRICS]", [
            { label: "Order Completion Rate", value: "98.5%" },
            { label: "Average Processing Time", value: "2.3 hours" },
            { label: "Customer Satisfaction", value: "4.8/5.0" },
            { label: "Return Rate", value: "1.2%" },
          ]);
          break;

        case "inventory":
          addSection("[INVENTORY SUMMARY]", [
            {
              label: "Total Products in Catalog",
              value: report.metrics?.inventoryMetrics?.totalProducts || "486",
            },
            {
              label: "Low Stock Items",
              value:
                report.metrics?.inventoryMetrics?.lowStockItems || "42 (8.6%)",
            },
            {
              label: "Critical Stock Items",
              value:
                report.metrics?.inventoryMetrics?.criticalItems || "8 (1.6%)",
            },
            {
              label: "Average Stock Level",
              value:
                report.metrics?.inventoryMetrics?.avgStockLevel || "245 units",
            },
            {
              label: "Stock Turnover Rate",
              value:
                report.metrics?.inventoryMetrics?.stockTurnoverRate ||
                "4.2x/year",
            },
          ]);
          addSection("[RISK ASSESSMENT]", [
            { label: "High Risk Items", value: "12" },
            { label: "Medium Risk Items", value: "38" },
            { label: "Inventory Value at Risk", value: "Rs 2,45,000" },
            { label: "Recommended Action", value: "Reorder 156 units" },
          ]);
          break;

        case "forecast":
          addSection("[FORECAST ACCURACY]", [
            {
              label: "Model Accuracy",
              value: report.metrics?.forecastMetrics?.modelAccuracy || "94.2%",
            },
            {
              label: "MAPE Error",
              value: report.metrics?.forecastMetrics?.mapeError || "5.8%",
            },
            {
              label: "Confidence Score",
              value: report.metrics?.forecastMetrics?.confidenceScore || "92%",
            },
            {
              label: "Forecast Horizon",
              value:
                report.metrics?.forecastMetrics?.forecastHorizon || "6 weeks",
            },
            {
              label: "Last Model Update",
              value:
                report.metrics?.forecastMetrics?.lastUpdate || "2 hours ago",
            },
          ]);
          addSection("[CATEGORY PERFORMANCE]", [
            { label: "Electronics", value: "95.8% (up)" },
            { label: "Accessories", value: "92.3% (up)" },
            { label: "Footwear", value: "89.5% (down)" },
            { label: "Apparel", value: "91.2% (up)" },
            { label: "Sports", value: "93.7% (up)" },
          ]);
          break;

        case "comprehensive":
          addSection("[SALES METRICS]", [
            {
              label: "Total Revenue",
              value:
                report.metrics?.salesMetrics?.totalRevenue || "Rs 1,24,500",
            },
            {
              label: "Total Orders",
              value: report.metrics?.salesMetrics?.totalOrders || "2,847",
            },
            {
              label: "Growth YoY",
              value: report.metrics?.salesMetrics?.growthRate || "+12.5%",
            },
            {
              label: "Top Region",
              value: report.metrics?.salesMetrics?.topRegion || "North India",
            },
          ]);
          addSection("[INVENTORY METRICS]", [
            {
              label: "Total Products",
              value: report.metrics?.inventoryMetrics?.totalProducts || "486",
            },
            {
              label: "Low Stock Items",
              value: report.metrics?.inventoryMetrics?.lowStockItems || "42",
            },
            {
              label: "Critical Items",
              value: report.metrics?.inventoryMetrics?.criticalItems || "8",
            },
            {
              label: "Avg Stock Level",
              value:
                report.metrics?.inventoryMetrics?.avgStockLevel || "245 units",
            },
          ]);
          addSection("[FORECAST METRICS]", [
            {
              label: "Model Accuracy",
              value: report.metrics?.forecastMetrics?.modelAccuracy || "94.2%",
            },
            {
              label: "MAPE Error",
              value: report.metrics?.forecastMetrics?.mapeError || "5.8%",
            },
            {
              label: "Confidence",
              value: report.metrics?.forecastMetrics?.confidenceScore || "92%",
            },
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

      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("[KEY RECOMMENDATIONS]", 15, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);

      const recommendations = [
        "* Review and optimize inventory levels for low-stock items",
        "* Implement automated alerts for critical stock thresholds",
        "* Analyze sales trends to improve demand forecasting",
        "* Monitor forecast accuracy and retrain models regularly",
        "* Schedule regular inventory audits and reconciliation",
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
