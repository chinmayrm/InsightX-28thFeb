"""
Synthetic Healthcare Dataset Generator
Generates minimum 1000 records with required features
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
    
    # Generate base features
    age = np.random.randint(18, 85, n_samples)
    gender = np.random.choice(['Male', 'Female'], n_samples)
    
    # BMI: Normal distribution centered around 25, range roughly 15-45
    bmi = np.clip(np.random.normal(26, 6, n_samples), 15, 50).round(1)
    
    # Blood Pressure (Systolic): Higher for older people
    base_bp = 100 + (age - 18) * 0.5
    blood_pressure = np.clip(base_bp + np.random.normal(0, 15, n_samples), 90, 200).astype(int)
    
    # Cholesterol Level: mg/dL, normal < 200, high > 240
    cholesterol = np.clip(150 + np.random.normal(0, 40, n_samples) + (age - 30) * 0.5, 100, 350).astype(int)
    
    # Glucose Level: mg/dL, normal 70-100, high > 126
    glucose = np.clip(90 + np.random.normal(0, 25, n_samples) + (bmi - 25) * 2, 60, 300).astype(int)
    
    # Smoking Habit: 0 = Never, 1 = Former, 2 = Current
    smoking_habit = np.random.choice([0, 1, 2], n_samples, p=[0.55, 0.25, 0.20])
    
    # Physical Activity Level: 0 = Sedentary, 1 = Light, 2 = Moderate, 3 = Active
    physical_activity = np.random.choice([0, 1, 2, 3], n_samples, p=[0.20, 0.30, 0.30, 0.20])
    
    # Family Medical History: 0 = No, 1 = Yes
    family_history = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Previous Hospital Visits: Poisson distribution
    hospital_visits = np.random.poisson(2, n_samples)
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
    
    # 1. Medical Expenses (Linear Regression target)
    # Based on age, BMI, smoking, and hospital visits
    base_expense = 2000
    age_factor = (age - 18) * 50
    bmi_factor = np.where(bmi > 30, (bmi - 30) * 200, 0)
    smoking_factor = smoking_habit * 3000
    visit_factor = hospital_visits * 1500
    activity_discount = physical_activity * -500
    
    medical_expenses = (
        base_expense + 
        age_factor + 
        bmi_factor + 
        smoking_factor + 
        visit_factor + 
        activity_discount +
        np.random.normal(0, 2000, n_samples)
    )
    medical_expenses = np.clip(medical_expenses, 500, 100000).round(2)
    df['medical_expenses'] = medical_expenses
    
    # 2. Disease Presence (Decision Tree target - binary classification)
    # Higher probability with: older age, high BMI, high BP, high cholesterol, smoking, family history
    disease_prob = (
        0.05 +  # base probability
        (age > 50).astype(float) * 0.15 +
        (bmi > 30).astype(float) * 0.15 +
        (blood_pressure > 140).astype(float) * 0.10 +
        (cholesterol > 240).astype(float) * 0.10 +
        (smoking_habit == 2).astype(float) * 0.15 +
        family_history * 0.10 +
        (glucose > 126).astype(float) * 0.10
    )
    disease_prob = np.clip(disease_prob, 0.02, 0.95)
    disease_presence = (np.random.random(n_samples) < disease_prob).astype(int)
    df['disease_presence'] = disease_presence
    
    # 3. Risk Category (KNN target - multi-class: Low, Medium, High)
    risk_score = (
        (age - 18) / 67 * 20 +  # age contribution
        (bmi - 15) / 35 * 15 +  # BMI contribution
        (blood_pressure - 90) / 110 * 15 +  # BP contribution
        (cholesterol - 100) / 250 * 15 +  # cholesterol contribution
        (glucose - 60) / 240 * 10 +  # glucose contribution
        smoking_habit * 8 +  # smoking contribution
        (3 - physical_activity) * 5 +  # activity contribution (inverse)
        family_history * 10 +  # family history contribution
        hospital_visits * 2  # hospital visits contribution
    )
    
    # Add some noise
    risk_score += np.random.normal(0, 5, n_samples)
    
    # Categorize into Low (0), Medium (1), High (2)
    risk_category = np.zeros(n_samples, dtype=int)
    risk_category[risk_score > 40] = 1  # Medium
    risk_category[risk_score > 60] = 2  # High
    df['risk_category'] = risk_category
    
    # Store raw risk score for potential use
    df['risk_score'] = np.clip(risk_score, 0, 100).round(2)
    
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
