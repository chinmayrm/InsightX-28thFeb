import { useState, useEffect } from 'react'
import { User, Calendar, Users, MapPin, CalendarDays, Phone } from 'lucide-react'

interface PatientInfoCardProps {
  onUpdate: (data: { name: string; age: number; gender: string; dob: string; address: string; contact: string }) => void
  data: { name: string; age: number; gender: string; dob: string; address: string; contact: string }
}

export function PatientInfoCard({ onUpdate, data }: PatientInfoCardProps) {
  const [localData, setLocalData] = useState(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (field: string, value: string | number) => {
    const newData = { ...localData, [field]: value }
    
    // Auto-calculate age from DOB
    if (field === 'dob' && value) {
      const birthDate = new Date(value as string)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      newData.age = age > 0 ? age : 0
    }
    
    setLocalData(newData)
    onUpdate(newData)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
        <div className="p-2.5 rounded-xl bg-emerald-500/10">
          <User className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900">Patient Information</h3>
          <p className="text-sm text-blue-600/70">Enter basic demographics</p>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full" />
          Patient Name
        </label>
        <input
          type="text"
          value={localData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter patient name"
          className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-blue-400"
        />
      </div>

      {/* Gender Select */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full" />
          <Users className="w-4 h-4" /> Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange('gender', 'Male')}
            className={`px-4 py-3 rounded-xl border text-base font-medium transition-all ${
              localData.gender === 'Male'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                : 'bg-blue-50/50 border-blue-200 text-blue-700 hover:border-blue-300'
            }`}
          >
            ♂ Male
          </button>
          <button
            type="button"
            onClick={() => handleChange('gender', 'Female')}
            className={`px-4 py-3 rounded-xl border text-base font-medium transition-all ${
              localData.gender === 'Female'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                : 'bg-blue-50/50 border-blue-200 text-blue-700 hover:border-blue-300'
            }`}
          >
            ♀ Female
          </button>
        </div>
      </div>

      {/* DOB, Age, Contact - Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* DOB Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            <CalendarDays className="w-4 h-4" /> DOB
          </label>
          <input
            type="date"
            value={localData.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
            className="w-full px-3 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Age Input (Auto-calculated) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            <Calendar className="w-4 h-4" /> Age
          </label>
          <input
            type="number"
            value={localData.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            min={1}
            max={120}
            placeholder="Auto"
            className="w-full px-3 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Contact Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            <Phone className="w-4 h-4" /> Contact
          </label>
          <input
            type="tel"
            value={localData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-3 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-blue-400"
          />
        </div>
      </div>

      {/* Address Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full" />
          <MapPin className="w-4 h-4" /> Address
        </label>
        <textarea
          value={localData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter full address"
          rows={2}
          className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-blue-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-blue-400 resize-none"
        />
      </div>
    </div>
  )
}
