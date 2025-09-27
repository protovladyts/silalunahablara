"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Copy, Check, X } from "lucide-react"

interface ShareReadingProps {
  reading: string
  question: string
  cards?: Array<{ name: string; upright: boolean }>
}

export function ShareReading({ reading, question, cards = [] }: ShareReadingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateShareText = () => {
    const cardsText = cards.length > 0 
      ? `\n\nCartas reveladas:\n${cards.map(card => `• ${card.name} (${card.upright ? 'derecha' : 'invertida'})`).join('\n')}`
      : ''
    
    return `🔮 Lectura de Tarot - Sila Luna Hablará

Pregunta: "${question}"

Lectura:
${reading}${cardsText}

✨ Consulta tu propia lectura en silalunahablara.com`
  }

  const handleShare = async () => {
    const shareText = generateShareText()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi lectura de tarot',
          text: shareText,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Error sharing:', error)
        // Fallback to copy
        handleCopy()
      }
    } else {
      // Fallback to copy
      handleCopy()
    }
  }

  const handleCopy = async () => {
    const shareText = generateShareText()
    
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir lectura
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full"
    >
      <Card className="bg-slate-800/80 border-violet-400/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start">
            <div className="text-3xl">🔮</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-violet-300 hover:text-violet-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl text-violet-100">Compartir tu lectura</CardTitle>
          <CardDescription className="text-violet-300">
            Compartí tu experiencia de tarot con otros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-900/50 p-3 rounded-lg border border-violet-400/20">
            <p className="text-violet-200 text-sm mb-2">Vista previa del texto a compartir:</p>
            <div className="text-violet-300 text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
              {generateShareText()}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            
            <Button
              onClick={handleCopy}
              variant="outline"
              className="border-violet-400/30 text-violet-300 hover:bg-violet-400/10"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

