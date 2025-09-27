"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentStep: "intake" | "shuffle" | "draw" | "reading"
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { id: "intake", label: "Pregunta", icon: "❓" },
    { id: "shuffle", label: "Barajar", icon: "🔀" },
    { id: "draw", label: "Revelar", icon: "🎴" },
    { id: "reading", label: "Lectura", icon: "🔮" }
  ] as const

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="bg-slate-800/80 border border-violet-400/30 rounded-xl px-4 py-2 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  index <= currentStepIndex
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-slate-600/50 text-slate-400"
                }`}
                animate={{
                  scale: index === currentStepIndex ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {step.icon}
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-2 transition-colors duration-300 ${
                  index < currentStepIndex ? "bg-violet-600" : "bg-slate-600/30"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
