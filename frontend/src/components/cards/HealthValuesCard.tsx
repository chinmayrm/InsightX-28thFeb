import { useState, useEffect } from 'react'
import { Activity, Heart, Droplets, Flame, Footprints, Home, Stethoscope, Calculator } from 'lucide-react'

interface HealthValuesCardProps {
  onUpdate: (data: HealthData) => void
  data: HealthData
  onBMIClick?: () => void
}

export interface HealthData {
  bmi: number
  blood_pressure: number
  cholesterol: number
  glucose: number
  smoking_habit: number
  physical_activity: number
  family_history: number
  hospital_visits: number
}

function NumberInput({ 
  value, 
  onChange, 
  min, 
  max, 
  label, 
  icon: Icon, 
  color,
  step = 1
}: { 
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  label: string
  icon: React.ElementType
  color: string
  step?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
        style={{ 
          '--tw-ring-color': color + '40'
        } as React.CSSProperties}
      />
      <div className="flex justify-between text-[10px] text-blue-500 px-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

function ToggleInput({ 
  value, 
  onChange, 
  options,
  label, 
  icon: Icon, 
  color
}: { 
  value: number
  onChange: (v: number) => void
  options: { value: number; label: string }[]
  label: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        {label}
      </label>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              value === opt.value
                ? 'text-white'
                : 'bg-blue-50/50 border border-blue-200 text-blue-700 hover:border-blue-300'
            }`}
            style={value === opt.value ? { backgroundColor: color, borderColor: color, border: '1px solid' } : {}}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function HealthValuesCard({ onUpdate, data, onBMIClick }: HealthValuesCardProps) {
  const [localData, setLocalData] = useState(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (field: keyof HealthData, value: number) => {
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    onUpdate(newData)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
        <div className="p-2.5 rounded-xl bg-sky-500/10">
          <Activity className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900">Health Metrics</h3>
          <p className="text-sm text-blue-600/70">Vital signs & lifestyle</p>
        </div>
      </div>

      {/* Vital Signs - Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: '#22c55e' }} />
            BMI
            {onBMIClick && (
              <button
                onClick={onBMIClick}
                className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-semibold hover:shadow-md hover:scale-105 transition-all"
              >
                <Calculator className="w-3 h-3" />
                Calc
              </button>
            )}
          </label>
          <input
            type="number"
            value={localData.bmi}
            onChange={(e) => handleChange('bmi', Number(e.target.value))}
            min={15}
            max={45}
            step={0.1}
            className="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': '#22c55e40' } as React.CSSProperties}
          />
          <div className="flex justify-between text-[10px] text-blue-500 px-1">
            <span>15</span>
            <span>45</span>
          </div>
        </div>
        <NumberInput
          value={localData.blood_pressure}
          onChange={(v) => handleChange('blood_pressure', v)}
          min={80}
          max={200}
          label="Blood Pressure"
          icon={Heart}
          color="#ef4444"
        />
      </div>

      {/* Vital Signs - Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          value={localData.cholesterol}
          onChange={(v) => handleChange('cholesterol', v)}
          min={100}
          max={350}
          label="Cholesterol"
          icon={Droplets}
          color="#f59e0b"
        />
        <NumberInput
          value={localData.glucose}
          onChange={(v) => handleChange('glucose', v)}
          min={50}
          max={250}
          label="Glucose"
          icon={Flame}
          color="#8b5cf6"
        />
      </div>

      {/* Lifestyle - Toggle Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <ToggleInput
          value={localData.smoking_habit}
          onChange={(v) => handleChange('smoking_habit', v)}
          options={[
            { value: 0, label: 'None' },
            { value: 1, label: 'Light' },
            { value: 2, label: 'Mod' },
            { value: 3, label: 'Heavy' }
          ]}
          label="Smoking"
          icon={Flame}
          color="#f97316"
        />
        <ToggleInput
          value={localData.physical_activity}
          onChange={(v) => handleChange('physical_activity', v)}
          options={[
            { value: 0, label: '0' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' }
          ]}
          label="Activity Level"
          icon={Footprints}
          color="#06b6d4"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        <ToggleInput
          value={localData.family_history}
          onChange={(v) => handleChange('family_history', v)}
          options={[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' }
          ]}
          label="Family History"
          icon={Home}
          color="#ec4899"
        />
        <NumberInput
          value={localData.hospital_visits}
          onChange={(v) => handleChange('hospital_visits', v)}
          min={0}
          max={10}
          label="Hospital Visits"
          icon={Stethoscope}
          color="#14b8a6"
        />
      </div>
    </div>
  )
}
