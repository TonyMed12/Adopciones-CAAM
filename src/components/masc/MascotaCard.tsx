"use client";
import React from "react";
import type { Mascota } from "@/data/masc/types";
import { Button } from "@/components/ui/Button";

type Props = {
  m: Mascota;
  onView: () => void;
  onAdopt: () => void;
  adoptDisabled?: boolean;
};

export default function MascotaCard({
  m,
  onView,
  onAdopt,
  adoptDisabled = false,
}: Props) {
  const fotoSrc =
    (m as any).foto ||
    (m as any).fotoUrl ||
    (m as any).imagen ||
    (m as any).image ||
    (m as any).img ||
    null;

  const estado = m.estado?.toLowerCase() ?? "disponible";
  const disponible = m.disponible_adopcion !== false && estado === "disponible";

  let botonTexto = "Adoptar";
  let disabled = adoptDisabled;

  if (estado === "adoptada") {
    botonTexto = "Adoptada";
    disabled = true;
  } else if (estado === "en_proceso") {
    botonTexto = "En proceso";
    disabled = true;
  } else if (!disponible) {
    botonTexto = "No disponible";
    disabled = true;
  }

  return (
    <article className="masc-card group">
      {/* Imagen */}
      <div className="media">
        {fotoSrc ? (
          <img
            src={String(fotoSrc)}
            alt={m.nombre}
            className="media-img group-hover:scale-105 transition-transform duration-500"
            onClick={onView}
          />
        ) : (
          <div className="media-placeholder" />
        )}

        {/* Sexo */}
        <span className={`sex ${m.sexo === "hembra" ? "f" : "m"}`}>
          {m.sexo.charAt(0).toUpperCase() + m.sexo.slice(1).toLowerCase()}
        </span>

        {/* Estado */}
        {estado !== "disponible" && (
          <span
            className={`estado-tag ${
              estado === "adoptada" ? "adoptada" : "proceso"
            }`}
          >
            {botonTexto}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="body">
        <div className="titleRow">
          <h3 className="name" title={m.nombre}>
            {m.nombre}
          </h3>
          <span className="pill">{m.especie}</span>
        </div>

        <div className="meta">
          <span>
            <strong>Raza:</strong> {m.raza || "Criollo"}
          </span>
          <span>
            <strong>Tamaño:</strong>{" "}
            {m.tamano
              ? m.tamano.charAt(0).toUpperCase() + m.tamano.slice(1).toLowerCase()
              : "—"}
          </span>
          <span>
            <strong>Edad:</strong> {m.edadMeses}
          </span>
        </div>

        {m.descripcion && (
          <p className="desc line-clamp-3">{m.descripcion}</p>
        )}

        <footer className="actions">
          <Button variant="ghost" size="md" onClick={onView}>
            Ver más
          </Button>
          <Button variant="primary" size="md" onClick={onAdopt} disabled={disabled}>
            {botonTexto}
          </Button>
        </footer>
      </div>

      {/* ====================== ESTILOS ====================== */}
      <style jsx>{`
        .masc-card {
          background: #fffaf2;
          border: 1px solid #eadacb;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(43, 27, 18, 0.1);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .masc-card * {
          font-family: 'Inter', sans-serif !important;
        }

        .masc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(43, 27, 18, 0.15);
        }

        .media {
          position: relative;
          height: 260px;
          background: #f7eee4;
          overflow: hidden;
        }

        .media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-placeholder {
          width: 100%;
          height: 100%;
          background: #f2e8dc;
        }

        /* SEXO */
        .sex {
          position: absolute;
          left: 14px;
          top: 14px;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          text-transform: capitalize;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .sex.f {
          background: #ec4899; /* rosa */
        }
        .sex.m {
          background: #3b82f6; /* azul */
        }

        /* ESTADO */
        .estado-tag {
          position: absolute;
          bottom: 14px;
          right: 14px;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .estado-tag.proceso {
          background: #facc15;
          color: #1f1f1f;
        }
        .estado-tag.adoptada {
          background: #a8a29e;
          color: #fff;
        }

        .body {
          padding: 16px 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .titleRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .name {
          margin: 0;
          color: #8b4513;
          font-weight: 700;
          font-size: 20px;
          line-height: 1.2;
        }

        .pill {
          background: #f3e7dc;
          color: #8b4513;
          border-radius: 999px;
          padding: 5px 10px;
          font-weight: 600;
          font-size: 12px;
        }

        .meta {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          color: #6c5241;
          font-size: 14px;
        }

        .meta span {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .meta strong {
          color: #2b1b12;
          font-weight: 700;
          min-width: 75px;
        }

        .desc {
          color: #2b1b12;
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
      `}</style>
    </article>
  );
}
