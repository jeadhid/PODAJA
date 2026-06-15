"use client";

import React, { useState } from "react";
import { ModelType, ModelResult } from "@/types";
import { getSummaryStats, getUncertaintyStats } from "@/lib/data";
import StatsCards from "./stat-cards";
import JakartaChoropleth from "../maps/jakarta-choropleth";
import RankingSidebar from "./ranking-sidebar";
import RankingTable from "./ranking-table";
import { cn } from "@/lib/utils";

interface ModelDashboardProps {
  model: ModelType;
  title: string;
  description: string;
  data: ModelResult[];
}

export default function ModelDashboard({
  model,
  title,
  description,
  data,
}: ModelDashboardProps) {
  const [mode, setMode] = useState<"prediction" | "uncertainty">("prediction");

  // Determine stats dynamically
  const isHBSTM = model === "hbstm";
  const isUncertainty = isHBSTM && mode === "uncertainty";

  const stats = isUncertainty 
    ? getUncertaintyStats() 
    : getSummaryStats(model);

  return (
    <div className="flex flex-col space-y-6">
      {/* Header section with Title and Segmented Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isUncertainty 
              ? "Visualisasi ketidakpastian spasial (standard deviation) estimasi PM10 menggunakan HBSTM."
              : description}
          </p>
        </div>

        {/* HBSTM Segmented Toggle */}
        {isHBSTM && (
          <div className="flex items-center self-start md:self-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setMode("prediction")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200",
                mode === "prediction"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              )}
            >
              Prediction
            </button>
            <button
              onClick={() => setMode("uncertainty")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200",
                mode === "uncertainty"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              )}
            >
              Uncertainty
            </button>
          </div>
        )}
      </div>

      {/* TOP ROW: Stats Cards */}
      <StatsCards
        total={stats.total}
        avg={stats.avg}
        highestArea={stats.highestArea}
        highestValue={stats.highestValue}
        lowestArea={stats.lowestArea}
        lowestValue={stats.lowestValue}
        isUncertainty={isUncertainty}
      />

      {/* MAIN CONTENT: Map & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left GIS Map: 70% width */}
        <div className="lg:col-span-7 flex flex-col">
          <JakartaChoropleth
            model={model}
            mode={mode}
            data={data}
          />
        </div>

        {/* Right Sidebar Leaderboard: 30% width */}
        <div className="lg:col-span-3 flex flex-col">
          <RankingSidebar
            data={data}
            model={model}
            mode={mode}
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Ranking Table */}
      <div className="w-full">
        <RankingTable
          data={data}
          model={model}
          mode={mode}
        />
      </div>
    </div>
  );
}
