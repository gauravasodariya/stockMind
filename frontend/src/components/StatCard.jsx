import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold text-gray-500 dark:text-slate-300 uppercase">
          {title}
        </h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
        {value}
      </div>
      {change && (
        <div
          className={`flex items-center gap-1 text-sm ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(change)}% vs last month</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
