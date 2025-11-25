export type CitaUsuario = {
    id: string;
    nombres: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    email: string;
};

export type CitaMascota = {
    id: string;
    nombre: string;
};

export type Cita = {
    id: string;
    fecha_cita: string;
    hora_cita: string;
    estado: "programada" | "completada" | "cancelada";
    creada_en: string | null;

    usuario: CitaUsuario | null;
    mascota: CitaMascota | null;

    asistencia: "asistio" | "no_asistio_no_apto" | null;
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota: string | null;
};


export type NuevaCita = {
    usuario_id: string;
    mascota_id: string | null;
    fecha_cita: string;
    hora_cita: string;
    estado?: "programada" | "completada" | "cancelada";
};

export type Asistencia = "asistio" | "no_asistio_no_apto";

export type Interaccion = "buena_aprobada" | "no_apta";

export type EvaluacionCita = {
    asistencia?: Asistencia | null;
    interaccion?: Interaccion | null;
    nota?: string | null;
};


export type RawCita = {
    id: string;
    fecha_cita: string;
    hora_cita: string;
    estado: "programada" | "completada" | "cancelada";
    creada_en: string | null;

    usuario_id: string | null;
    mascota_id: string | null;

    asistencia: "asistio" | "no_asistio_no_apto" | null;
    interaccion: "buena_aprobada" | "no_apta" | null;
    nota: string | null;

    // viene como ARRAY
    mascotas?: { id: string; nombre: string }[] | null;

    // viene como objeto
    usuario?: {
        id: string;
        nombres: string;
        apellido_paterno: string | null;
        apellido_materno: string | null;
        email: string;
    } | null;
};
