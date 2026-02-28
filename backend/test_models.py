"""Test improved ML models"""
from ml_models import HealthcareMLModels
from data_generator import generate_synthetic_data

print('Generating improved synthetic data (2000 samples)...')
df = generate_synthetic_data(n_samples=2000)
print(f'Generated {len(df)} records')
print(f'Disease distribution: {df["disease_presence"].value_counts().to_dict()}')
print(f'Risk distribution: {df["risk_category"].value_counts().to_dict()}')

print('\nTraining models with improved configuration...')
models = HealthcareMLModels()
results = models.train_all_models(df)

print('\n' + '='*50)
print('MODEL PERFORMANCE')
print('='*50)
for model, metrics in results.items():
    print(f'\n{model.upper()}:')
    for metric, value in metrics.items():
        if isinstance(value, (float, int)):
            if any(x in metric for x in ['score', 'accuracy', 'precision', 'recall', 'f1', 'r2']):
                print(f'  {metric}: {value*100:.1f}%')
            else:
                print(f'  {metric}: {value:.2f}')
