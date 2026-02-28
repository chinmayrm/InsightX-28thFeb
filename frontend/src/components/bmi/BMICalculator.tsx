import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GenderSelector } from './GenderSelector'
import { HeightWeightInput } from './HeightWeightInput'
import { BMIResult } from './BMIResult'

interface BMICalculatorProps {
  isOpen: boolean
  onClose: () => void
  onBMISubmit?: (bmi: number, gender: 'male' | 'female') => void
}

type Screen = 'gender' | 'measurements' | 'result'

export function BMICalculator({ isOpen, onClose, onBMISubmit }: BMICalculatorProps) {
  const [screen, setScreen] = useState<Screen>('gender')
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)

  // Calculate BMI
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  const handleClose = () => {
    // Reset state on close
    setScreen('gender')
    setGender(null)
    setWeight(70)
    setHeight(170)
    onClose()
  }

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender)
  }

  const handleGenderNext = () => {
    if (gender) {
      setScreen('measurements')
    }
  }

  const handleMeasurementsNext = () => {
    setScreen('result')
  }

  const handleBack = () => {
    if (screen === 'measurements') {
      setScreen('gender')
    } else if (screen === 'result') {
      setScreen('measurements')
    }
  }

  const handleDone = () => {
    // Submit BMI to parent and close
    if (gender && onBMISubmit) {
      onBMISubmit(bmi, gender)
    }
    // Reset state and close
    setScreen('gender')
    setGender(null)
    setWeight(70)
    setHeight(170)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-blue-900/30 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-blue-50 via-white to-sky-50 rounded-3xl shadow-2xl w-[360px] h-[580px] overflow-hidden relative border border-blue-100"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Screen Content */}
              <AnimatePresence mode="wait">
                {screen === 'gender' && (
                  <GenderSelector
                    key="gender"
                    gender={gender}
                    onSelect={handleGenderSelect}
                    onNext={handleGenderNext}
                  />
                )}
                {screen === 'measurements' && (
                  <HeightWeightInput
                    key="measurements"
                    weight={weight}
                    height={height}
                    gender={gender}
                    onWeightChange={setWeight}
                    onHeightChange={setHeight}
                    onNext={handleMeasurementsNext}
                    onBack={handleBack}
                  />
                )}
                {screen === 'result' && (
                  <BMIResult
                    key="result"
                    bmi={bmi}
                    weight={weight}
                    height={height}
                    onBack={handleBack}
                    onClose={handleDone}
                  />
                )}
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {['gender', 'measurements', 'result'].map((s) => (
                  <motion.div
                    key={s}
                    animate={{
                      scale: screen === s ? 1.2 : 1,
                      backgroundColor: screen === s ? '#ff4d6d' : '#d1d5db'
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
