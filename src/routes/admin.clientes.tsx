import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Edit3, FileDown, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clientes")({
  component: Clientes,
});

const data = [
  { id: 1, nome: "Marina Silva", tel: "(11) 99999-1234", ultima: "12/05/2026", status: "Completa" },
  { id: 2, nome: "Carla Rocha", tel: "(11) 98888-5678", ultima: "08/05/2026", status: "Incompleta" },
  { id: 3, nome: "Júlia Martins", tel: "(11) 97777-9012", ultima: "30/04/2026", status: "Completa" },
  { id: 4, nome: "Patrícia Lima", tel: "(11) 96666-3456", ultima: "22/04/2026", status: "Completa" },
];

function Clientes() {
  const [q, setQ] = useState("");
  const rows = data.filter((d) => d.nome.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-primary">Clientes & Fichas</h1>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome..."
          className="max-w-xs"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Telefone</th>
              <th className="px-5 py-3">Última sessão</th>
              <th className="px-5 py-3">Ficha</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3 font-medium">{r.nome}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.tel}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.ultima}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${r.status === "Completa" ? "bg-gold/20 text-primary" : "bg-destructive/15 text-destructive"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" title="Ver ficha"><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" title="Editar"><Edit3 className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" title="Exportar PDF" onClick={() => toast.success("Ficha exportada")}>
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Apto para atendimento" onClick={() => toast.success("Marcado como apto")}>
                      <ShieldCheck className="text-gold h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
