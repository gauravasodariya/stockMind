import React, { useState } from "react";
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
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import {
  showSuccessToast,
  showErrorToast,
} from "../utils/toastNotification.jsx";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";

function Forecasting() {
  const [forecastData, setForecastData] = useState([
    { week: "W1", predicted: 450, lower: 380, upper: 520 },
    { week: "W2", predicted: 520, lower: 440, upper: 600 },
    { week: "W3", predicted: 580, lower: 500, upper: 660 },
    { week: "W4", predicted: 620, lower: 540, upper: 700 },
    { week: "W5", predicted: 680, lower: 590, upper: 770 },
    { week: "W6", predicted: 720, lower: 620, upper: 820 },
  ]);

  const [modelMetrics, setModelMetrics] = useState({
    accuracy: "94.2%",
    mape: "5.8%",
    confidence: "92%",
    updatedAt: new Date(),
  });

  const [selectedRegion, setSelectedRegion] = useState("All India");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("6 Weeks");
  const [loading, setLoading] = useState(false);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const [categoryAccuracy] = useState([
    {
      category: "Electronics",
      accuracy: "95.8%",
      trend: "↑",
      color: "text-success",
    },
    {
      category: "Accessories",
      accuracy: "92.3%",
      trend: "↑",
      color: "text-success",
    },
    {
      category: "Footwear",
      accuracy: "89.5%",
      trend: "↓",
      color: "text-warning",
    },
    {
      category: "Apparel",
      accuracy: "91.2%",
      trend: "↑",
      color: "text-success",
    },
    {
      category: "Sports",
      accuracy: "93.7%",
      trend: "↑",
      color: "text-success",
    },
  ]);

  const [insights] = useState([
    {
      id: 1,
      type: "recommendation",
      title: "High Demand Alert",
      message:
        "Electronics category showing 25% surge in W3-W4. Recommend increasing stock by 30%.",
      icon: "⚡",
    },
    {
      id: 2,
      type: "insight",
      title: "Seasonal Pattern Detected",
      message:
        "Accessories show consistent weekly growth. Prepare for 40% spike in Q2.",
      icon: "📈",
    },
    {
      id: 3,
      type: "alert",
      title: "Risk: Footwear Volatility",
      message:
        "Confidence interval widening for Footwear (W5-W6). Model accuracy: 89.5%.",
      icon: "⚠️",
    },
  ]);

  const handleGenerateForecast = async () => {
    try {
      setLoading(true);
      console.log(
        `Generating forecast for ${selectedRegion}, ${selectedCategory}, ${selectedPeriod}`
      );

      const response = await fetch("/api/forecast/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: selectedRegion,
          category: selectedCategory,
          horizon: selectedPeriod,
          historicalData: forecastData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate forecast");
      }

      const result = await response.json();
      console.log("Forecast generated:", result);

      setModelMetrics({
        accuracy: result.accuracy || "94.2%",
        mape: result.mape || "5.8%",
        confidence: result.confidence || "92%",
        updatedAt: new Date(),
      });

      showSuccessToast(
        `Forecast generated successfully!\nRegion: ${selectedRegion}\nCategory: ${selectedCategory}\nPeriod: ${selectedPeriod}`
      );
    } catch (error) {
      console.error("Forecast generation error:", error);
      showErrorToast(error.message || "Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleExportForecast = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      const colors = {
        primary: [25, 118, 210],
        accent: [66, 165, 245],
        dark: [13, 71, 161],
        light: [227, 242, 253],
      };

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(...colors.dark);
      pdf.text("INVENTORY FORECAST SYSTEM", pageWidth / 2, yPosition, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Demand Forecasting Report", pageWidth / 2, yPosition + 6, {
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
      pdf.text("6-Week Demand Forecast", 15, yPosition);
      yPosition += 10;

      // Details Box
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);

      pdf.setFillColor(...colors.light);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yPosition, pageWidth - 30, 22, "FD");

      const details = [
        `Generated: ${new Date().toLocaleString()}`,
        `Region: ${selectedRegion}`,
        `Category: ${selectedCategory}`,
        `Period: ${selectedPeriod}`,
        `Model Accuracy: ${modelMetrics.accuracy} | Confidence: ${modelMetrics.confidence}`,
      ];

      let detailY = yPosition + 3;
      details.forEach((detail) => {
        pdf.text(detail, 18, detailY);
        detailY += 4;
      });
      yPosition += 27;

      // Forecast Data Table with Professional Borders
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("FORECAST DATA TABLE", 15, yPosition);
      yPosition += 6;

      // Table parameters
      const startX = 15;
      const tableWidth = pageWidth - 30;
      const colWidths = {
        week: tableWidth * 0.2,
        predicted: tableWidth * 0.27,
        lower: tableWidth * 0.27,
        upper: tableWidth * 0.26,
      };
      const rowHeight = 7;

      // Table Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(...colors.primary);
      pdf.setDrawColor(200, 200, 200);

      let currentX = startX;
      pdf.rect(currentX, yPosition, colWidths.week, rowHeight, "FD");
      pdf.text("Week", currentX + colWidths.week / 2, yPosition + 5, {
        align: "center",
      });
      currentX += colWidths.week;

      pdf.rect(currentX, yPosition, colWidths.predicted, rowHeight, "FD");
      pdf.text("Predicted", currentX + colWidths.predicted / 2, yPosition + 5, {
        align: "center",
      });
      currentX += colWidths.predicted;

      pdf.rect(currentX, yPosition, colWidths.lower, rowHeight, "FD");
      pdf.text("Lower Bound", currentX + colWidths.lower / 2, yPosition + 5, {
        align: "center",
      });
      currentX += colWidths.lower;

      pdf.rect(currentX, yPosition, colWidths.upper, rowHeight, "FD");
      pdf.text("Upper Bound", currentX + colWidths.upper / 2, yPosition + 5, {
        align: "center",
      });

      yPosition += rowHeight;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);

      forecastData.forEach((row, idx) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
        }

        const bgColor = idx % 2 === 0 ? [240, 248, 255] : [255, 255, 255];

        currentX = startX;

        pdf.setFillColor(...bgColor);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(currentX, yPosition, colWidths.week, rowHeight, "FD");
        pdf.setTextColor(20, 20, 20);
        pdf.setFont("helvetica", "bold");
        pdf.text(row.week, currentX + colWidths.week / 2, yPosition + 5, {
          align: "center",
        });
        currentX += colWidths.week;

        pdf.setFillColor(...bgColor);
        pdf.rect(currentX, yPosition, colWidths.predicted, rowHeight, "FD");
        pdf.setTextColor(20, 20, 20);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          String(row.predicted),
          currentX + colWidths.predicted / 2,
          yPosition + 5,
          { align: "center" }
        );
        currentX += colWidths.predicted;

        pdf.setFillColor(...bgColor);
        pdf.rect(currentX, yPosition, colWidths.lower, rowHeight, "FD");
        pdf.setTextColor(20, 20, 20);
        pdf.text(
          String(row.lower),
          currentX + colWidths.lower / 2,
          yPosition + 5,
          { align: "center" }
        );
        currentX += colWidths.lower;

        pdf.setFillColor(...bgColor);
        pdf.rect(currentX, yPosition, colWidths.upper, rowHeight, "FD");
        pdf.setTextColor(20, 20, 20);
        pdf.text(
          String(row.upper),
          currentX + colWidths.upper / 2,
          yPosition + 5,
          { align: "center" }
        );

        yPosition += rowHeight;
      });

      yPosition += 6;

      if (yPosition > pageHeight - 45) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("MODEL PERFORMANCE METRICS", 15, yPosition);
      yPosition += 6;

      const metricsTableX = 15;
      const metricsTableWidth = pageWidth - 30;
      const metricColWidth = metricsTableWidth * 0.65;
      const valueColWidth = metricsTableWidth * 0.35;
      const metricRowHeight = 7;

      pdf.setFillColor(...colors.primary);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(metricsTableX, yPosition, metricColWidth, metricRowHeight, "FD");
      pdf.rect(
        metricsTableX + metricColWidth,
        yPosition,
        valueColWidth,
        metricRowHeight,
        "FD"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Metric", metricsTableX + 2, yPosition + 5);
      pdf.text("Value", metricsTableX + metricColWidth + 2, yPosition + 5);
      yPosition += metricRowHeight;

      const metrics = [
        { label: "Model Accuracy", value: modelMetrics.accuracy },
        { label: "MAPE Error", value: modelMetrics.mape },
        { label: "Confidence Score", value: modelMetrics.confidence },
        { label: "Last Updated", value: getTimeAgo(modelMetrics.updatedAt) },
      ];

      pdf.setFont("helvetica", "normal");
      metrics.forEach((metric, idx) => {
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          yPosition = 15;
          pdf.setFont("helvetica", "normal");
        }

        // Alternating row colors
        if (idx % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
        } else {
          pdf.setFillColor(255, 255, 255);
        }

        pdf.setDrawColor(220, 220, 220);
        pdf.rect(
          metricsTableX,
          yPosition,
          metricColWidth,
          metricRowHeight,
          "FD"
        );
        pdf.rect(
          metricsTableX + metricColWidth,
          yPosition,
          valueColWidth,
          metricRowHeight,
          "FD"
        );

        pdf.setTextColor(50, 50, 50);
        pdf.text(metric.label, metricsTableX + 2, yPosition + 5);
        pdf.setTextColor(...colors.dark);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          metric.value,
          metricsTableX + metricsTableWidth - 2,
          yPosition + 5,
          {
            align: "right",
          }
        );
        pdf.setFont("helvetica", "normal");

        yPosition += metricRowHeight;
      });

      yPosition += 6;

      if (yPosition > pageHeight - 45) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("CATEGORY ACCURACY PERFORMANCE", 15, yPosition);
      yPosition += 6;

      pdf.setFillColor(...colors.primary);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(metricsTableX, yPosition, metricColWidth, metricRowHeight, "FD");
      pdf.rect(
        metricsTableX + metricColWidth,
        yPosition,
        valueColWidth,
        metricRowHeight,
        "FD"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Category", metricsTableX + 2, yPosition + 5);
      pdf.text("Accuracy", metricsTableX + metricColWidth + 2, yPosition + 5);
      yPosition += metricRowHeight;

      pdf.setFont("helvetica", "normal");
      categoryAccuracy.forEach((cat, idx) => {
        if (yPosition > pageHeight - 25) {
          pdf.addPage();
          yPosition = 15;
          pdf.setFont("helvetica", "normal");
        }

        if (idx % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
        } else {
          pdf.setFillColor(255, 255, 255);
        }

        pdf.setDrawColor(220, 220, 220);
        pdf.rect(
          metricsTableX,
          yPosition,
          metricColWidth,
          metricRowHeight,
          "FD"
        );
        pdf.rect(
          metricsTableX + metricColWidth,
          yPosition,
          valueColWidth,
          metricRowHeight,
          "FD"
        );

        pdf.setTextColor(50, 50, 50);
        pdf.text(cat.category, metricsTableX + 2, yPosition + 5);

        const trendSymbol = cat.trend === "\u2191" ? "(up)" : "(down)";
        pdf.setTextColor(...colors.dark);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `${cat.accuracy} ${trendSymbol}`,
          metricsTableX + metricsTableWidth - 2,
          yPosition + 5,
          { align: "right" }
        );
        pdf.setFont("helvetica", "normal");

        yPosition += metricRowHeight;
      });

      yPosition += 6;

      if (yPosition > pageHeight - 45) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.text("[AI-DRIVEN INSIGHTS]", 15, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(60, 60, 60);

      insights.forEach((insight) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 15;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(60, 60, 60);
        }

        pdf.setFont("helvetica", "bold");
        const insightLabel =
          insight.type === "recommendation"
            ? "[ALERT]"
            : insight.type === "insight"
            ? "[INSIGHT]"
            : "[RISK]";
        pdf.text(`${insightLabel} ${insight.title}`, 18, yPosition);
        yPosition += 4;

        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(insight.message, pageWidth - 40);
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * 3.5 + 3;
      });

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

      const filename = `forecast-${selectedRegion
        .replace(/\s+/g, "-")
        .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(filename);
      showSuccessToast(
        `Forecast report exported successfully! File: ${filename}`
      );
    } catch (error) {
      console.error("Export error:", error);
      showErrorToast(`Failed to export forecast: ${error.message}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Forecasting
          </h1>
          <p className="text-gray-500 dark:text-slate-300">
            Generate AI-driven forecasts by category and region
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleExportForecast}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FileText size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Model Accuracy" value={modelMetrics.accuracy} />
        <StatCard title="MAPE Error" value={modelMetrics.mape} />
        <StatCard title="Confidence Score" value={modelMetrics.confidence} />
        <StatCard
          title="Last Updated"
          value={getTimeAgo(modelMetrics.updatedAt)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard
            title="6-Week Demand Forecast"
            subtitle="Predicted demand with confidence intervals"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#1976d2"
                  name="Predicted"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#17a697"
                  name="Upper Bound"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#f9a825"
                  name="Lower Bound"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div>
          <div className="card h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              AI Insights
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {insights.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    item.type === "alert"
                      ? "bg-red-50 border-l-danger dark:bg-red-950/60"
                      : item.type === "recommendation"
                      ? "bg-blue-50 border-l-primary dark:bg-slate-800"
                      : "bg-green-50 border-l-success dark:bg-emerald-900/50"
                  }`}
                >
                  <div className="flex gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Forecast Accuracy by Category
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Accuracy</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {categoryAccuracy.map((item) => (
                <tr
                  key={item.category}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <td className="text-gray-900 dark:text-slate-100">
                    {item.category}
                  </td>
                  <td className="text-gray-600 dark:text-slate-300">
                    {item.accuracy}
                  </td>
                  <td className={`font-semibold ${item.color}`}>
                    {item.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Forecast Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input w-full"
            >
              <option>All India</option>
              <option>North (Delhi, Punjab, Himachal Pradesh)</option>
              <option>South (Tamil Nadu, Karnataka, Telangana)</option>
              <option>East (West Bengal, Odisha, Bihar)</option>
              <option>West (Mumbai, Gujarat, Rajasthan)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Footwear</option>
              <option>Apparel</option>
              <option>Sports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input w-full"
            >
              <option>6 Weeks</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerateForecast}
          disabled={loading}
          className="btn btn-primary mt-4 disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : `Generate Forecast for ${selectedRegion}`}
        </button>
      </div>
    </div>
  );
}

export default Forecasting;
