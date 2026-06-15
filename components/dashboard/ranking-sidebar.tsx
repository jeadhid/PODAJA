import { ModelResult, ModelType } from "@/types";
import { getModelValue } from "@/lib/data";

interface RankingSidebarProps {
  data: ModelResult[];
  model: ModelType;
  mode?: "prediction" | "uncertainty";
}

export default function RankingSidebar({
  data,
  model,
  mode = "prediction",
}: RankingSidebarProps) {
  const isUncertainty = model === "hbstm" && mode === "uncertainty";

  // Map data with values
  const recordsWithValues = data.map((row) => {
    const value = isUncertainty
      ? row.pm10_hbstm_uncertainty
      : getModelValue(row, model);

    return {
      row,
      value,
    };
  });

  // Top list (Highest value first)
  const topList = [...recordsWithValues]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Bottom list (Lowest value first)
  const bottomList = [...recordsWithValues]
    .sort((a, b) => a.value - b.value)
    .slice(0, 5);

  // Define labels
  const topLabel = isUncertainty ? "Top 5 Paling Tidak Pasti" : "Top 5 Paling Tercemar";
  const bottomLabel = isUncertainty ? "Top 5 Paling Pasti" : "Top 5 Paling Bersih";

  const topColor = isUncertainty ? "bg-red-500" : "bg-red-500";
  const bottomColor = isUncertainty ? "bg-emerald-500" : "bg-emerald-500";

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Top Card (Highest Polluted/Uncertain) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100">
          <span className={`w-2.5 h-2.5 rounded-full inline-block ${topColor}`}></span>
          <h4 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
            {topLabel}
          </h4>
        </div>

        <div className="flex flex-col divide-y divide-slate-50">
          {topList.map((item, idx) => (
            <div key={item.row.kecamatan_name} className="flex justify-between items-center py-2.5">
              <div className="flex items-center space-x-3 truncate">
                <span className="text-xs font-bold text-slate-400 w-4">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate" title={item.row.kecamatan_name}>
                  {item.row.kecamatan_name}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-extrabold text-slate-800">
                  {item.value.toFixed(isUncertainty ? 2 : 1)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isUncertainty ? "" : "µg/m³"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Card (Lowest Polluted/Uncertain) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-100">
          <span className={`w-2.5 h-2.5 rounded-full inline-block ${bottomColor}`}></span>
          <h4 className="text-xs font-extrabold tracking-wider text-slate-700 uppercase">
            {bottomLabel}
          </h4>
        </div>

        <div className="flex flex-col divide-y divide-slate-50">
          {bottomList.map((item, idx) => (
            <div key={item.row.kecamatan_name} className="flex justify-between items-center py-2.5">
              <div className="flex items-center space-x-3 truncate">
                <span className="text-xs font-bold text-slate-400 w-4">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate" title={item.row.kecamatan_name}>
                  {item.row.kecamatan_name}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-extrabold text-slate-800">
                  {item.value.toFixed(isUncertainty ? 2 : 1)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isUncertainty ? "" : "µg/m³"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
