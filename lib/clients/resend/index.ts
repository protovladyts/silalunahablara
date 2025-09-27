import { Resend } from 'resend'
import { generateOtpTemplate } from './templates/otp-template'

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendOtpEmailParams {
  email: string
  name: string
  otpCode: string
}

export async function sendOtpEmail({ email, name, otpCode }: SendOtpEmailParams) {
  try {
    console.log(`[Resend] Sending OTP email to: ${email}`)
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',//'Sila Luna Hablará <noreply@sila-luna-hablara.com>', // TODO: Configurar dominio verificado
      to: [email],
      subject: 'Tu código de verificación - Sila Luna Hablará',
      html: generateOtpTemplate({ name, otpCode }),
    })

    if (error) {
      console.error('[Resend] Error sending email:', error)
      throw new Error(`Error enviando email: ${error.message}`)
    }

    console.log('[Resend] Email sent successfully:', data?.id)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('[Resend] Failed to send email:', error)
    throw error
  }
}

export { resend }
