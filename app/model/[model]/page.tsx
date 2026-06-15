"use client";

import React from "react";
import { notFound } from "next/navigation";
import { ModelType } from "@/types";
import { modelResults } from "@/lib/data";
import ModelDashboard from "@/components/dashboard/model-dashboard";

interface ModelPageProps {
  params: Promise<{
    model: string;
  }>;
}

const MODEL_INFO: Record<Exclude<ModelType, "ensemble">, {
  title: string;
  desc: string;
}> = {
  hbstm: {
    title: "Hierarchical Bayesian Spatio-Temporal Model (HBSTM)",
    desc: "Visualisasi hasil estimasi polusi udara PM10 menggunakan pendekatan Bayesian spasio-temporal.",
  },
  lstm: {
    title: "Long Short-Term Memory (LSTM) Neural Network",
    desc: "Visualisasi hasil estimasi polusi udara PM10 menggunakan model temporal Deep Learning.",
  },
  xgboost: {
    title: "Extreme Gradient Boosting (XGBoost)",
    desc: "Visualisasi hasil estimasi polusi udara PM10 menggunakan ensemble gradient boosted decision trees.",
  },
};

export default function ModelPage({ params }: ModelPageProps) {
  const unwrappedParams = React.use(params);
  const model = unwrappedParams.model;

  const validModels = ["hbstm", "lstm", "xgboost"];
  if (!validModels.includes(model)) {
    notFound();
  }

  const modelType = model as Exclude<ModelType, "ensemble">;
  const info = MODEL_INFO[modelType];

  return (
    <div className="animate-fade-in pb-12">
      <ModelDashboard
        model={modelType}
        title={info.title}
        description={info.desc}
        data={modelResults}
      />
    </div>
  );
}
