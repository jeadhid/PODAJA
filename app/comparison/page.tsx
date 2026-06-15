"use client";

import React from "react";
import dynamic from "next/dynamic";
import { modelMetricsData, modelResults } from "@/lib/data";
import ModelComparisonChart from "@/components/charts/model-comparison-chart";
import { Award, BookOpen, BarChart3, Map } from "lucide-react";
import { cn } from "@/lib/utils";

// Load Choropleth map dynamically to disable SSR and avoid hydration errors
const JakartaChoropleth = dynamic(() => import("@/components/maps/jakarta-choropleth"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex justify-center items-center h-[340px]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin"></div>
        <span className="text-[10px] text-slate-400 mt-2 font-semibold">Loading Map...</span>
      </div>
    </div>
  )
});

export default function ComparisonPage() {
  const metrics = modelMetricsData;

  // Process ranking dynamically based on RMSE (lowest primary), then MAPE (lowest secondary)
  const ranking = [
    { 
      name: "HBSTM", 
      rmse: metrics.hbstm.rmse, 
      mape: metrics.hbstm.mape, 
      desc: "Hierarchical Bayesian Spatio-Temporal Model unggul dalam parameterisasi probabilistik dan pengelolaan ketidakpastian data spasio-temporal, meskipun secara metrik titik berada di posisi kedua." 
    },
    { 
      name: "LSTM", 
      rmse: metrics.lstm.rmse, 
      mape: metrics.lstm.mape, 
      desc: "Long Short-Term Memory neural network menempati peringkat tertinggi dengan nilai error (RMSE & MAPE) terendah. Ini membuktikan kekuatan Deep Learning temporal dalam mendeteksi pola fluktuasi PM10." 
    },
    { 
      name: "XGBoost", 
      rmse: metrics.xgboost.rmse, 
      mape: metrics.xgboost.mape, 
      desc: "Extreme Gradient Boosting menduduki peringkat ketiga. XGBoost sangat efisien secara komputasi dan baik dalam interaksi fitur non-linear, namun sedikit kurang optimal pada tren runtun waktu dibandingkan LSTM." 
    },
  ].sort((a, b) => {
    if (a.rmse !== b.rmse) return a.rmse - b.rmse;
    return a.mape - b.mape;
  });

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return { label: "1st Place", style: "bg-amber-100 text-amber-800 border-amber-300", medal: "🥇" };
      case 1:
        return { label: "2nd Place", style: "bg-slate-100 text-slate-800 border-slate-300", medal: "🥈" };
      case 2:
      default:
        return { label: "3rd Place", style: "bg-orange-100 text-orange-900 border-orange-200", medal: "🥉" };
    }
  };

  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-slate-800" />
          <span>Model Comparison Dashboard</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluasi terpadu metrik performa statistik dan visualisasi spasial model machine learning dalam mengestimasi PM10 di Jakarta.
        </p>
      </div>

      {/* SECTION 1: Performance Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* HBSTM Metrics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 mb-4 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                HBSTM
              </span>
              <span className="text-[10px] bg-slate-50 text-slate-600 font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                Bayesian Spatio-Temporal
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
              Hierarchical Bayesian Space-Time Model. Menangkap interaksi spatial-temporal secara hierarkis serta mengukur ketidakpastian.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">RMSE</span>
              <span className="text-lg font-black text-slate-800">{metrics.hbstm.rmse.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">MAPE</span>
              <span className="text-lg font-black text-slate-800">{metrics.hbstm.mape.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* LSTM Metrics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 mb-4 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                LSTM
              </span>
              <span className="text-[10px] bg-slate-50 text-slate-600 font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                Temporal Neural Net
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
              Long Short-Term Memory. Arsitektur RNN khusus untuk mendeteksi tren ketergantungan waktu jangka panjang.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">RMSE</span>
              <span className="text-lg font-black text-slate-800">{metrics.lstm.rmse.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">MAPE</span>
              <span className="text-lg font-black text-slate-800">{metrics.lstm.mape.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* XGBoost Metrics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 mb-4 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                XGBoost
              </span>
              <span className="text-[10px] bg-slate-50 text-slate-600 font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                Decision Tree Boosting
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
              Extreme Gradient Boosting. Model ensemble pohon keputusan dengan efisiensi komputasi tinggi dan prediksi akurat.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">RMSE</span>
              <span className="text-lg font-black text-slate-800">{metrics.xgboost.rmse.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">MAPE</span>
              <span className="text-lg font-black text-slate-800">{metrics.xgboost.mape.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Error Comparison Chart */}
      <ModelComparisonChart metrics={metrics} />

      {/* SECTION 3: Model Ranking */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
            Peringkat Performa Model
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Penentuan peringkat model dihitung secara otomatis dengan kriteria utama **Root Mean Squared Error (RMSE) terendah**, diikuti **Mean Absolute Percentage Error (MAPE) terendah** sebagai kriteria sekunder.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ranking.map((model, idx) => {
            const badge = getRankBadge(idx);
            return (
              <div
                key={model.name}
                className={cn(
                  "border rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all duration-200",
                  idx === 0 ? "border-amber-200 bg-amber-50/20" : "border-slate-200 bg-white"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{badge.medal}</span>
                      <h4 className="font-extrabold text-slate-800 tracking-wide text-base">
                        {model.name}
                      </h4>
                    </div>
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", badge.style)}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {model.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">RMSE</span>
                    <span className="text-sm font-extrabold text-slate-700">{model.rmse.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">MAPE</span>
                    <span className="text-sm font-extrabold text-slate-700">{model.mape.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Spatial Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
          <Map className="w-5 h-5 text-slate-800" />
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
            Perbandingan Spasial PM10
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Tiga peta mini di bawah menampilkan hasil estimasi spasial PM10 untuk setiap model secara berdampingan. Seluruh peta menggunakan **skala warna PM10 yang identik** untuk memudahkan interpretasi perbedaan pola distribusi polusi udara Jakarta secara spasial.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <JakartaChoropleth model="hbstm" mode="prediction" data={modelResults} isMini={true} />
          <JakartaChoropleth model="lstm" mode="prediction" data={modelResults} isMini={true} />
          <JakartaChoropleth model="xgboost" mode="prediction" data={modelResults} isMini={true} />
        </div>
        
        {/* Compact Legend for Spatial Comparison */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2 justify-center text-[10px] font-semibold text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]"></span>
            <span>Baik (&le; 50)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#84cc16]"></span>
            <span>Sedang (51 - 150)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#facc15]"></span>
            <span>Tidak Sehat (151 - 250)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316]"></span>
            <span>Sangat Tidak Sehat (251 - 350)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626]"></span>
            <span>Berbahaya (&gt; 350)</span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Methodology */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-slate-800" />
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
            Metodologi Estimasi Spasial
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 text-[13px] border-b border-slate-100 pb-1 uppercase tracking-wider">
              HBSTM (Statistical)
            </h4>
            <p>
              <strong>Hierarchical Bayesian Spatio-Temporal Model</strong> adalah model statistik formal yang memformulasikan dependensi spasial (kedekatan geografis) dan dependensi temporal (tren waktu) secara hierarkis. 
            </p>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 text-slate-500 font-medium">
              Keunggulan utama HBSTM adalah kemampuannya memodelkan **ketidakpastian spasial (uncertainty)** dalam estimasi secara probabilistik, yang direpresentasikan lewat standar deviasi hasil prediksi.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 text-[13px] border-b border-slate-100 pb-1 uppercase tracking-wider">
              LSTM (Deep Learning)
            </h4>
            <p>
              <strong>Long Short-Term Memory</strong> merupakan salah satu arsitektur jaringan saraf tiruan berulang (RNN) tercanggih. Dirancang khusus untuk mempelajari pola sekuensial deret waktu (time-series) jangka panjang tanpa mengalami masalah vanishing gradient.
            </p>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 text-slate-500 font-medium">
              Dalam pemodelan PM10, LSTM sangat handal mengekstraksi ketergantungan temporal jangka pendek dan panjang dari faktor musiman cuaca dan fluktuasi emisi harian Jakarta.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 text-[13px] border-b border-slate-100 pb-1 uppercase tracking-wider">
              XGBoost (Machine Learning)
            </h4>
            <p>
              <strong>Extreme Gradient Boosting</strong> adalah algoritma supervised learning berbasis ensemble decision tree yang dioptimalkan dengan teknik regularization dan gradient boosting yang sangat efisien secara komputasi.
            </p>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50 text-slate-500 font-medium">
              XGBoost sangat unggul dalam memetakan korelasi non-linear yang rumit antara fitur-fitur spasial lokal (seperti tata guna lahan, elevasi, kepadatan jalan) dengan polusi PM10.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
