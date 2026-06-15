import { getPM10Category, getUncertaintyCategory } from "@/lib/pm10";
import { avgUncertainty } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, Layers, Activity, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  total: number;
  avg: number;
  highestArea: string;
  highestValue: number;
  lowestArea: string;
  lowestValue: number;
  isUncertainty?: boolean;
}

export default function StatsCards({
  total,
  avg,
  highestArea,
  highestValue,
  lowestArea,
  lowestValue,
  isUncertainty = false,
}: StatsCardsProps) {
  
  const cards = isUncertainty
    ? [
        {
          title: "TOTAL KECAMATAN",
          value: total,
          subtitle: "Wilayah DKI Jakarta",
          description: "Unit spasial teranalisis",
          icon: Layers,
          iconColor: "text-slate-500",
          iconBg: "bg-slate-50",
          accentBorder: "border-t-slate-500",
        },
        {
          title: "RATA-RATA KETIDAKPASTIAN",
          value: avg.toFixed(2),
          subtitle: "Standard Deviation",
          description: `Kategori rata-rata: ${getUncertaintyCategory(avg, avgUncertainty)}`,
          icon: Activity,
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50",
          accentBorder: "border-t-blue-500",
        },
        {
          title: "WILAYAH PALING TIDAK PASTI",
          value: highestArea,
          subtitle: `Uncertainty: ${highestValue.toFixed(2)}`,
          description: `Tingkat: ${getUncertaintyCategory(highestValue, avgUncertainty)}`,
          icon: AlertTriangle,
          iconColor: "text-red-500",
          iconBg: "bg-red-50",
          accentBorder: "border-t-red-500",
          isAlert: true,
        },
        {
          title: "WILAYAH PALING PASTI",
          value: lowestArea,
          subtitle: `Uncertainty: ${lowestValue.toFixed(2)}`,
          description: `Tingkat: ${getUncertaintyCategory(lowestValue, avgUncertainty)}`,
          icon: ShieldCheck,
          iconColor: "text-emerald-500",
          iconBg: "bg-emerald-50",
          accentBorder: "border-t-emerald-500",
          isSuccess: true,
        },
      ]
    : [
        {
          title: "TOTAL KECAMATAN",
          value: total,
          subtitle: "Wilayah DKI Jakarta",
          description: "Unit spasial teranalisis",
          icon: Layers,
          iconColor: "text-slate-500",
          iconBg: "bg-slate-50",
          accentBorder: "border-t-slate-500",
        },
        {
          title: "RATA-RATA PM10",
          value: avg.toFixed(1),
          subtitle: "µg/m³",
          description: `Kategori rata-rata: ${getPM10Category(avg)}`,
          icon: Activity,
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50",
          accentBorder: "border-t-blue-500",
        },
        {
          title: "WILAYAH PALING TERCEMAR",
          value: highestArea,
          subtitle: `PM10: ${highestValue.toFixed(1)} µg/m³`,
          description: `Kategori: ${getPM10Category(highestValue)}`,
          icon: ShieldAlert,
          iconColor: "text-red-500",
          iconBg: "bg-red-50",
          accentBorder: "border-t-red-500",
          isAlert: true,
        },
        {
          title: "WILAYAH PALING BERSIH",
          value: lowestArea,
          subtitle: `PM10: ${lowestValue.toFixed(1)} µg/m³`,
          description: `Kategori: ${getPM10Category(lowestValue)}`,
          icon: ShieldCheck,
          iconColor: "text-emerald-500",
          iconBg: "bg-emerald-50",
          accentBorder: "border-t-emerald-500",
          isSuccess: true,
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={cn(
              "bg-white rounded-xl shadow-sm border border-slate-200 border-t-4 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300",
              card.accentBorder
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                {card.title}
              </span>
              <div className={cn("p-1.5 rounded-lg", card.iconBg)}>
                <Icon className={cn("w-4 h-4", card.iconColor)} />
              </div>
            </div>

            <div className="flex flex-col">
              <h3
                className={cn(
                  "font-bold tracking-tight leading-none truncate text-slate-800",
                  typeof card.value === "string" 
                    ? "text-lg md:text-xl" 
                    : "text-3xl md:text-4xl"
                )}
                title={String(card.value)}
              >
                {card.value}
              </h3>
              <span className="text-xs font-semibold mt-1.5 text-slate-500">
                {card.subtitle}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                {card.description}
              </span>
              {card.isAlert && (
                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wider">
                  Tinggi
                </span>
              )}
              {card.isSuccess && (
                <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Rendah
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
