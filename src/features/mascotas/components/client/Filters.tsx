"use client";
import {Search} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";

type Props = {
    q: string;
    onQ: (v: string) => void;
    especie: string;
    onEspecie: (v: string) => void;
    sexo: string;
    onSexo: (v: string) => void;
    ESPECIES: readonly string[];
};

type Opt = {label: string; value: string};

function useClickOutside(ref: React.RefObject<HTMLElement>, onClose: () => void) {
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
}: {
    value: string;
    onChange: (v: string) => void;
    options: Opt[];
    ariaLabel: string;
}) {
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);
    useClickOutside(boxRef, () => setOpen(false));

    const current = options.find((o) => o.value === value) ?? options[0];

    return (
        <div className="mselect" ref={boxRef}>
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
                    width: 100%;
                    max-width: 260px;
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
                    font-weight: 400;
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
                    min-width: 220px;
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
                    font-weight: 400;
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

export default function Filters({q, onQ, especie, onEspecie, sexo, onSexo, ESPECIES}: Props) {
    const especieOpts: Opt[] = [
        {label: "Todas las especies", value: "Todas"},
        ...ESPECIES.map((e) => ({label: e, value: e})),
    ];
    const sexoOpts: Opt[] = [
        {label: "Ambos sexos", value: "Todos"},
        {label: "Macho", value: "Macho"},
        {label: "Hembra", value: "Hembra"},
    ];
    return (
        <section className="filters">
            <div className="search">
                <span className="searchIcon">
                    <Search size={16} />
                </span>
                <input
                    value={q}
                    onChange={(e) => onQ(e.target.value)}
                    placeholder="Busca por nombre, raza o descripción…"
                />
            </div>

            <MenuSelect value={especie} onChange={onEspecie} options={especieOpts} ariaLabel="Filtrar por especie" />
            <MenuSelect value={sexo} onChange={onSexo} options={sexoOpts} ariaLabel="Filtrar por sexo" />

            <style jsx>{`
                .filters {
                    display: grid;
                    grid-template-columns: 1fr 220px 200px;
                    gap: 12px;
                    margin: 18px 0 10px;
                }
                .search {
                    position: relative;
                }
                .search input {
                    width: 100%;
                    padding: 10px 12px 10px 34px;
                    border: 1px solid var(--line);
                    border-radius: 12px;
                    background: #fff;
                    outline: none;
                    box-shadow: 0 4px 14px rgba(43, 27, 18, 0.06);
                }
                .search input:focus {
                    border-color: #d7c4b2;
                }
                .searchIcon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a78d7b;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                }
                @media (max-width: 720px) {
                    .filters {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
}
