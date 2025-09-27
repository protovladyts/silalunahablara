"use client"

import { useState, useEffect } from "react"
import { isMobileDevice, buildInstagramStoryUrl, openWithFallback } from "@/app/lib/instagramShare"

type Props = {
  label?: string
  backgroundImage?: string
  stickerImage?: string
  backgroundTopColor?: string
  backgroundBottomColor?: string
  attributionURL?: string
  className?: string
}

export function InstagramStoryShareButton({
  label = "Compartir en Instagram Stories",
  backgroundImage,
  stickerImage,
  backgroundTopColor,
  backgroundBottomColor,
  attributionURL,
  className = ""
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Detectar móvil solo en el cliente para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true)
    setIsMobile(isMobileDevice())
  }, [])

  const handleClick = async () => {
    if (!isMobile) {
      return;
    }

    setIsLoading(true);

    try {
      // Try Web Share API first (more reliable)
      if (navigator.share) {
        const shareData = {
          title: 'Mi lectura de tarot - Sila Luna Hablará',
          text: '🔮 Descubre tu futuro con una lectura de tarot personalizada',
          url: attributionURL || 'https://silalunahablara.com'
        };

        await navigator.share(shareData);
        setIsLoading(false);
        return;
      }

      // Fallback: Try Instagram deep link
      const primaryUrl = buildInstagramStoryUrl({
        backgroundImage,
        stickerImage,
        backgroundTopColor,
        backgroundBottomColor,
        attributionURL
      });

      // Open with fallback to app stores
      await openWithFallback({
        primaryUrl,
        iosStoreUrl: 'https://apps.apple.com/app/instagram/id389801252',
        androidStoreUrl: 'https://play.google.com/store/apps/details?id=com.instagram.android',
        timeoutMs: 1500
      });
    } catch (error) {
      console.error('Error sharing to Instagram Stories:', error);
      // Show user-friendly message
      alert('No se pudo abrir Instagram. Por favor, instala la app desde la tienda.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !isMobile || isLoading;

  // No renderizar hasta que el cliente esté hidratado
  if (!isClient) {
    return null;
  }

  return (
    <button
      id="instagram-story-share-button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`mobile-only ${className}`}
      title={!isMobile ? "Disponible solo en móviles con Instagram" : undefined}
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
          <div 
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          Compartiendo...
        </>
      ) : (
        <>
          📱 {label}
        </>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
