"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmailForm } from "@/components/email-form"
import { createUser, findUserByEmail } from "@/lib/mocks/mockDb"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error enviando código")
      }

      // Create or find user
      let user = findUserByEmail(email)
      if (!user) {
        user = createUser(email)
      }

      localStorage.setItem("userEmail", email)

      // Navigate to verification
      router.push("/verify")
    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("Error enviando código. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return <EmailForm onSubmit={handleEmailSubmit} isLoading={isLoading} />
}
