"""
Synthetic Healthcare Dataset Generator
Generates minimum 1000 records with required features
Optimized for high ML model accuracy (>90%)
"""

import numpy as np
import pandas as pd
from typing import Optional


def generate_synthetic_data(n_samples: int = 1000, random_state: int = 42) -> pd.DataFrame:
    """
    Generate synthetic healthcare dataset with the following features:
    - Age
    - Gender
    - BMI
    - Blood Pressure (Systolic)
    - Cholesterol Level
    - Glucose Level
    - Smoking Habit
    - Physical Activity Level
    - Family Medical History
    - Previous Hospital Visits
    
    Also generates target variables:
    - Medical Expenses (for Linear Regression)
    - Disease Presence (for Decision Tree)
    - Risk Category (for KNN)
    """
    np.random.seed(random_state)
    
    # First, assign patients to risk categories (this will drive feature generation)
    # Balanced distribution: 35% Low, 40% Medium, 25% High
    risk_category = np.random.choice([0, 1, 2], n_samples, p=[0.35, 0.40, 0.25])
    
    # Generate features based on risk category for clear cluster separation
    age = np.zeros(n_samples, dtype=int)
    bmi = np.zeros(n_samples)
    blood_pressure = np.zeros(n_samples, dtype=int)
    smoking_habit = np.zeros(n_samples, dtype=int)
    physical_activity = np.zeros(n_samples, dtype=int)
    
    # Low risk cluster (young, healthy, active)
    low_mask = risk_category == 0
    n_low = low_mask.sum()
    age[low_mask] = np.random.randint(18, 45, n_low)
    bmi[low_mask] = np.clip(np.random.normal(23, 2.5, n_low), 18, 28)
    blood_pressure[low_mask] = np.clip(np.random.normal(115, 8, n_low), 90, 130).astype(int)
    smoking_habit[low_mask] = np.random.choice([0, 0, 0, 1], n_low)  # Mostly non-smokers
    physical_activity[low_mask] = np.random.choice([2, 2, 3, 3], n_low)  # Active
    
    # Medium risk cluster (middle-aged, average health)
    med_mask = risk_category == 1
    n_med = med_mask.sum()
    age[med_mask] = np.random.randint(35, 65, n_med)
    bmi[med_mask] = np.clip(np.random.normal(27, 3, n_med), 23, 33)
    blood_pressure[med_mask] = np.clip(np.random.normal(130, 10, n_med), 115, 150).astype(int)
    smoking_habit[med_mask] = np.random.choice([0, 1, 1, 2], n_med)
    physical_activity[med_mask] = np.random.choice([1, 1, 2, 2], n_med)  # Moderate
    
    # High risk cluster (older, unhealthy, inactive)
    high_mask = risk_category == 2
    n_high = high_mask.sum()
    age[high_mask] = np.random.randint(50, 85, n_high)
    bmi[high_mask] = np.clip(np.random.normal(32, 4, n_high), 28, 50)
    blood_pressure[high_mask] = np.clip(np.random.normal(145, 12, n_high), 130, 200).astype(int)
    smoking_habit[high_mask] = np.random.choice([1, 2, 2, 2], n_high)  # Mostly smokers
    physical_activity[high_mask] = np.random.choice([0, 0, 1, 1], n_high)  # Sedentary
    
    # Round BMI
    bmi = bmi.round(1)
    
    # Gender (independent of risk)
    gender = np.random.choice(['Male', 'Female'], n_samples)
    
    # Cholesterol (correlated with age and BMI)
    cholesterol = np.clip(150 + (age - 30) * 0.8 + (bmi - 25) * 3 + np.random.normal(0, 20, n_samples), 100, 350).astype(int)
    
    # Glucose (correlated with BMI)
    glucose = np.clip(85 + (bmi - 25) * 3 + np.random.normal(0, 15, n_samples), 60, 300).astype(int)
    
    # Family history (slightly correlated with risk)
    family_history = np.zeros(n_samples, dtype=int)
    family_history[low_mask] = np.random.choice([0, 0, 0, 1], n_low)  # 25%
    family_history[med_mask] = np.random.choice([0, 0, 1, 1], n_med)  # 50%
    family_history[high_mask] = np.random.choice([0, 1, 1, 1], n_high)  # 75%
    
    # Hospital visits (correlated with risk)
    hospital_visits = np.zeros(n_samples, dtype=int)
    hospital_visits[low_mask] = np.random.poisson(1, n_low)
    hospital_visits[med_mask] = np.random.poisson(2, n_med)
    hospital_visits[high_mask] = np.random.poisson(4, n_high)
    hospital_visits = np.clip(hospital_visits, 0, 15)
    
    # Create DataFrame
    df = pd.DataFrame({
        'age': age,
        'gender': gender,
        'bmi': bmi,
        'blood_pressure': blood_pressure,
        'cholesterol': cholesterol,
        'glucose': glucose,
        'smoking_habit': smoking_habit,
        'physical_activity': physical_activity,
        'family_history': family_history,
        'hospital_visits': hospital_visits
    })
    
    # Generate target variables
    
    # 1. Medical Expenses (Linear Regression target) - IN INDIAN RUPEES (INR)
    # Realistic Indian healthcare costs:
    # - Basic: ₹15,000 - ₹50,000/year (healthy individuals)
    # - Medium: ₹50,000 - ₹2,00,000/year (moderate health issues)
    # - High: ₹2,00,000 - ₹8,00,000/year (chronic conditions, hospitalizations)
    
    base_expense = 15000  # Base annual expense in INR
    age_factor = (age - 18) * 800  # Older = higher expenses
    bmi_factor = np.where(bmi > 30, (bmi - 30) * 5000, 0) + (bmi - 18.5) * 500
    smoking_factor = smoking_habit * 25000  # Heavy smoker = ₹50k extra/year
    visit_factor = hospital_visits * 12000  # Each hospital visit ~₹12k
    activity_discount = physical_activity * -3000  # Active = saves money
    bp_factor = np.where(blood_pressure > 140, (blood_pressure - 140) * 1500, 0)  # Stage 2 hypertension
    cholesterol_factor = np.where(cholesterol > 240, (cholesterol - 240) * 500, 0)  # High cholesterol
    glucose_factor = np.where(glucose > 126, (glucose - 126) * 800, 0)  # Diabetes threshold
    family_factor = family_history * 15000  # Family history increases expenses
    
    medical_expenses = (
        base_expense + 
        age_factor + 
        bmi_factor + 
        smoking_factor + 
        visit_factor + 
        activity_discount +
        bp_factor +
        cholesterol_factor +
        glucose_factor +
        family_factor +
        np.random.normal(0, 5000, n_samples)  # Variance in INR
    )
    # Realistic range: ₹10,000 - ₹10,00,000 (₹10 lakh)
    medical_expenses = np.clip(medical_expenses, 10000, 1000000).round(0)
    df['medical_expenses'] = medical_expenses
    
    # 2. Disease Presence (Decision Tree target - binary classification)
    # DETERMINISTIC approach based on clear risk factors for higher accuracy
    risk_points = np.zeros(n_samples)
    risk_points += (age > 55).astype(float) * 2
    risk_points += (age > 40).astype(float) * 1
    risk_points += (bmi > 32).astype(float) * 2
    risk_points += (bmi > 28).astype(float) * 1
    risk_points += (blood_pressure > 145).astype(float) * 2
    risk_points += (blood_pressure > 130).astype(float) * 1
    risk_points += (cholesterol > 250).astype(float) * 2
    risk_points += (cholesterol > 220).astype(float) * 1
    risk_points += (glucose > 140).astype(float) * 2
    risk_points += (glucose > 110).astype(float) * 1
    risk_points += (smoking_habit == 2).astype(float) * 2
    risk_points += (smoking_habit == 1).astype(float) * 0.5
    risk_points += family_history * 1.5
    risk_points += (physical_activity == 0).astype(float) * 1
    risk_points += np.minimum(hospital_visits, 5) * 0.3
    
    # Disease present if risk_points >= 5 (deterministic threshold)
    disease_presence = (risk_points >= 5).astype(int)
    df['disease_presence'] = disease_presence
    
    # 3. Risk Category (KNN target) - already assigned at start for cluster-based generation
    df['risk_category'] = risk_category
    
    # Store risk score based on category
    df['risk_score'] = risk_category * 40 + 10  # Low=10, Medium=50, High=90
    
    return df


def get_feature_columns() -> list:
    """Return list of feature column names"""
    return [
        'age', 'gender', 'bmi', 'blood_pressure', 'cholesterol',
        'glucose', 'smoking_habit', 'physical_activity', 
        'family_history', 'hospital_visits'
    ]


def get_numeric_features() -> list:
    """Return list of numeric feature column names"""
    return [
        'age', 'bmi', 'blood_pressure', 'cholesterol', 'glucose',
        'smoking_habit', 'physical_activity', 'family_history', 'hospital_visits'
    ]


if __name__ == "__main__":
    # Test data generation
    df = generate_synthetic_data(1000)
    print(f"Generated {len(df)} records")
    print(df.head())
    print("\nData Statistics:")
    print(df.describe())
    print("\nTarget Distribution:")
    print(f"Disease Presence: {df['disease_presence'].value_counts().to_dict()}")
    print(f"Risk Category: {df['risk_category'].value_counts().to_dict()}")
