"""
Machine Learning Models for Healthcare Risk Prediction
- Linear Regression: Predict Medical Expenses
- Decision Tree: Classify Disease Presence
- KNN: Predict Risk Category
- K-Means: Cluster Patient Risk Segments
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, silhouette_score
)
import joblib
from typing import Dict, Any, Tuple, Optional
from pathlib import Path

from data_generator import generate_synthetic_data, get_numeric_features


class HealthcareMLModels:
    """
    Container class for all healthcare ML models
    """
    
    def __init__(self, model_dir: str = "models"):
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        
        # Models
        self.linear_regression = None
        self.decision_tree = None
        self.knn = None
        self.kmeans = None
        
        # Scalers and encoders
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
        # Training data reference
        self.training_data = None
        self.feature_columns = get_numeric_features()
        
        # Model performance metrics
        self.metrics = {}
        
    def prepare_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare data for ML models - encode categorical variables"""
        df_processed = df.copy()
        
        # Encode gender
        if 'gender' in df_processed.columns:
            df_processed['gender_encoded'] = (df_processed['gender'] == 'Male').astype(int)
        
        return df_processed
    
    def get_features(self, df: pd.DataFrame) -> np.ndarray:
        """Extract numeric features from dataframe"""
        df_processed = self.prepare_data(df)
        features = df_processed[self.feature_columns].values
        return features
    
    # ==================== LINEAR REGRESSION ====================
    def train_linear_regression(self, df: pd.DataFrame) -> Dict[str, float]:
        """
        Train Linear Regression to predict Medical Expenses
        """
        X = self.get_features(df)
        y = df['medical_expenses'].values
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.linear_regression = LinearRegression()
        self.linear_regression.fit(X_train_scaled, y_train)
        
        # Predictions
        y_pred = self.linear_regression.predict(X_test_scaled)
        
        # Metrics
        metrics = {
            'mse': float(mean_squared_error(y_test, y_pred)),
            'rmse': float(np.sqrt(mean_squared_error(y_test, y_pred))),
            'mae': float(mean_absolute_error(y_test, y_pred)),
            'r2_score': float(r2_score(y_test, y_pred))
        }
        
        self.metrics['linear_regression'] = metrics
        
        # Save model
        joblib.dump(self.linear_regression, self.model_dir / 'linear_regression.joblib')
        joblib.dump(self.scaler, self.model_dir / 'scaler.joblib')
        
        return metrics
    
    def predict_medical_expenses(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict medical expenses for a single patient"""
        if self.linear_regression is None:
            self.load_models()
        
        X = self._dict_to_features(features)
        X_scaled = self.scaler.transform(X)
        prediction = self.linear_regression.predict(X_scaled)[0]
        
        return {
            'predicted_expenses': round(max(0, prediction), 2),
            'model': 'Linear Regression'
        }
    
    # ==================== DECISION TREE ====================
    def train_decision_tree(self, df: pd.DataFrame) -> Dict[str, float]:
        """
        Train Decision Tree to classify Disease Presence
        """
        X = self.get_features(df)
        y = df['disease_presence'].values
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.decision_tree = DecisionTreeClassifier(
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        self.decision_tree.fit(X_train, y_train)
        
        # Predictions
        y_pred = self.decision_tree.predict(X_test)
        
        # Metrics
        metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1_score': float(f1_score(y_test, y_pred, zero_division=0))
        }
        
        self.metrics['decision_tree'] = metrics
        
        # Save model
        joblib.dump(self.decision_tree, self.model_dir / 'decision_tree.joblib')
        
        return metrics
    
    def predict_disease_presence(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict disease presence for a single patient"""
        if self.decision_tree is None:
            self.load_models()
        
        X = self._dict_to_features(features)
        prediction = self.decision_tree.predict(X)[0]
        probabilities = self.decision_tree.predict_proba(X)[0]
        
        return {
            'disease_present': bool(prediction),
            'confidence': round(float(max(probabilities)) * 100, 2),
            'probability_no_disease': round(float(probabilities[0]) * 100, 2),
            'probability_disease': round(float(probabilities[1]) * 100, 2),
            'model': 'Decision Tree'
        }
    
    # ==================== KNN ====================
    def train_knn(self, df: pd.DataFrame, n_neighbors: int = 5) -> Dict[str, float]:
        """
        Train KNN to predict Risk Category (Low, Medium, High)
        """
        X = self.get_features(df)
        y = df['risk_category'].values
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features for KNN
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.knn = KNeighborsClassifier(n_neighbors=n_neighbors)
        self.knn.fit(X_train_scaled, y_train)
        
        # Predictions
        y_pred = self.knn.predict(X_test_scaled)
        
        # Metrics
        metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision_macro': float(precision_score(y_test, y_pred, average='macro', zero_division=0)),
            'recall_macro': float(recall_score(y_test, y_pred, average='macro', zero_division=0)),
            'f1_score_macro': float(f1_score(y_test, y_pred, average='macro', zero_division=0))
        }
        
        self.metrics['knn'] = metrics
        
        # Save model
        joblib.dump(self.knn, self.model_dir / 'knn.joblib')
        
        return metrics
    
    def predict_risk_category(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict risk category for a single patient"""
        if self.knn is None:
            self.load_models()
        
        X = self._dict_to_features(features)
        X_scaled = self.scaler.transform(X)
        prediction = self.knn.predict(X_scaled)[0]
        probabilities = self.knn.predict_proba(X_scaled)[0]
        
        risk_labels = ['Low', 'Medium', 'High']
        
        return {
            'risk_category': risk_labels[prediction],
            'risk_level': int(prediction),
            'probabilities': {
                'Low': round(float(probabilities[0]) * 100, 2),
                'Medium': round(float(probabilities[1]) * 100, 2),
                'High': round(float(probabilities[2]) * 100, 2)
            },
            'model': 'K-Nearest Neighbors'
        }
    
    # ==================== K-MEANS ====================
    def train_kmeans(self, df: pd.DataFrame, n_clusters: int = 4) -> Dict[str, Any]:
        """
        Train K-Means for Patient Risk Segmentation
        """
        X = self.get_features(df)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        self.kmeans.fit(X_scaled)
        
        # Get cluster labels
        labels = self.kmeans.labels_
        
        # Calculate metrics
        silhouette = silhouette_score(X_scaled, labels)
        inertia = self.kmeans.inertia_
        
        # Analyze clusters
        df_clustered = df.copy()
        df_clustered['cluster'] = labels
        
        cluster_stats = {}
        for i in range(n_clusters):
            cluster_data = df_clustered[df_clustered['cluster'] == i]
            cluster_stats[f'cluster_{i}'] = {
                'count': int(len(cluster_data)),
                'avg_age': float(cluster_data['age'].mean()),
                'avg_bmi': float(cluster_data['bmi'].mean()),
                'avg_expenses': float(cluster_data['medical_expenses'].mean()),
                'disease_rate': float(cluster_data['disease_presence'].mean() * 100),
                'avg_risk_score': float(cluster_data['risk_score'].mean())
            }
        
        metrics = {
            'silhouette_score': float(silhouette),
            'inertia': float(inertia),
            'n_clusters': n_clusters,
            'cluster_stats': cluster_stats
        }
        
        self.metrics['kmeans'] = metrics
        
        # Save model
        joblib.dump(self.kmeans, self.model_dir / 'kmeans.joblib')
        
        return metrics
    
    def predict_cluster(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict cluster assignment for a single patient"""
        if self.kmeans is None:
            self.load_models()
        
        X = self._dict_to_features(features)
        X_scaled = self.scaler.transform(X)
        cluster = self.kmeans.predict(X_scaled)[0]
        
        # Get distance to all centroids
        distances = self.kmeans.transform(X_scaled)[0]
        
        cluster_names = ['Low Risk', 'Moderate Risk', 'High Risk', 'Critical Risk']
        
        return {
            'cluster': int(cluster),
            'cluster_name': cluster_names[cluster] if cluster < len(cluster_names) else f'Cluster {cluster}',
            'distance_to_centroid': round(float(distances[cluster]), 4),
            'model': 'K-Means Clustering'
        }
    
    # ==================== UTILITY METHODS ====================
    def _dict_to_features(self, features: Dict[str, Any]) -> np.ndarray:
        """Convert feature dictionary to numpy array"""
        feature_values = []
        for col in self.feature_columns:
            if col in features:
                feature_values.append(features[col])
            else:
                feature_values.append(0)  # Default value
        return np.array([feature_values])
    
    def train_all_models(self, df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        """Train all models on given or generated data"""
        if df is None:
            df = generate_synthetic_data(1000)
        
        self.training_data = df
        
        results = {
            'linear_regression': self.train_linear_regression(df),
            'decision_tree': self.train_decision_tree(df),
            'knn': self.train_knn(df),
            'kmeans': self.train_kmeans(df)
        }
        
        return results
    
    def load_models(self):
        """Load saved models from disk"""
        try:
            self.linear_regression = joblib.load(self.model_dir / 'linear_regression.joblib')
            self.decision_tree = joblib.load(self.model_dir / 'decision_tree.joblib')
            self.knn = joblib.load(self.model_dir / 'knn.joblib')
            self.kmeans = joblib.load(self.model_dir / 'kmeans.joblib')
            self.scaler = joblib.load(self.model_dir / 'scaler.joblib')
            return True
        except FileNotFoundError:
            return False
    
    def get_all_predictions(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Get predictions from all models for a single patient"""
        return {
            'medical_expenses': self.predict_medical_expenses(features),
            'disease_presence': self.predict_disease_presence(features),
            'risk_category': self.predict_risk_category(features),
            'patient_segment': self.predict_cluster(features)
        }
    
    def get_model_metrics(self) -> Dict[str, Any]:
        """Return all model metrics"""
        return self.metrics


if __name__ == "__main__":
    # Test the models
    print("Training Healthcare ML Models...")
    
    models = HealthcareMLModels()
    results = models.train_all_models()
    
    print("\n=== Model Training Results ===")
    for model_name, metrics in results.items():
        print(f"\n{model_name.upper()}:")
        for metric, value in metrics.items():
            if isinstance(value, dict):
                print(f"  {metric}:")
                for k, v in value.items():
                    print(f"    {k}: {v}")
            else:
                print(f"  {metric}: {value:.4f}" if isinstance(value, float) else f"  {metric}: {value}")
    
    # Test prediction
    print("\n=== Sample Prediction ===")
    sample_patient = {
        'age': 55,
        'bmi': 28.5,
        'blood_pressure': 145,
        'cholesterol': 230,
        'glucose': 120,
        'smoking_habit': 1,
        'physical_activity': 1,
        'family_history': 1,
        'hospital_visits': 3
    }
    
    predictions = models.get_all_predictions(sample_patient)
    print(f"Patient: {sample_patient}")
    print(f"Predictions: {predictions}")
