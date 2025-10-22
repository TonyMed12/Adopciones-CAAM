import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verificar Email - Adopciones',
  description: 'Verifica tu correo electrónico para completar el registro',
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>¡Revisa tu correo!</CardTitle>
          <CardDescription>
            Te hemos enviado un enlace de verificación a tu correo electrónico
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div className="text-sm">
                <p className="text-green-800 font-medium">¡Registro exitoso!</p>
                <p className="text-green-700 mt-1">
                  Tu cuenta se ha creado correctamente. Para completar el proceso, 
                  haz clic en el enlace que enviamos a tu correo electrónico.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>¿No ves el correo?</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Revisa tu carpeta de spam o correo no deseado</li>
              <li>Asegúrate de haber ingresado correctamente tu email</li>
              <li>El correo puede tardar unos minutos en llegar</li>
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <Button variant="primary" className="w-full">
              <Link href="/login">
                Ir a Iniciar Sesión
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full">
              <Link href="/" className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}