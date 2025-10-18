import { Metadata } from 'next'
import RegistroForm from '@/components/auth/registro-form'

export const metadata: Metadata = {
  title: 'Registro de Adopciones',
  description: 'Crea tu cuenta para adoptar una mascota',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <RegistroForm />
    </div>
  )
}