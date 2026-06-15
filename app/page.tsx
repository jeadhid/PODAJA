"use client";

import React from "react";
import { modelResults } from "@/lib/data";
import ModelDashboard from "@/components/dashboard/model-dashboard";

export default function OverviewPage() {
  return (
    <div className="animate-fade-in pb-12">
      <ModelDashboard
        model="ensemble"
        title="Overview Estimasi PM10 Jakarta"
        description="Visualisasi rata-rata estimasi spasial polusi udara PM10 DKI Jakarta menggunakan Model Ensemble."
        data={modelResults}
      />
    </div>
  );
}
