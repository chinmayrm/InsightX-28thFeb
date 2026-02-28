import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { TubesBackground } from "@/components/ui/neon-flow"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { AnimatedSocialIcons } from "@/components/ui/floating-action-button"
import { Github, Instagram, Linkedin, Phone, Mail } from "lucide-react"

export function MainPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState<string | null>(null)
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }
  
  // Left side - Social links
  const socialIcons = [
    { Icon: Github, href: "https://github.com/chinmayrm" },
    { Icon: Instagram, href: "https://www.instagram.com/chinmay.mov/" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/chinmay-rm/" },
  ]
  
  // Right side - Contact (copy to clipboard)
  const contactIcons = [
    { Icon: Phone, onClick: () => copyToClipboard("8073087576", "Phone") },
    { Icon: Mail, onClick: () => copyToClipboard("csechinmayrm@gmail.com", "Email") },
  ]
  
  const teamMembers = [
    { name: "Chinmay R M", role: "Team Lead" },
    { name: "Sameer P", role: "Frontend Developer" },
    { name: "Appaji B M", role: "Frontend Developer" },
    { name: "Preeti Katti", role: "Backend Developer" },
  ]

  return (
    <TubesBackground className="min-h-screen">
      {/* Left side - Social Icons */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
        <AnimatedSocialIcons 
          icons={socialIcons}
          iconSize={18}
        />
      </div>
      
      {/* Right side - Contact Icons */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
        <AnimatedSocialIcons 
          icons={contactIcons}
          iconSize={18}
        />
      </div>

      {/* Copied notification toast */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {copied} copied to clipboard!
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-start pt-12 pb-20 pointer-events-auto">
        {/* Hero Section */}
        <div className="text-center px-4">
          {/* Logo */}
          <div className="relative mb-6">
            <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              Code Cult
            </h1>
          </div>

          {/* Team Members Table */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
              <div className="overflow-hidden rounded-lg border border-gray-700/50">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-900/80">
                      <th className="w-16 px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                      <th className="w-1/2 px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {teamMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-400 text-center">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-white text-center">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 text-center">{member.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Problem Statement card */}
            <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-green-400 font-medium">Problem Statement</span>
              </div>
              
              <p className="text-white text-lg font-medium">
                Smart Healthcare Risk Prediction & Patient Segmentation System
              </p>
            </div>

            {/* Interactive Button */}
            <div className="flex justify-center mt-4">
              <InteractiveHoverButton 
                text="Open Project" 
                className="w-44" 
                onClick={() => navigate('/project')}
              />
            </div>

            {/* Coordinators Section */}
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div>
                  <span className="text-gray-500">Coordinator:</span>
                  <span className="text-white ml-2">Lakshmi P Kolur</span>
                </div>
                <div>
                  <span className="text-gray-500">HoD:</span>
                  <span className="text-white ml-2">Bharati Reshmi</span>
                </div>
                <div>
                  <span className="text-gray-500">Vice President:</span>
                  <span className="text-white ml-2">Vikas A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-6 text-gray-400 text-sm">
          InsightX &copy; 2026
        </footer>
      </div>
    </TubesBackground>
  )
}
