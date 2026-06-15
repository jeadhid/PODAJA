"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { ModelType, ModelResult } from "@/types";
import { getModelValue, avgUncertainty } from "@/lib/data";
import { 
  getPM10Category, 
  getUncertaintyCategory, 
  PM10_COLORS, 
  UNCERTAINTY_COLORS 
} from "@/lib/pm10";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface JakartaChoroplethProps {
  model: ModelType;
  mode?: "prediction" | "uncertainty"; // Used for HBSTM toggle
  data: ModelResult[];
  isMini?: boolean;
}

export default function JakartaChoropleth({
  model,
  mode = "prediction",
  data,
  isMini = false,
}: JakartaChoroplethProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([106.8456, -6.21]);
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    value: number;
    category: string;
    x: number;
    y: number;
  } | null>(null);

  // Fetch GeoJSON in client-side
  useEffect(() => {
    fetch("/data/kecamatan_jakarta.geojson")
      .then((res) => res.json())
      .then((geoJson) => {
        setGeoData(geoJson);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading GeoJSON:", err);
        setLoading(false);
      });
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    if (zoom < 5) setZoom((z) => z + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) setZoom((z) => z - 0.5);
  };

  const handleReset = () => {
    setZoom(1);
    setCenter([106.8456, -6.21]);
  };

  if (loading) {
    return (
      <div className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 p-5 w-full flex flex-col justify-center items-center",
        isMini ? "h-[280px]" : "h-[500px]"
      )}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        {!isMini && <span className="text-sm text-slate-500 mt-3 font-medium">Loading Map Data...</span>}
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 p-5 w-full flex justify-center items-center",
        isMini ? "h-[280px]" : "h-[500px]"
      )}>
        <span className="text-sm text-red-500 font-semibold">Failed to load maps</span>
      </div>
    );
  }

  // Pre-filter geographies based on model_result.json to satisfy the requirement
  // "Only render polygons that exist in model_result.json, ignore unmatched polygons"
  const matchedFeatures = geoData.features.filter((feature: any) => {
    const name = feature.properties?.NAME_3;
    if (!name) return false;
    return data.some(
      (row) => row.kecamatan_name.toLowerCase() === name.toLowerCase()
    );
  });

  const displayGeoData = {
    ...geoData,
    features: matchedFeatures,
  };

  const isUncertainty = model === "hbstm" && mode === "uncertainty";

  return (
    <div className={cn(
      "relative bg-white rounded-xl shadow-sm border border-slate-200 p-5 w-full flex flex-col hover:shadow-md transition-all duration-300",
      isMini ? "p-3 min-h-0 h-[340px]" : "min-h-[500px]"
    )}>
      {/* Map Header */}
      {!isMini ? (
        <div className="flex justify-between items-start pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">
              {isUncertainty
                ? "Peta Ketidakpastian HBSTM (Uncertainty)"
                : `Peta Estimasi PM10 — ${model === "ensemble" ? "Ensemble" : model.toUpperCase()}`}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isUncertainty ? "Standard Deviation PM10" : "Konsentrasi PM10 (µg/m³)"}
            </p>
          </div>

          {/* Map Control Buttons */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 p-0.5 rounded-lg shadow-2xs">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Reset Map"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center font-bold text-xs uppercase text-slate-700 mb-2 border-b border-slate-100 pb-1">
          {model.toUpperCase()}
        </div>
      )}

      {/* Map Container */}
      <div className={cn(
        "relative flex-1 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center",
        isMini ? "min-h-0 h-[280px]" : "min-h-[380px]"
      )}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: isMini ? 45000 : 65000, // Slightly scaled down for mini viewport
          }}
          className="w-full h-full max-h-[480px] outline-none"
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={({ coordinates, zoom }) => {
              setCenter(coordinates as [number, number]);
              setZoom(zoom);
            }}
          >
            <Geographies geography={displayGeoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.NAME_3 || "Unknown Area";
                  
                  // Find prediction record in modelResult
                  const record = data.find(
                    (p) => p.kecamatan_name.toLowerCase() === name.toLowerCase()
                  );
                  
                  if (!record) return null;

                  let value = 0;
                  let color = "#cbd5e1";
                  let categoryStr = "";

                  if (isUncertainty) {
                    value = record.pm10_hbstm_uncertainty;
                    const cat = getUncertaintyCategory(value, avgUncertainty);
                    categoryStr = cat;
                    color = UNCERTAINTY_COLORS[cat];
                  } else {
                    value = getModelValue(record, model);
                    const cat = getPM10Category(value);
                    categoryStr = cat;
                    color = PM10_COLORS[cat];
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(event) => {
                        setTooltipContent({
                          name,
                          value,
                          category: categoryStr,
                          x: event.clientX,
                          y: event.clientY,
                        });
                      }}
                      onMouseMove={(event) => {
                        if (tooltipContent) {
                          setTooltipContent((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  x: event.clientX,
                                  y: event.clientY,
                                }
                              : null
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent(null);
                      }}
                      style={{
                        default: {
                          fill: color,
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: isMini ? 0.4 : 0.75,
                          transition: "fill 0.3s ease",
                        },
                        hover: {
                          fill: color,
                          outline: "none",
                          stroke: "#0f172a",
                          strokeWidth: 1.5,
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: color,
                          outline: "none",
                          stroke: "#0f172a",
                          strokeWidth: 2,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend in bottom-right corner of the map */}
        {!isMini && (
          <div className="absolute bottom-3 right-3 bg-white/95 border border-slate-200 rounded-xl p-3 shadow-md flex flex-col space-y-1.5 text-[10px] z-10 font-medium">
            {isUncertainty ? (
              <>
                <div className="font-extrabold text-slate-700 border-b border-slate-100 pb-1 mb-0.5 uppercase tracking-wide">
                  Ketidakpastian
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: UNCERTAINTY_COLORS["Very Certain"] }}></span>
                  <span className="text-slate-600 font-semibold">Very Certain (&lt; 0.75x Avg)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: UNCERTAINTY_COLORS.Normal }}></span>
                  <span className="text-slate-600 font-semibold">Normal (0.75x - 1.25x Avg)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: UNCERTAINTY_COLORS.Uncertain }}></span>
                  <span className="text-slate-600 font-semibold">Uncertain (&gt; 1.25x Avg)</span>
                </div>
              </>
            ) : (
              <>
                <div className="font-extrabold text-slate-700 border-b border-slate-100 pb-1 mb-0.5 uppercase tracking-wide">
                  Indeks PM10
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PM10_COLORS.Baik }}></span>
                  <span className="text-slate-600 font-semibold">Baik (&le; 50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PM10_COLORS.Sedang }}></span>
                  <span className="text-slate-600 font-semibold">Sedang (51 - 150)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PM10_COLORS["Tidak Sehat"] }}></span>
                  <span className="text-slate-600 font-semibold">Tidak Sehat (151 - 250)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PM10_COLORS["Sangat Tidak Sehat"] }}></span>
                  <span className="text-slate-600 font-semibold">Sangat Tidak Sehat (251 - 350)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PM10_COLORS.Berbahaya }}></span>
                  <span className="text-slate-600 font-semibold">Berbahaya (&gt; 350)</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Tooltip */}
      {tooltipContent && (
        <div
          className="fixed pointer-events-none bg-slate-900/95 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 z-50 flex flex-col space-y-1"
          style={{
            left: tooltipContent.x + 15,
            top: tooltipContent.y + 15,
          }}
        >
          <div className="font-extrabold text-[13px] border-b border-slate-700/50 pb-1 mb-1 tracking-wide">
            {tooltipContent.name}
          </div>
          <div className="flex justify-between items-center space-x-6">
            <span className="text-slate-400 font-medium">
              {isUncertainty ? "Uncertainty (SD):" : "PM10 Value:"}
            </span>
            <span className="font-extrabold text-white text-[12px]">
              {tooltipContent.value.toFixed(2)} {isUncertainty ? "" : "µg/m³"}
            </span>
          </div>
          <div className="flex justify-between items-center space-x-6">
            <span className="text-slate-400 font-medium">
              {isUncertainty ? "Confidence:" : "Kategori:"}
            </span>
            <span
              className="font-bold px-1.5 py-0.5 rounded text-[10px] text-slate-900 shadow-2xs"
              style={{
                backgroundColor: isUncertainty 
                  ? UNCERTAINTY_COLORS[tooltipContent.category as import("@/lib/pm10").UncertaintyCategory] 
                  : PM10_COLORS[tooltipContent.category as import("@/lib/pm10").PM10Category],
              }}
            >
              {tooltipContent.category}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
