import { motion } from 'framer-motion'

interface GenderSelectorProps {
  gender: 'male' | 'female' | null
  onSelect: (gender: 'male' | 'female') => void
  onNext: () => void
}

export function GenderSelector({ gender, onSelect, onNext }: GenderSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center justify-between h-full py-8 px-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Choose One</h2>
      
      <div className="flex gap-6 mt-8">
        {/* Female Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('female')}
          className={`relative w-32 h-40 rounded-3xl bg-white shadow-lg transition-all duration-300 ${
            gender === 'female' 
              ? 'ring-4 ring-pink-400 shadow-pink-200' 
              : 'hover:shadow-xl'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {/* Female SVG */}
            <svg viewBox="0 0 100 150" className="w-20 h-28">
              {/* Hair */}
              <ellipse cx="50" cy="35" rx="22" ry="25" fill="#2d1b0e"/>
              <path d="M28 35 Q25 60 30 80 L30 45 Z" fill="#2d1b0e"/>
              <path d="M72 35 Q75 60 70 80 L70 45 Z" fill="#2d1b0e"/>
              {/* Face */}
              <ellipse cx="50" cy="40" rx="18" ry="20" fill="#ffd5c8"/>
              {/* Eyes */}
              <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#333"/>
              <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#333"/>
              {/* Smile */}
              <path d="M45 48 Q50 52 55 48" stroke="#333" strokeWidth="1.5" fill="none"/>
              {/* Body/Dress */}
              <path d="M35 60 L32 100 L68 100 L65 60 Q50 65 35 60" fill="#ff6b8a"/>
              {/* Arms */}
              <path d="M32 65 L25 85" stroke="#ffd5c8" strokeWidth="6" strokeLinecap="round"/>
              <path d="M68 65 L75 85" stroke="#ffd5c8" strokeWidth="6" strokeLinecap="round"/>
              {/* Skirt */}
              <path d="M30 100 L25 130 L75 130 L70 100 Z" fill="#1a1a2e"/>
              {/* Legs */}
              <line x1="40" y1="130" x2="38" y2="145" stroke="#ffd5c8" strokeWidth="5"/>
              <line x1="60" y1="130" x2="62" y2="145" stroke="#ffd5c8" strokeWidth="5"/>
            </svg>
          </div>
          {gender === 'female' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>

        {/* Male Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('male')}
          className={`relative w-32 h-40 rounded-3xl bg-white shadow-lg transition-all duration-300 ${
            gender === 'male' 
              ? 'ring-4 ring-pink-400 shadow-pink-200' 
              : 'hover:shadow-xl'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {/* Male SVG */}
            <svg viewBox="0 0 100 150" className="w-20 h-28">
              {/* Hair */}
              <ellipse cx="50" cy="30" rx="20" ry="15" fill="#5a4a3a"/>
              {/* Face */}
              <ellipse cx="50" cy="40" rx="18" ry="20" fill="#ffd5c8"/>
              {/* Eyes */}
              <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#333"/>
              <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#333"/>
              {/* Smile */}
              <path d="M45 48 Q50 52 55 48" stroke="#333" strokeWidth="1.5" fill="none"/>
              {/* Neck */}
              <rect x="45" y="58" width="10" height="8" fill="#ffd5c8"/>
              {/* T-Shirt */}
              <path d="M30 66 L30 105 L70 105 L70 66 Q50 72 30 66" fill="#87ceeb"/>
              {/* Arms */}
              <path d="M30 70 L22 90" stroke="#ffd5c8" strokeWidth="6" strokeLinecap="round"/>
              <path d="M70 70 L78 90" stroke="#ffd5c8" strokeWidth="6" strokeLinecap="round"/>
              {/* Pants */}
              <path d="M30 105 L35 145 L50 145 L50 105 Z" fill="#90ee90"/>
              <path d="M70 105 L65 145 L50 145 L50 105 Z" fill="#90ee90"/>
            </svg>
          </div>
          {gender === 'male' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Gender Toggle */}
      <div className="flex bg-gray-100 rounded-full p-1 mt-6">
        <button
          onClick={() => onSelect('female')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            gender === 'female' 
              ? 'bg-white text-gray-800 shadow-md' 
              : 'text-gray-500'
          }`}
        >
          Female
        </button>
        <button
          onClick={() => onSelect('male')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            gender === 'male' 
              ? 'bg-white text-gray-800 shadow-md' 
              : 'text-gray-500'
          }`}
        >
          Male
        </button>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        disabled={!gender}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mt-8 transition-all ${
          gender 
            ? 'bg-pink-500 hover:bg-pink-600 cursor-pointer' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.div>
  )
}
