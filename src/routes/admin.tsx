import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut, Loader2, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Aline Home Spa Prime" }] }),
  component: AdminLayout,
});

const items: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clientes", label: "Clientes & Fichas", icon: Users },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {items.map((it) => {
        const active = it.exact ? path === it.to : path.startsWith(it.to);
        return (
          <Link
            key={it.to}
            to={it.to as never}
            onClick={onClick}
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
    </>
  );
}

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-primary-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-primary-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary p-6 text-primary-foreground">
        <div className="container-spa flex min-h-[80vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl text-gold">Acesso restrito</h1>
          <p className="mt-3 max-w-md text-primary-foreground/80">
            Sua conta não possui permissão administrativa. Entre em contato com a Aline para
            liberar o acesso.
          </p>
          <Button
            className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={() => supabase.auth.signOut()}
          >
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border p-5">
          <Logo size="sm" />
          <p className="mt-2 text-xs text-sidebar-foreground/60 truncate">{session.user.email}</p>
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
            onClick={() => supabase.auth.signOut()}
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
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              Ver site
            </Link>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;
        toast.success("Bem-vinda de volta!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: pwd,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Já pode entrar.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Não foi possível autenticar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="container-spa flex min-h-screen items-center justify-center">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl border border-primary-foreground/15 bg-primary/60 p-8 backdrop-blur"
        >
          <Logo size="md" />
          <h1 className="font-display mt-6 text-3xl">Área Administrativa</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            {mode === "signin" ? "Entre com sua conta de terapeuta." : "Crie a conta da terapeuta."}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-primary-foreground/90">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-primary-foreground/20 bg-primary/40 text-primary-foreground placeholder:text-primary-foreground/40"
                placeholder="aline@email.com"
              />
            </div>
            <div>
              <Label htmlFor="pwd" className="text-primary-foreground/90">Senha</Label>
              <Input
                id="pwd"
                type="password"
                value={pwd}
                required
                minLength={6}
                onChange={(e) => setPwd(e.target.value)}
                className="mt-1 border-primary-foreground/20 bg-primary/40 text-primary-foreground"
                placeholder="••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Entrar" : "Criar conta"}
            </Button>
            <button
              type="button"
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              className="block w-full text-center text-xs text-primary-foreground/70 hover:text-gold"
            >
              {mode === "signin" ? "Primeiro acesso? Criar conta" : "Já tenho conta · Entrar"}
            </button>
            <Link to="/" className="block text-center text-xs text-primary-foreground/60 hover:text-gold">
              Voltar ao site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
