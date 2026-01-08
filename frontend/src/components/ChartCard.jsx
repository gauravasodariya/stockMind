import React from "react";

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
}

export default ChartCard;
