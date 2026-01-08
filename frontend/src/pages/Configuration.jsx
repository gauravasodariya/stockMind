import React, { useState, useEffect } from "react";
import ChartCard from "../components/ChartCard";

function Configuration() {
  const [lowStockThreshold, setLowStockThreshold] = useState(
    localStorage.getItem("lowStockThreshold") || 20
  );
  const [forecastRiskThreshold, setForecastRiskThreshold] = useState(
    localStorage.getItem("forecastRiskThreshold") || 15
  );
  const [saved, setSaved] = useState(false);

  const handleSaveThresholds = () => {
    try {
      localStorage.setItem("lowStockThreshold", lowStockThreshold);
      localStorage.setItem("forecastRiskThreshold", forecastRiskThreshold);
      setSaved(true);
      alert(
        `Thresholds saved successfully!\nLow Stock: ${lowStockThreshold}%\nForecast Risk: ${forecastRiskThreshold}%`
      );
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Failed to save thresholds");
    }
  };
  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Configuration
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Alert thresholds"
          subtitle="Set stock and forecast alerts"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Low stock threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Forecast risk threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={forecastRiskThreshold}
                onChange={(e) => setForecastRiskThreshold(e.target.value)}
                className="input w-full"
              />
            </div>
            <button
              onClick={handleSaveThresholds}
              className={`btn w-full ${saved ? "btn-success" : "btn-primary"}`}
            >
              {saved ? "✓ Saved" : "Save thresholds"}
            </button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default Configuration;
