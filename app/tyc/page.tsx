"use client"

import { StarsBackground } from "@/components/stars-background"
import { FloatingVideoCallButton } from "@/components/floating-video-call-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <StarsBackground animated={false} />
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Términos y Condiciones de Uso
        </h1>
        <p className="text-violet-200 text-sm md:text-base">
          Última actualización: {new Date().toLocaleDateString('es-AR')}
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <Card className="bg-white/95 backdrop-blur-sm border-violet-200/30 shadow-xl">
          <CardHeader className="text-center border-b border-violet-200/30">
            <CardTitle className="text-2xl md:text-3xl text-slate-800">
              Bienvenido/a a Silalunahablara
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">
              Al acceder o utilizar nuestros servicios de consultas de tarot asistidas por inteligencia artificial, 
              aceptás los siguientes Términos y Condiciones. Si no estás de acuerdo, por favor no utilices el Sitio.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-8">
            
            {/* Sección 1 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Objeto del servicio
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>El Sitio ofrece experiencias de tarot simuladas mediante inteligencia artificial y visualización de cartas.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Todo el contenido brindado tiene fines de entretenimiento, reflexión personal y ocio.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span className="font-semibold text-red-600">No constituye asesoramiento médico, psicológico, financiero, jurídico ni profesional de ningún tipo.</span>
                </li>
              </ul>
            </section>

            {/* Sección 2 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Acceso y uso
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>El servicio está destinado a personas mayores de 18 años.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Cada usuario es responsable de la información que comparte en el Sitio.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>No se permite el uso del Sitio para actividades ilegales o que infrinjan derechos de terceros.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Nos reservamos el derecho de suspender o dar de baja cuentas y accesos que incumplan estos Términos.</span>
                </li>
              </ul>
            </section>

            {/* Sección 3 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Limitación de responsabilidad
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>El Sitio y sus responsables no garantizan la veracidad ni exactitud de las lecturas.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>El usuario acepta que el uso del servicio es bajo su propia responsabilidad.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>En ningún caso seremos responsables de daños directos, indirectos, incidentales o consecuentes derivados del uso del Sitio.</span>
                </li>
              </ul>
            </section>

            {/* Sección 4 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Propiedad intelectual
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Todos los textos, imágenes, gráficos, logotipos, interfaces y software del Sitio son propiedad de sus titulares y están protegidos por la legislación vigente.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Queda prohibida su reproducción total o parcial sin autorización expresa.</span>
                </li>
              </ul>
            </section>

            {/* Sección 5 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Datos personales y privacidad
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Al utilizar el Sitio, el usuario autoriza el tratamiento de su correo electrónico y de las consultas ingresadas para el correcto funcionamiento de la experiencia.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Los datos podrán almacenarse en proveedores externos (ej. bases de datos en la nube) con las medidas razonables de seguridad técnica.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Nunca venderemos ni compartiremos datos personales con terceros con fines comerciales.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>El usuario puede solicitar la eliminación de sus datos escribiendo a <a href="mailto:silalunahablara@gmail.com" className="text-violet-600 hover:text-violet-800 underline">silalunahablara@gmail.com</a>.</span>
                </li>
              </ul>
            </section>

            {/* Sección 6 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Modificaciones
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Nos reservamos el derecho de modificar estos Términos en cualquier momento.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Los cambios entrarán en vigencia a partir de su publicación en el Sitio.</span>
                </li>
              </ul>
            </section>

            {/* Sección 7 */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-4 flex items-center">
                <span className="bg-violet-100 text-violet-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Jurisdicción y ley aplicable
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Estos Términos se rigen por las leyes de Argentina.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Cualquier controversia se someterá a los tribunales competentes de Buenos Aires, Argentina.</span>
                </li>
              </ul>
            </section>

            {/* Aviso Legal */}
            <section className="border-t border-violet-200/50 pt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-red-700 mb-4 flex items-center">
                <span className="bg-red-100 text-red-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">⚠️</span>
                Aviso Legal y de Salud
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Las lecturas de tarot ofrecidas en este Sitio no sustituyen diagnósticos, tratamientos ni recomendaciones de profesionales médicos, psicológicos, financieros o jurídicos.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Si tenés problemas de salud física, mental o situaciones legales/financieras serias, buscá ayuda profesional calificada.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>El Sitio es una experiencia lúdica y reflexiva; usalo como entretenimiento, no como guía absoluta para tomar decisiones críticas.</span>
                </li>
              </ul>
            </section>

            {/* Botones de navegación */}
            <div className="text-center pt-6 space-y-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                  ← Volver al inicio
                </Button>
              </Link>
              
              <div>
                <Link 
                  href="/deck" 
                  className="text-sm text-violet-400 hover:text-violet-300 underline"
                >
                  Ver mazo completo del tarot
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón flotante de videollamada */}
      <FloatingVideoCallButton currentStep="tyc" />
    </div>
  )
}
