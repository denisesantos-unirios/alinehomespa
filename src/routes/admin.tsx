import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aline Home Spa Prime" }] }),
  component: AdminLayout,
});

const items: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (!authed) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground">
        <div className="container-spa flex min-h-screen items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (user && pwd) setAuthed(true);
            }}
            className="w-full max-w-md rounded-3xl border border-primary-foreground/15 bg-primary/60 p-8 backdrop-blur"
          >
            <Logo size="md" />
            <h1 className="font-display mt-6 text-3xl">Área Administrativa</h1>
            <p className="mt-1 text-sm text-primary-foreground/70">
              Acesso restrito à terapeuta.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block text-sm">
                Usuário
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="mt-1 w-full rounded-md border border-primary-foreground/20 bg-primary/40 px-3 py-2 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                  placeholder="admin"
                />
              </label>
              <label className="block text-sm">
                Senha
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="mt-1 w-full rounded-md border border-primary-foreground/20 bg-primary/40 px-3 py-2 text-primary-foreground focus:border-gold focus:outline-none"
                  placeholder="••••••"
                />
              </label>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                Entrar
              </Button>
              <Link to="/" className="block text-center text-xs text-primary-foreground/60 hover:text-gold">
                Voltar ao site
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border p-5">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to as never}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-sidebar-accent text-gold"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setAuthed(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <header className="border-b bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="font-display text-xl text-primary">Painel Administrativo</h2>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Ver site</Link>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
