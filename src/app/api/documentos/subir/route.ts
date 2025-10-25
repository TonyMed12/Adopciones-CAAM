// src/app/api/documentos/subir/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const tipo = formData.get('tipo') as string;
    const archivo = formData.get('archivo') as File;
    const perfilId = formData.get('perfilId') as string;

    if (!tipo || !archivo || !perfilId) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // 1. Subir archivo a Storage
    const extension = archivo.name.split('.').pop();
    const nombreArchivo = `${perfilId}/${tipo}_${Date.now()}.${extension}`;

    const arrayBuffer = await archivo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(nombreArchivo, buffer, {
        contentType: archivo.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError);
      return NextResponse.json(
        { error: 'Error al subir el archivo: ' + uploadError.message },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'Error al guardar el documento: ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, documento: data },
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