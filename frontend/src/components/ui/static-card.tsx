"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const StaticCard = ({
  children,
  title,
  className,
  containerClassName,
  accentColor = "cyan",
  headerAction,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  containerClassName?: string;
  accentColor?: "cyan" | "emerald" | "purple" | "pink";
  headerAction?: React.ReactNode;
}) => {
  const accentColors = {
    cyan: "from-cyan-500 to-blue-500",
    emerald: "from-emerald-500 to-green-500",
    purple: "from-purple-500 to-pink-500",
    pink: "from-pink-500 to-rose-500",
  };

  const glowColors = {
    cyan: "shadow-cyan-500/20",
    emerald: "shadow-emerald-500/20",
    purple: "shadow-purple-500/20",
    pink: "shadow-pink-500/20",
  };

  return (
    <div
      className={cn(
        "relative",
        containerClassName
      )}
    >
      {/* Title Badge */}
      {title && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className={cn(
            "px-4 py-1 rounded-full bg-gradient-to-r text-white text-xs font-bold shadow-lg",
            accentColors[accentColor]
          )}>
            {title}
          </div>
        </div>
      )}

      {/* Header Action (top right) */}
      {headerAction && (
        <div className="absolute -top-3 right-4 z-10">
          {headerAction}
        </div>
      )}

      {/* Card Container */}
      <div
        className={cn(
          "relative p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 shadow-xl h-full",
          glowColors[accentColor],
          className
        )}
      >
        {/* Accent Line */}
        <div className={cn(
          "absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full",
          accentColors[accentColor]
        )} />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner Markers */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-200 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-200 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-blue-200 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-blue-200 rounded-br" />
      </div>
    </div>
  );
};
