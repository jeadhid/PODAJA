"use client";

import React from "react";
import { BookOpen, User, Database, Layers, Info, Code } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col space-y-8 pb-12 animate-fade-in">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Info className="w-6 h-6 text-slate-800" />
          <span>Tentang PODAJA</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detail akademis, metodologi penelitian, parameter dataset, dan profil penelitian tugas akhir.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Center: Thesis Info & Methodology - Spans 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thesis Detail Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                Judul & Abstrak Penelitian
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  ANALISIS KOMPARATIF MODEL HIERARCHICAL BAYESIAN SPATIO-TEMPORAL, LONG SHORT-TERM MEMORY, DAN EXTREME GRADIENT BOOSTING UNTUK PREDIKSI KUALITAS UDARA DKI JAKARTA BERBASIS WEB
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  KATEGORI: PRESENTASI TESIS & PERBANDINGAN MODEL
                </p>
              </div>

              <p className="text-xs text-slate-650 leading-relaxed">
                Keterbatasan stasiun pemantau fisik kualitas udara (sensor DLH) di DKI Jakarta menyebabkan tidak meratanya ketersediaan data spasial polusi atau blank spots. Penelitian ini bertujuan untuk melakukan evaluasi komparatif antara model <strong>Hierarchical Bayesian Spatio-Temporal (HBSTM)</strong>, <strong>Long Short-Term Memory (LSTM)</strong>, dan <strong>Extreme Gradient Boosting (XGBoost)</strong> guna memprediksi konsentrasi Particulate Matter 10 (PM10) di lokasi tanpa sensor.
                Evaluasi dilakukan menggunakan teknik <strong>Leave-One-Location-Out (LOLO) Cross-Validation</strong> untuk menguji kemampuan interpolasi spasial. Hasil pengujian membuktikan bahwa algoritma XGBoost merupakan model terbaik dengan tingkat akurasi tertinggi, mencatatkan rata-rata RMSE global minimum sebesar 13.206 µg/m3 dan MAPE terkecil sebesar 20,79%. LSTM menempati peringkat kedua, sementara HBSTM memiliki performa terendah akibat adanya spatial smoothing bias pada wilayah dengan anomali ekstrem. Algoritma XGBoost kemudian diimplementasikan sebagai mesin inferensi utama (core inference engine) pada dashboard PODAJA untuk menyajikan pemetaan polusi secara real-time dan responsif.
              </p>
            </div>
          </div>

          {/* Research Objectives */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <Layers className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                Tujuan Penelitian
              </h3>
            </div>

            <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>
                <strong>Pembangunan Model Spasial-Temporal:</strong> Membangun arsitektur model HBSTM, LSTM, dan XGBoost yang disesuaikan untuk karakteristik data spasial-temporal kualitas udara di Jakarta
              </li>
              <li>
                <strong>Evaluasi Akurasi Prediksi:</strong> Mengevaluasi akurasi ketiga model komputasi tersebut dalam memprediksi tingkat polusi di area yang tidak memiliki sensor pemantau fisik.
              </li>
              <li>
                <strong>Pengembangan Dasbor Interaktif:</strong> Mengembangkan aplikasi berbasis web dengan arsitektur penarikan data statis (pre-computed data dashboard) sebagai sarana visualisasi. Sistem ini memungkinkan pengguna mengeksplorasi peta tingkat risiko polusi (PM10) per kecamatan dan membandingkan performa metrik dari ketiga algoritma prediksi secara interaktif.
              </li>
            </ul>
          </div>

          {/* Dataset Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <Database className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                Deskripsi Dataset & Cakupan Wilayah
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                Penelitian ini menggunakan data sekunder yang terdiri dari deret waktu harian konsentrasi polutan udara (Particulate Matter / PM10) beserta data koordinat stasiun pemantau.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-2.5">
                <div>
                  <span className="font-extrabold text-slate-850 uppercase text-[10px] tracking-wide block">Sumber Data dan Periode Observasi</span>
                  <p className="text-slate-500 mt-0.5">
                    Data historis PM10 diperoleh dari portal Satu Data Jakarta (melalui agregasi Kaggle). Data yang digunakan mencakup periode observasi aktif dari 1 Januari 2010 hingga 31 Desember 2024.
                  </p>
                </div>
                <div>
                  <span className="font-extrabold text-slate-850 uppercase text-[10px] tracking-wide block">Cakupan Wilayah</span>
                  <p className="text-slate-500 mt-0.5">
                    Observasi diambil dari lima stasiun resmi, yaitu DKI 1 (Bundaran HI), DKI 2 (Kelapa Gading), DKI 3 (Jagakarsa), DKI 4 (Lubang Buaya), dan DKI 5 (Kebon Jeruk).
                  </p>
                </div>
                <div>
                  <span className="font-extrabold text-slate-850 uppercase text-[10px] tracking-wide block">Pengecualian Data (Kepulauan Seribu)</span>
                  <p className="text-slate-500 mt-0.5 text-rose-700 font-medium">
                    Penelitian ini secara eksplisit mengecualikan wilayah Kepulauan Seribu dikarenakan karakteristik geografis kepulauan dan keterbatasan variabel pendukung yang tidak konsisten dengan daratan Jakarta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Author & Institutional Profile - Spans 1 column */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
              <User className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
                Profil Peneliti
              </h3>
            </div>

            {/* Avatar Placeholder */}
            <div className="flex flex-col items-center py-4 text-center border-b border-slate-100 pb-4 mb-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl shadow-inner mb-3">
                J
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">Jeson Adhi Dharma</h4>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide mt-0.5">MAHASISWA PENELITI / MAHASISWA TUGAS AKHIR</p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block">Institusi</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">BINUS University</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block">Fakultas / Departemen</span>
                <span className="font-bold text-slate-800 text-[11px] mt-0.5 block">Computer Science and Statistics</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block">Kontak</span>
                <span className="font-semibold text-slate-650 mt-0.5 block">jeson.dharma@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Academic Disclaimer */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2.5 text-slate-550 leading-relaxed text-xs">
            <h5 className="font-bold text-slate-700 uppercase text-[10px] tracking-wide">Pemberitahuan Akademis</h5>
            <p>
              Dashboard PODAJA ini dikembangkan murni untuk kepentingan pameran sidang tesis, pertahanan tugas akhir, dan penulisan jurnal ilmiah.
            </p>
            <p className="text-red-700 font-semibold">
              Sistem ini tidak dirancang untuk monitoring polusi real-time, prakiraan operasional harian, atau layanan peringatan dini kualitas udara publik.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
          <Code className="w-5 h-5 text-slate-800" />
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
            Arsitektur Teknologi Dashboard
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-center text-xs">
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Next.js 15</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">App Router Architecture</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">TypeScript</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">Static Type System</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Tailwind CSS</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">Fluid Responsive styling</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Shadcn/UI</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">Clean Accessibility Components</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">React Simple Maps</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">SVG GIS Geographies</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Recharts</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">SVG Chart Framework</span>
          </div>
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-center">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">TanStack Table</span>
            <span className="text-[9px] text-slate-400 mt-1 font-medium">Headless Data Grid</span>
          </div>
        </div>
      </div>
    </div>
  );
}
