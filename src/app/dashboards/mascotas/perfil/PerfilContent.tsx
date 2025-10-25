'use client';

import { useState } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Upload } from 'lucide-react';
import type { User as UserType, DocumentoUI } from '@/data/user/types';
import { DocumentCard } from '@/components/usuarios/DocumentCard';
import { UploadDocument } from '@/components/usuarios/UploadDocument';

type PerfilContentProps = {
  perfilInicial: UserType;
  documentosIniciales: DocumentoUI[];
};

export function PerfilContent({ perfilInicial, documentosIniciales }: PerfilContentProps) {
  const [perfil] = useState(perfilInicial);
  const [documentos, setDocumentos] = useState<DocumentoUI[]>(documentosIniciales);
  const [mostrarUpload, setMostrarUpload] = useState(false);

  const handleUpload = async (tipo: string, archivo: File) => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);
    formData.append('perfilId', perfil.id);

    const response = await fetch('/api/documentos/subir', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir documento');
    }

    // Recargar la página para actualizar los documentos
    window.location.reload();
  };

  const handleDelete = async (documentoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) {
      return;
    }

    const response = await fetch(`/api/documentos/${documentoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      alert('Error al eliminar el documento: ' + error.error);
      return;
    }

    // Recargar la página para actualizar los documentos
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              {perfil.avatar ? (
                <img
                  src={perfil.avatar}
                  alt={perfil.nombreCompleto}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-blue-600" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {perfil.nombreCompleto}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{perfil.email}</span>
                </div>
                
                {perfil.telefono && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{perfil.telefono}</span>
                  </div>
                )}
                
                {perfil.edad && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{perfil.edad} años</span>
                  </div>
                )}
                
                {perfil.ocupacion && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{perfil.ocupacion}</span>
                  </div>
                )}
              </div>

              {perfil.bio && (
                <p className="mt-4 text-gray-600 text-sm">
                  {perfil.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Mis documentos
            </h2>
            <button
              onClick={() => setMostrarUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Subir documento
            </button>
          </div>

          {documentos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tienes documentos subidos</p>
              <button
                onClick={() => setMostrarUpload(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Subir tu primer documento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentos.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  documento={doc}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {mostrarUpload && (
        <UploadDocument
          onUpload={handleUpload}
          onClose={() => setMostrarUpload(false)}
        />
      )}
    </div>
  );
}