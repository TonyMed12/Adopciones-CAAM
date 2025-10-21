"use client";
import React from "react";
import type {Mascota} from "@/data/masc/types";
import {Button} from "@/components/ui/Button";

type Props = {
    m: Mascota;
    onView: () => void;
    onAdopt: () => void;
    adoptDisabled?: boolean;
};

export default function MascotaCard({m, onView, onAdopt, adoptDisabled = false}: Props) {
    // Fallback de imagen: usa la primera disponible
    const fotoSrc =
        (m as any).foto || (m as any).fotoUrl || (m as any).imagen || (m as any).image || (m as any).img || null;

    return (
        <article className="card">
            {/* Imagen / portada */}
            <div className="media">
                {fotoSrc ? <img src={String(fotoSrc)} alt={m.nombre} /> : <div className="media-placeholder" />}

                {/* Etiqueta de sexo */}
                <span className={"sex " + (m.sexo === "hembra" ? "f" : "m")}>
                    {m.sexo.charAt(0).toUpperCase() + m.sexo.slice(1).toLowerCase()}
                </span>
            </div>

            {/* Info */}
            <div className="body">
                <div className="titleRow">
                    <h3 className="name">{m.nombre}</h3>
                    <span className="pill">{m.especie}</span>
                </div>

                <div className="meta">
                    <span>
                        <strong>Raza:</strong> {m.raza || "Criollo"}
                    </span>
                    <span>
                        <strong>Tamaño:</strong>{" "}
                        {m.tamano ? m.tamano.charAt(0).toUpperCase() + m.tamano.slice(1).toLowerCase() : "—"}
                    </span>
                    <span>
                        <strong>Edad:</strong> {m.edadMeses}
                    </span>
                </div>

                {m.descripcion && <p className="desc">{m.descripcion}</p>}

                <footer className="actions">
                    {/* Igual al estilo de button2 */}
                    <Button variant="ghost" size="md" onClick={onView}>
                        Ver más
                    </Button>
                </footer>
            </div>

            <style jsx>{`
                .card {
                    background: #fffaf2;
                    border: 1px solid #eadacb;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(43, 27, 18, 0.1);
                    display: flex;
                    flex-direction: column;
                }
                .media {
                    position: relative;
                    height: 320px;
                    background: #f7eee4;
                }
                .media img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .media-placeholder {
                    width: 100%;
                    height: 100%;
                }

                .sex {
                    position: absolute;
                    left: 12px;
                    top: 12px;
                    padding: 6px 10px;
                    border-radius: 999px;
                    font-weight: 800;
                    font-size: 12px;
                    color: #fff;
                    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
                }
                .sex.f {
                    background: #f472b6; /* rosa */
                }
                .sex.m {
                    background: #60a5fa; /* azul */
                }

                .body {
                    padding: 12px;
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
                    font-weight: 600;
                    font-size: 22px;
                }
                .pill {
                    background: #f3e7dc;
                    color: #8b4513;
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-weight: 600;
                    font-size: 12px;
                }

                .meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    color: #6c5241;
                    font-size: 14px;
                }
                .meta strong {
                    color: #2b1b12;
                    font-weight: 700;
                }
                .desc {
                    color: #2b1b12;
                    margin: 0;
                    font-size: 14px;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 8px;
                }
            `}</style>
        </article>
    );
}
