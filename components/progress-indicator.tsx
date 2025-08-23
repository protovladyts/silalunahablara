"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ClientOnly } from "./client-only"
import { getTarotReadingMessages } from "@/lib/tarot-utils"

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
  const messages = getTarotReadingMessages(loopsUsed)

  return (
    <>
      {/* Mobile: Barra simple en la parte inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-slate-900/80 border-t border-violet-400/30 backdrop-blur-sm">
          <div className="px-4 py-2">
            {/* Barra de progreso simple */}
            <div className="flex items-center space-x-1 mb-1">
              {steps.map((step, index: number) => (
                <div key={step.key} className="flex-1 flex items-center">
                  <div
                    className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                      index <= currentStepIndex ? "bg-violet-500" : "bg-slate-600"
                    }`}
                  />
                  {index < steps.length - 1 && (
                    <div className="w-1 h-1 mx-1 rounded-full bg-slate-500" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Indicador de paso actual */}
            <div className="text-xs text-violet-300 text-center">
              {steps[currentStepIndex]?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Indicador completo en la esquina superior derecha */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <Card className="bg-slate-800/90 border-violet-400/30 backdrop-blur-sm">
          <div className="p-3">
            {/* Step indicators */}
            <div className="flex items-center space-x-2 mb-2">
              {steps.map((step, index: number) => (
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

            {/* Loop counter - REMOVIDO: era redundante con el contador de consultas restantes */}
          </div>
        </Card>
      </div>

      {/* Contador de consultas restantes - siempre visible pero sutil */}
      {maxLoops > 1 && (
        <div className="fixed top-4 left-4 z-40">
          <div className="bg-slate-800/60 border border-violet-400/20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs text-violet-200">
              {messages.remainingMessage}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ProgressIndicatorFallback({ currentStep, loopsUsed = 0, maxLoops = 3 }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
  const messages = getTarotReadingMessages(loopsUsed)

  return (
    <>
      {/* Mobile: Barra simple en la parte inferior */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-slate-900/80 border-t border-violet-400/30 backdrop-blur-sm">
          <div className="px-4 py-2">
            <div className="flex items-center space-x-1 mb-1">
              {steps.map((step, index: number) => (
                <div key={step.key} className="flex-1 flex items-center">
                  <div
                    className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                      index <= currentStepIndex ? "bg-violet-500" : "bg-slate-600"
                    }`}
                  />
                  {index < steps.length - 1 && (
                    <div className="w-1 h-1 mx-1 rounded-full bg-slate-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-violet-300 text-center">
              {steps[currentStepIndex]?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Indicador completo */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <Card className="bg-slate-800/90 border-violet-400/30 backdrop-blur-sm">
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              {steps.map((step, index: number) => (
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
            {/* Loop counter - REMOVIDO: era redundante con el contador de consultas restantes */}
          </div>
        </Card>
      </div>

      {/* Contador de consultas restantes */}
      {maxLoops > 1 && (
        <div className="fixed top-4 left-4 z-40">
          <div className="bg-slate-800/60 border border-violet-400/20 rounded-lg px-3 py-1 backdrop-blur-sm">
            <div className="text-xs text-violet-200">
              {messages.remainingMessage}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function ProgressIndicator(props: ProgressIndicatorProps) {
  return (
    <ClientOnly fallback={<ProgressIndicatorFallback {...props} />}>
      <ProgressIndicatorContent {...props} />
    </ClientOnly>
  )
}
