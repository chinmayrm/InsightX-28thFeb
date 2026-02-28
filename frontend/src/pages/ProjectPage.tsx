import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { StaticCard } from '@/components/ui/static-card'
import { Button as MovingBorderButton } from '@/components/ui/moving-border'
import { PatientInfoCard, HealthValuesCard, MetricsCard, type HealthData } from '@/components/cards'
import { VisualizationPanel } from '@/components/VisualizationPanel'
import { BMICalculator } from '@/components/bmi'
import { api } from '@/services/api'
import type { PatientInput, AllPredictions, ModelMetrics } from '@/services/api'
import { Sparkles } from 'lucide-react'

export function ProjectPage() {
  const [results, setResults] = useState<AllPredictions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [showBMICalculator, setShowBMICalculator] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Patient info state
  const [patientInfo, setPatientInfo] = useState({
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    dob: '1981-01-15',
    address: '123 Health Street, Medical City, IN 400001',
    contact: '+91 98765 43210'
  })

  // Health values state
  const [healthValues, setHealthValues] = useState<HealthData>({
    bmi: 25.0,
    blood_pressure: 120,
    cholesterol: 200,
    glucose: 100,
    smoking_habit: 0,
    physical_activity: 2,
    family_history: 0,
    hospital_visits: 1,
  })

  useEffect(() => {
    checkBackend()
    loadMetrics()
  }, [])

  const checkBackend = async () => {
    try {
      await api.healthCheck()
      setBackendStatus('online')
    } catch {
      setBackendStatus('offline')
    }
  }

  const loadMetrics = async () => {
    try {
      const data = await api.getModelMetrics()
      setMetrics(data)
    } catch {
      // Metrics not available yet
    }
  }

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const patientData: PatientInput = {
        age: patientInfo.age,
        gender: patientInfo.gender,
        ...healthValues
      }
      const data = await api.predictAll(patientData)
      setResults(data)
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBMISubmit = (bmi: number, gender: 'male' | 'female') => {
    setHealthValues(prev => ({ ...prev, bmi: Math.round(bmi * 10) / 10 }))
    setPatientInfo(prev => ({ ...prev, gender: gender === 'male' ? 'Male' : 'Female' }))
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 overflow-hidden">
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#93c5fd"
        maxOpacity={0.4}
        flickerChance={0.1}
      />
      
      <div className="relative z-10 min-h-screen py-6 px-8">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-900 mb-2">
              InsightX
            </h1>
            <p className="text-blue-700/80 text-base">
              Smart Healthcare Risk Prediction & Patient Segmentation System
            </p>
            
            {/* Backend Status */}
            <div className="mt-3 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  backendStatus === 'online' ? 'bg-green-500' : 
                  backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
                }`} />
                <span className="text-sm text-blue-600">
                  Backend: {backendStatus === 'checking' ? 'Connecting...' : backendStatus}
                </span>
              </div>
            </div>
          </div>

          {backendStatus === 'offline' ? (
            <div className="text-center p-8 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-600 text-lg mb-2">Backend server is offline</p>
              <p className="text-gray-600 text-sm">
                Start the backend server: <code className="bg-gray-200 px-2 py-1 rounded">python main.py</code>
              </p>
            </div>
          ) : (
            <>
              {/* Patient Info Card - Centered at Top */}
              <div className="flex justify-center mt-8 px-4">
                <div className="w-full max-w-3xl">
                  <StaticCard title="Patient Profile" accentColor="emerald" containerClassName="w-full">
                    <PatientInfoCard 
                      data={patientInfo}
                      onUpdate={setPatientInfo}
                    />
                  </StaticCard>
                </div>
              </div>

              {/* Health Values & AI Performance Cards - Below */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4">
                {/* Health Values Card */}
                <StaticCard 
                  title="Health Metrics" 
                  accentColor="cyan" 
                  containerClassName="w-full h-full"
                >
                  <HealthValuesCard 
                    data={healthValues}
                    onUpdate={setHealthValues}
                    onBMIClick={() => setShowBMICalculator(true)}
                  />
                </StaticCard>

                {/* Metrics Card */}
                <StaticCard title="AI Performance" accentColor="purple" containerClassName="w-full h-full">
                  <MetricsCard 
                    metrics={metrics}
                    isLoading={isLoading}
                  />
                </StaticCard>
              </div>

              {/* Analyze Button */}
              <div className="flex justify-center mt-10">
                <MovingBorderButton
                  onClick={handlePredict}
                  disabled={isLoading}
                  borderRadius="1.75rem"
                  containerClassName="h-14 w-52"
                  className="bg-gradient-to-r from-blue-600/90 via-cyan-600/90 to-sky-600/90 border-sky-400/30 text-base font-bold gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  borderClassName="bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)] h-24 w-24"
                  duration={2500}
                >
                  <Sparkles className="w-5 h-5" />
                  {isLoading ? 'Analyzing...' : 'Analyze Patient'}
                </MovingBorderButton>
              </div>

              {error && (
                <div className="max-w-md mx-auto mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Visualization Panel */}
              <AnimatePresence>
                {showResults && results && (
                  <VisualizationPanel
                    results={results}
                    patientName={patientInfo.name}
                    onClose={() => setShowResults(false)}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* BMI Calculator Modal */}
      <BMICalculator 
        isOpen={showBMICalculator} 
        onClose={() => setShowBMICalculator(false)}
        onBMISubmit={handleBMISubmit}
      />
    </div>
  )
}
