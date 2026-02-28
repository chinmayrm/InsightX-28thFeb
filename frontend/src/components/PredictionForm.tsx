import { useState, useEffect } from 'react'
import type { PatientInput } from '@/services/api'

interface PredictionFormProps {
  onSubmit: (data: PatientInput) => void;
  isLoading?: boolean;
  externalBMI?: number;
  externalGender?: 'Male' | 'Female';
}

export function PredictionForm({ onSubmit, isLoading, externalBMI, externalGender }: PredictionFormProps) {
  const [formData, setFormData] = useState<PatientInput>({
    age: 45,
    gender: 'Male',
    bmi: 25.0,
    blood_pressure: 120,
    cholesterol: 200,
    glucose: 100,
    smoking_habit: 0,
    physical_activity: 2,
    family_history: 0,
    hospital_visits: 1,
  })

  // Update form when external BMI/gender is provided from BMI Calculator
  useEffect(() => {
    if (externalBMI !== undefined) {
      setFormData(prev => ({ ...prev, bmi: Math.round(externalBMI * 10) / 10 }))
    }
  }, [externalBMI])

  useEffect(() => {
    if (externalGender !== undefined) {
      setFormData(prev => ({ ...prev, gender: externalGender }))
    }
  }, [externalGender])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min={18}
            max={100}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* BMI */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">BMI</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            min={10}
            max={60}
            step={0.1}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Blood Pressure (Systolic)</label>
          <input
            type="number"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
            min={70}
            max={250}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Cholesterol */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cholesterol (mg/dL)</label>
          <input
            type="number"
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
            min={100}
            max={400}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Glucose */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Glucose (mg/dL)</label>
          <input
            type="number"
            name="glucose"
            value={formData.glucose}
            onChange={handleChange}
            min={50}
            max={400}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Smoking Habit */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Smoking Habit</label>
          <select
            name="smoking_habit"
            value={formData.smoking_habit}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value={0}>Never</option>
            <option value={1}>Former</option>
            <option value={2}>Current</option>
          </select>
        </div>

        {/* Physical Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Physical Activity</label>
          <select
            name="physical_activity"
            value={formData.physical_activity}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value={0}>Sedentary</option>
            <option value={1}>Light</option>
            <option value={2}>Moderate</option>
            <option value={3}>Active</option>
          </select>
        </div>

        {/* Family History */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Family Medical History</label>
          <select
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        {/* Hospital Visits */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Previous Hospital Visits</label>
          <input
            type="number"
            name="hospital_visits"
            value={formData.hospital_visits}
            onChange={handleChange}
            min={0}
            max={20}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Patient'}
      </button>
    </form>
  )
}
