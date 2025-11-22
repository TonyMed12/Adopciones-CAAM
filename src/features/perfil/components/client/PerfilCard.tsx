"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import { Card } from "@/components/ui/card";
import {
    actualizarPerfil,
    guardarDireccion,
} from "@/features/perfil/actions/perfil-actions";
import type {
    Perfil,
    Direccion,
    Documento,
    SolicitudAdopcionMin as SolicitudAdopcion,
} from "@/features/perfil/types/perfil";
import type { Mascota } from "@/features/mascotas/types/mascotas";

interface Props {
    perfil: Perfil | null;
    direccion: Direccion | null;
    solicitudes: SolicitudAdopcion[];
    documentos: Documento[];
    mascotasAdoptadas?: {
    id: string;
    nombre: string;
    imagen_url: string | null;
    sexo?: string;
    tamano?: string;
    edad?: string | null;
    personalidad?: string | null;
    raza?: { nombre: string; especie: string };
  }[];
}

/* ======================= CARD DE MASCOTA ADOPTADA ======================= */
type MascotaAdoptadaMin = {
  id: string;
  nombre: string;
  imagen_url: string | null;
  sexo?: string;
  tamano?: string;
  edad?: string | null;
  personalidad?: string | null;
  raza?: { nombre: string; especie: string } | null;
};

function MascotaCardAdoptada({ mascota }: { mascota: MascotaAdoptadaMin }) {
    return (
        <Card className="overflow-hidden bg-[#fffaf3] border border-[#e2cbb3] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            {/* Imagen */}
            <div className="relative w-full h-48">
                <img
                    src={mascota.imagen_url || "/placeholder.jpg"}
                    alt={mascota.nombre}
                    className="w-full h-full object-cover"
                />

                {/* Etiqueta de sexo */}
                {mascota.sexo && (
                    <span
                        className={`absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full ${mascota.sexo === "macho" ? "bg-[#3b82f6]" : "bg-[#f472b6]"
                            }`}
                    >
                        {mascota.sexo === "macho" ? "Macho" : "Hembra"}
                    </span>
                )}
            </div>

            {/* Contenido */}
            <div className="p-4 text-[#5b3e26]">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-[#8b4513]">
                        {mascota.nombre}
                    </h3>

                    {mascota.raza?.especie && (
                        <span className="text-xs bg-[#f7e8d0] text-[#8b4513] font-semibold px-2 py-1 rounded-full">
                            {mascota.raza.especie}
                        </span>
                    )}
                </div>

                <div className="text-sm space-y-0.5 mb-1">
                    {mascota.raza?.nombre && (
                        <p>
                            <span className="font-semibold">Raza:</span>{" "}
                            {mascota.raza.nombre}
                        </p>
                    )}
                    {mascota.tamano && (
                        <p>
                            <span className="font-semibold">Tamaño:</span>{" "}
                            {mascota.tamano}
                        </p>
                    )}
                    {mascota.edad && (
                        <p>
                            <span className="font-semibold">Edad:</span> {mascota.edad}
                        </p>
                    )}
                </div>

                {mascota.personalidad && (
                    <p className="text-sm text-[#7a5c49] italic mt-2">
                        {mascota.personalidad}
                    </p>
                )}
            </div>
        </Card>
    );
}

/* ======================= PERFIL CARD ======================= */
export default function PerfilCard({
    perfil,
    direccion,
    solicitudes,
    documentos,
    mascotasAdoptadas = [],
}: Props) {
    const [editPerfil, setEditPerfil] = useState(false);
    const [editDir, setEditDir] = useState(false);
    const [formPerfil, setFormPerfil] = useState({
        ocupacion: perfil?.ocupacion || "",
        telefono: perfil?.telefono || "",
    });

    const [formDir, setFormDir] = useState<Partial<Direccion>>({
        calle: direccion?.calle || "",
        numero_exterior: direccion?.numero_exterior || "",
        colonia: direccion?.colonia || "",
        municipio: direccion?.municipio || "",
        estado: direccion?.estado || "",
        codigo_postal: direccion?.codigo_postal || "",
        pais: direccion?.pais || "México",
    });

    const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormPerfil({ ...formPerfil, [e.target.name]: e.target.value });

    const handleDirChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormDir({ ...formDir, [e.target.name]: e.target.value });

    const handleSavePerfil = async () => {
        if (!perfil?.id) return;
        const res = await actualizarPerfil(perfil.id, formPerfil);
        if (res.success) setEditPerfil(false);
    };

    const handleSaveDir = async () => {
        if (!perfil?.id) return;
        const data = {
            ...formDir,
            usuario_id: perfil.id,
            direccion_principal: true,
        };
        const res = await guardarDireccion(data);
        if (res.success) setEditDir(false);
    };

    return (
        <div className="space-y-6">
            {/* --- Datos personales --- */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#8b4513]">
                        Datos personales
                    </h2>
                    <Button
                        onClick={() => setEditPerfil(true)}
                        className="bg-[#8b4513] hover:bg-[#7a3f11]"
                    >
                        Editar
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#5b3e26]">
                    <div>
                        <p className="text-sm text-[#9b7b59]">Nombre</p>
                        <p className="font-medium">{perfil?.nombres ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">Apellido Paterno</p>
                        <p className="font-medium">{perfil?.apellido_paterno ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">Apellido Materno</p>
                        <p className="font-medium">{perfil?.apellido_materno ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">Correo</p>
                        <p className="font-medium">{perfil?.email ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">Teléfono</p>
                        <p className="font-medium">{perfil?.telefono ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">CURP</p>
                        <p className="font-medium">{perfil?.curp ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#9b7b59]">Ocupación</p>
                        <p className="font-medium">{perfil?.ocupacion ?? "—"}</p>
                    </div>
                </div>
            </Card>

            {/* --- Dirección principal --- */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#8b4513]">
                        Dirección principal
                    </h2>
                    <Button
                        onClick={() => setEditDir(true)}
                        className="bg-[#8b4513] hover:bg-[#7a3f11]"
                    >
                        {direccion ? "Editar" : "Agregar"}
                    </Button>
                </div>

                {direccion ? (
                    <div className="text-[#5b3e26] space-y-1">
                        <p>
                            {direccion.calle} {direccion.numero_exterior},{" "}
                            {direccion.colonia}
                        </p>
                        <p>
                            {direccion.municipio}, {direccion.estado}, CP{" "}
                            {direccion.codigo_postal}
                        </p>
                        <p>{direccion.pais}</p>
                    </div>
                ) : (
                    <p className="text-[#5b3e26]">
                        No tienes dirección principal registrada.
                    </p>
                )}
            </Card>

            {/* --- Solicitudes --- */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
                    Mascotas en proceso de adopción
                </h2>

                {solicitudes.length === 0 ? (
                    <p className="text-[#5b3e26]">No tienes solicitudes pendientes.</p>
                ) : (
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {solicitudes.map((sol) => (
                            <li
                                key={sol.id}
                                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#fffaf3] border border-[#e2cbb3] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {sol.mascota?.imagen_url && (
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={sol.mascota.imagen_url}
                                            alt={sol.mascota.nombre ?? "Mascota"}
                                            className="w-full h-full rounded-lg object-cover border border-[#e2cbb3]"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 text-center sm:text-left">
                                    <p className="font-semibold text-[#8b4513] text-lg mb-1">
                                        {sol.mascota?.nombre ?? "Mascota"}
                                    </p>
                                    <p className="text-sm text-[#9b7b59]">
                                        <span className="font-medium">Solicitud:</span> #
                                        {sol.numero_solicitud}
                                    </p>

                                    <div className="mt-2 inline-block bg-[#f7e8d0] text-[#8b4513] text-xs font-semibold px-3 py-1 rounded-full capitalize shadow-sm">
                                        {sol.estado}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {/* --- Mascotas adoptadas --- */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
                    Mascotas adoptadas
                </h2>

                {mascotasAdoptadas.length === 0 ? (
                    <p className="text-[#5b3e26]">Aún no tienes mascotas adoptadas.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mascotasAdoptadas.map((m) => (
                            <MascotaCardAdoptada key={m.id} mascota={m} />
                        ))}
                    </div>
                )}
            </Card>

            {/* --- Documentos aprobados --- */}
            <Card className="p-6 bg-[#fffdf9] border border-[#e2cbb3] shadow-md">
                <h2 className="text-xl font-semibold text-[#8b4513] mb-4">
                    Documentos aprobados
                </h2>

                {documentos.length === 0 ? (
                    <p className="text-[#5b3e26]">No hay documentos aprobados.</p>
                ) : (
                    <div className="grid sm:grid-cols-3 gap-4">
                        {documentos.map((d) => (
                            <div
                                key={d.id}
                                className="bg-[#fffaf3] border border-[#e2cbb3] rounded-lg p-4 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#f7e8d0] flex items-center justify-center mb-2">
                                        <FileCheck className="h-6 w-6 text-[#8b4513]" />
                                    </div>
                                    <p className="font-medium text-[#8b4513] capitalize">
                                        {d.tipo}
                                    </p>
                                    <p className="text-xs text-[#9b7b59] mt-1">{d.status}</p>
                                </div>

                                <a
                                    href={d.url ?? "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 px-3 py-1.5 rounded-md bg-[#8b4513] hover:bg-[#7a3f11] text-white text-sm font-medium transition-all"
                                >
                                    Ver documento
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* --- Modal: editar perfil --- */}
            <Modal open={editPerfil} onClose={() => setEditPerfil(false)} title="Editar perfil">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="ocupacion">Ocupacion</Label>
                        <Input
                            id="ocupacion"
                            name="ocupacion"
                            value={formPerfil.ocupacion}
                            onChange={handlePerfilChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            name="telefono"
                            value={formPerfil.telefono}
                            onChange={handlePerfilChange}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleSavePerfil} className="bg-[#8b4513] hover:bg-[#7a3f11]">
                            Guardar cambios
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* --- Modal: dirección --- */}
            <Modal open={editDir} onClose={() => setEditDir(false)} title="Dirección principal">
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="calle">Calle</Label>
                        <Input id="calle" name="calle" value={formDir.calle} onChange={handleDirChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="numero_exterior">Número exterior</Label>
                            <Input
                                id="numero_exterior"
                                name="numero_exterior"
                                value={formDir.numero_exterior ?? ""}
                                onChange={handleDirChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="colonia">Colonia</Label>
                            <Input
                                id="colonia"
                                name="colonia"
                                value={formDir.colonia}
                                onChange={handleDirChange}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="municipio">Municipio</Label>
                        <Input
                            id="municipio"
                            name="municipio"
                            value={formDir.municipio}
                            onChange={handleDirChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label htmlFor="estado">Estado</Label>
                            <Input
                                id="estado"
                                name="estado"
                                value={formDir.estado}
                                onChange={handleDirChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="codigo_postal">Código postal</Label>
                            <Input
                                id="codigo_postal"
                                name="codigo_postal"
                                value={formDir.codigo_postal}
                                onChange={handleDirChange}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="pais">País</Label>
                        <Input id="pais" name="pais" value={formDir.pais ?? ""} onChange={handleDirChange} />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleSaveDir} className="bg-[#8b4513] hover:bg-[#7a3f11]">
                            Guardar dirección
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
