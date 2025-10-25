// src/app/api/documentos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const documentoId = params.id;

    // 1. Obtener info del documento
    const { data: documento, error: fetchError } = await supabase
      .from('documentos')
      .select('url')
      .eq('id', documentoId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Error al obtener documento: ' + fetchError.message },
        { status: 404 }
      );
    }

    // 2. Extraer ruta del archivo de la URL
    const url = new URL(documento.url);
    const rutaArchivo = url.pathname.split('/storage/v1/object/public/documentos/')[1];

    if (rutaArchivo) {
      // 3. Eliminar archivo de Storage
      const { error: storageError } = await supabase.storage
        .from('documentos')
        .remove([rutaArchivo]);

      if (storageError) {
        console.error('Error eliminando archivo:', storageError);
      }
    }

    // 4. Eliminar registro de la BD
    const { error: deleteError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', documentoId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Error al eliminar documento: ' + deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error inesperado:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error inesperado: ' + errorMessage },
      { status: 500 }
    );
  }
}
