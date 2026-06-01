import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Aline Home Spa Prime" },
      { name: "description", content: "Conheça os serviços de massoterapia e home spa: massagem relaxante, drenagem linfática, pós-operatório e mais." },
      { property: "og:title", content: "Serviços — Aline Home Spa Prime" },
      { property: "og:description", content: "Massoterapia clínica, drenagem, pós-operatório e home spa." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { name: "Massagem Relaxante", time: "60 min", desc: "Toque suave e fluido que alivia o estresse, melhora o sono e renova a energia.", benefits: ["Reduz ansiedade", "Melhora o sono", "Bem-estar imediato"] },
  { name: "Massoterapia Clínica", time: "60–90 min", desc: "Avaliação e manobras específicas para dores musculares, tensões e desequilíbrios posturais.", benefits: ["Alívio de dores", "Mobilidade", "Postura"] },
  { name: "Drenagem Linfática", time: "60 min", desc: "Movimentos rítmicos que estimulam o sistema linfático e reduzem inchaço.", benefits: ["Reduz inchaço", "Melhora circulação", "Sensação de leveza"] },
  { name: "Pós-Operatório", time: "60 min", desc: "Cuidado técnico e acolhedor para uma recuperação segura, respeitando seu tempo.", benefits: ["Recuperação", "Conforto", "Segurança"] },
  { name: "Spa Day / Home Spa", time: "120 min", desc: "Experiência completa de cuidado com aromaterapia, massagem e ritual de relaxamento.", benefits: ["Imersão", "Aromaterapia", "Ritual completo"] },
  { name: "Massagem Terapêutica", time: "60 min", desc: "Foco em pontos de tensão e alívio de dores crônicas. Cuidado contínuo.", benefits: ["Dores crônicas", "Tensão muscular", "Flexibilidade"] },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container-spa">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">Serviços</p>
          <h1 className="font-display mt-3 text-4xl md:text-6xl">Um cuidado para cada momento</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Sessões pensadas para o seu bem-estar, com técnica, escuta e acolhimento. Escolha
            o cuidado que mais se conecta com você hoje.
          </p>
        </div>
      </section>
      <section className="container-spa py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.name} className="rounded-3xl border border-border bg-card p-8 transition hover:border-gold/60 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-primary">{s.name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Clock className="h-3 w-3" /> {s.time}
                </span>
              </div>
              <p className="mt-4 text-muted-foreground">{s.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.benefits.map((b) => (
                  <li key={b} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    <Sparkles className="text-gold h-3 w-3" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/contato">Quero esse cuidado</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
