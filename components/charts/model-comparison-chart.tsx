"use client";

import { ModelMetrics } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ModelComparisonChartProps {
  metrics: ModelMetrics;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
  payload?: {
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export default function ModelComparisonChart({ metrics }: ModelComparisonChartProps) {
  // Format data for Recharts
  const data = [
    {
      name: "HBSTM",
      RMSE: metrics.hbstm.rmse,
      MAPE: metrics.hbstm.mape,
      color: "#3b82f6", // Blue
    },
    {
      name: "LSTM",
      RMSE: metrics.lstm.rmse,
      MAPE: metrics.lstm.mape,
      color: "#10b981", // Emerald (Best)
    },
    {
      name: "XGBoost",
      RMSE: metrics.xgboost.rmse,
      MAPE: metrics.xgboost.mape,
      color: "#f59e0b", // Amber
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-md text-xs font-sans">
          <p className="font-extrabold mb-1.5 border-b border-slate-700 pb-1 uppercase tracking-wide">
            Model: {label}
          </p>
          {payload.map((p) => {
            const barColor = p.color || p.payload?.color || "#3b82f6";
            return (
              <p key={p.name} className="flex justify-between space-x-4 py-0.5">
                <span className="text-slate-400 font-medium">{p.name}:</span>
                <span className="font-extrabold" style={{ color: barColor }}>
                  {p.value.toFixed(2)} {p.name === "MAPE" ? "%" : "µg/m³"}
                </span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* RMSE Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="pb-3 mb-3 border-b border-slate-100">
          <h4 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
            Root Mean Squared Error (RMSE)
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Nilai error kuadrat rata-rata (Semakin rendah semakin baik)
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="RMSE" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MAPE Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="pb-3 mb-3 border-b border-slate-100">
          <h4 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
            Mean Absolute Percentage Error (MAPE)
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Persentase rata-rata penyimpangan prediksi (Semakin rendah semakin baik)
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="MAPE" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
