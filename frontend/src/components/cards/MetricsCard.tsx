import { BarChart3, TrendingUp, Target, Layers } from 'lucide-react'
import type { ModelMetrics } from '@/services/api'

interface MetricsCardProps {
  metrics: ModelMetrics | null
  isLoading?: boolean
}

function MetricBar({ label, value, color, icon: Icon }: { 
  label: string
  value: number
  color: string
  icon: React.ElementType
}) {
  const percentage = value * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm text-blue-800">{label}</span>
        </div>
        <span className="text-base font-bold" style={{ color }}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ backgroundColor: color, width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function MetricsCard({ metrics, isLoading }: MetricsCardProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
        <div className="p-2.5 rounded-xl bg-purple-500/10">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-900">Model Performance</h3>
          <p className="text-sm text-blue-600/70">AI prediction metrics</p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            isLoading ? 'bg-yellow-500 animate-pulse' : 
            metrics ? 'bg-green-500' : 'bg-blue-300'
          }`} />
          <span className="text-xs text-blue-500">
            {isLoading ? 'Loading' : metrics ? 'Ready' : 'Pending'}
          </span>
        </div>
      </div>

      {metrics ? (
        <div className="space-y-4">
          <MetricBar
            label="Linear Regression R²"
            value={metrics.linear_regression.r2_score}
            color="#3b82f6"
            icon={TrendingUp}
          />
          <MetricBar
            label="Decision Tree Accuracy"
            value={metrics.decision_tree.accuracy}
            color="#22c55e"
            icon={Target}
          />
          <MetricBar
            label="KNN Accuracy"
            value={metrics.knn.accuracy}
            color="#a855f7"
            icon={Layers}
          />
          
          {/* Clusters info */}
          <div className="flex items-center justify-between pt-3 border-t border-blue-200">
            <span className="text-sm text-blue-700">K-Means Clusters</span>
            <div className="flex gap-1.5">
              {Array.from({ length: metrics.kmeans.n_clusters }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className={`w-14 h-14 border-3 border-purple-500/30 ${isLoading ? 'border-t-purple-500 animate-spin' : 'border-blue-300'} rounded-full`}
          />
          <p className="text-sm text-blue-500 mt-4">
            {isLoading ? 'Training models...' : 'Analyze a patient to see metrics'}
          </p>
        </div>
      )}
    </div>
  )
}
