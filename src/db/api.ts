import { supabase } from './supabase';
import type { Prediction, Comparable, MarketTrend, TrainingData, PredictionFormData } from '@/types/types';

export const predictionApi = {
  async createPrediction(data: PredictionFormData): Promise<Prediction | null> {
    const { data: result, error } = await supabase
      .from('predictions')
      .insert([data])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating prediction:', error);
      return null;
    }
    return result;
  },

  async getPredictionById(id: string): Promise<Prediction | null> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching prediction:', error);
      return null;
    }
    return data;
  },

  async getAllPredictions(): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async updatePrediction(id: string, updates: Partial<Prediction>): Promise<Prediction | null> {
    const { data, error } = await supabase
      .from('predictions')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating prediction:', error);
      return null;
    }
    return data;
  }
};

export const comparablesApi = {
  async getComparables(city: string, locality: string, bhk: number, limit = 5): Promise<Comparable[]> {
    const { data, error } = await supabase
      .from('comparables')
      .select('*')
      .eq('city', city)
      .eq('locality', locality)
      .eq('bhk', bhk)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching comparables:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getSimilarComparables(city: string, bhk: number, limit = 5): Promise<Comparable[]> {
    const { data, error } = await supabase
      .from('comparables')
      .select('*')
      .eq('city', city)
      .eq('bhk', bhk)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching similar comparables:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createComparable(comparable: Omit<Comparable, 'id' | 'created_at'>): Promise<Comparable | null> {
    const { data, error } = await supabase
      .from('comparables')
      .insert([comparable])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating comparable:', error);
      return null;
    }
    return data;
  }
};

export const marketTrendsApi = {
  async getMarketTrends(city: string, locality?: string): Promise<MarketTrend[]> {
    let query = supabase
      .from('market_trends')
      .select('*')
      .eq('city', city)
      .order('year', { ascending: true });

    if (locality) {
      query = query.eq('locality', locality);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching market trends:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createMarketTrend(trend: Omit<MarketTrend, 'id' | 'created_at'>): Promise<MarketTrend | null> {
    const { data, error } = await supabase
      .from('market_trends')
      .insert([trend])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating market trend:', error);
      return null;
    }
    return data;
  }
};

export const trainingDataApi = {
  async getAllTrainingData(): Promise<TrainingData[]> {
    const { data, error } = await supabase
      .from('training_data')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching training data:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async createTrainingData(trainingData: Omit<TrainingData, 'id' | 'upload_date'>): Promise<TrainingData | null> {
    const { data, error } = await supabase
      .from('training_data')
      .insert([trainingData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating training data:', error);
      return null;
    }
    return data;
  },

  async updateTrainingDataStatus(id: string, status: string): Promise<TrainingData | null> {
    const { data, error } = await supabase
      .from('training_data')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating training data status:', error);
      return null;
    }
    return data;
  }
};
