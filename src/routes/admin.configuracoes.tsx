import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/configuracoes")({
  component: Config,
});

const WEEKDAYS = [
  { key: "0", label: "Domingo" },
  { key: "1", label: "Segunda" },
  { key: "2", label: "Terça" },
  { key: "3", label: "Quarta" },
  { key: "4", label: "Quinta" },
  { key: "5", label: "Sexta" },
  { key: "6", label: "Sábado" },
];

type Settings = {
  clinic_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  confirmation_message: string;
  availability: Record<string, { enabled: boolean; start: string; end: string }>;
  blocked_dates: string[];
};

function Config() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [newBlock, setNewBlock] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data as any as Settings;
    },
  });

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading || !form) {
    return <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;
  }

  const upd = (k: keyof Settings, v: any) => setForm((f) => f && ({ ...f, [k]: v }));
  const updDay = (key: string, patch: Partial<Settings["availability"][string]>) =>
    setForm((f) => f && ({ ...f, availability: { ...f.availability, [key]: { ...f.availability[key], ...patch } } }));

  async function save() {
    if (!form) return;
    setBusy(true);
    const { error } = await supabase.from("settings").update({
      clinic_name: form.clinic_name,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      instagram: form.instagram,
      confirmation_message: form.confirmation_message,
      availability: form.availability,
      blocked_dates: form.blocked_dates,
    }).eq("id", true);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Configurações salvas.");
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
  }

  function addBlock() {
    if (!newBlock) return;
    if (form!.blocked_dates.includes(newBlock)) return;
    upd("blocked_dates", [...form!.blocked_dates, newBlock].sort());
    setNewBlock("");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl text-primary">Configurações</h1>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Dados da clínica</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Nome" value={form.clinic_name} onChange={(v) => upd("clinic_name", v)} />
          <Field label="Telefone" value={form.phone ?? ""} onChange={(v) => upd("phone", v)} />
          <Field label="WhatsApp" value={form.whatsapp ?? ""} onChange={(v) => upd("whatsapp", v)} />
          <Field label="E-mail" value={form.email ?? ""} onChange={(v) => upd("email", v)} />
          <Field label="Instagram" value={form.instagram ?? ""} onChange={(v) => upd("instagram", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Mensagem padrão de confirmação</h2>
        <Label className="mt-4 block text-sm">Texto enviado por WhatsApp/E-mail</Label>
        <Textarea
          rows={5}
          className="mt-1.5"
          value={form.confirmation_message}
          onChange={(e) => upd("confirmation_message", e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Disponibilidade semanal</h2>
        <p className="text-sm text-muted-foreground">Defina os dias e horários em que você atende.</p>
        <div className="mt-5 space-y-3">
          {WEEKDAYS.map((d) => {
            const day = form.availability[d.key] ?? { enabled: false, start: "09:00", end: "18:00" };
            return (
              <div key={d.key} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-3">
                <Switch checked={day.enabled} onCheckedChange={(v) => updDay(d.key, { enabled: v })} />
                <span className="min-w-24 text-sm font-medium">{d.label}</span>
                {day.enabled ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input type="time" value={day.start} onChange={(e) => updDay(d.key, { start: e.target.value })} className="w-32" />
                    <span className="text-muted-foreground">até</span>
                    <Input type="time" value={day.end} onChange={(e) => updDay(d.key, { end: e.target.value })} className="w-32" />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Fechado</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Datas bloqueadas</h2>
        <p className="text-sm text-muted-foreground">Feriados, folgas e dias indisponíveis.</p>
        <div className="mt-4 flex gap-2">
          <Input type="date" value={newBlock} onChange={(e) => setNewBlock(e.target.value)} className="max-w-xs" />
          <Button type="button" variant="outline" onClick={addBlock}><Plus className="mr-1 h-4 w-4" /> Adicionar</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {form.blocked_dates.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma data bloqueada.</p>
          )}
          {form.blocked_dates.map((d) => (
            <Badge key={d} variant="secondary" className="gap-1 py-1.5">
              {new Date(d + "T00:00:00").toLocaleDateString("pt-BR")}
              <button type="button" onClick={() => upd("blocked_dates", form.blocked_dates.filter((x) => x !== d))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={busy} className="bg-gold text-gold-foreground hover:bg-gold/90">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar alterações"}
      </Button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
    </div>
  );
}
