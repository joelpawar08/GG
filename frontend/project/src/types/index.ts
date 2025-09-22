export interface User {
  username: string;
  name: string;
  role: string;
}

export interface RiskAssessmentInput {
  X: number;
  Y: number;
  Z: number;
  Rock_Type: string;
  Ore_Grade_percent: number;
  Tonnage: number;
  Ore_Value_per_tonne: number;
  Mining_Cost: number;
  Processing_Cost: number;
}

export interface PredictionResponse {
  success: boolean;
  prediction: {
    risk_label: string;
    confidence: number;
    grid_position: { x: number; y: number };
  };
  explanation: string;
  key_factors: string[];
  safety_recommendations: string[];
  input_summary: {
    location: string;
    rock_type: string;
    ore_details: string;
    economic_summary: string;
  };
  metadata: {
    rock_type_original: string;
    total_value: number;
    profit_margin: number;
  };
}

export interface RecentAssessment {
  id: string;
  location: string;
  coordinates: string;
  rockType: string;
  riskLevel: 'High Risk' | 'Low Risk';
  confidence: number;
  date: string;
  tonnage: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface LocationData {
  x: number;
  y: number;
  risk: 'High' | 'Low';
  location: string;
}

export interface MineLocation {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
  type: string;
  production: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  operationalStatus: 'Active' | 'Inactive' | 'Under Development';
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}