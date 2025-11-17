"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { ESPECIES } from "@/data/masc/constants";
import { crearMascota, actualizarMascota } from "@/mascotas/mascotas-actions";
import type { CreateMascotaPayload } from "@/data/masc/types";
import { SelectorColores } from "@/components/masc/SelectorColores";
import "@/styles/form-mascota.css";
import { listarRazas } from "@/mascotas/razas/razas-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Opt = { label: string; value: string };

function validarRangoAltura(valor: number, especie: string) {
  if (especie.toLowerCase() === "perro") {
    return valor >= 10 && valor <= 110;
  }

  if (especie.toLowerCase() === "gato") {
    return valor >= 10 && valor <= 45;
  }

  if (especie.toLowerCase() === "ave") {
    return valor >= 5 && valor <= 60;
  }

  return valor >= 1 && valor <= 200;
}

function validarRangoPeso(valor: number, especie: string) {
  const esp = especie.toLowerCase();

  if (esp === "perro") {
    return valor >= 1 && valor <= 90;
  }

  if (esp === "gato") {
    return valor >= 1 && valor <= 40;
  }

  if (esp === "ave") {
    return valor >= 0.05 && valor <= 5;
  }

  return valor >= 0.1 && valor <= 200;
}

/* Detectar clic fuera del menú */
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void
) {
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
    <div
      className={`mselect ${widthClass}`}
      ref={boxRef}
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="mselect-trigger cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current?.label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="chev"
        >
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
              className={`mselect-item cursor-pointer ${
                opt.value === value ? "is-active" : ""
              }`}
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
  const [especie, setEspecie] = useState("");
  const [sexo, setSexo] = useState("");
  const [tamano, setTamano] = useState("");
  const [edadMeses, setEdadMeses] = useState<string>("");
  const [descripcion, setDescripcion] = useState("");
  const [razaId, setRazaId] = useState("");
  const [pesoKg, setPesoKg] = useState<string>("");
  const [alturaCm, setAlturaCm] = useState<string>("");
  const [esterilizado, setEsterilizado] = useState<string>("");
  const [personalidad, setPersonalidad] = useState("");
  const [colores, setColores] = useState<string[]>([]);
  const [lugarRescate, setLugarRescate] = useState("");
  const [condicionIngreso, setCondicionIngreso] = useState("");
  const [observacionesMedicas, setObservacionesMedicas] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [todasRazas, setTodasRazas] = useState<
    { id: string; nombre: string; especie: string }[]
  >([]);
  const [busquedaRaza, setBusquedaRaza] = useState("");
  const [openRaza, setOpenRaza] = useState(false);
  const router = useRouter();

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
    const filtradas = todasRazas.filter(
      (r) => r.especie.toLowerCase() === especie.toLowerCase()
    );
    if (!busquedaRaza.trim()) return filtradas;
    return filtradas.filter((r) =>
      r.nombre.toLowerCase().includes(busquedaRaza.toLowerCase())
    );
  }, [todasRazas, especie, busquedaRaza]);

  const razaOpts = razasFiltradas.map((r) => ({
    label: r.nombre,
    value: r.id,
  }));

  /* ✅ Si estamos editando, llenar campos */
  useEffect(() => {
    if (mascota) {
      setNombre(mascota.nombre || "");
      setEspecie(mascota.raza?.especie || "");
      setSexo(mascota.sexo || "");
      setTamano(mascota.tamano || "");
      setEdadMeses(mascota.edad ? String(mascota.edad) : "");
      setDescripcion(mascota.descripcion_fisica || "");
      setRazaId(mascota.raza_id || "");
      setPesoKg(mascota.peso_kg ? String(mascota.peso_kg) : "");
      setAlturaCm(mascota.altura_cm ? String(mascota.altura_cm) : "");
      setEsterilizado(mascota.esterilizado ? "sí" : "no");
      setPersonalidad(mascota.personalidad || "");
      setColores(mascota.colores || []);
      setLugarRescate(mascota.lugar_rescate || "");
      setCondicionIngreso(mascota.condicion_ingreso || "");
      setObservacionesMedicas(mascota.observaciones_medicas || "");
      setFotoPreview(mascota.imagen_url || null);
    }
  }, [mascota]);

  /* ================== Handlers ================== */
  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.warning("Por favor selecciona una imagen (jpg, png, webp).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("La imagen es muy pesada (máx. 5 MB).");
      return;
    }

    // Guardar en memoria la nueva imagen temporal
    setFotoFile(file);

    // Mostrar la vista previa local (sin subir todavía)
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const sexoNormalizado =
    sexo?.charAt(0).toUpperCase() + sexo.slice(1).toLowerCase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    if (!especie) {
      toast.error("Selecciona una especie.");
      return;
    }

    if (!sexo) {
      toast.error("Selecciona un sexo.");
      return;
    }

    if (!tamano) {
      toast.error("Selecciona un tamaño.");
      return;
    }

    if (!razaId) {
      toast.error("Selecciona una raza.");
      return;
    }

    if (!colores || colores.length === 0) {
      toast.error("Selecciona al menos un color.");
      return;
    }

    const noHayFoto = !fotoFile && !fotoPreview;

    if (!mascota?.id && noHayFoto) {
      toast.error("Debes subir una foto de la mascota.");
      return;
    }

    if (!esterilizado) {
      toast.error("Selecciona si la mascota está esterilizada.");
      return;
    }

    if (!personalidad) {
      toast.error("Selecciona la personalidad de la mascota.");
      return;
    }

    if (!edadMeses || isNaN(Number(edadMeses)) || Number(edadMeses) <= 0) {
      toast.error("Ingresa una edad válida (en meses).");
      return;
    }

    if (!pesoKg || isNaN(Number(pesoKg)) || Number(pesoKg) <= 0) {
      toast.error("Ingresa un peso válido en kilogramos.");
      return;
    }

    const edadNum = Number(edadMeses);

    if (edadNum < 1 || edadNum > 240) {
      toast.error("La edad debe estar entre 1 y 240 meses.");
      return;
    }

    if (Number(pesoKg) > 200) {
      toast.error("El peso ingresado es demasiado grande.");
      return;
    }

    const pesoNum = Number(pesoKg);

    if (!validarRangoPeso(pesoNum, especie)) {
      toast.error(
        `El peso no está dentro del rango válido para un ${especie}.`
      );
      return;
    }

    if (!alturaCm || isNaN(Number(alturaCm)) || Number(alturaCm) <= 0) {
      toast.error("Ingresa una altura válida en centímetros.");
      return;
    }

    const alturaNum = Number(alturaCm);

    if (!validarRangoAltura(alturaNum, especie)) {
      toast.error(
        `La altura no está dentro del rango válido para un ${especie}.`
      );
      return;
    }

    if (Number(alturaCm) > 200) {
      toast.error("La altura ingresada es demasiado grande.");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("La descripción es obligatoria.");
      return;
    }

    if (descripcion.trim().length < 10) {
      toast.error("La descripción debe tener al menos 10 caracteres.");
      return;
    }

    if (!lugarRescate.trim()) {
      toast.error("El lugar de rescate es obligatorio.");
      return;
    }

    if (lugarRescate.trim().length < 3) {
      toast.error("El lugar de rescate debe tener al menos 3 caracteres.");
      return;
    }

    if (!condicionIngreso) {
      toast.error("Selecciona la condición de ingreso.");
      return;
    }

    if (!observacionesMedicas.trim()) {
      toast.error("Las observaciones médicas son obligatorias.");
      return;
    }

    if (observacionesMedicas.trim().length < 5) {
      toast.error(
        "Las observaciones médicas deben tener al menos 5 caracteres."
      );
      return;
    }

    const payload = {
      id: mascota?.id,
      nombre,
      sexo: sexoNormalizado,
      tamano: tamano.toLowerCase(),
      raza_id: razaId,
      edad: String(Number(edadMeses)),
      peso_kg: Number(pesoKg),
      altura_cm: Number(alturaCm),
      personalidad,
      descripcion_fisica: descripcion,
      esterilizado: esterilizado === "sí",
      disponible_adopcion: true,
      colores,
      lugar_rescate: lugarRescate,
      condicion_ingreso: condicionIngreso,
      observaciones_medicas: observacionesMedicas,
      imagen_url: noHayFoto ? null : mascota?.imagen_url || fotoPreview || null,
      qr_code: mascota?.qr_code || null,
    };

    try {
      let result;
      if (mascota?.id) {
        result = await actualizarMascota(payload, fotoFile || undefined);
        toast.success("Mascota actualizada 🐾");
      } else {
        result = await crearMascota(payload, fotoFile || undefined);
        toast.success("Mascota creada 🐾");
      }
      await onSubmit(result);
      onCancel();
    } catch (err: any) {
      console.error("Error al guardar mascota:", err);
      toast.error(err.message || "Error al guardar la mascota");
    }
  }

  /* ======================== UI ======================== */
  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Nombre + especie */}
      <div className="row">
        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Especie</label>
          <MenuSelect
            value={especie}
            onChange={setEspecie}
            options={[
              { label: "Seleccionar especie", value: "" },
              ...ESPECIES.map((e) => ({ label: e, value: e })),
            ]}
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
              { label: "Seleccionar sexo", value: "" },
              { label: "Macho", value: "macho" },
              { label: "Hembra", value: "hembra" },
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
              { label: "Seleccionar tamaño", value: "" },
              { label: "Pequeño", value: "pequeño" },
              { label: "Mediano", value: "mediano" },
              { label: "Grande", value: "grande" },
            ]}
            ariaLabel="Seleccionar tamaño"
          />
        </div>
      </div>

      {/* Combobox de razas con búsqueda incluida */}
      <div className="field relative w-full">
        <label>Raza</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar o seleccionar raza..."
            value={
              busquedaRaza ||
              razaOpts.find((r) => r.value === razaId)?.label ||
              ""
            }
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
                <div className="px-3 py-2 text-sm text-gray-500">
                  No hay razas disponibles
                </div>
              ) : (
                razaOpts
                  .filter((r) =>
                    r.label.toLowerCase().includes(busquedaRaza.toLowerCase())
                  )
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
                        razaId === r.value
                          ? "bg-[#FF8414]/10 font-medium text-[#8B4513]"
                          : ""
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

      {/* 🖼️ Campo de Foto */}
      <div className="field flex flex-col items-center">
        <label className="mb-2">Foto</label>

        {fotoPreview ? (
          // ✅ Si hay foto actual
          <div className="flex flex-col items-center">
            <img
              src={fotoPreview}
              alt="Vista previa"
              className="rounded-xl w-64 h-64 object-cover shadow-md border border-[#FF8414]/20"
            />

            <button
              type="button"
              className="btn btn-ghost mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Cambiar
            </button>

            {/* Input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          // 📷 Si no hay imagen (centrado)
          <div className="flex justify-center items-center w-full">
            <div
              className="flex flex-col items-center justify-center w-64 h-64 rounded-xl border-2 border-dashed border-[#FF8414]/50 bg-[#fff9f4] text-[#8B4513] hover:border-[#FF8414] transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-4xl mb-2">🐾</span>
              <p className="text-sm font-medium">Sube una foto</p>
              <p className="text-xs opacity-70 mt-1">
                Haz clic para seleccionar
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>
        )}
      </div>

      {/* Esterilizado + Personalidad */}
      <div className="row">
        <div className="field">
          <label>Esterilizado</label>
          <MenuSelect
            value={esterilizado}
            onChange={setEsterilizado}
            options={[
              { label: "Seleccionar opción", value: "" },
              { label: "Sí", value: "Sí" },
              { label: "No", value: "No" },
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
              { label: "Seleccionar personalidad", value: "" },
              { label: "Tranquilo", value: "Tranquilo" },
              { label: "Juguetón", value: "Juguetón" },
              { label: "Curioso", value: "Curioso" },
              { label: "Tímido", value: "Tímido" },
              { label: "Protector", value: "Protector" },
              { label: "Energético", value: "Energético" },
              { label: "Independiente", value: "Independiente" },
              { label: "Cariñoso", value: "Cariñoso" },
              { label: "Sociable", value: "Sociable" },
              { label: "Obediente", value: "Obediente" },
              { label: "Nervioso", value: "Nervioso" },
              { label: "Territorial", value: "Territorial" },
              { label: "Leal", value: "Leal" },
              { label: "Inteligente", value: "Inteligente" },
              { label: "Dormilón", value: "Dormilón" },
            ]}
            ariaLabel="Seleccionar personalidad"
          />
        </div>
      </div>

      {/* 🟢 Edad + Peso + Altura — siempre en la misma línea */}
      <div className="flex items-end justify-center gap-6 w-full whitespace-nowrap">
        <div className="inline-flex flex-col items-start">
          <label className="mb-1 text-sm font-semibold text-[#2b1b12]">
            Edad (meses)
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={edadMeses}
            onChange={(e) => setEdadMeses(e.target.value)}
            className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
          />
        </div>

        <div className="inline-flex flex-col items-start">
          <label className="mb-1 text-sm font-semibold text-[#2b1b12]">
            Peso (kg)
          </label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={pesoKg}
            onChange={(e) => setPesoKg(e.target.value)}
            className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
          />
        </div>

        <div className="inline-flex flex-col items-start">
          <label className="mb-1 text-sm font-semibold text-[#2b1b12]">
            Altura (cm)
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={alturaCm}
            onChange={(e) => setAlturaCm(e.target.value)}
            className="w-[110px] rounded-lg border border-[#FF8414]/40 px-2 py-2 text-center focus:border-[#FF8414] focus:outline-none"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="field">
        <label>Descripción</label>
        <textarea
          rows={4}
          value={descripcion}
          placeholder="Escribe al menos 10 caracteres..."
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      {/* Lugar rescate + Condición */}
      <div className="row">
        <div className="field">
          <label>Lugar de rescate</label>
          <input
            type="text"
            value={lugarRescate}
            onChange={(e) => setLugarRescate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Condición al ingreso</label>
          <MenuSelect
            value={condicionIngreso}
            onChange={setCondicionIngreso}
            options={[
              { label: "Seleccionar condición", value: "" },
              { label: "Sano", value: "Sano" },
              { label: "Heridas leves", value: "Heridas leves" },
              { label: "Heridas moderadas", value: "Heridas moderadas" },
              { label: "Heridas graves", value: "Heridas graves" },
              { label: "Desnutrido", value: "Desnutrido" },
              { label: "Deshidratado", value: "Deshidratado" },
              {
                label: "Enfermedad respiratoria",
                value: "Enfermedad respiratoria",
              },
              { label: "Problemas de piel", value: "Problemas de piel" },
              { label: "Parasitosis", value: "Parasitosis" },
              { label: "Trauma o golpe", value: "Trauma o golpe" },
              { label: "Envenenamiento", value: "Envenenamiento" },
              { label: "Maltrato evidente", value: "Maltrato evidente" },
              { label: "Atropellado", value: "Atropellado" },
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
          placeholder="Escribe al menos 10 caracteres..."
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
