"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OtpForm } from "@/components/otp-form"

export default function VerifyPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (!storedEmail) {
      router.push("/")
      return
    }
    setEmail(storedEmail)
  }, [router])

  const handleOtpSubmit = async (code: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Código incorrecto. Probá de nuevo.")
        return
      }

      sessionStorage.setItem("userVerified", "true")
      console.log("[v0] User verified successfully, redirecting to session")

      router.push("/session")
    } catch (error) {
      console.error("[v0] Error verifying OTP:", error)
      setError("Se cortó. Intentá otra vez.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Código reenviado")
      } else {
        setError(data.error || "Se cortó. Intentá otra vez.")
      }
    } catch (error) {
      console.error("[v0] Error resending OTP:", error)
      setError("Se cortó. Intentá otra vez.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <div>
      <OtpForm email={email} onSubmit={handleOtpSubmit} onResend={handleResend} isLoading={isLoading} />
      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg text-center">{error}</div>
      )}
    </div>
  )
}
