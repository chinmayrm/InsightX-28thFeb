"""
FastAPI Application for Healthcare Risk Prediction System
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from data_generator import generate_synthetic_data
from ml_models import HealthcareMLModels

# Initialize FastAPI app
app = FastAPI(
    title="InsightX - Healthcare Risk Prediction API",
    description="Smart Healthcare Risk Prediction & Patient Segmentation System",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
ml_models = HealthcareMLModels()

# Global storage for current dataset
current_dataset: Optional[pd.DataFrame] = None


# ==================== PYDANTIC MODELS ====================
class PatientInput(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Patient age (18-100)")
    gender: str = Field(default="Male", description="Gender (Male/Female)")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index")
    blood_pressure: int = Field(..., ge=70, le=250, description="Systolic blood pressure")
    cholesterol: int = Field(..., ge=100, le=400, description="Cholesterol level mg/dL")
    glucose: int = Field(..., ge=50, le=400, description="Glucose level mg/dL")
    smoking_habit: int = Field(..., ge=0, le=2, description="0=Never, 1=Former, 2=Current")
    physical_activity: int = Field(..., ge=0, le=3, description="0=Sedentary, 1=Light, 2=Moderate, 3=Active")
    family_history: int = Field(..., ge=0, le=1, description="0=No, 1=Yes")
    hospital_visits: int = Field(..., ge=0, le=20, description="Previous hospital visits")


class DataGenerationRequest(BaseModel):
    n_samples: int = Field(default=1000, ge=100, le=10000, description="Number of samples to generate")
    random_state: int = Field(default=42, description="Random seed for reproducibility")


class TrainResponse(BaseModel):
    success: bool
    message: str
    metrics: Dict[str, Any]


# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "InsightX Healthcare API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "generate_data": "/api/data/generate",
            "train_models": "/api/models/train",
            "predict": "/api/predict/{model_type}",
            "predict_all": "/api/predict/all",
            "metrics": "/api/models/metrics",
            "visualize": "/api/visualize/{chart_type}"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ==================== DATA ENDPOINTS ====================

@app.post("/api/data/generate")
async def generate_data(request: DataGenerationRequest):
    """Generate synthetic healthcare dataset"""
    global current_dataset
    
    try:
        current_dataset = generate_synthetic_data(
            n_samples=request.n_samples,
            random_state=request.random_state
        )
        
        return {
            "success": True,
            "message": f"Generated {request.n_samples} records",
            "columns": list(current_dataset.columns),
            "shape": current_dataset.shape,
            "sample": current_dataset.head(5).to_dict(orient='records'),
            "statistics": {
                "age": {"min": int(current_dataset['age'].min()), "max": int(current_dataset['age'].max()), "mean": float(current_dataset['age'].mean())},
                "bmi": {"min": float(current_dataset['bmi'].min()), "max": float(current_dataset['bmi'].max()), "mean": float(current_dataset['bmi'].mean())},
                "medical_expenses": {"min": float(current_dataset['medical_expenses'].min()), "max": float(current_dataset['medical_expenses'].max()), "mean": float(current_dataset['medical_expenses'].mean())},
                "disease_presence": current_dataset['disease_presence'].value_counts().to_dict(),
                "risk_category": current_dataset['risk_category'].value_counts().to_dict()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/data/upload")
async def upload_data(file: UploadFile = File(...)):
    """Upload CSV dataset"""
    global current_dataset
    
    try:
        contents = await file.read()
        current_dataset = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        required_columns = ['age', 'bmi', 'blood_pressure', 'cholesterol', 'glucose', 
                           'smoking_habit', 'physical_activity', 'family_history', 'hospital_visits']
        
        missing_columns = [col for col in required_columns if col not in current_dataset.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}"
            )
        
        return {
            "success": True,
            "message": f"Uploaded {len(current_dataset)} records",
            "columns": list(current_dataset.columns),
            "shape": current_dataset.shape
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/data/current")
async def get_current_data():
    """Get current dataset info and sample"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded. Generate or upload data first.")
    
    return {
        "columns": list(current_dataset.columns),
        "shape": current_dataset.shape,
        "sample": current_dataset.head(10).to_dict(orient='records'),
        "statistics": current_dataset.describe().to_dict()
    }


@app.get("/api/data/download")
async def download_data():
    """Download current dataset as JSON"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    return current_dataset.to_dict(orient='records')


# ==================== MODEL ENDPOINTS ====================

@app.post("/api/models/train")
async def train_models():
    """Train all ML models on current dataset"""
    global current_dataset
    
    if current_dataset is None:
        # Generate default dataset
        current_dataset = generate_synthetic_data(1000)
    
    try:
        metrics = ml_models.train_all_models(current_dataset)
        
        return TrainResponse(
            success=True,
            message="All models trained successfully",
            metrics=metrics
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/models/metrics")
async def get_model_metrics():
    """Get performance metrics for all trained models"""
    metrics = ml_models.get_model_metrics()
    
    if not metrics:
        raise HTTPException(status_code=404, detail="No models trained yet. Train models first.")
    
    return metrics


# ==================== PREDICTION ENDPOINTS ====================

@app.post("/api/predict/expenses")
async def predict_expenses(patient: PatientInput):
    """Predict medical expenses using Linear Regression"""
    try:
        features = patient.model_dump()
        result = ml_models.predict_medical_expenses(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/disease")
async def predict_disease(patient: PatientInput):
    """Predict disease presence using Decision Tree"""
    try:
        features = patient.model_dump()
        result = ml_models.predict_disease_presence(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/risk")
async def predict_risk(patient: PatientInput):
    """Predict risk category using KNN"""
    try:
        features = patient.model_dump()
        result = ml_models.predict_risk_category(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/segment")
async def predict_segment(patient: PatientInput):
    """Predict patient segment using K-Means"""
    try:
        features = patient.model_dump()
        result = ml_models.predict_cluster(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/all")
async def predict_all(patient: PatientInput):
    """Get all predictions for a patient"""
    try:
        features = patient.model_dump()
        result = ml_models.get_all_predictions(features)
        result['patient_input'] = features
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== VISUALIZATION ENDPOINTS ====================

def create_plot_base64(fig) -> str:
    """Convert matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_str


@app.get("/api/visualize/age-distribution")
async def visualize_age_distribution():
    """Get age distribution chart"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.histplot(data=current_dataset, x='age', kde=True, ax=ax, color='#8b5cf6')
    ax.set_title('Age Distribution', fontsize=14)
    ax.set_xlabel('Age')
    ax.set_ylabel('Count')
    
    return {"image": create_plot_base64(fig), "type": "age_distribution"}


@app.get("/api/visualize/risk-distribution")
async def visualize_risk_distribution():
    """Get risk category distribution chart"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    fig, ax = plt.subplots(figsize=(8, 6))
    risk_counts = current_dataset['risk_category'].value_counts().sort_index()
    colors = ['#22c55e', '#eab308', '#ef4444']
    ax.bar(['Low', 'Medium', 'High'], risk_counts.values, color=colors)
    ax.set_title('Risk Category Distribution', fontsize=14)
    ax.set_xlabel('Risk Category')
    ax.set_ylabel('Count')
    
    return {"image": create_plot_base64(fig), "type": "risk_distribution"}


@app.get("/api/visualize/expenses-by-age")
async def visualize_expenses_by_age():
    """Get expenses vs age scatter plot"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    fig, ax = plt.subplots(figsize=(10, 6))
    scatter = ax.scatter(
        current_dataset['age'], 
        current_dataset['medical_expenses'],
        c=current_dataset['risk_category'],
        cmap='RdYlGn_r',
        alpha=0.6
    )
    ax.set_title('Medical Expenses by Age', fontsize=14)
    ax.set_xlabel('Age')
    ax.set_ylabel('Medical Expenses ($)')
    plt.colorbar(scatter, ax=ax, label='Risk Category')
    
    return {"image": create_plot_base64(fig), "type": "expenses_by_age"}


@app.get("/api/visualize/correlation")
async def visualize_correlation():
    """Get correlation heatmap"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    numeric_cols = ['age', 'bmi', 'blood_pressure', 'cholesterol', 'glucose', 
                    'smoking_habit', 'physical_activity', 'hospital_visits', 
                    'medical_expenses', 'risk_score']
    
    fig, ax = plt.subplots(figsize=(12, 10))
    corr = current_dataset[numeric_cols].corr()
    sns.heatmap(corr, annot=True, cmap='RdYlGn', center=0, ax=ax, fmt='.2f')
    ax.set_title('Feature Correlation Heatmap', fontsize=14)
    
    return {"image": create_plot_base64(fig), "type": "correlation"}


@app.get("/api/visualize/clusters")
async def visualize_clusters():
    """Get K-Means cluster visualization"""
    if current_dataset is None:
        raise HTTPException(status_code=404, detail="No dataset loaded")
    
    if ml_models.kmeans is None:
        raise HTTPException(status_code=404, detail="K-Means model not trained yet")
    
    # Get cluster labels
    features = ml_models.get_features(current_dataset)
    features_scaled = ml_models.scaler.transform(features)
    clusters = ml_models.kmeans.predict(features_scaled)
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    
    # Plot 1: Age vs BMI colored by cluster
    scatter1 = axes[0].scatter(
        current_dataset['age'], 
        current_dataset['bmi'],
        c=clusters,
        cmap='viridis',
        alpha=0.6
    )
    axes[0].set_title('Patient Clusters (Age vs BMI)', fontsize=12)
    axes[0].set_xlabel('Age')
    axes[0].set_ylabel('BMI')
    plt.colorbar(scatter1, ax=axes[0], label='Cluster')
    
    # Plot 2: Expenses vs Risk Score colored by cluster
    scatter2 = axes[1].scatter(
        current_dataset['risk_score'], 
        current_dataset['medical_expenses'],
        c=clusters,
        cmap='viridis',
        alpha=0.6
    )
    axes[1].set_title('Patient Clusters (Risk Score vs Expenses)', fontsize=12)
    axes[1].set_xlabel('Risk Score')
    axes[1].set_ylabel('Medical Expenses ($)')
    plt.colorbar(scatter2, ax=axes[1], label='Cluster')
    
    plt.tight_layout()
    
    return {"image": create_plot_base64(fig), "type": "clusters"}


@app.get("/api/visualize/model-performance")
async def visualize_model_performance():
    """Get model performance comparison chart"""
    metrics = ml_models.get_model_metrics()
    
    if not metrics:
        raise HTTPException(status_code=404, detail="No models trained yet")
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Classification models performance
    clf_models = ['decision_tree', 'knn']
    clf_metrics = ['accuracy', 'f1_score' if 'f1_score' in metrics.get('decision_tree', {}) else 'f1_score_macro']
    
    clf_data = []
    for model in clf_models:
        if model in metrics:
            acc = metrics[model].get('accuracy', 0)
            f1 = metrics[model].get('f1_score', metrics[model].get('f1_score_macro', 0))
            clf_data.append({'Model': model.replace('_', ' ').title(), 'Accuracy': acc, 'F1 Score': f1})
    
    if clf_data:
        df_clf = pd.DataFrame(clf_data)
        x = np.arange(len(df_clf))
        width = 0.35
        axes[0].bar(x - width/2, df_clf['Accuracy'], width, label='Accuracy', color='#8b5cf6')
        axes[0].bar(x + width/2, df_clf['F1 Score'], width, label='F1 Score', color='#22c55e')
        axes[0].set_xlabel('Model')
        axes[0].set_ylabel('Score')
        axes[0].set_title('Classification Model Performance')
        axes[0].set_xticks(x)
        axes[0].set_xticklabels(df_clf['Model'])
        axes[0].legend()
        axes[0].set_ylim(0, 1)
    
    # Linear Regression metrics
    if 'linear_regression' in metrics:
        lr_metrics = metrics['linear_regression']
        metric_names = ['R² Score', 'RMSE (scaled)']
        metric_values = [lr_metrics.get('r2_score', 0), min(lr_metrics.get('rmse', 0) / 10000, 1)]
        axes[1].bar(metric_names, metric_values, color=['#3b82f6', '#f59e0b'])
        axes[1].set_title('Linear Regression Performance')
        axes[1].set_ylabel('Score')
        axes[1].set_ylim(0, 1)
    
    plt.tight_layout()
    
    return {"image": create_plot_base64(fig), "type": "model_performance"}


# ==================== STARTUP EVENT ====================

@app.on_event("startup")
async def startup_event():
    """Initialize models and data on startup"""
    global current_dataset
    
    # Generate initial dataset
    current_dataset = generate_synthetic_data(1000)
    
    # Train models
    ml_models.train_all_models(current_dataset)
    
    print("InsightX API initialized with 1000 sample records and trained models")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
