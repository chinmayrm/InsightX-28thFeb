import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar
} from 'recharts'
import { Activity, DollarSign, TrendingUp, X, Heart, Droplets, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import type { AllPredictions } from '@/services/api'

interface VisualizationPanelProps {
  results: AllPredictions
  patientName: string
  onClose: () => void
}

const COLORS = {
  primary: '#22c55e',
  secondary: '#10b981',
  accent: '#34d399',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
}

// Format INR currency
const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}



export function VisualizationPanel({ results, patientName, onClose }: VisualizationPanelProps) {
  const input = results.patient_input
  
  // Calculate realistic Diastolic BP (typically systolic - 40 for normal range, ratio ~1.5:1)
  const diastolicBP = Math.round(input.blood_pressure - 40 - Math.random() * 5)
  
  // Calculate comprehensive Health Score (0-100) based on medical standards
  let healthScore = 100
  
  // BMI scoring (max -25 points)
  if (input.bmi >= 30) healthScore -= 25 // Obese
  else if (input.bmi >= 25) healthScore -= 15 // Overweight
  else if (input.bmi < 18.5) healthScore -= 10 // Underweight
  else healthScore -= 0 // Normal
  
  // Blood Pressure scoring (max -25 points)
  if (input.blood_pressure >= 180) healthScore -= 25 // Crisis
  else if (input.blood_pressure >= 140) healthScore -= 20 // Stage 2 Hypertension
  else if (input.blood_pressure >= 130) healthScore -= 12 // Stage 1 Hypertension
  else if (input.blood_pressure >= 120) healthScore -= 5 // Elevated
  
  // Cholesterol scoring (max -20 points)
  if (input.cholesterol >= 240) healthScore -= 20 // High
  else if (input.cholesterol >= 200) healthScore -= 10 // Borderline
  
  // Glucose scoring (max -20 points)
  if (input.glucose >= 126) healthScore -= 20 // Diabetes
  else if (input.glucose >= 100) healthScore -= 10 // Prediabetes
  
  // Activity bonus (max +10 points)
  healthScore += input.physical_activity * 3
  
  // Smoking penalty
  if (input.smoking_habit === 2) healthScore -= 15
  else if (input.smoking_habit === 1) healthScore -= 8
  
  healthScore = Math.max(20, Math.min(100, healthScore))
  
  // Generate health status assessments
  const getBMIStatus = () => {
    if (input.bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600', advice: 'Consider nutritional consultation' }
    if (input.bmi <= 24.9) return { label: 'Normal', color: 'text-green-600', advice: 'Maintain current lifestyle' }
    if (input.bmi <= 29.9) return { label: 'Overweight', color: 'text-amber-600', advice: 'Moderate exercise recommended' }
    return { label: 'Obese', color: 'text-red-600', advice: 'Weight management program advised' }
  }
  
  const getBPStatus = () => {
    if (input.blood_pressure < 120) return { label: 'Normal', color: 'text-green-600', advice: 'Maintain healthy habits' }
    if (input.blood_pressure < 130) return { label: 'Elevated', color: 'text-amber-500', advice: 'Monitor regularly, reduce sodium' }
    if (input.blood_pressure < 140) return { label: 'High (Stage 1)', color: 'text-orange-600', advice: 'Lifestyle changes recommended' }
    return { label: 'High (Stage 2)', color: 'text-red-600', advice: 'Consult physician immediately' }
  }
  
  const getCholesterolStatus = () => {
    if (input.cholesterol < 200) return { label: 'Desirable', color: 'text-green-600', advice: 'Continue healthy diet' }
    if (input.cholesterol < 240) return { label: 'Borderline High', color: 'text-amber-600', advice: 'Reduce saturated fats' }
    return { label: 'High', color: 'text-red-600', advice: 'Medication may be needed' }
  }
  
  const getGlucoseStatus = () => {
    if (input.glucose < 100) return { label: 'Normal', color: 'text-green-600', advice: 'Maintain balanced diet' }
    if (input.glucose < 126) return { label: 'Prediabetes', color: 'text-amber-600', advice: 'Reduce sugar intake, exercise' }
    return { label: 'Diabetes Range', color: 'text-red-600', advice: 'Consult endocrinologist' }
  }

  // Health score weekly trend data
  const healthScoreData = [
    { day: 'Mon', current: Math.max(50, healthScore - 8), previous: Math.max(40, healthScore - 15) },
    { day: 'Tue', current: Math.max(50, healthScore - 5), previous: Math.max(40, healthScore - 12) },
    { day: 'Wed', current: Math.max(50, healthScore - 6), previous: Math.max(40, healthScore - 10) },
    { day: 'Thu', current: Math.max(50, healthScore - 3), previous: Math.max(40, healthScore - 8) },
    { day: 'Fri', current: Math.max(50, healthScore - 2), previous: Math.max(40, healthScore - 6) },
    { day: 'Sat', current: Math.max(50, healthScore - 1), previous: Math.max(40, healthScore - 4) },
    { day: 'Sun', current: healthScore, previous: Math.max(40, healthScore - 2) },
  ]

  // Vitals data with realistic diastolic BP
  const vitalsData = [
    { day: 'Mon', systole: 118, diastole: 78, cholesterol: 195 },
    { day: 'Tue', systole: 122, diastole: 80, cholesterol: 198 },
    { day: 'Wed', systole: 120, diastole: 79, cholesterol: 192 },
    { day: 'Thu', systole: input.blood_pressure, diastole: diastolicBP, cholesterol: input.cholesterol },
    { day: 'Fri', systole: Math.round(input.blood_pressure * 0.98), diastole: diastolicBP - 2, cholesterol: input.cholesterol - 3 },
    { day: 'Sat', systole: Math.round(input.blood_pressure * 0.97), diastole: diastolicBP - 3, cholesterol: input.cholesterol - 2 },
    { day: 'Sun', systole: input.blood_pressure, diastole: diastolicBP, cholesterol: input.cholesterol },
  ]

  // Risk Distribution for radial chart (probabilities are already 0-100 from backend)
  const riskScore = Math.round(results.risk_category.probabilities.High + results.risk_category.probabilities.Medium * 0.5)
  const riskRadialData = [
    { name: 'Risk', value: Math.min(100, riskScore), fill: results.risk_category.risk_category === 'High' ? COLORS.rose : results.risk_category.risk_category === 'Medium' ? COLORS.amber : COLORS.primary },
  ]

  // Disease confidence radial (confidence is already 0-100 from backend)
  const diseaseRadialData = [
    { name: 'Confidence', value: Math.round(results.disease_presence.confidence), fill: results.disease_presence.disease_present ? COLORS.rose : COLORS.primary },
  ]

  // Medical expenses trend in INR (monthly breakdown)
  const monthlyExpense = results.medical_expenses.predicted_expenses / 12
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1y')
  
  const allExpensesData = [
    { month: 'Jan', amount: Math.round(monthlyExpense * 0.8) },
    { month: 'Feb', amount: Math.round(monthlyExpense * 0.9) },
    { month: 'Mar', amount: Math.round(monthlyExpense * 0.85) },
    { month: 'Apr', amount: Math.round(monthlyExpense * 1.1) },
    { month: 'May', amount: Math.round(monthlyExpense * 0.95) },
    { month: 'Jun', amount: Math.round(monthlyExpense) },
    { month: 'Jul', amount: Math.round(monthlyExpense * 1.05) },
    { month: 'Aug', amount: Math.round(monthlyExpense * 0.92) },
    { month: 'Sep', amount: Math.round(monthlyExpense * 1.08) },
    { month: 'Oct', amount: Math.round(monthlyExpense * 0.88) },
    { month: 'Nov', amount: Math.round(monthlyExpense * 1.02) },
    { month: 'Dec', amount: Math.round(monthlyExpense * 1.15) },
  ]
  
  const getFilteredExpensesData = () => {
    switch (selectedPeriod) {
      case '1m': return allExpensesData.slice(-1)
      case '3m': return allExpensesData.slice(-3)
      case '6m': return allExpensesData.slice(-6)
      case '1y': return allExpensesData
      case 'All': return allExpensesData
      default: return allExpensesData
    }
  }
  
  const expensesData = getFilteredExpensesData()

  // BMI and Glucose trend
  const metricsData = [
    { day: 'Mon', bmi: +(input.bmi - 0.3).toFixed(1), glucose: input.glucose - 5 },
    { day: 'Tue', bmi: +(input.bmi - 0.2).toFixed(1), glucose: input.glucose - 3 },
    { day: 'Wed', bmi: +(input.bmi - 0.1).toFixed(1), glucose: input.glucose - 4 },
    { day: 'Thu', bmi: input.bmi, glucose: input.glucose },
    { day: 'Fri', bmi: +(input.bmi + 0.1).toFixed(1), glucose: input.glucose + 2 },
    { day: 'Sat', bmi: +(input.bmi + 0.05).toFixed(1), glucose: input.glucose - 1 },
    { day: 'Sun', bmi: input.bmi, glucose: input.glucose },
  ]
  
  const bmiStatus = getBMIStatus()
  const bpStatus = getBPStatus()
  const cholesterolStatus = getCholesterolStatus()
  const glucoseStatus = getGlucoseStatus()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/95 via-sky-50/95 to-cyan-50/95 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white/90 rounded-3xl border border-blue-100 shadow-xl"
      >
        {/* SVG Gradients */}
        <svg className="absolute w-0 h-0">
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </svg>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-8 py-6 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                Analysis Visualization
              </h2>
              <p className="text-blue-600/70 mt-1">Comprehensive health insights for {patientName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Health Score Card - Like Osler Score */}
          <div className="lg:col-span-2 bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Health Score
                </h3>
                <p className="text-4xl font-bold text-blue-900 mt-2">{healthScore} <span className="text-lg font-normal text-blue-400">pts</span></p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-blue-700">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-300" />
                  <span className="text-blue-700">Previous</span>
                </div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthScoreData}>
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis hide domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} fill="transparent" dot={false} />
                  <Area type="monotone" dataKey="current" stroke="#22c55e" strokeWidth={3} fill="url(#healthGradient)" dot={{ fill: '#22c55e', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#22c55e' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Circular Risk Indicator */}
          <div className="bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Risk Assessment</h3>
            <p className="text-blue-600/70 text-sm mb-4">{results.risk_category.risk_category} Risk Level</p>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={riskRadialData} startAngle={180} endAngle={0}>
                  <RadialBar background={{ fill: '#dbeafe' }} dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-8">
              <span className="text-3xl font-bold text-blue-900">{riskScore}%</span>
              <p className="text-blue-600/70 text-sm">Risk Score</p>
            </div>
          </div>

          {/* Blood Pressure / Vitals Chart */}
          <div className="lg:col-span-2 bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Vital Signs Trend
                </h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">{input.blood_pressure}/{diastolicBP} <span className="text-base font-normal text-blue-400">mmHg</span></p>
                <p className={`text-sm mt-1 ${bpStatus.color}`}>{bpStatus.label}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-blue-700">Systolic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-blue-700">Diastolic</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-blue-700">Cholesterol</span>
                </div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="systole" stroke="#f43f5e" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="diastole" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="cholesterol" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disease Confidence Circle */}
          <div className="bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Disease Analysis
            </h3>
            <p className="text-blue-600/70 text-sm mb-4">{results.disease_presence.disease_present ? 'Indicators Present' : 'No Indicators'}</p>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={12} data={diseaseRadialData} startAngle={180} endAngle={0}>
                  <RadialBar background={{ fill: '#dbeafe' }} dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-8">
              <span className="text-3xl font-bold text-blue-900">{Math.round(results.disease_presence.confidence)}%</span>
              <p className="text-blue-600/70 text-sm">Confidence</p>
            </div>
          </div>

          {/* BMI & Glucose Metrics */}
          <div className="bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  Body Metrics
                </h3>
                <p className="text-2xl font-bold text-blue-900 mt-2">BMI: {input.bmi.toFixed(1)}</p>
                <p className={`text-sm ${bmiStatus.color}`}>{bmiStatus.label}</p>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsData}>
                  <defs>
                    <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="bmi" stroke="#06b6d4" strokeWidth={3} fill="url(#bmiGradient)" dot={{ fill: '#06b6d4', strokeWidth: 0, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Medical Expenses Trend */}
          <div className="lg:col-span-2 bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Estimated Medical Expenses
                </h3>
                <p className="text-3xl font-bold text-blue-900 mt-2">{formatINR(results.medical_expenses.predicted_expenses)} <span className="text-base font-normal text-blue-400">/year</span></p>
                <p className="text-sm text-blue-600/70">Monthly avg: {formatINR(monthlyExpense)}</p>
              </div>
              <div className="flex gap-2">
                {['1m', '3m', '6m', '1y', 'All'].map((period) => (
                  <button 
                    key={period} 
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedPeriod === period ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expensesData}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [formatINR(Number(value)), 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fill="url(#expenseGradient)" dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#8b5cf6' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Analysis Summary Section */}
        <div className="px-8 pb-6">
          <div className="bg-gradient-to-br from-blue-50/80 to-sky-50/80 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Health Analysis Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Findings */}
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">Key Findings</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {input.bmi <= 24.9 && input.bmi >= 18.5 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-blue-800">BMI: {input.bmi.toFixed(1)} kg/m²</p>
                      <p className={`text-xs ${bmiStatus.color}`}>{bmiStatus.label} - {bmiStatus.advice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {input.blood_pressure < 130 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-blue-800">Blood Pressure: {input.blood_pressure}/{diastolicBP} mmHg</p>
                      <p className={`text-xs ${bpStatus.color}`}>{bpStatus.label} - {bpStatus.advice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {input.cholesterol < 200 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-blue-800">Cholesterol: {input.cholesterol} mg/dL</p>
                      <p className={`text-xs ${cholesterolStatus.color}`}>{cholesterolStatus.label} - {cholesterolStatus.advice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    {input.glucose < 100 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-blue-800">Fasting Glucose: {input.glucose} mg/dL</p>
                      <p className={`text-xs ${glucoseStatus.color}`}>{glucoseStatus.label} - {glucoseStatus.advice}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tasks to be Performed */}
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">Tasks to be Performed</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/80 border border-blue-100">
                    <p className="text-blue-600">Linear Regression – Predict Medical Expenses</p>
                    <p className="font-semibold text-blue-900">{formatINR(results.medical_expenses.predicted_expenses)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 border border-blue-100">
                    <p className="text-blue-600">Decision Tree – Classify Disease Presence</p>
                    <p className={`font-semibold ${results.disease_presence.disease_present ? 'text-red-600' : 'text-green-600'}`}>
                      {results.disease_presence.disease_present ? 'Risk Indicators Present' : 'No Disease Indicators'} ({Math.round(results.disease_presence.confidence)}% confidence)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 border border-blue-100">
                    <p className="text-blue-600">KNN – Predict Risk Category</p>
                    <p className="font-semibold text-blue-900">{results.risk_category.risk_category} Risk ({Math.round(results.risk_category.probabilities[results.risk_category.risk_category as keyof typeof results.risk_category.probabilities])}% confidence)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/80 border border-blue-100">
                    <p className="text-blue-600">K-Means – Cluster Patient Risk Segments</p>
                    <p className="font-semibold text-blue-900">{results.patient_segment.cluster_name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overall Assessment */}
            <div className="mt-6 p-4 rounded-xl bg-white/80 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Overall Assessment</h4>
              <p className="text-sm text-blue-700">
                Based on the analysis, {patientName}'s health score is <span className="font-semibold">{healthScore}/100</span>. 
                {healthScore >= 80 ? (
                  " This indicates good overall health. Continue maintaining healthy lifestyle habits including regular exercise and balanced diet."
                ) : healthScore >= 60 ? (
                  " This suggests moderate health status. Focus on improving areas flagged above, particularly through lifestyle modifications."
                ) : (
                  " This indicates areas requiring attention. We recommend consulting healthcare professionals for personalized guidance on the flagged risk factors."
                )}
                {' '}Estimated annual healthcare expenses are <span className="font-semibold">{formatINR(results.medical_expenses.predicted_expenses)}</span> 
                ({formatINR(monthlyExpense)}/month average).
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-8 pb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <p className="text-green-600 text-sm font-medium">Health Score</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{healthScore}/100</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <p className="text-blue-600 text-sm font-medium">Risk Level</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{results.risk_category.risk_category}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
            <p className="text-purple-600 text-sm font-medium">Est. Expenses</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">₹{(results.medical_expenses.predicted_expenses / 1000).toFixed(0)}k</p>
          </div>
          <div className={`bg-gradient-to-br ${results.disease_presence.disease_present ? 'from-red-50 to-rose-50 border-red-100' : 'from-emerald-50 to-green-50 border-emerald-100'} rounded-xl p-4 border`}>
            <p className={`${results.disease_presence.disease_present ? 'text-red-600' : 'text-emerald-600'} text-sm font-medium`}>Disease Status</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{results.disease_presence.disease_present ? 'At Risk' : 'Clear'}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
