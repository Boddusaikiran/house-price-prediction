export interface Prediction {
  id: string;
  city: string;
  locality: string;
  pincode?: string;
  bhk: number;
  total_area: number;
  bathrooms: number;
  floor_number?: number;
  total_floors?: number;
  property_age?: number;
  furnishing_status: string;
  parking: boolean;
  facing_direction?: string;
  has_lift: boolean;
  has_security: boolean;
  has_power_backup: boolean;
  predicted_min_price?: number;
  predicted_avg_price?: number;
  predicted_max_price?: number;
  predicted_fair_value?: number;
  price_per_sqft?: number;
  confidence_score?: number;
  created_at: string;
}

export interface Comparable {
  id: string;
  city: string;
  locality: string;
  bhk: number;
  total_area: number;
  bathrooms?: number;
  property_age?: number;
  furnishing_status?: string;
  price: number;
  price_per_sqft?: number;
  created_at: string;
}

export interface MarketTrend {
  id: string;
  city: string;
  locality?: string;
  month: string;
  year: number;
  avg_price: number;
  avg_price_per_sqft?: number;
  total_transactions?: number;
  created_at: string;
}

export interface TrainingData {
  id: string;
  file_name: string;
  file_size?: number;
  upload_date: string;
  status: string;
  records_count?: number;
}

export interface PredictionFormData {
  city: string;
  locality: string;
  pincode?: string;
  bhk: number;
  total_area: number;
  bathrooms: number;
  floor_number?: number;
  total_floors?: number;
  property_age?: number;
  furnishing_status: string;
  parking: boolean;
  facing_direction?: string;
  has_lift: boolean;
  has_security: boolean;
  has_power_backup: boolean;
}

export interface PredictionResult {
  prediction: Prediction;
  comparables: Comparable[];
  marketTrends: MarketTrend[];
}
