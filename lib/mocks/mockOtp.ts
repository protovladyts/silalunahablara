import { mockOtps, type OtpEntry } from "./mockDb"

export const sendOtp = async (email: string): Promise<boolean> => {
  // Remove any existing OTP for this email
  const existingIndex = mockOtps.findIndex((otp) => otp.email === email)
  if (existingIndex !== -1) {
    mockOtps.splice(existingIndex, 1)
  }

  // Add new OTP
  const otpEntry: OtpEntry = {
    email,
    code: "123456",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  }
  mockOtps.push(otpEntry)

  // Simulate sending email
  console.log(`[MOCK] Enviando OTP ${otpEntry.code} a ${email}`)
  return true
}

export const verifyOtp = (email: string, code: string): boolean => {
  const otpEntry = mockOtps.find((otp) => otp.email === email && otp.code === code)

  if (!otpEntry) {
    return false
  }

  if (otpEntry.expiresAt < new Date()) {
    // Remove expired OTP
    const index = mockOtps.indexOf(otpEntry)
    mockOtps.splice(index, 1)
    return false
  }

  // Remove used OTP
  const index = mockOtps.indexOf(otpEntry)
  mockOtps.splice(index, 1)
  return true
}
