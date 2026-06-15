export type ModelType = 'hbstm' | 'lstm' | 'xgboost' | 'ensemble';

export interface ModelResult {
  kecamatan_name: string;
  latitude: number;
  longitude: number;
  mean_pm10_hbstm: number;
  pm10_hbstm_uncertainty: number;
  xgb_pm10: number;
  lstm_pm10: number;
  // Computed dynamically
  ensemble_pm10?: number;
}

export interface MetricDetail {
  rmse: number;
  mape: number;
}

export interface ModelMetrics {
  hbstm: MetricDetail;
  lstm: MetricDetail;
  xgboost: MetricDetail;
}
