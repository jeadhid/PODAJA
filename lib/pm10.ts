export type PM10Category = 'Baik' | 'Sedang' | 'Tidak Sehat' | 'Sangat Tidak Sehat' | 'Berbahaya';
export type UncertaintyCategory = 'Very Certain' | 'Normal' | 'Uncertain';

export function getPM10Category(pm10: number): PM10Category {
  if (pm10 <= 50) return "Baik";
  if (pm10 <= 150) return "Sedang";
  if (pm10 <= 250) return "Tidak Sehat";
  if (pm10 <= 350) return "Sangat Tidak Sehat";
  return "Berbahaya";
}

export function getUncertaintyCategory(value: number, avgUncertainty: number): UncertaintyCategory {
  if (value < avgUncertainty * 0.75) return "Very Certain";
  if (value > avgUncertainty * 1.25) return "Uncertain";
  return "Normal";
}

export const PM10_COLORS: Record<PM10Category, string> = {
  Baik: "#22c55e",
  Sedang: "#84cc16",
  "Tidak Sehat": "#facc15",
  "Sangat Tidak Sehat": "#f97316",
  Berbahaya: "#dc2626",
};

export const UNCERTAINTY_COLORS: Record<UncertaintyCategory, string> = {
  "Very Certain": "#22c55e", // Green
  Normal: "#facc15",        // Yellow
  Uncertain: "#dc2626",     // Red
};

export const PM10_BG_CLASSES: Record<PM10Category, string> = {
  Baik: "bg-green-50 text-green-700 border-green-200",
  Sedang: "bg-lime-50 text-lime-700 border-lime-200",
  "Tidak Sehat": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Sangat Tidak Sehat": "bg-orange-50 text-orange-700 border-orange-200",
  Berbahaya: "bg-red-50 text-red-700 border-red-200",
};

export const UNCERTAINTY_BG_CLASSES: Record<UncertaintyCategory, string> = {
  "Very Certain": "bg-green-50 text-green-700 border-green-200",
  Normal: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Uncertain: "bg-red-50 text-red-700 border-red-200",
};
