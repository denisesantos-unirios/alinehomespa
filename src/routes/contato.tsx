import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, Instagram } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e Agendamento — Aline Home Spa Prime" },
      { name: "description", content: "Agende seu atendimento de massoterapia ou home spa. Fale conosco pelo WhatsApp, telefone ou e-mail." },
      { property: "og:title", content: "Contato — Aline Home Spa Prime" },
      { property: "og:description", content: "Agende seu atendimento com a Aline Home Spa Prime." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  mensagem: z.string().trim().min(5, "Conte um pouco sobre o que procura").max(1000),
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = schema.safeParse(data);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      toast.error("Verifique os campos destacados.");
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Recebemos sua mensagem! Entraremos em contato em breve.");
      e.currentTarget.reset();
    }, 800);
  }

  return (
    <SiteLayout>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container-spa">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">Contato</p>
          <h1 className="font-display mt-3 text-4xl md:text-6xl">Vamos cuidar de você?</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Envie uma mensagem ou fale direto pelo WhatsApp. Respondemos com atenção e
            carinho.
          </p>
        </div>
      </section>

      <section className="container-spa grid gap-10 py-16 md:grid-cols-5">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:col-span-3">
          <h2 className="font-display text-2xl text-primary">Solicitar agendamento</h2>
          <div className="mt-6 grid gap-5">
            <Field label="Nome completo" id="nome" error={errors.nome}>
              <Input id="nome" name="nome" placeholder="Seu nome" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Telefone / WhatsApp" id="telefone" error={errors.telefone}>
                <Input id="telefone" name="telefone" placeholder="(00) 00000-0000" inputMode="tel" />
              </Field>
              <Field label="E-mail" id="email" error={errors.email}>
                <Input id="email" name="email" type="email" placeholder="voce@email.com" />
              </Field>
            </div>
            <Field label="Mensagem" id="mensagem" error={errors.mensagem}>
              <Textarea id="mensagem" name="mensagem" rows={5} placeholder="Conte o que você procura — serviço, dia preferido, dúvidas." />
            </Field>
            <Button type="submit" disabled={loading} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {loading ? "Enviando..." : "Enviar mensagem"}
            </Button>
          </div>
        </form>

        <aside className="space-y-5 md:col-span-2">
          <a href="https://wa.me/5500000000000" target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:border-gold/60">
            <MessageCircle className="text-gold h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-display text-lg text-primary">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Atendimento direto e ágil. Toque para falar agora.</p>
            </div>
          </a>
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <Phone className="text-gold h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-display text-lg text-primary">Telefone</h3>
              <p className="text-sm text-muted-foreground">(00) 00000-0000</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <Mail className="text-gold h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-display text-lg text-primary">E-mail</h3>
              <p className="text-sm text-muted-foreground">contato@alinehomespaprime.com</p>
            </div>
          </div>
          <a href="https://instagram.com/alinehomespaprime" target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:border-gold/60">
            <Instagram className="text-gold h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-display text-lg text-primary">Instagram</h3>
              <p className="text-sm text-muted-foreground">@alinehomespaprime</p>
            </div>
          </a>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
