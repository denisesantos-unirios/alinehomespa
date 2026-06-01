import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, HeartHandshake, Home, Sparkles, Quote, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import heroImg from "@/assets/hero-spa.jpg";
import aboutImg from "@/assets/about-spa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aline Home Spa Prime — Massoterapia e Home Spa em domicílio" },
      {
        name: "description",
        content:
          "Atendimento personalizado de massoterapia clínica e home spa. Relaxamento, alívio de dores e cuidado integral sem sair de casa.",
      },
    ],
  }),
  component: HomePage,
});

const benefits = [
  { icon: HeartHandshake, title: "Massoterapia clínica personalizada", desc: "Sessões adaptadas à sua queixa, ritmo e objetivos terapêuticos." },
  { icon: Home, title: "Atendimento em domicílio", desc: "Você relaxa em casa — levamos o cuidado, o conforto e a estrutura até você." },
  { icon: Sparkles, title: "Relaxamento e alívio de dores", desc: "Técnicas para tensão muscular, estresse, pós-operatório e bem-estar geral." },
  { icon: Leaf, title: "Ambiente de cuidado e descanso", desc: "Um espaço acolhedor, ético e respeitoso para cuidar de você por inteiro." },
];

const services = [
  { name: "Massagem Relaxante", time: "60 min", desc: "Toque suave e fluido para aliviar o estresse e renovar a energia." },
  { name: "Massoterapia Clínica", time: "60–90 min", desc: "Manobras específicas para dores musculares, tensões e desequilíbrios posturais." },
  { name: "Drenagem Linfática", time: "60 min", desc: "Estimula o sistema linfático, reduz inchaço e melhora a circulação." },
  { name: "Pós-Operatório", time: "60 min", desc: "Cuidado especializado para acelerar a recuperação com segurança e acolhimento." },
  { name: "Spa Day / Home Spa", time: "120 min", desc: "Experiência completa de cuidado: massagem, aromaterapia e ritual de relaxamento." },
  { name: "Massagem Terapêutica", time: "60 min", desc: "Foco em pontos de tensão, alívio de dores crônicas e mobilidade." },
];

const testimonials = [
  { name: "Marina S.", text: "A Aline transformou minha rotina. Atendimento impecável, acolhedor e profissional. Saio de cada sessão renovada." },
  { name: "Carla R.", text: "O home spa é uma experiência única. Tudo cuidado nos mínimos detalhes — me senti em um verdadeiro retiro." },
  { name: "Júlia M.", text: "Comecei o acompanhamento no pós-operatório e fui muito bem cuidada. Recomendo de olhos fechados." },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, oklch(0.78 0.13 85 / 0.35), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.78 0.13 85 / 0.2), transparent 55%)`,
          }}
        />
        <div className="container-spa relative grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <Logo size="lg" />
            <h1 className="font-display mt-8 text-4xl leading-tight md:text-6xl">
              Massoterapia e Home Spa para{" "}
              <span className="italic text-gold">cuidar de você</span> sem sair de casa.
            </h1>
            <p className="mt-6 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              Atendimento personalizado, acolhedor e clínico, focado em bem-estar, alívio
              de dores e cuidado integral.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/contato">Agendar atendimento</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/servicos">Conhecer serviços</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/20 blur-2xl" />
            <img
              src={heroImg}
              alt="Ambiente acolhedor de home spa com velas e toalhas"
              width={1536}
              height={1024}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-gold/30"
            />
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container-spa py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">
            Por que escolher
          </p>
          <h2 className="font-display mt-2 text-3xl md:text-5xl">Cuidado integral, do começo ao fim</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-gold">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-5 text-xl text-primary">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-secondary/60 py-20">
        <div className="container-spa">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">
                Serviços
              </p>
              <h2 className="font-display mt-2 text-3xl md:text-5xl">
                Cada toque, um cuidado dedicado
              </h2>
            </div>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-gold"
            >
              Ver todos os serviços <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-gold/60 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-primary">{s.name}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {s.time}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                <Link
                  to="/contato"
                  className="text-gold mt-5 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  Quero esse cuidado <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-spa grid gap-12 py-20 md:grid-cols-2 md:items-center">
        <img
          src={aboutImg}
          alt="Detalhes de spa com toalhas, velas e folhas"
          width={1024}
          height={1024}
          loading="lazy"
          className="aspect-square w-full rounded-3xl object-cover shadow-xl ring-1 ring-border"
        />
        <div>
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">
            Sobre
          </p>
          <h2 className="font-display mt-2 text-3xl md:text-5xl text-primary">
            Um cuidado feito de presença, técnica e fé.
          </h2>
          <p className="mt-6 text-muted-foreground">
            A Aline Home Spa Prime nasceu do desejo de oferecer uma experiência terapêutica
            verdadeiramente acolhedora. Unimos conhecimento clínico, escuta atenta e um
            ambiente sereno para cuidar de cada cliente de forma única.
          </p>
          <p className="mt-4 text-muted-foreground">
            Nossa missão é proporcionar bem-estar com ética, profissionalismo e respeito —
            seja em um momento de relaxamento, no alívio de dores ou no acompanhamento
            terapêutico de longo prazo.
          </p>
          <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/sobre">Conhecer nossa história</Link>
          </Button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/60 py-20">
        <div className="container-spa">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">
              Depoimentos
            </p>
            <h2 className="font-display mt-2 text-3xl md:text-5xl">Quem cuida, sente. Quem sente, indica.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-7">
                <Quote className="text-gold h-7 w-7" />
                <blockquote className="mt-4 text-base text-foreground/90">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium text-primary">
                  — {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-spa text-center">
          <h2 className="font-display text-4xl md:text-5xl">
            Pronta para <span className="italic text-gold">cuidar de você</span> hoje?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Agende seu atendimento e receba o cuidado que você merece, no conforto do seu lar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
                Agendar pelo WhatsApp
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/anamnese">Preencher ficha de anamnese</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
