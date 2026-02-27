import { useEffect, useState } from "react"
import { Typewriter } from "@/components/ui/typewriter"

interface IntroScreenProps {
  onComplete: () => void
  duration?: number
}

export function IntroScreen({ onComplete, duration = 3000 }: IntroScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out slightly before transition
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, duration - 500)

    // Complete the transition
    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950
        transition-opacity duration-500
        ${fadeOut ? "opacity-0" : "opacity-100"}
      `}
    >
      <div className="text-center">
        {/* Main Logo */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full scale-150" />
          
          {/* Main title with typewriter */}
          <h1 className="relative text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              <Typewriter
                words={["InsightX"]}
                speed={120}
                cursor={true}
                cursorChar="_"
                delayBetweenWords={10000}
              />
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}
