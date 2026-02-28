

<h1 style="font-size:2.2em; font-weight:bold; text-align:center; margin-bottom:0.2em;">Smart Healthcare Risk Prediction & Patient Segmentation System</h1>
<div style="font-size:1.35em; font-weight:bold; text-align:center; color:#1155cc; margin-bottom:1em; letter-spacing:0.01em;">
  Smart Healthcare Risk Prediction &amp; Patient Segmentation System
</div>

# InsightX Project Report

## Project Overview

**InsightX** is a full-stack healthcare analytics platform designed for smart healthcare risk prediction and patient segmentation. It consists of a Python-based backend (FastAPI) for data generation, machine learning, and prediction APIs, and a modern React + TypeScript frontend for user interaction and visualization.

---

## Backend (e:/InsightX/backend)

- **Framework:** FastAPI (Python)
- **Key Libraries:** pandas, numpy, scikit-learn, pydantic, matplotlib, seaborn, joblib, python-multipart, uvicorn
- **Main Files:**
  - **main.py:** FastAPI app with endpoints for health check, data generation, model training, prediction, metrics, and visualization.
  - **data_generator.py:** Generates synthetic healthcare datasets.
  - **ml_models.py:** Contains machine learning models for regression, classification, risk prediction, and clustering.
  - **test_models.py:** For testing ML models.
  - **models/**: Stores pre-trained model artifacts (joblib files).
- **Endpoints:**
  - `/health`: Health check
  - `/api/data/generate`: Generate synthetic data
  - `/api/models/train`: Train/retrain models
  - `/api/predict/{model_type}`: Predict using a specific model
  - `/api/predict/all`: Predict all outcomes for a patient
  - `/api/models/metrics`: Get model metrics
  - `/api/visualize/{chart_type}`: Get visualizations

---

## Synthetic Data Generation

The synthetic healthcare data used in this project is generated dynamically using the function `generate_synthetic_data` located in `backend/data_generator.py`. This function creates a DataFrame with realistic patient features (age, gender, BMI, blood pressure, cholesterol, glucose, smoking habit, physical activity, family history, hospital visits) and target variables (medical expenses, disease presence, risk category) for machine learning tasks.

Key points:
- **No static file:** The synthetic data is not stored as a static file. It is generated in memory whenever needed by the backend.
- **API usage:** The backend endpoint `/api/data/generate` creates new synthetic data on request. The backend also generates a default dataset at startup and for model training if no dataset is present.
- **Direct script usage:** You can generate and inspect synthetic data by running `data_generator.py` or `test_models.py` directly.
- **Customization:** The number of samples and random seed can be customized via API or script arguments.

If you want to persist the data, you can modify the code to save the generated DataFrame to a CSV or other file format.

---

## Frontend (e:/InsightX/frontend)

- **Framework:** React + TypeScript, Vite
- **Styling:** Tailwind CSS
- **Key Libraries:** framer-motion, lucide-react, recharts, react-router-dom, clsx
- **Main Files:**
  - **src/App.tsx:** Main app with routing and intro screen.
  - **src/pages/MainPage.tsx:** Landing page with team info, social/contact links.
  - **src/pages/ProjectPage.tsx:** Main dashboard for patient input, predictions, metrics, and visualizations.
  - **src/services/api.ts:** TypeScript API client for backend endpoints.
  - **src/components/**: Modular UI components (BMI calculator, cards, visualization panels, etc.).
- **Features:**
  - Patient data input and validation
  - Real-time predictions (expenses, disease, risk, segmentation)
  - Model metrics and visualizations
  - Modern, animated UI with social/contact integration

---

## Workflow

1. **User Interaction:** Users input patient data via the frontend.
2. **API Requests:** Frontend sends requests to backend endpoints for predictions, data generation, or metrics.
3. **ML Processing:** Backend processes requests using pre-trained or retrained models, returns predictions/metrics.
4. **Visualization:** Frontend displays results, metrics, and visualizations interactively.

---

## Team

- Chinmay R M (Team Lead)
- Sameer P (Frontend Developer)
- Appaji B M (Frontend Developer)
- Preeti Katti (Backend Developer)

---

## Summary

InsightX is a robust, modular, and modern healthcare analytics platform, leveraging FastAPI for scalable backend ML services and a React/TypeScript frontend for a rich user experience. It is well-structured for further extension, deployment, and real-world healthcare analytics use cases.
