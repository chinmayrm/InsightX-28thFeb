import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BMIResultProps {
  bmi: number
  weight: number
  height: number
  onBack: () => void
  onClose: () => void
}

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#ff4d6d', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  return (
    <motion.div
      initial={{ y: -20, x, opacity: 1, rotate: 0 }}
      animate={{ 
        y: 400, 
        x: x + (Math.random() - 0.5) * 100,
        opacity: 0,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
      }}
      transition={{ 
        duration: 2 + Math.random(),
        delay,
        ease: "easeOut"
      }}
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color, left: '50%' }}
    />
  )
}

export function BMIResult({ bmi, weight, height, onBack, onClose }: BMIResultProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Determine BMI category
  const getBMICategory = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#4d96ff', section: 0 }
    if (bmi < 25) return { label: 'Normal', color: '#6bcb77', section: 1 }
    if (bmi < 30) return { label: 'Overweight', color: '#ffd93d', section: 2 }
    return { label: 'Obese', color: '#ff4d6d', section: 3 }
  }

  const category = getBMICategory()
  
  // Calculate pointer position (0-100%)
  const getPointerPosition = () => {
    if (bmi < 15) return 0
    if (bmi > 35) return 100
    return ((bmi - 15) / 20) * 100
  }

  useEffect(() => {
    // Show confetti for normal BMI
    if (category.label === 'Normal') {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [category.label])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col h-full py-6 px-6 relative overflow-hidden"
    >
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiParticle 
                key={i} 
                delay={i * 0.05} 
                x={(i % 10) * 30 - 120}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start p-2 -ml-2 text-gray-500 hover:text-gray-700 transition-colors z-10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 text-center mt-2">Your Result</h2>

      {/* BMI Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.span 
            className="text-6xl font-bold"
            style={{ color: category.color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {bmi.toFixed(1)}
          </motion.span>
          <p className="text-gray-500 mt-2">Your BMI</p>
        </motion.div>

        {/* Category Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-2 rounded-full text-white font-semibold mb-8"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </motion.div>

        {/* BMI Scale Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs"
        >
          <div className="relative">
            {/* Scale bar */}
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-400" /> {/* Underweight */}
              <div className="flex-1 bg-green-400" /> {/* Normal */}
              <div className="flex-1 bg-yellow-400" /> {/* Overweight */}
              <div className="flex-1 bg-red-400" /> {/* Obese */}
            </div>
            
            {/* Pointer */}
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${getPointerPosition()}%` }}
              transition={{ type: "spring", delay: 0.7 }}
              className="absolute -top-1 w-0 h-0"
              style={{ transform: 'translateX(-50%)' }}
            >
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-gray-800" />
            </motion.div>
          </div>

          {/* Scale labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35+</span>
          </div>

          {/* Category labels */}
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span className="w-1/4 text-center">Under</span>
            <span className="w-1/4 text-center">Normal</span>
            <span className="w-1/4 text-center">Over</span>
            <span className="w-1/4 text-center">Obese</span>
          </div>
        </motion.div>

        {/* Weight & Height Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-8 mt-8 text-sm text-gray-600"
        >
          <div className="text-center">
            <span className="font-semibold text-gray-800">{weight} kg</span>
            <p className="text-gray-400">Weight</p>
          </div>
          <div className="text-center">
            <span className="font-semibold text-gray-800">{height} cm</span>
            <p className="text-gray-400">Height</p>
          </div>
        </motion.div>
      </div>

      {/* Close Button */}
      <div className="flex justify-center mt-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-lg"
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  )
}
