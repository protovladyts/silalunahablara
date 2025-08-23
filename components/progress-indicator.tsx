"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ClientOnly } from "./client-only"

interface ProgressIndicatorProps {
  currentStep: "intake" | "shuffle" | "draw" | "reading"
  loopsUsed?: number
  maxLoops?: number
}

const steps = [
  { key: "intake", label: "Consulta", icon: "💭" },
  { key: "shuffle", label: "Corte", icon: "🔀" },
  { key: "draw", label: "Tirada", icon: "🃏" },
  { key: "reading", label: "Lectura", icon: "✨" },
]

function ProgressIndicatorContent({ currentStep, loopsUsed = 0, maxLoops = 3 }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-slate-800/90 border-violet-400/30 backdrop-blur-sm z-50">
      <div className="p-3">
        {/* Step indicators */}
        <div className="flex items-center space-x-2 mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                  index <= currentStepIndex ? "bg-violet-600 text-white" : "bg-slate-600 text-slate-400"
                }`}
                animate={{
                  scale: index === currentStepIndex ? 1.1 : 1,
                  backgroundColor: index <= currentStepIndex ? "#7c3aed" : "#475569",
                }}
                transition={{ duration: 0.3 }}
              >
                {step.icon}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${index < currentStepIndex ? "bg-violet-600" : "bg-slate-600"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Loop counter */}
        {maxLoops > 0 && (
          <div className="text-xs text-violet-300 text-center">
            Consulta {loopsUsed + 1} de {maxLoops}
          </div>
        )}
      </div>
    </Card>
  )
}

function ProgressIndicatorFallback({ currentStep, loopsUsed = 0, maxLoops = 3 }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <Card className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto bg-slate-800/90 border-violet-400/30 backdrop-blur-sm z-50">
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                  index <= currentStepIndex ? "bg-violet-600 text-white" : "bg-slate-600 text-slate-400"
                }`}
              >
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${index < currentStepIndex ? "bg-violet-600" : "bg-slate-600"}`} />
              )}
            </div>
          ))}
        </div>
        {maxLoops > 0 && (
          <div className="text-xs text-violet-300 text-center">
            Consulta {loopsUsed + 1} de {maxLoops}
          </div>
        )}
      </div>
    </Card>
  )
}

export function ProgressIndicator(props: ProgressIndicatorProps) {
  return (
    <ClientOnly fallback={<ProgressIndicatorFallback {...props} />}>
      <ProgressIndicatorContent {...props} />
    </ClientOnly>
  )
}
