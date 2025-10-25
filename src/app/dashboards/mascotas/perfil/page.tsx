import { redirect } from 'next/navigation';
import { PerfilContent } from './PerfilContent';
import { obtenerPerfilActual } from '@/services/perfil.service';
import { obtenerDocumentos } from '@/services/documentos.service';

export default async function PerfilPage() {
  const resultado = await obtenerPerfilActual();

  console.log('🔍 Resultado perfil:', resultado);

  if (!resultado.success || !resultado.perfil) {
    redirect('/auth/login');
  }
  console.log('📄 Buscando documentos para perfil ID:', resultado.perfil.id);

  // Obtener documentos del usuario
  const resultadoDocs = await obtenerDocumentos(resultado.perfil.id);

    console.log('📦 Resultado documentos:', resultadoDocs);
  const documentos = resultadoDocs.success ? resultadoDocs.documentos : [];

  return <PerfilContent perfilInicial={resultado.perfil} documentosIniciales={documentos} />;
}