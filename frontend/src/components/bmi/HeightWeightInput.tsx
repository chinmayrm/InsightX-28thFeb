import { motion } from 'framer-motion'
import { useState } from 'react'

interface HeightWeightInputProps {
  weight: number
  height: number
  gender: 'male' | 'female' | null
  onWeightChange: (weight: number) => void
  onHeightChange: (height: number) => void
  onNext: () => void
  onBack: () => void
}

export function HeightWeightInput({ 
  weight, 
  height, 
  gender,
  onWeightChange, 
  onHeightChange, 
  onNext, 
  onBack 
}: HeightWeightInputProps) {
  const [isDraggingWeight, setIsDraggingWeight] = useState(false)
  const [isDraggingHeight, setIsDraggingHeight] = useState(false)

  // Convert height cm to feet and inches for display
  const heightInFeet = Math.floor(height / 30.48)
  const heightInInches = Math.round((height / 2.54) % 12)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col h-full py-6 px-6"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start p-2 -ml-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 text-center mt-2">Your height & weight</h2>

      <div className="flex-1 flex items-center justify-center gap-8 mt-6">
        {/* Weight Slider */}
        <div className="flex flex-col items-center h-64">
          <motion.div 
            animate={{ scale: isDraggingWeight ? 1.1 : 1 }}
            className="text-lg font-bold text-gray-800 mb-2"
          >
            {weight} kg
          </motion.div>
          <div className="relative h-48 w-8 bg-gray-200 rounded-full overflow-hidden">
            {/* Slider Track Fill */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-pink-300 rounded-full"
              style={{ height: `${((weight - 30) / 150) * 100}%` }}
              animate={{ height: `${((weight - 30) / 150) * 100}%` }}
            />
            {/* Slider Input */}
            <input
              type="range"
              min="30"
              max="180"
              value={weight}
              onChange={(e) => onWeightChange(Number(e.target.value))}
              onMouseDown={() => setIsDraggingWeight(true)}
              onMouseUp={() => setIsDraggingWeight(false)}
              onTouchStart={() => setIsDraggingWeight(true)}
              onTouchEnd={() => setIsDraggingWeight(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ 
                writingMode: 'vertical-lr',
                WebkitAppearance: 'slider-vertical'
              }}
            />
            {/* Thumb indicator */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-pink-500"
              style={{ bottom: `calc(${((weight - 30) / 150) * 100}% - 12px)` }}
              animate={{ bottom: `calc(${((weight - 30) / 150) * 100}% - 12px)` }}
            />
          </div>
          <span className="text-sm text-gray-500 mt-2">Weight</span>
        </div>

        {/* Character Illustration */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 120 200" className="w-24 h-40">
              {gender === 'female' ? (
                <>
                  {/* Female Character */}
                  {/* Hair */}
                  <ellipse cx="60" cy="40" rx="28" ry="30" fill="#2d1b0e"/>
                  <path d="M32 40 Q28 70 35 100 L35 50 Z" fill="#2d1b0e"/>
                  <path d="M88 40 Q92 70 85 100 L85 50 Z" fill="#2d1b0e"/>
                  {/* Face */}
                  <ellipse cx="60" cy="45" rx="22" ry="24" fill="#ffd5c8"/>
                  {/* Eyes */}
                  <ellipse cx="52" cy="42" rx="3" ry="3.5" fill="#333"/>
                  <ellipse cx="68" cy="42" rx="3" ry="3.5" fill="#333"/>
                  {/* Blush */}
                  <ellipse cx="48" cy="50" rx="4" ry="2" fill="#ffb6c1" opacity="0.6"/>
                  <ellipse cx="72" cy="50" rx="4" ry="2" fill="#ffb6c1" opacity="0.6"/>
                  {/* Smile */}
                  <path d="M54 55 Q60 60 66 55" stroke="#333" strokeWidth="2" fill="none"/>
                  {/* Neck */}
                  <rect x="55" y="68" width="10" height="10" fill="#ffd5c8"/>
                  {/* Dress */}
                  <path d="M40 78 L35 140 L85 140 L80 78 Q60 85 40 78" fill="#ff6b8a"/>
                  {/* Arms */}
                  <path d="M38 82 L28 110" stroke="#ffd5c8" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M82 82 L92 110" stroke="#ffd5c8" strokeWidth="8" strokeLinecap="round"/>
                  {/* Skirt */}
                  <path d="M32 140 L25 180 L95 180 L88 140 Z" fill="#1a1a2e"/>
                  {/* Legs */}
                  <line x1="50" y1="180" x2="48" y2="198" stroke="#ffd5c8" strokeWidth="8"/>
                  <line x1="70" y1="180" x2="72" y2="198" stroke="#ffd5c8" strokeWidth="8"/>
                </>
              ) : (
                <>
                  {/* Male Character */}
                  {/* Hair */}
                  <ellipse cx="60" cy="35" rx="25" ry="18" fill="#5a4a3a"/>
                  {/* Face */}
                  <ellipse cx="60" cy="45" rx="22" ry="24" fill="#ffd5c8"/>
                  {/* Eyes */}
                  <ellipse cx="52" cy="42" rx="3" ry="3.5" fill="#333"/>
                  <ellipse cx="68" cy="42" rx="3" ry="3.5" fill="#333"/>
                  {/* Smile */}
                  <path d="M54 55 Q60 60 66 55" stroke="#333" strokeWidth="2" fill="none"/>
                  {/* Neck */}
                  <rect x="55" y="68" width="10" height="10" fill="#ffd5c8"/>
                  {/* T-Shirt */}
                  <path d="M35 78 L35 145 L85 145 L85 78 Q60 88 35 78" fill="#87ceeb"/>
                  {/* Arms */}
                  <path d="M35 82 L22 115" stroke="#ffd5c8" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M85 82 L98 115" stroke="#ffd5c8" strokeWidth="8" strokeLinecap="round"/>
                  {/* Pants */}
                  <path d="M35 145 L42 198 L60 198 L60 145 Z" fill="#90ee90"/>
                  <path d="M85 145 L78 198 L60 198 L60 145 Z" fill="#90ee90"/>
                </>
              )}
            </svg>
          </motion.div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">{heightInFeet}'{heightInInches}"</span>
          </div>
        </div>

        {/* Height Slider */}
        <div className="flex flex-col items-center h-64">
          <motion.div 
            animate={{ scale: isDraggingHeight ? 1.1 : 1 }}
            className="text-lg font-bold text-gray-800 mb-2"
          >
            {heightInFeet}'{heightInInches}"
          </motion.div>
          <div className="relative h-48 w-8 bg-gray-200 rounded-full overflow-hidden">
            {/* Height markers */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              {[6, 5, 4, 3].map((ft) => (
                <div key={ft} className="flex items-center justify-end pr-1">
                  <span className="text-[10px] text-gray-400">{ft}'</span>
                </div>
              ))}
            </div>
            {/* Slider Track Fill */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-300 rounded-full"
              style={{ height: `${((height - 100) / 120) * 100}%` }}
              animate={{ height: `${((height - 100) / 120) * 100}%` }}
            />
            {/* Slider Input */}
            <input
              type="range"
              min="100"
              max="220"
              value={height}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              onMouseDown={() => setIsDraggingHeight(true)}
              onMouseUp={() => setIsDraggingHeight(false)}
              onTouchStart={() => setIsDraggingHeight(true)}
              onTouchEnd={() => setIsDraggingHeight(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ 
                writingMode: 'vertical-lr',
                WebkitAppearance: 'slider-vertical'
              }}
            />
            {/* Thumb indicator */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-purple-500"
              style={{ bottom: `calc(${((height - 100) / 120) * 100}% - 12px)` }}
              animate={{ bottom: `calc(${((height - 100) / 120) * 100}% - 12px)` }}
            />
          </div>
          <span className="text-sm text-gray-500 mt-2">Height</span>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          className="w-14 h-14 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center shadow-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}
