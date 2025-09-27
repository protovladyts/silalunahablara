export interface OtpTemplateData {
  name: string
  otpCode: string
}

export function generateOtpTemplate({ name, otpCode }: OtpTemplateData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">🔮 Sila Luna Hablará</h1>
        <p style="color: #6B7280; font-size: 16px; margin: 10px 0 0 0;">Tu consulta de tarot personalizada</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #8B5CF6, #A855F7); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
        <h2 style="color: white; font-size: 24px; margin: 0 0 20px 0;">¡Hola ${name}!</h2>
        <p style="color: white; font-size: 16px; margin: 0 0 20px 0;">Tu código de verificación es:</p>
        <div style="background: white; color: #8B5CF6; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 4px; margin: 0 auto; width: fit-content;">
          ${otpCode}
        </div>
        <p style="color: white; font-size: 14px; margin: 20px 0 0 0;">Este código expira en 10 minutos</p>
      </div>
      
      <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">¿Qué sigue?</h3>
        <ol style="color: #6B7280; font-size: 14px; margin: 0; padding-left: 20px;">
          <li>Ingresa el código en la página de verificación</li>
          <li>Realiza tu consulta de tarot personalizada</li>
          <li>Recibe tu lectura completa con interpretación</li>
        </ol>
      </div>
      
      <div style="text-align: center; color: #9CA3AF; font-size: 12px;">
        <p>Si no solicitaste este código, puedes ignorar este email.</p>
        <p>© 2024 Sila Luna Hablará - Todos los derechos reservados</p>
      </div>
    </div>
  `.trim()
}
