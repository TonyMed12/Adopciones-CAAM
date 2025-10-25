'use client';

import { FileText, CheckCircle, Clock, Trash2 } from 'lucide-react';
import type { DocumentoUI } from '@/data/user/types';

type DocumentCardProps = {
  documento: DocumentoUI;
  onDelete?: (id: string) => void;
};

export function DocumentCard({ documento, onDelete }: DocumentCardProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {documento.nombre}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatearFecha(documento.fechaSubida)}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              {documento.verificado ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  Pendiente
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={documento.archivo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver
          </a>
          
          {onDelete && (
            <button
              onClick={() => onDelete(documento.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar documento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}