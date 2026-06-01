import { createFileRoute } from "@tanstack/react-router";
import { Users, CalendarCheck, CalendarClock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const stats = [
  { label: "Total de clientes", value: 48, icon: Users },
  { label: "Atendimentos hoje", value: 3, icon: CalendarClock },
  { label: "Agendados na semana", value: 12, icon: CalendarCheck },
  { label: "Finalizados no mês", value: 27, icon: CheckCircle2 },
];

const proximos = [
  { hora: "09:00", cliente: "Marina Silva", servico: "Massagem Relaxante", local: "Domicílio" },
  { hora: "11:30", cliente: "Carla Rocha", servico: "Drenagem Linfática", local: "Clínica" },
  { hora: "15:00", cliente: "Júlia Martins", servico: "Pós-Operatório", local: "Domicílio" },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className="text-gold h-5 w-5" />
            </div>
            <p className="font-display mt-3 text-4xl text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <header className="border-b p-5">
          <h3 className="font-display text-xl text-primary">Próximos atendimentos de hoje</h3>
        </header>
        <ul className="divide-y">
          {proximos.map((p) => (
            <li key={p.hora} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {p.hora}
                </span>
                <div>
                  <p className="font-medium">{p.cliente}</p>
                  <p className="text-xs text-muted-foreground">{p.servico} • {p.local}</p>
                </div>
              </div>
              <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-primary">
                Agendado
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
