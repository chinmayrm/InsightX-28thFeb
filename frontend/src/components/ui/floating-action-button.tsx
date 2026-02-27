'use client'

import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SocialIcon {
  Icon: LucideIcon
  href?: string
  onClick?: () => void
  className?: string
}

interface AnimatedSocialIconsProps {
  icons: SocialIcon[]
  className?: string
  iconSize?: number
}

export function AnimatedSocialIcons({ 
  icons, 
  className,
  iconSize = 20,
}: AnimatedSocialIconsProps) {
  const [active, setActive] = useState(false)

  const buttonSize = "size-10 sm:size-12" 
  // Calculate offset: each icon is ~48px (sm:size-12) + 12px gap
  const iconCount = icons.length
  const offsetY = active ? `calc((100% + 12px) * ${iconCount})` : "0px"

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-start",
      className
    )}>
      <div className="flex flex-col items-center justify-center relative gap-3">
        {/* Main toggle button */}
        <motion.div
          className="absolute top-0 bg-gray-900 rounded-full z-10"
          animate={{
            y: offsetY,
          }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <motion.button
            className={cn(
              buttonSize,
              "rounded-full flex items-center justify-center",
              "bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/30"
            )}
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 45 : 0 }}
            transition={{
              type: "tween",
              duration: 0.4,
            }}
          >
            <Plus 
              size={iconSize} 
              strokeWidth={3} 
              className="text-white" 
            />
          </motion.button>
        </motion.div>
        
        {/* Social icons */}
        {icons.map(({ Icon, href, onClick, className: iconClassName }, index) => (
          <motion.div
            key={index}
            className={cn(
              buttonSize,
              "rounded-full flex items-center justify-center",
              "bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl",
              "border border-gray-600/50",
              iconClassName
            )}
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={{
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0,
              y: active ? 0 : -20,
              pointerEvents: active ? "auto" : "none",
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              delay: active ? index * 0.05 : 0,
            }}
          >
            {href ? (
              <a 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Icon 
                  size={iconSize}
                  className="text-gray-400 transition-all hover:text-white hover:scale-110" 
                />
              </a>
            ) : onClick ? (
              <button
                onClick={onClick}
                className="flex items-center justify-center"
              >
                <Icon 
                  size={iconSize}
                  className="text-gray-400 transition-all hover:text-white hover:scale-110" 
                />
              </button>
            ) : (
              <Icon 
                size={iconSize}
                className="text-gray-400 transition-all hover:text-white hover:scale-110" 
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
