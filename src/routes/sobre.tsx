import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import aboutImg from "@/assets/about-spa.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Aline Home Spa Prime" },
      { name: "description", content: "Conheça a Aline Home Spa Prime: missão, valores e cuidado humanizado em massoterapia e home spa." },
      { property: "og:title", content: "Sobre — Aline Home Spa Prime" },
      { property: "og:description", content: "Massoterapia com ética, acolhimento e profissionalismo." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container-spa grid gap-12 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">Sobre</p>
          <h1 className="font-display mt-3 text-4xl md:text-6xl text-primary">
            Cuidar é a nossa <span className="italic">essência</span>.
          </h1>
          <p className="mt-6 text-muted-foreground">
            A Aline Home Spa Prime oferece massoterapia clínica e home spa com um olhar
            atento, técnica refinada e um ambiente sereno. Acreditamos que cada pessoa
            merece um espaço de pausa, escuta e cuidado real.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-xl text-primary">Missão</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Promover bem-estar integral por meio de um cuidado ético, acolhedor e
                profissional.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-xl text-primary">Valores</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Acolhimento, respeito, profissionalismo, escuta e cuidado integral.
              </p>
            </div>
          </div>
          <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/contato">Agendar atendimento</Link>
          </Button>
        </div>
        <img
          src={aboutImg}
          alt="Detalhes de spa"
          width={1024}
          height={1024}
          loading="lazy"
          className="aspect-square w-full rounded-3xl object-cover shadow-xl"
        />
      </section>
    </SiteLayout>
  );
}
