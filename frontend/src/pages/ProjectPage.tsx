import { EtheralShadow } from "@/components/ui/etheral-shadow"

export function ProjectPage() {
  return (
    <EtheralShadow 
      className="min-h-screen bg-black"
      color="rgba(128, 128, 128, 1)"
      animation={{ scale: 100, speed: 90 }}
      noise={{ opacity: 1, scale: 1.2 }}
      sizing="fill"
    >
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] mb-8">
            InsightX
          </h1>
          <p className="text-gray-400 text-lg">
            Project page coming soon...
          </p>
        </div>
      </div>
    </EtheralShadow>
  )
}
