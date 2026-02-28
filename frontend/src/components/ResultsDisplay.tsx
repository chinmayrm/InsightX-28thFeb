import type { AllPredictions } from '@/services/api'

interface ResultsDisplayProps {
  results: AllPredictions | null;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) return null;

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Low': return 'text-green-400 bg-green-900/30 border-green-500/50';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      case 'High': return 'text-red-400 bg-red-900/30 border-red-500/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
    }
  }

  const getSegmentColor = (segment: number) => {
    const colors = [
      'text-blue-400 bg-blue-900/30 border-blue-500/50',
      'text-purple-400 bg-purple-900/30 border-purple-500/50',
      'text-cyan-400 bg-cyan-900/30 border-cyan-500/50',
      'text-pink-400 bg-pink-900/30 border-pink-500/50',
    ];
    return colors[segment % colors.length];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Medical Expenses - Linear Regression */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💰</span>
          <h3 className="text-lg font-semibold text-blue-300">Medical Expenses</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">Linear Regression Model</p>
        <p className="text-3xl font-bold text-white">
          ${results.medical_expenses.predicted_expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-gray-400 mt-1">Estimated Annual Cost</p>
      </div>

      {/* Disease Prediction - Decision Tree */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🩺</span>
          <h3 className="text-lg font-semibold text-emerald-300">Disease Prediction</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">Decision Tree Model</p>
        <p className="text-3xl font-bold text-white">
          {results.disease_presence.disease_present ? 'Risk Detected' : 'No Risk'}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${results.disease_presence.probability_disease * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-300">{(results.disease_presence.probability_disease * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Risk Category - KNN */}
      <div className={`p-4 rounded-lg border ${getRiskColor(results.risk_category.risk_category)}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold">Risk Category</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">KNN Classifier Model</p>
        <p className="text-3xl font-bold">
          {results.risk_category.risk_category}
        </p>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Level: {results.risk_category.risk_level}</p>
        </div>
      </div>

      {/* Patient Segment - K-Means */}
      <div className={`p-4 rounded-lg border ${getSegmentColor(results.patient_segment.cluster)}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">👥</span>
          <h3 className="text-lg font-semibold">Patient Segment</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">K-Means Clustering Model</p>
        <p className="text-3xl font-bold">
          {results.patient_segment.cluster_name}
        </p>
        <p className="text-sm text-gray-400 mt-1">Cluster #{results.patient_segment.cluster}</p>
      </div>
    </div>
  )
}
