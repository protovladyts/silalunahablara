"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EmailForm } from "@/components/email-form"
import { StarsBackground } from "@/components/stars-background"
import { Upsell } from "@/components/upsell"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [paywallOptions, setPaywallOptions] = useState<any>(null)
  const router = useRouter()

  const handleEmailSubmit = async (data: { email: string; name: string }) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, name: data.name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Si no tiene créditos gratuitos, mostrar paywall
        if (errorData.error === "NO_FREE_CREDITS") {
          setUserEmail(data.email)
          setPaywallOptions(errorData.options)
          setShowPaywall(true)
          return
        }
        
        throw new Error(errorData.message || "Error enviando código")
      }

      localStorage.setItem("userEmail", data.email)
      localStorage.setItem("userName", data.name)

      // Navigate to verification
      router.push("/verify")
    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("Error enviando código. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Si no tiene créditos, mostrar paywall
  if (showPaywall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        <StarsBackground animated={true} />
        <Upsell userEmail={userEmail} />
        <FloatingVideoCallButton currentStep="upsell" />
      </div>
    )
  }

              return (
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
                <StarsBackground animated={true} />
                <EmailForm onSubmit={handleEmailSubmit} isLoading={isLoading} />
                <FloatingVideoCallButton currentStep="intake" />
              </div>
            )
}
