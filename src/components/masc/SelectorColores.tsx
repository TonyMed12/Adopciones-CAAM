import React from "react";

// Paleta extendida con color real (visual y nombre)
const COLORES_DISPONIBLES = [
    {nombre: "blanco", hex: "#FFFFFF"},
    {nombre: "negro", hex: "#000000"},
    {nombre: "gris", hex: "#808080"},
    {nombre: "gris oscuro", hex: "#4B4B4B"},
    {nombre: "café", hex: "#8B4513"},
    {nombre: "café claro", hex: "#B97A57"},
    {nombre: "beige", hex: "#D6B591"},
    {nombre: "crema", hex: "#F5E8C7"},
    {nombre: "canela", hex: "#C68642"},
    {nombre: "dorado", hex: "#DAA520"},
    {nombre: "miel", hex: "#E2B66C"},
    {nombre: "rojizo", hex: "#B55239"},
    {nombre: "atigrado", hex: "#9C661F"},
    {nombre: "tricolor", hex: "#C19A6B"},
    {nombre: "bicolor", hex: "#C0C0C0"},
    {nombre: "manchado", hex: "#B5A89F"},
    {nombre: "naranja", hex: "#FFA500"},
    {nombre: "gris azulado", hex: "#6E7F80"},

    // Colores comunes en aves
    {nombre: "verde", hex: "#32CD32"},
    {nombre: "verde oscuro", hex: "#228B22"},
    {nombre: "amarillo", hex: "#FFD700"},
    {nombre: "azul", hex: "#1E90FF"},
    {nombre: "celeste", hex: "#87CEEB"},
    {nombre: "rojo", hex: "#DC143C"},
];

export function SelectorColores({value, onChange}: {value: string[]; onChange: (colores: string[]) => void}) {
    const toggleColor = (nombre: string) => {
        if (value.includes(nombre)) {
            // si ya está seleccionado, lo quitamos
            onChange(value.filter((c) => c !== nombre));
        } else if (value.length < 3) {
            // si hay menos de 3 seleccionados, agregamos
            onChange([...value, nombre]);
        } else {
            // opcional: podrías mostrar una alerta o mensaje visual
            alert("Solo puedes seleccionar hasta 3 colores");
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {COLORES_DISPONIBLES.map(({nombre, hex}) => {
                const activo = value.includes(nombre);
                const maximoAlcanzado = value.length >= 3 && !activo;

                return (
                    <button
                        key={nombre}
                        type="button"
                        onClick={() => toggleColor(nombre)}
                        disabled={maximoAlcanzado}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition font-medium ${
                            activo
                                ? "bg-[#FF8414] border-[#FF8414] text-white"
                                : maximoAlcanzado
                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                : "bg-white border-[#FF8414] text-[#2b1b12] hover:bg-[#fff0e0]"
                        }`}
                    >
                        <span
                            className="w-4 h-4 rounded-full border border-[#2b1b12]/30"
                            style={{backgroundColor: hex}}
                        />
                        {nombre}
                    </button>
                );
            })}
        </div>
    );
}
