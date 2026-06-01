import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/agenda")({
  component: Agenda,
});

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const horas = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const agendamentos: Record<string, { cliente: string; servico: string; status: string }> = {
  "Seg-09:00": { cliente: "Marina S.", servico: "Relaxante", status: "agendado" },
  "Ter-11:00": { cliente: "Carla R.", servico: "Drenagem", status: "agendado" },
  "Qua-15:00": { cliente: "Júlia M.", servico: "Pós-Op", status: "concluído" },
  "Sex-16:00": { cliente: "Patrícia L.", servico: "Home Spa", status: "agendado" },
};

function Agenda() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-primary">Agenda da semana</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Horário</th>
              {dias.map((d) => <th key={d} className="p-3 text-left">{d}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y">
            {horas.map((h) => (
              <tr key={h}>
                <td className="p-3 font-medium text-muted-foreground">{h}</td>
                {dias.map((d) => {
                  const a = agendamentos[`${d}-${h}`];
                  return (
                    <td key={d} className="p-2 align-top">
                      {a ? (
                        <div className={`rounded-md p-2 text-xs ${a.status === "concluído" ? "bg-primary/10 text-primary" : "bg-gold/20 text-primary"}`}>
                          <p className="font-semibold">{a.cliente}</p>
                          <p className="opacity-80">{a.servico}</p>
                        </div>
                      ) : (
                        <button className="h-full w-full rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-gold hover:text-gold">
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
