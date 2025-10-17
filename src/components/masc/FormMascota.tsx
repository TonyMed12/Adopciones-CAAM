"use client";
import React, {useEffect, useRef, useState} from "react";
import {ESPECIES} from "@/data/masc/constants";
import type {CreateMascotaPayload} from "@/mascotas/service/mascota.service";
/* ========= Dropdown con look & feel “Adopta” (sin negritas) ========= */
type Opt = {label: string; value: string};

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onClose]);
}

function MenuSelect({
    value,
    onChange,
    options,
    ariaLabel,
    widthClass = "w-full",
}: {
    value: string;
    onChange: (v: string) => void;
    options: Opt[];
    ariaLabel: string;
    widthClass?: string;
}) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    useClickOutside(boxRef, () => setOpen(false));

    const current = options.find((o) => o.value === value) ?? options[0];

    return (
        <div className={"mselect " + widthClass} ref={boxRef}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                className="mselect-trigger"
                onClick={() => setOpen((o) => !o)}
            >
                <span>{current.label}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="chev">
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
            </button>

            {open && (
                <div className="mselect-menu" role="listbox">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={"mselect-item " + (opt.value === value ? "is-active" : "")}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .mselect {
                    position: relative;
                }
                .mselect-trigger {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 12px;
                    border: 1px solid var(--line);
                    border-radius: 12px;
                    background: #fff;
                    box-shadow: 0 4px 14px rgba(43, 27, 18, 0.06);
                    color: #2b1b12;
                    font-weight: 400; /* sin negritas */
                }
                .chev {
                    color: #8b4513;
                    opacity: 0.9;
                }
                .mselect-menu {
                    position: absolute;
                    left: 0;
                    top: calc(100% + 8px);
                    z-index: 40;
                    width: 100%;
                    background: #fff1e6;
                    border-radius: 10px;
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
                    overflow: hidden;
                }
                .mselect-item {
                    width: 100%;
                    text-align: left;
                    padding: 10px 14px;
                    color: #8b4513;
                    font-weight: 400; /* sin negritas */
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: background 0.12s ease;
                }
                .mselect-item:hover {
                    background: #fde68a;
                }
                .mselect-item.is-active {
                    background: #fde68a;
                }
            `}</style>
        </div>
    );
}

/* ====================== Formulario de Mascota ====================== */
export default function FormMascota({
    onCancel,
    onSubmit,
}: {
    onCancel: () => void;
    onSubmit: (m: CreateMascotaPayload) => void;
}) {
    // estados del form
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState<string>(ESPECIES?.[0] ?? "Perro");
    const [sexo, setSexo] = useState<string>("Macho");
    const [tamano, setTamano] = useState<string>("Mediano");
    const [razaId, setRazaId] = useState("");
    const [edadMeses, setEdadMeses] = useState<number>(0);
    const [descripcion, setDescripcion] = useState("");

    // foto
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    // opciones
    const especieOpts: Opt[] = (ESPECIES?.length ? ESPECIES : ["Perro", "Gato"]).map((e) => ({
        label: e,
        value: e,
    }));
    const sexoOpts: Opt[] = [
        {label: "Macho", value: "Macho"},
        {label: "Hembra", value: "Hembra"},
    ];
    const tamanoOpts: Opt[] = [
        {label: "Pequeño", value: "Pequeño"},
        {label: "Mediano", value: "Mediano"},
        {label: "Grande", value: "Grande"},
    ];

    // handlers foto
    function handleFile(file?: File) {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona una imagen (jpg, png, webp).");
            return;
        }
        // opcional: limitar ~5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es muy pesada (máx. 5 MB).");
            return;
        }
        setFotoFile(file);
        const reader = new FileReader();
        reader.onload = () => setFotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function onPickFile() {
        fileInputRef.current?.click();
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        handleFile(f);
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault();
    }

    function clearPhoto() {
        setFotoFile(null);
        setFotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload: CreateMascotaPayload = {
            nombre,
            sexo: sexo as "Macho" | "Hembra",
            raza_id: razaId,
            descripcion_fisica: descripcion || undefined,
            // imagen_url: (fotoPreview?.startsWith("http") ? fotoPreview : undefined), // lo haremos en el paso de imagen
            // el resto de campos del DTO (opcional) los dejamos vacíos por ahora
        };
        onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="form">
            {/* fila 1 */}
            <div className="row">
                <div className="field">
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        placeholder="Ej. Toby"
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="field">
                    <label>Especie</label>
                    <MenuSelect
                        value={especie}
                        onChange={setEspecie}
                        options={especieOpts}
                        ariaLabel="Seleccionar especie"
                    />
                </div>
            </div>

            {/* fila 2 */}
            <div className="row">
                <div className="field">
                    <label>Sexo</label>
                    <MenuSelect value={sexo} onChange={setSexo} options={sexoOpts} ariaLabel="Seleccionar sexo" />
                </div>

                <div className="field">
                    <label>Tamaño</label>
                    <MenuSelect
                        value={tamano}
                        onChange={setTamano}
                        options={tamanoOpts}
                        ariaLabel="Seleccionar tamaño"
                    />
                </div>
            </div>

            {/* fila 3 */}
            <div className="row">
                +{" "}
                <div className="field">
                    <label>Raza ID</label>
                    <input
                        type="text"
                        value={razaId}
                        placeholder="uuid de la raza"
                        onChange={(e) => setRazaId(e.target.value)}
                        required
                    />
                    <small>Temporal: luego lo cambiamos por un selector.</small>
                </div>
                <div className="field">
                    <label>Edad (meses)</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1}
                        value={edadMeses}
                        onChange={(e) => setEdadMeses(parseInt(e.target.value || "0", 10))}
                    />
                </div>
            </div>

            {/* fila 4: Foto */}
            <div className="field">
                <label>Foto</label>

                {!fotoPreview ? (
                    <div ref={dropRef} className="upload" onClick={onPickFile} onDrop={onDrop} onDragOver={onDragOver}>
                        <div className="upload-inner">
                            <div className="upload-icon">📷</div>
                            <div className="upload-text">
                                <strong>Sube una foto</strong> o arrástrala aquí
                                <div className="upload-hint">JPG, PNG o WEBP (máx. 5MB)</div>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                            hidden
                        />
                    </div>
                ) : (
                    <div className="preview">
                        <img src={fotoPreview} alt="Vista previa" />
                        <div className="preview-actions">
                            <button type="button" className="btn btn-ghost" onClick={onPickFile}>
                                Cambiar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={clearPhoto}>
                                Quitar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* fila 5 */}
            <div className="field">
                <label>Descripción</label>
                <textarea
                    rows={4}
                    value={descripcion}
                    placeholder="Cuenta un poco sobre su personalidad, cuidados, etc."
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            {/* acciones */}
            <div className="actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
            </div>

            <style jsx>{`
                .form {
                    display: grid;
                    gap: 14px;
                }

                .row {
                    display: grid;
                    gap: 12px;
                    grid-template-columns: 1fr 1fr;
                }

                .field {
                    display: grid;
                    gap: 6px;
                }
                label {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    color: var(--text-muted, #7a5c49);
                    text-transform: uppercase;
                }
                input,
                textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--line, #eadacb);
                    border-radius: 12px;
                    background: #fff;
                    outline: none;
                    box-shadow: 0 4px 14px rgba(43, 27, 18, 0.06);
                    color: var(--text-main, #2b1b12);
                }
                textarea {
                    resize: vertical;
                }

                /* Upload */
                .upload {
                    border: 1px dashed #d6c5b6;
                    border-radius: 12px;
                    background: #fff;
                    box-shadow: 0 4px 14px rgba(43, 27, 18, 0.06);
                    padding: 16px;
                    cursor: pointer;
                }
                .upload-inner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #2b1b12;
                }
                .upload-icon {
                    font-size: 20px;
                }
                .upload-text strong {
                    font-weight: 700;
                }
                .upload-hint {
                    font-size: 12px;
                    color: #7a5c49;
                }

                .preview {
                    display: grid;
                    gap: 10px;
                }
                .preview img {
                    width: 100%;
                    max-height: 260px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid #eadacb;
                    box-shadow: 0 4px 14px rgba(43, 27, 18, 0.06);
                    background: #fff;
                }
                .preview-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                }

                /* Botones */
                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 6px;
                }
                .btn {
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 1;
                    border-radius: 12px;
                    padding: 12px 18px;
                    cursor: pointer;
                    transition: filter 0.15s;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
                }
                .btn-primary {
                    background: #8b4513;
                    color: #fff;
                }
                .btn-primary:hover {
                    filter: brightness(1.07);
                }
                .btn-ghost {
                    background: #fff;
                    color: #d97706;
                    box-shadow: 0 6px 14px rgba(43, 27, 18, 0.12);
                }
                .btn-ghost:hover {
                    filter: brightness(1.05);
                }
                .btn-danger {
                    background: #fff1f1;
                    color: #b42318;
                }
                .btn-danger:hover {
                    filter: brightness(1.03);
                }

                @media (max-width: 720px) {
                    .row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </form>
    );
}
