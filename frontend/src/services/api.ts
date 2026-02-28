/**
 * API Service for Healthcare ML Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface PatientInput {
  age: number;
  gender: string;
  bmi: number;
  blood_pressure: number;
  cholesterol: number;
  glucose: number;
  smoking_habit: number;
  physical_activity: number;
  family_history: number;
  hospital_visits: number;
}

export interface ExpensesPrediction {
  predicted_expenses: number;
  model: string;
}

export interface DiseasePrediction {
  disease_present: boolean;
  confidence: number;
  probability_no_disease: number;
  probability_disease: number;
  model: string;
}

export interface RiskPrediction {
  risk_category: string;
  risk_level: number;
  probabilities: {
    Low: number;
    Medium: number;
    High: number;
  };
  model: string;
}

export interface SegmentPrediction {
  cluster: number;
  cluster_name: string;
  distance_to_centroid: number;
  model: string;
}

export interface AllPredictions {
  medical_expenses: ExpensesPrediction;
  disease_presence: DiseasePrediction;
  risk_category: RiskPrediction;
  patient_segment: SegmentPrediction;
  patient_input: PatientInput;
}

export interface ModelMetrics {
  linear_regression: {
    mse: number;
    rmse: number;
    mae: number;
    r2_score: number;
  };
  decision_tree: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  knn: {
    accuracy: number;
    precision_macro: number;
    recall_macro: number;
    f1_score_macro: number;
  };
  kmeans: {
    silhouette_score: number;
    inertia: number;
    n_clusters: number;
    cluster_stats: Record<string, {
      count: number;
      avg_age: number;
      avg_bmi: number;
      avg_expenses: number;
      disease_rate: number;
      avg_risk_score: number;
    }>;
  };
}

export interface DataStats {
  columns: string[];
  shape: [number, number];
  sample: Record<string, unknown>[];
  statistics: {
    age: { min: number; max: number; mean: number };
    bmi: { min: number; max: number; mean: number };
    medical_expenses: { min: number; max: number; mean: number };
    disease_presence: Record<string, number>;
    risk_category: Record<string, number>;
  };
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }

  // Data endpoints
  async generateData(nSamples: number = 1000): Promise<DataStats & { success: boolean; message: string }> {
    return this.request('/api/data/generate', {
      method: 'POST',
      body: JSON.stringify({ n_samples: nSamples, random_state: 42 }),
    });
  }

  async getCurrentData(): Promise<DataStats> {
    return this.request('/api/data/current');
  }

  // Model endpoints
  async trainModels(): Promise<{ success: boolean; message: string; metrics: ModelMetrics }> {
    return this.request('/api/models/train', { method: 'POST' });
  }

  async getModelMetrics(): Promise<ModelMetrics> {
    return this.request('/api/models/metrics');
  }

  // Prediction endpoints
  async predictExpenses(patient: PatientInput): Promise<ExpensesPrediction> {
    return this.request('/api/predict/expenses', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async predictDisease(patient: PatientInput): Promise<DiseasePrediction> {
    return this.request('/api/predict/disease', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async predictRisk(patient: PatientInput): Promise<RiskPrediction> {
    return this.request('/api/predict/risk', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async predictSegment(patient: PatientInput): Promise<SegmentPrediction> {
    return this.request('/api/predict/segment', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async predictAll(patient: PatientInput): Promise<AllPredictions> {
    return this.request('/api/predict/all', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  // Visualization endpoints
  async getVisualization(type: string): Promise<{ image: string; type: string }> {
    return this.request(`/api/visualize/${type}`);
  }
}

export const api = new ApiService();
export default api;
