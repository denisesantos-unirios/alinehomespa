import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-spa grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size="md" />
          <p className="mt-5 max-w-sm text-sm text-primary-foreground/70">
            Massoterapia clínica e home spa com atendimento acolhedor, sofisticado e
            personalizado. Cuidado integral para o seu bem-estar.
          </p>
        </div>
        <div>
          <h4 className="text-gold text-sm font-semibold uppercase tracking-widest">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Início" },
              { to: "/servicos", label: "Serviços" },
              { to: "/sobre", label: "Sobre" },
              { to: "/contato", label: "Contato" },
              { to: "/anamnese", label: "Área do Cliente" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gold text-sm font-semibold uppercase tracking-widest">
            Contato
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" /> (00) 00000-0000
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> contato@alinehomespaprime.com
            </li>
            <li>
              <a
                href="https://instagram.com/alinehomespaprime"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:underline"
              >
                <Instagram className="h-4 w-4" /> @alinehomespaprime
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-spa flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Aline Home Spa Prime. Todos os direitos reservados.</p>
          <p>Política de privacidade</p>
        </div>
      </div>
    </footer>
  );
}
