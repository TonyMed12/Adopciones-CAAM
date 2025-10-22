"use client";
import React, {useEffect, useRef, useState, useMemo} from "react";
import {ESPECIES} from "@/data/masc/constants";
import {crearMascota, actualizarMascota} from "@/mascotas/mascotas-actions";
import {supabase} from "@/lib/supabase/client";
import type {CreateMascotaPayload} from "@/data/masc/types";
import {SelectorColores} from "@/components/masc/SelectorColores";
import "@/styles/form-mascota.css";
import {listarRazas} from "@/mascotas/razas/razas-actions";

type Opt = {label: string; value: string};

/* Detectar clic fuera del menú */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onClose]);
}

/* ====================== MenuSelect (select estilizado) ====================== */
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
        <div className={`mselect ${widthClass}`} ref={boxRef} data-open={open ? "true" : "false"}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                className="mselect-trigger"
                onClick={() => setOpen((o) => !o)}
            >
                <span>{current?.label}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="chev">
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
                            className={`mselect-item ${opt.value === value ? "is-active" : ""}`}
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
        </div>
    );
}

/* ====================== Formulario Mascota ====================== */
export default function FormMascota({
    onCancel,
    onSubmit,
    mascota,
}: {
    onCancel: () => void;
    onSubmit: (m: CreateMascotaPayload) => void;
    mascota?: any;
}) {
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState<string>(ESPECIES?.[0] ?? "Perro");
    const [sexo, setSexo] = useState<string>("Macho");
    const [tamano, setTamano] = useState<string>("Mediano");
    const [edadMeses, setEdadMeses] = useState<number>(0);
    const [descripcion, setDescripcion] = useState("");
    const [razaId, setRazaId] = useState("");
    const [pesoKg, setPesoKg] = useState<number>(0);
    const [alturaCm, setAlturaCm] = useState<number>(0);
    const [esterilizado, setEsterilizado] = useState<boolean>(false);
    const [personalidad, setPersonalidad] = useState<string>("por evaluar");
    const [colores, setColores] = useState<string[]>([]);
    const [lugarRescate, setLugarRescate] = useState("");
    const [condicionIngreso, setCondicionIngreso] = useState("sano");
    const [observacionesMedicas, setObservacionesMedicas] = useState("");
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [todasRazas, setTodasRazas] = useState<{id: string; nombre: string; especie: string}[]>([]);
    const [busquedaRaza, setBusquedaRaza] = useState("");
    const [openRaza, setOpenRaza] = useState(false);

    useEffect(() => {
        async function cargarRazas() {
            try {
                const data = await listarRazas();
                setTodasRazas(data);
            } catch (err) {
                console.error("Error al cargar razas:", err);
            }
        }
        cargarRazas();
    }, []);

    const razasFiltradas = useMemo(() => {
        const filtradas = todasRazas.filter((r) => r.especie.toLowerCase() === especie.toLowerCase());
        if (!busquedaRaza.trim()) return filtradas;
        return filtradas.filter((r) => r.nombre.toLowerCase().includes(busquedaRaza.toLowerCase()));
    }, [todasRazas, especie, busquedaRaza]);

    const razaOpts = razasFiltradas.map((r) => ({
        label: r.nombre,
        value: r.id,
    }));

    /* ✅ Si estamos editando, llenar campos */
    useEffect(() => {
        if (mascota) {
            setNombre(mascota.nombre || "");
            setEspecie(mascota.raza?.especie || "Perro");
            setSexo(mascota.sexo || "macho");
            setTamano(mascota.tamano || "mediano");
            setEdadMeses(Number(mascota.edad ?? 0));
            setDescripcion(mascota.descripcion_fisica || "");
            setRazaId(mascota.raza_id || "");
            setPesoKg(mascota.peso_kg || 0);
            setAlturaCm(mascota.altura_cm || 0);
            setEsterilizado(!!mascota.esterilizado);
            setPersonalidad(mascota.personalidad || "por evaluar");
            setColores(mascota.colores || []);
            setLugarRescate(mascota.lugar_rescate || "");
            setCondicionIngreso(mascota.condicion_ingreso || "sano");
            setObservacionesMedicas(mascota.observaciones_medicas || "");
            setFotoPreview(mascota.imagen_url || null);
        }
    }, [mascota]);

    /* ================== Handlers ================== */
    function handleFile(file?: File) {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona una imagen (jpg, png, webp).");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es muy pesada (máx. 5 MB).");
            return;
        }

        setFotoFile(file);

        // ✅ Mostrar la preview local inmediatamente
        const reader = new FileReader();
        reader.onload = () => setFotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function clearPhoto() {
        setFotoFile(null);
        setFotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const sexoNormalizado = sexo?.charAt(0).toUpperCase() + sexo.slice(1).toLowerCase();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            id: mascota?.id,
            nombre,
            sexo: sexoNormalizado,
            tamano: tamano.toLowerCase(),
            raza_id: razaId,
            edad: String(edadMeses),
            peso_kg: pesoKg || null,
            altura_cm: alturaCm || null,
            personalidad,
            descripcion_fisica: descripcion,
            esterilizado,
            disponible_adopcion: true,
            colores,
            lugar_rescate: lugarRescate,
            condicion_ingreso: condicionIngreso,
            observaciones_medicas: observacionesMedicas,
        };

        try {
            let result;
            if (mascota?.id) {
                result = await actualizarMascota(payload, fotoFile || undefined);
                alert("Mascota actualizada 🐾");
            } else {
                result = await crearMascota(payload, fotoFile || undefined);
                alert("Mascota creada 🐾");
            }
            onSubmit(result);
            onCancel();
        } catch (err: any) {
            console.error("Error al guardar mascota:", err);
            alert(err.message || "Error al guardar la mascota");
        }
    }

    /* ======================== UI ======================== */
    return (
        <form onSubmit={handleSubmit} className="form">
            {/* Nombre + especie */}
            <div className="row">
                <div className="field">
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="field">
                    <label>Especie</label>
                    <MenuSelect
                        value={especie}
                        onChange={setEspecie}
                        options={ESPECIES.map((e) => ({label: e, value: e}))}
                        ariaLabel="Seleccionar especie"
                    />
                </div>
            </div>

            {/* Sexo + Tamaño */}
            <div className="row">
                <div className="field">
                    <label>Sexo</label>
                    <MenuSelect
                        value={sexo}
                        onChange={setSexo}
                        options={[
                            {label: "Macho", value: "macho"},
                            {label: "Hembra", value: "hembra"},
                        ]}
                        ariaLabel="Seleccionar sexo"
                    />
                </div>

                <div className="field">
                    <label>Tamaño</label>
                    <MenuSelect
                        value={tamano}
                        onChange={setTamano}
                        options={[
                            {label: "Pequeño", value: "pequeño"},
                            {label: "Mediano", value: "mediano"},
                            {label: "Grande", value: "grande"},
                        ]}
                        ariaLabel="Seleccionar tamaño"
                    />
                </div>
            </div>

            {/* 🐶 Combobox de razas con búsqueda incluida */}
            <div className="field relative w-full">
                <label>Raza</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar o seleccionar raza..."
                        value={busquedaRaza || razaOpts.find((r) => r.value === razaId)?.label || ""}
                        onChange={(e) => {
                            setBusquedaRaza(e.target.value);
                            setRazaId(""); // limpiamos selección al escribir
                        }}
                        onFocus={() => setOpenRaza(true)}
                        className="w-full rounded-lg border border-[#FF8414]/40 px-3 py-2 focus:border-[#FF8414] focus:outline-none bg-white"
                    />

                    {openRaza && (
                        <div
                            className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-[#FF8414]/40 bg-white shadow-lg"
                            onMouseLeave={() => setOpenRaza(false)}
                        >
                            {razaOpts.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-500">No hay razas disponibles</div>
                            ) : (
                                razaOpts
                                .filter((r) => r.label.toLowerCase().includes(busquedaRaza.toLowerCase()))
                                .map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => {
                                            setRazaId(r.value);
                                            setBusquedaRaza(r.label);
                                            setOpenRaza(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#fff2e6] ${
                                            razaId === r.value ? "bg-[#FF8414]/10 font-medium text-[#8B4513]" : ""
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Colores */}
            <div className="field">
                <label>Colores del pelaje</label>
                <SelectorColores value={colores} onChange={setColores} />
            </div>

            {/* Foto */}
            <div className="field">
                <label>Foto</label>

                {/* ✅ Si NO hay preview, mostrar cuadro de subida */}
                {!fotoPreview ? (
                    <div className="upload" onClick={() => fileInputRef.current?.click()}>
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
                    /* ✅ Si hay preview, mostrar imagen seleccionada */
                    <div className="preview">
                        <img src={fotoPreview} alt="Vista previa" className="rounded-xl w-64 h-64 object-cover" />

                        <div className="preview-actions">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cambiar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={clearPhoto}>
                                Quitar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Esterilizado + Personalidad */}
            <div className="row">
                <div className="field">
                    <label>Esterilizado</label>
                    <MenuSelect
                        value={esterilizado ? "sí" : "no"}
                        onChange={(v) => setEsterilizado(v === "sí")}
                        options={[
                            {label: "Sí", value: "sí"},
                            {label: "No", value: "no"},
                        ]}
                        ariaLabel="Seleccionar esterilización"
                    />
                </div>

                <div className="field">
                    <label>Personalidad</label>
                    <MenuSelect
                        value={personalidad}
                        onChange={setPersonalidad}
                        options={[
                            {label: "Tranquilo", value: "tranquilo"},
                            {label: "Juguetón", value: "juguetón"},
                            {label: "Curioso", value: "curioso"},
                            {label: "Tímido", value: "tímido"},
                        ]}
                        ariaLabel="Seleccionar personalidad"
                    />
                </div>
            </div>

            {/* 🟢 Edad + Peso + Altura — siempre en la misma línea */}
            <div className="flex items-end justify-center gap-6 w-full whitespace-nowrap">
                <div className="inline-flex flex-col items-start">
                    <label className="mb-1 text-sm font-semibold text-[#2b1b12]">Edad (meses)</label>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        value={edadMeses}
                        onChange={(e) => setEdadMeses(parseInt(e.target.value || "0", 10))}
                        className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
                    />
                </div>

                <div className="inline-flex flex-col items-start">
                    <label className="mb-1 text-sm font-semibold text-[#2b1b12]">Peso (kg)</label>
                    <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={pesoKg}
                        onChange={(e) => setPesoKg(parseFloat(e.target.value) || 0)}
                        className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
                    />
                </div>

                <div className="inline-flex flex-col items-start">
                    <label className="mb-1 text-sm font-semibold text-[#2b1b12]">Altura (cm)</label>
                    <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={alturaCm}
                        onChange={(e) => setAlturaCm(parseFloat(e.target.value) || 0)}
                        className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
                    />
                </div>
            </div>

            {/* Descripción */}
            <div className="field">
                <label>Descripción</label>
                <textarea rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            {/* Lugar rescate + Condición */}
            <div className="row">
                <div className="field">
                    <label>Lugar de rescate</label>
                    <input type="text" value={lugarRescate} onChange={(e) => setLugarRescate(e.target.value)} />
                </div>

                <div className="field">
                    <label>Condición al ingreso</label>
                    <MenuSelect
                        value={condicionIngreso}
                        onChange={setCondicionIngreso}
                        options={[
                            {label: "Sano", value: "sano"},
                            {label: "Heridas leves", value: "heridas leves"},
                            {label: "Desnutrido", value: "desnutrido"},
                        ]}
                        ariaLabel="Seleccionar condición"
                    />
                </div>
            </div>

            {/* Observaciones */}
            <div className="field">
                <label>Observaciones médicas</label>
                <textarea
                    rows={3}
                    value={observacionesMedicas}
                    onChange={(e) => setObservacionesMedicas(e.target.value)}
                />
            </div>

            {/* Botones */}
            <div className="actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
            </div>
        </form>
    );
}
