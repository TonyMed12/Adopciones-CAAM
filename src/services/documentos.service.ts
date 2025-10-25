// src/services/documentos.service.ts

import { createClient } from '@/lib/supabase/server';
import type { Documento, DocumentoUI } from '@/data/user/types';
import { documentoToUI } from '@/data/user/types';

export type SubirDocumentoParams = {
  perfilId: string;
  tipo: string;
  archivo: File;
};

export type DocumentosResponse = {
  success: boolean;
  documentos: DocumentoUI[];
  error?: string;
};

export type SubirDocumentoResponse = {
  success: boolean;
  documento?: DocumentoUI;
  error?: string;
};

export async function obtenerDocumentos(perfilId: string): Promise<DocumentosResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('perfil_id', perfilId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo documentos:', error);
      return {
        success: false,
        documentos: [],
        error: error.message
      };
    }

    const documentosUI = data.map((doc: Documento) => documentoToUI(doc));

    return {
      success: true,
      documentos: documentosUI
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      documentos: [],
      error: 'Error inesperado: ' + errorMessage
    };
  }
}

export async function subirDocumento(params: SubirDocumentoParams): Promise<SubirDocumentoResponse> {
  try {
    const supabase = await createClient();
    const { perfilId, tipo, archivo } = params;

    // 1. Subir archivo a Storage
    const extension = archivo.name.split('.').pop();
    const nombreArchivo = `${perfilId}/${tipo}_${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(nombreArchivo, archivo);

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError);
      return {
        success: false,
        error: 'Error al subir el archivo: ' + uploadError.message
      };
    }

    // 2. Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documentos')
      .getPublicUrl(nombreArchivo);

    // 3. Crear registro en la tabla documentos
    const { data, error: dbError } = await supabase
      .from('documentos')
      .insert({
        perfil_id: perfilId,
        tipo: tipo,
        url: publicUrl,
        status: 'pendiente'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error guardando documento en BD:', dbError);
      return {
        success: false,
        error: 'Error al guardar el documento: ' + dbError.message
      };
    }

    return {
      success: true,
      documento: documentoToUI(data)
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: 'Error inesperado: ' + errorMessage
    };
  }
}

export async function eliminarDocumento(documentoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Obtener info del documento
    const { data: documento, error: fetchError } = await supabase
      .from('documentos')
      .select('url')
      .eq('id', documentoId)
      .single();

    if (fetchError) {
      return {
        success: false,
        error: 'Error al obtener documento: ' + fetchError.message
      };
    }

    // 2. Extraer ruta del archivo de la URL
    const url = new URL(documento.url);
    const rutaArchivo = url.pathname.split('/').slice(-2).join('/');

    // 3. Eliminar archivo de Storage
    const { error: storageError } = await supabase.storage
      .from('documentos')
      .remove([rutaArchivo]);

    if (storageError) {
      console.error('Error eliminando archivo:', storageError);
    }

    // 4. Eliminar registro de la BD
    const { error: deleteError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', documentoId);

    if (deleteError) {
      return {
        success: false,
        error: 'Error al eliminar documento: ' + deleteError.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: 'Error inesperado: ' + errorMessage
    };
  }
}