// src/data/user/constants.ts

import type { User, DocumentoUI } from "./types";

export const MOCK_USER: User = {
  id: "usr_123",
  nombres: "María Elena",
  apellidoPaterno: "García",
  apellidoMaterno: "López",
  nombreCompleto: "María Elena García López",
  email: "maria.garcia@ejemplo.com",
  telefono: "443 123 4567",
  fechaNacimiento: "1990-05-15",
  edad: 34,
  ocupacion: "Veterinaria",
  avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=8B4513&color=fff&size=200",
  bio: "Amante de los animales, voluntaria en CAAM desde 2020.",
  activo: true,
};

export const MOCK_DOCUMENTOS: DocumentoUI[] = [
  {
    id: "doc_1",
    nombre: "INE Frente",
    tipo: "INE",
    archivo: "https://via.placeholder.com/400x250/8B4513/ffffff?text=INE+Frente",
    fechaSubida: "2024-01-20T10:30:00Z",
    verificado: true,
  },
  {
    id: "doc_2",
    nombre: "INE Reverso",
    tipo: "INE",
    archivo: "https://via.placeholder.com/400x250/8B4513/ffffff?text=INE+Reverso",
    fechaSubida: "2024-01-20T10:31:00Z",
    verificado: true,
  },
  {
    id: "doc_3",
    nombre: "Comprobante CFE",
    tipo: "Comprobante de domicilio",
    archivo: "https://via.placeholder.com/400x250/BC5F36/ffffff?text=Comprobante+CFE",
    fechaSubida: "2024-02-01T15:45:00Z",
    verificado: false,
  },
];