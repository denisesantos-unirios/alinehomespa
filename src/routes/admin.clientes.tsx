import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, FileDown, Pencil, Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { exportAnamnesisPDF } from "@/lib/anamnese-pdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export const Route = createFileRoute("/admin/clientes")({
  component: ClientsPage,
});

const STATUS_LABEL = {
  pendente: { label: "Pendente", variant: "secondary" as const },
  apto: { label: "Apto", variant: "default" as const },
  requer_avaliacao: { label: "Requer avaliação médica", variant: "destructive" as const },
};

function ClientsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [completeFilter, setCompleteFilter] = useState<string>("todos");
  const [viewing, setViewing] = useState<Client | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
  });

  const filtered = useMemo(() => {
    return (data ?? []).filter((c) => {
      if (search && !c.full_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "todos" && c.fitness_status !== statusFilter) return false;
      if (completeFilter === "completa" && !c.anamnesis_complete) return false;
      if (completeFilter === "incompleta" && c.anamnesis_complete) return false;
      return true;
    });
  }, [data, search, statusFilter, completeFilter]);

  async function remove(c: Client) {
    if (!confirm(`Excluir a ficha de ${c.full_name}?`)) return;
    const { error } = await supabase.from("clients").delete().eq("id", c.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Ficha excluída.");
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-primary">Clientes & Fichas</h1>
          <p className="text-sm text-muted-foreground">Gerencie as fichas de anamnese.</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="apto">Aptos</SelectItem>
            <SelectItem value="requer_avaliacao">Requer avaliação</SelectItem>
          </SelectContent>
        </Select>
        <Select value={completeFilter} onValueChange={setCompleteFilter}>
          <SelectTrigger><SelectValue placeholder="Ficha" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as fichas</SelectItem>
            <SelectItem value="completa">Completas</SelectItem>
            <SelectItem value="incompleta">Incompletas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Última sessão</th>
              <th className="px-4 py-3">Ficha</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={6} className="p-8 text-center">
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold" />
              </td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">
                Nenhum cliente encontrado.
              </td></tr>
            )}
            {filtered.map((c) => {
              const s = STATUS_LABEL[c.fitness_status];
              return (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Cadastrado em {format(new Date(c.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <p>{c.phone ?? "—"}</p>
                    <p className="text-xs">{c.email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.last_session_at
                      ? format(new Date(c.last_session_at), "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.anamnesis_complete ? "default" : "secondary"}>
                      {c.anamnesis_complete ? "Completa" : "Incompleta"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" title="Ver ficha" onClick={() => setViewing(c)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Editar" onClick={() => setEditing(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Exportar PDF" onClick={() => exportAnamnesisPDF(c)}>
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" title="Excluir" onClick={() => remove(c)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ViewDialog client={viewing} onClose={() => setViewing(null)} />
      <EditDialog
        client={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          qc.invalidateQueries({ queryKey: ["admin", "clients"] });
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  const v = value === undefined || value === null || value === "" ? "—"
    : Array.isArray(value) ? (value.length ? value.join(", ") : "—")
    : typeof value === "object" ? Object.entries(value).filter(([,x]) => x === "sim").map(([k]) => k).join(", ") || "Nenhuma"
    : String(value);
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border py-2 text-sm last:border-0">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground">{v}</dd>
    </div>
  );
}

function ViewDialog({ client, onClose }: { client: Client | null; onClose: () => void }) {
  if (!client) return null;
  const a = (client.anamnesis ?? {}) as any;
  return (
    <Dialog open={!!client} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">{client.full_name}</DialogTitle>
          <DialogDescription>Ficha de anamnese — modo leitura</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Section title="Identificação">
            <Row label="Nascimento" value={a.nascimento ?? client.birth_date} />
            <Row label="Idade" value={a.idade} />
            <Row label="Sexo" value={a.sexo} />
            <Row label="Estado civil" value={a.estadoCivil} />
            <Row label="Telefone" value={client.phone} />
            <Row label="WhatsApp" value={client.whatsapp} />
            <Row label="E-mail" value={client.email} />
            <Row label="Endereço" value={a.endereco} />
            <Row label="Profissão" value={a.profissao} />
            <Row label="Contato emergência" value={`${a.emerg ?? "—"} ${a.emergTel ?? ""}`} />
          </Section>
          <Section title="Objetivo e queixa">
            <Row label="Objetivos" value={a.objetivos} />
            <Row label="Outro objetivo" value={a.outroObj} />
            <Row label="Queixa principal" value={a.queixa} />
          </Section>
          <Section title="Saúde">
            <Row label="Condições" value={a.saude} />
            <Row label="Observações" value={a.saudeExp} />
            <Row label="Cirurgia" value={a.cirurgia} />
            <Row label="Quais" value={a.cirurgiaQuais} />
            <Row label="Medicamentos" value={a.medicamentos} />
            <Row label="Quais" value={a.medQuais} />
          </Section>
          <Section title="Hábitos">
            <Row label="Atividade física" value={a.ativ} />
            <Row label="Frequência" value={a.ativFreq} />
            <Row label="Sono" value={a.sono} />
            <Row label="Estresse" value={a.estresse} />
            <Row label="Água" value={a.agua} />
            <Row label="Fuma" value={a.fuma} />
            <Row label="Álcool" value={a.alcool} />
          </Section>
          <Section title="Dor e avaliação">
            <Row label="Apresenta dor" value={a.dores} />
            <Row label="Local" value={a.doresLoc} />
            <Row label="Intensidade" value={a.doresInt} />
            <Row label="Há quanto tempo" value={a.doresTempo} />
            <Row label="Tensão muscular" value={a.tensao} />
            <Row label="Regiões com tensão" value={a.tensaoReg} />
          </Section>
          <Section title="Preferências">
            <Row label="Bebida" value={a.bebida} />
            <Row label="Sabor" value={a.sabor} />
            <Row label="Açúcar" value={a.acucar} />
            <Row label="Restrição alimentar" value={a.restricao} />
          </Section>
          <Section title="Anotações da terapeuta">
            <Row label="Observações" value={client.therapist_notes} />
          </Section>
        </div>
        <DialogFooter>
          <Button onClick={() => exportAnamnesisPDF(client)} variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button onClick={onClose} className="bg-primary text-primary-foreground">Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-lg text-primary">{title}</h3>
      <dl className="mt-2 rounded-lg border border-border bg-background px-4">{children}</dl>
    </section>
  );
}

function EditDialog({
  client, onClose, onSaved,
}: { client: Client | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useMemo(() => {
    if (client) {
      const a = (client.anamnesis ?? {}) as any;
      setForm({
        full_name: client.full_name ?? "",
        phone: client.phone ?? "",
        whatsapp: client.whatsapp ?? "",
        email: client.email ?? "",
        birth_date: client.birth_date ?? "",
        therapist_notes: client.therapist_notes ?? "",
        fitness_status: client.fitness_status,
        last_session: client.last_session_at
          ? format(new Date(client.last_session_at), "yyyy-MM-dd")
          : "",
        sexo: a.sexo ?? "",
        estadoCivil: a.estadoCivil ?? "",
        profissao: a.profissao ?? "",
        endereco: a.endereco ?? "",
        emerg: a.emerg ?? "",
        emergTel: a.emergTel ?? "",
        queixa: a.queixa ?? "",
        saudeExp: a.saudeExp ?? "",
        medQuais: a.medQuais ?? "",
        cirurgiaQuais: a.cirurgiaQuais ?? "",
      });
    }
  }, [client]);

  if (!client || !form) return null;
  const upd = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    const a = { ...((client!.anamnesis ?? {}) as any) };
    [
      "sexo", "estadoCivil", "profissao", "endereco", "emerg", "emergTel",
      "queixa", "saudeExp", "medQuais", "cirurgiaQuais",
    ].forEach((k) => { a[k] = form[k] || ""; });
    a.nascimento = form.birth_date || a.nascimento;

    const { error } = await supabase
      .from("clients")
      .update({
        full_name: form.full_name,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        birth_date: form.birth_date || null,
        therapist_notes: form.therapist_notes,
        fitness_status: form.fitness_status,
        last_session_at: form.last_session ? new Date(form.last_session).toISOString() : null,
        anamnesis: a,
      })
      .eq("id", client!.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Ficha atualizada.");
    onSaved();
  }

  return (
    <Dialog open={!!client} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar ficha — {client.full_name}</DialogTitle>
          <DialogDescription>Atualize dados pessoais, anamnese e avaliação clínica.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <section className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Identificação</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Nome completo</Label>
                <Input value={form.full_name} onChange={(e) => upd("full_name", e.target.value)} /></div>
              <div><Label>Telefone</Label>
                <Input value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></div>
              <div><Label>WhatsApp</Label>
                <Input value={form.whatsapp} onChange={(e) => upd("whatsapp", e.target.value)} /></div>
              <div><Label>E-mail</Label>
                <Input value={form.email} onChange={(e) => upd("email", e.target.value)} /></div>
              <div><Label>Nascimento</Label>
                <Input value={form.birth_date} onChange={(e) => upd("birth_date", e.target.value)} placeholder="dd/mm/aaaa" /></div>
              <div><Label>Sexo</Label>
                <Select value={form.sexo} onValueChange={(v) => upd("sexo", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select></div>
              <div><Label>Estado civil</Label>
                <Select value={form.estadoCivil} onValueChange={(v) => upd("estadoCivil", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="União estável">União estável</SelectItem>
                  </SelectContent>
                </Select></div>
              <div><Label>Profissão</Label>
                <Input value={form.profissao} onChange={(e) => upd("profissao", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Endereço</Label>
                <Input value={form.endereco} onChange={(e) => upd("endereco", e.target.value)} /></div>
              <div><Label>Contato emergência</Label>
                <Input value={form.emerg} onChange={(e) => upd("emerg", e.target.value)} /></div>
              <div><Label>Tel. emergência</Label>
                <Input value={form.emergTel} onChange={(e) => upd("emergTel", e.target.value)} /></div>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Anamnese</h4>
            <div><Label>Queixa principal</Label>
              <Textarea rows={2} value={form.queixa} onChange={(e) => upd("queixa", e.target.value)} /></div>
            <div><Label>Observações de saúde</Label>
              <Textarea rows={2} value={form.saudeExp} onChange={(e) => upd("saudeExp", e.target.value)} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Medicamentos</Label>
                <Input value={form.medQuais} onChange={(e) => upd("medQuais", e.target.value)} /></div>
              <div><Label>Cirurgias</Label>
                <Input value={form.cirurgiaQuais} onChange={(e) => upd("cirurgiaQuais", e.target.value)} /></div>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Avaliação da terapeuta</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Status</Label>
                <Select value={form.fitness_status} onValueChange={(v) => upd("fitness_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="apto">Apto para atendimento</SelectItem>
                    <SelectItem value="requer_avaliacao">Requer avaliação médica</SelectItem>
                  </SelectContent>
                </Select></div>
              <div><Label>Última sessão</Label>
                <Input type="date" value={form.last_session} onChange={(e) => upd("last_session", e.target.value)} /></div>
            </div>
            <div><Label>Observações</Label>
              <Textarea rows={4} value={form.therapist_notes} onChange={(e) => upd("therapist_notes", e.target.value)} /></div>
          </section>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} disabled={busy} className="bg-gold text-gold-foreground hover:bg-gold/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
