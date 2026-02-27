import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IntroScreen } from '@/components/IntroScreen'
import { MainPage } from '@/pages/MainPage'
import { ProjectPage } from '@/pages/ProjectPage'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
  }, [])

  return (
    <BrowserRouter>
      {showIntro && (
        <IntroScreen onComplete={handleIntroComplete} duration={3000} />
      )}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/project" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
