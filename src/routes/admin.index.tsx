import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d = new Date()) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
function endOfWeek(d = new Date()) { const x = endOfDay(d); x.setDate(x.getDate() + (7 - x.getDay())); return x; }

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const now = new Date();
      const sod = startOfDay(now).toISOString();
      const eod = endOfDay(now).toISOString();
      const eow = endOfWeek(now).toISOString();

      const [clients, today, week, done, upcoming] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_at", sod)
          .lte("scheduled_at", eod)
          .eq("status", "agendado"),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_at", sod)
          .lte("scheduled_at", eow)
          .eq("status", "agendado"),
        supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("status", "concluido"),
        supabase
          .from("appointments")
          .select("id, client_name, service_type, scheduled_at, location, status")
          .gte("scheduled_at", sod)
          .lte("scheduled_at", eod)
          .order("scheduled_at"),
      ]);

      return {
        totalClients: clients.count ?? 0,
        today: today.count ?? 0,
        week: week.count ?? 0,
        done: done.count ?? 0,
        upcoming: upcoming.data ?? [],
      };
    },
  });

  const cards = [
    { label: "Total de clientes", value: stats?.totalClients ?? "—", icon: Users },
    { label: "Atendimentos hoje", value: stats?.today ?? "—", icon: Clock },
    { label: "Agendados na semana", value: stats?.week ?? "—", icon: CalendarDays },
    { label: "Atendimentos finalizados", value: stats?.done ?? "—", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-primary">Olá, Aline 🌿</h1>
        <p className="text-sm text-muted-foreground">Resumo do dia e da semana.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <c.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="mt-3 font-display text-4xl text-primary">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-primary">Próximos atendimentos de hoje</h2>
          <Link to="/admin/agenda" className="text-sm text-gold hover:underline">Ver agenda completa</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {stats?.upcoming.length ? (
            stats.upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">{a.client_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.service_type} · {a.location ?? "Local não informado"}
                  </p>
                </div>
                <p className="text-sm font-medium text-primary">
                  {format(new Date(a.scheduled_at), "HH:mm", { locale: ptBR })}
                </p>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum atendimento agendado para hoje.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
