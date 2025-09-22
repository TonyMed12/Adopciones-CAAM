"use client";
import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import Header from "@/components/Header";           // ← el de arriba
import Filters from "./components/Filters";
import MascotaCard from "./components/MascotaCard";
import FormMascota from "./components/FormMascota";

import { ESPECIES, MOCK } from "./data/constants";
import type { Mascota, Sexo } from "./data/types";

export default function MascotasPage() {
  const [items, setItems] = useState<Mascota[]>(MOCK);
  const [q, setQ] = useState("");
  const [especie, setEspecie] = useState<string>("Todas");
  const [sexo, setSexo] = useState<string>("Todos");
  const [openForm, setOpenForm] = useState(false);

  const data = useMemo(() => {
    return items.filter((m) => {
      const matchesQ = [m.nombre, m.raza, m.descripcion, m.especie].some((v) =>
        v?.toLowerCase().includes(q.toLowerCase())
      );
      const matchesEsp = especie === "Todas" || m.especie === especie;
      const matchesSexo = sexo === "Todos" || m.sexo === (sexo as Sexo);
      return matchesQ && matchesEsp && matchesSexo;
    });
  }, [items, q, especie, sexo]);

  function onSubmit(form: Mascota) {
    setItems((prev) => [{ ...form, id: crypto.randomUUID(), activo: true }, ...prev]);
    setOpenForm(false);
  }

  return (
    <>
      <Header showSubbar={false} /> {/* 👈 sin franja naranja aquí */}

      <main className="shell">
        <div className="pageHead">
          <div className="titles">
            <h1 className="title">Mascotas</h1>
            <p className="subtitle">Explora a nuestros adorables compañeros 🐾</p>
          </div>

          <button className="btn btn-primary" onClick={() => setOpenForm(true)}>
            <Plus size={18} /> Agregar
          </button>
        </div>

        <Filters
          q={q}
          onQ={setQ}
          especie={especie}
          onEspecie={setEspecie}
          sexo={sexo}
          onSexo={setSexo}
          ESPECIES={ESPECIES}
        />

        <section className="grid">
          {data.map((m) => (
            <MascotaCard key={m.id} m={m} onView={() => {}} onAdopt={() => {}} />
          ))}
          {data.length === 0 && (
            <div className="empty">No hay resultados con esos filtros</div>
          )}
        </section>

        {openForm && (
          <div className="overlay" role="dialog" aria-modal="true">
            <div className="dialog">
              <header className="dialogHead">
                <div className="dialogTitle">Agregar mascota</div>
                <button className="close" onClick={() => setOpenForm(false)} aria-label="Cerrar">
                  ✕
                </button>
              </header>
              <div className="dialogBody">
                <FormMascota onCancel={() => setOpenForm(false)} onSubmit={onSubmit} />
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        :global(body) { background: #fff4e7; }

        .shell {
          max-width: 1200px;         /* mismo ancho visual que header */
          margin: 18px auto 60px;    /* sube un poco para pegarse más */
          padding: 0 24px;           /* igual que header.inner */
          color: #2b1b12;
        }

        .pageHead {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 18px;
        }
        .titles { display:flex; flex-direction:column; gap:6px; }
        .title {
          margin: 0;
          font-weight: 800;
          font-size: 64px;          /* un pelín más grande como la portada */
          line-height: 1.05;        /* más compacto para que “pese” igual */
          color: #8B4513;
          letter-spacing: .2px;
        }
        .subtitle { margin: 0; color: #7a5c49; font-weight: 500; }

        .grid {
          display: grid; gap: 14px;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }
        .empty {
          grid-column: 1 / -1; text-align: center; color: #7a5c49; padding: 40px 0;
        }

        /* Botón “Agregar” igual peso que CTA del header */
        .btn {
          font-weight: 800;          /* ↑ para igualar al CTA */
          font-size: 16px; line-height: 1;
          border-radius: 12px; padding: 12px 18px;
          cursor: pointer; transition: filter .15s;
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 6px 14px rgba(0,0,0,.12);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary { color: #fff; background: #8B4513; }
        .btn-primary:hover { filter: brightness(1.07); }

        /* Modal */
        .overlay { position: fixed; inset: 0; z-index: 60; background: rgba(43,27,18,.45);
                   display: grid; place-items: center; padding: 16px; }
        .dialog { width: 100%; max-width: 720px; background: #fff4e7; color: #2b1b12;
                  border: 1px solid #eadacb; border-radius: 16px; overflow: hidden;
                  box-shadow: 0 18px 60px rgba(43,27,18,.25); }
        .dialogHead { display:flex; align-items:center; justify-content:space-between;
                      padding: 10px 14px; border-bottom: 1px solid #f0e6dc; background: #fff4e7; }
        .dialogTitle { font-weight: 800; font-size: 14px; }
        .close { border: none; background: #f4ece4; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; }
        .dialogBody { padding: 14px; }

        @media (max-width: 720px) {
          .title { font-size: 42px; line-height: 1.06; }
          .pageHead { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </>
  );
}