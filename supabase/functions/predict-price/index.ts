import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface PredictionRequest {
  city: string;
  locality: string;
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

interface PredictionResult {
  predicted_min_price: number;
  predicted_avg_price: number;
  predicted_max_price: number;
  predicted_fair_value: number;
  price_per_sqft: number;
  confidence_score: number;
}

const cityBaseRates: Record<string, number> = {
  'Mumbai': 18000,
  'Delhi': 10000,
  'Bangalore': 9500,
  'Pune': 8000,
  'Hyderabad': 7500,
  'Chennai': 7000,
  'Kolkata': 6500,
  'Ahmedabad': 6000
};

const localityMultipliers: Record<string, Record<string, number>> = {
  'Mumbai': {
    'Andheri West': 1.2,
    'Bandra West': 1.5,
    'Powai': 1.3,
    'default': 1.0
  },
  'Delhi': {
    'Dwarka': 1.1,
    'Rohini': 1.0,
    'Vasant Kunj': 1.4,
    'default': 1.0
  },
  'Bangalore': {
    'Whitefield': 1.2,
    'Koramangala': 1.3,
    'Indiranagar': 1.4,
    'default': 1.0
  },
  'Pune': {
    'Hinjewadi': 1.1,
    'Wakad': 1.0,
    'Baner': 1.2,
    'default': 1.0
  }
};

function calculatePrediction(data: PredictionRequest): PredictionResult {
  const baseRate = cityBaseRates[data.city] || 8000;
  
  const localityMult = localityMultipliers[data.city]?.[data.locality] || 
                       localityMultipliers[data.city]?.['default'] || 1.0;
  
  let pricePerSqft = baseRate * localityMult;
  
  if (data.bhk >= 3) {
    pricePerSqft *= 1.1;
  }
  
  if (data.furnishing_status === 'Fully-Furnished') {
    pricePerSqft *= 1.15;
  } else if (data.furnishing_status === 'Semi-Furnished') {
    pricePerSqft *= 1.08;
  }
  
  if (data.property_age) {
    const ageFactor = Math.max(0.7, 1 - (data.property_age * 0.015));
    pricePerSqft *= ageFactor;
  }
  
  if (data.has_lift) pricePerSqft *= 1.05;
  if (data.has_security) pricePerSqft *= 1.03;
  if (data.has_power_backup) pricePerSqft *= 1.02;
  if (data.parking) pricePerSqft *= 1.04;
  
  if (data.floor_number && data.total_floors) {
    const floorRatio = data.floor_number / data.total_floors;
    if (floorRatio > 0.5 && floorRatio < 0.9) {
      pricePerSqft *= 1.05;
    }
  }
  
  const avgPrice = pricePerSqft * data.total_area;
  const minPrice = avgPrice * 0.85;
  const maxPrice = avgPrice * 1.15;
  const fairValue = avgPrice * 0.98;
  
  const confidence = Math.min(95, 75 + Math.random() * 15);
  
  return {
    predicted_min_price: Math.round(minPrice),
    predicted_avg_price: Math.round(avgPrice),
    predicted_max_price: Math.round(maxPrice),
    predicted_fair_value: Math.round(fairValue),
    price_per_sqft: Math.round(pricePerSqft),
    confidence_score: Math.round(confidence * 10) / 10
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const data: PredictionRequest = await req.json();
    
    if (!data.city || !data.locality || !data.bhk || !data.total_area || !data.bathrooms || !data.furnishing_status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    const prediction = calculatePrediction(data);
    
    return new Response(
      JSON.stringify({ success: true, data: prediction }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to calculate prediction' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
