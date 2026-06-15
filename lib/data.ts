import { ModelResult, ModelMetrics, ModelType } from "../types";
import modelResultJson from "../public/data/model_result.json";
import metrikModelJson from "../public/data/metrik_model.json";

// Cast JSON imports
const rawModelResults = modelResultJson as Omit<ModelResult, 'ensemble_pm10'>[];
export const modelMetricsData = metrikModelJson as ModelMetrics;

// Map results to compute the ensemble value for each area
export const modelResults: ModelResult[] = rawModelResults.map(row => ({
  ...row,
  ensemble_pm10: (row.mean_pm10_hbstm + row.xgb_pm10 + row.lstm_pm10) / 3
}));

// Calculate overall average uncertainty for HBSTM
export const avgUncertainty = modelResults.reduce((acc, row) => acc + row.pm10_hbstm_uncertainty, 0) / modelResults.length;

/**
 * Get PM10 value based on selected model
 */
export function getModelValue(row: ModelResult, model: ModelType): number {
  switch (model) {
    case 'hbstm':
      return row.mean_pm10_hbstm;
    case 'lstm':
      return row.lstm_pm10;
    case 'xgboost':
      return row.xgb_pm10;
    case 'ensemble':
    default:
      return row.ensemble_pm10 || 0;
  }
}

/**
 * Get summary stats for predictions
 */
export function getSummaryStats(model: ModelType) {
  if (modelResults.length === 0) {
    return {
      total: 0,
      avg: 0,
      highestArea: "-",
      highestValue: 0,
      lowestArea: "-",
      lowestValue: 0
    };
  }

  let totalValue = 0;
  let highestArea = "";
  let highestValue = -Infinity;
  let lowestArea = "";
  let lowestValue = Infinity;

  modelResults.forEach(row => {
    const val = getModelValue(row, model);
    totalValue += val;
    if (val > highestValue) {
      highestValue = val;
      highestArea = row.kecamatan_name;
    }
    if (val < lowestValue) {
      lowestValue = val;
      lowestArea = row.kecamatan_name;
    }
  });

  return {
    total: modelResults.length,
    avg: totalValue / modelResults.length,
    highestArea,
    highestValue,
    lowestArea,
    lowestValue
  };
}

/**
 * Get summary stats for HBSTM Uncertainty mode
 */
export function getUncertaintyStats() {
  if (modelResults.length === 0) {
    return {
      total: 0,
      avg: 0,
      highestArea: "-",
      highestValue: 0,
      lowestArea: "-",
      lowestValue: 0
    };
  }

  let totalValue = 0;
  let highestArea = "";
  let highestValue = -Infinity;
  let lowestArea = "";
  let lowestValue = Infinity;

  modelResults.forEach(row => {
    const val = row.pm10_hbstm_uncertainty;
    totalValue += val;
    if (val > highestValue) {
      highestValue = val;
      highestArea = row.kecamatan_name;
    }
    if (val < lowestValue) {
      lowestValue = val;
      lowestArea = row.kecamatan_name;
    }
  });

  return {
    total: modelResults.length,
    avg: totalValue / modelResults.length,
    highestArea, // Most Uncertain
    highestValue,
    lowestArea, // Most Certain (lowest uncertainty)
    lowestValue
  };
}
