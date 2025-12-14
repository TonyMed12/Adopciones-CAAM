export type EstadoDocumentos =
    | "sin_documentos"
    | "en_revision"
    | "aprobado"
    | "rechazado";

export type DocumentoUsuario = {
    id: string;
    tipo: string;
    estado: string;
    motivo_rechazo?: string | null;
    url?: string | null;
};

export type DocumentosUsuarioData = {
    estado: EstadoDocumentos;
    documentos: DocumentoUsuario[];
};
