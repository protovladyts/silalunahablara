"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Share2 } from "lucide-react"

interface TarotStoryButtonProps {
  readingText: string
  question?: string
  cards?: Array<{ name: string; upright: boolean }>
  backgroundTopColor?: string
  backgroundBottomColor?: string
  textColor?: string
  className?: string
}

export function TarotStoryButton({
  readingText,
  question = "Mi consulta de tarot",
  cards = [],
  backgroundTopColor = "#8B5CF6",
  backgroundBottomColor = "#EC4899",
  textColor = "#FFFFFF",
  className = ""
}: TarotStoryButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Detectar móvil solo en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true)
    setIsMobile(isMobileDevice())
  }, [])

  // Función para detectar dispositivo móvil
  function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false
    
    const userAgent = navigator.userAgent.toLowerCase()
    const hasTouchPoints = navigator.maxTouchPoints > 0
    const screenWidth = window.innerWidth
    
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isMobileWidth = screenWidth <= 768
    
    return (isIOS || isAndroid || isMobileUA) && hasTouchPoints && isMobileWidth
  }

  // Función para generar la imagen
  const generateImage = async (): Promise<Blob> => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    
    // Configurar canvas para alta resolución
    const dpr = window.devicePixelRatio || 1
    canvas.width = 1080 * dpr
    canvas.height = 1920 * dpr
    ctx.scale(dpr, dpr)
    
    // Crear gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920)
    gradient.addColorStop(0, backgroundTopColor)
    gradient.addColorStop(1, backgroundBottomColor)
    
    // Dibujar fondo
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1920)
    
    // Configurar fuentes
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    // Título principal
    ctx.font = 'bold 48px "Times New Roman", serif'
    ctx.fillText('🔮 Sila Luna Hablará', 540, 100)
    
    // Subtítulo
    ctx.font = '32px "Times New Roman", serif'
    ctx.fillText('Lectura de Tarot', 540, 180)
    
    // Pregunta
    ctx.font = '28px "Times New Roman", serif'
    const questionLines = wrapText(ctx, question, 1000)
    let yPos = 280
    questionLines.forEach(line => {
      ctx.fillText(line, 540, yPos)
      yPos += 40
    })
    
    // Separador decorativo
    ctx.strokeStyle = textColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, yPos + 20)
    ctx.lineTo(880, yPos + 20)
    ctx.stroke()
    
    // Texto de la lectura
    ctx.font = '24px "Times New Roman", serif'
    const readingLines = wrapText(ctx, readingText, 1000)
    yPos += 80
    
    readingLines.forEach(line => {
      if (yPos < 1600) { // Evitar que se salga del canvas
        ctx.fillText(line, 540, yPos)
        yPos += 35
      }
    })
    
    // Footer con URL
    ctx.font = '20px "Times New Roman", serif'
    ctx.fillText('silalunahablara.com', 540, 1800)
    
    // Convertir a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/png', 0.95)
    })
  }

  // Función para ajustar texto a múltiples líneas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  // Función para compartir imagen
  const shareImage = async (blob: Blob): Promise<void> => {
    const file = new File([blob], 'lectura-tarot.png', { type: 'image/png' })
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Mi lectura de tarot',
          text: '🔮 Descubre tu futuro con Sila Luna Hablará',
          files: [file]
        })
        return
      } catch (error) {
        console.log('Share failed, falling back to download:', error)
      }
    }
    
    // Fallback: descargar imagen
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lectura-tarot.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Función para abrir Instagram
  const openInstagram = async (): Promise<void> => {
    const instagramUrl = 'instagram://story-camera'
    const iosStoreUrl = 'https://apps.apple.com/app/instagram/id389801252'
    const androidStoreUrl = 'https://play.google.com/store/apps/details?id=com.instagram.android'
    
    // Intentar abrir Instagram
    window.location.href = instagramUrl
    
    // Fallback después de 1.5 segundos
    setTimeout(() => {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(userAgent)) {
        window.open(iosStoreUrl, '_blank')
      } else if (/android/.test(userAgent)) {
        window.open(androidStoreUrl, '_blank')
      }
    }, 1500)
  }

  // Función principal
  const handleClick = async () => {
    if (!isMobile) return
    
    setIsLoading(true)
    
    try {
      // Generar imagen
      const blob = await generateImage()
      
      // Compartir/descargar imagen
      await shareImage(blob)
      
      // Abrir Instagram después de un breve delay
      setTimeout(() => {
        openInstagram()
      }, 500)
      
    } catch (error) {
      console.error('Error generating story:', error)
      alert('Error al generar la imagen. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = !isMobile || isLoading

  // No renderizar hasta que el cliente esté hidratado
  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Canvas oculto para generar la imagen */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={1080}
        height={1920}
      />
      
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        className={`mobile-only ${className}`}
        style={{
          padding: '12px 24px',
          backgroundColor: isDisabled ? '#ccc' : '#E4405F',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
          transition: 'all 0.2s ease',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando imagen...
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            Guardar y abrir Instagram
          </>
        )}
      </Button>
    </>
  )
}

