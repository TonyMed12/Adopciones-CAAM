// src/app/(marketing)/page.tsx
import { ButtonLink } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-[var(--brand-dark)]">
            Adopta y cambia una vida
          </h1>
          <p className="mt-4 text-gray-600">
            Conoce a nuestros gatetes y perretes que buscan un hogar.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/adopciones" variant="secondary" size="lg">
              Ver mascotas
            </ButtonLink>

            <ButtonLink href="/ayuda" variant="primary" size="lg">
              Ayúdalos
            </ButtonLink>
          </div>
        </div>

        <div className="mt-6 md:mt-0">
          <div className="aspect-[16/10] w-full rounded-2xl bg-gray-100" />
        </div>
      </section>
    </main>
  );
}
