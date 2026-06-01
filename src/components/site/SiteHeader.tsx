import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
  { to: "/anamnese", label: "Área do Cliente" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-primary/95 backdrop-blur">
      <div className="container-spa flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Aline Home Spa Prime — Início">
          <Logo size="sm" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-gold data-[status=active]:text-gold"
            >
              {n.label}
            </Link>
          ))}
          <Button asChild className="ml-3 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/contato">Agendar</Link>
          </Button>
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-primary-foreground md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-primary-foreground/10 bg-primary md:hidden">
          <nav className="container-spa flex flex-col py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-primary-foreground/90 hover:bg-primary-foreground/10"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/contato" onClick={() => setOpen(false)}>
                Agendar atendimento
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
