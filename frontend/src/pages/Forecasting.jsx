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
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";
// DataTable not used on this page; removed to reduce bundle size

function Forecasting() {
  const [forecastData, setForecastData] = useState([
    { week: "W1", predicted: 450, lower: 380, upper: 520 },
    { week: "W2", predicted: 520, lower: 440, upper: 600 },
    { week: "W3", predicted: 580, lower: 500, upper: 660 },
    { week: "W4", predicted: 620, lower: 540, upper: 700 },
    { week: "W5", predicted: 680, lower: 590, upper: 770 },
    { week: "W6", predicted: 720, lower: 620, upper: 820 },
  ]);

  const [modelMetrics] = useState({
    accuracy: "94.2%",
    mape: "5.8%",
    confidence: "92%",
    updatedAt: "2 hours ago",
  });

  const [selectedRegion, setSelectedRegion] = useState("All India");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("6 Weeks");
  const [loading, setLoading] = useState(false);

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(
        `Forecast generated!\nRegion: ${selectedRegion}\nCategory: ${selectedCategory}\nPeriod: ${selectedPeriod}`
      );
    } catch (error) {
      alert("Failed to generate forecast");
    } finally {
      setLoading(false);
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
          <button className="btn btn-secondary flex items-center gap-2">
            <FileText size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Model Accuracy"
          value={modelMetrics.accuracy}
        />
        <StatCard title="MAPE Error" value={modelMetrics.mape}  />
        <StatCard
          title="Confidence Score"
          value={modelMetrics.confidence}
        />
        <StatCard
          title="Last Updated"
          value={modelMetrics.updatedAt}
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
                <tr key={item.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/80">
                  <td className="text-gray-900 dark:text-slate-100">{item.category}</td>
                  <td className="text-gray-600 dark:text-slate-300">{item.accuracy}</td>
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
          {loading ? "Generating..." : `Generate Forecast for ${selectedRegion}`}
        </button>
      </div>
    </div>
  );
}

export default Forecasting;
