import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

export const Route = createFileRoute("/admin/agenda")({
  component: AgendaPage,
});

const STATUS = {
  agendado: { label: "Agendado", variant: "default" as const },
  concluido: { label: "Concluído", variant: "secondary" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
};

const SERVICES = [
  "Massagem relaxante",
  "Massagem terapêutica",
  "Drenagem linfática",
  "Massagem com pedras quentes",
  "Reflexologia",
  "Home spa completo",
];

function AgendaPage() {
  const qc = useQueryClient();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const { data: appts, isLoading } = useQuery({
    queryKey: ["admin", "agenda", weekStart.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("scheduled_at", weekStart.toISOString())
        .lte("scheduled_at", addDays(weekEnd, 1).toISOString())
        .order("scheduled_at");
      if (error) throw error;
      return data as Appointment[];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("availability, blocked_dates").eq("id", true).maybeSingle();
      return data as { availability: Record<string, { enabled: boolean; start: string; end: string }>; blocked_dates: string[] } | null;
    },
  });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-primary">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Semana de {format(weekStart, "dd MMM", { locale: ptBR })} a{" "}
            {format(weekEnd, "dd MMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Plus className="mr-2 h-4 w-4" /> Novo atendimento
              </Button>
            </DialogTrigger>
            <NewAppointmentDialog onClose={() => setOpen(false)} />
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-7">
          {days.map((day) => {
            const dayAppts = (appts ?? []).filter(
              (a) => format(new Date(a.scheduled_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
            );
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            const dayKey = String(day.getDay());
            const av = settings?.availability?.[dayKey];
            const blocked = settings?.blocked_dates?.includes(format(day, "yyyy-MM-dd"));
            const unavailable = blocked || (av && !av.enabled);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[180px] rounded-2xl border bg-card p-3 ${isToday ? "border-gold" : "border-border"} ${unavailable ? "opacity-60" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {format(day, "EEE", { locale: ptBR })}
                    </p>
                    <p className={`font-display text-2xl ${isToday ? "text-gold" : "text-primary"}`}>
                      {format(day, "dd")}
                    </p>
                  </div>
                  {unavailable ? (
                    <Badge variant="outline" className="text-[10px]">{blocked ? "Bloqueado" : "Fechado"}</Badge>
                  ) : av ? (
                    <span className="text-[10px] text-muted-foreground">{av.start}–{av.end}</span>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {dayAppts.length === 0 && (
                    <p className="text-xs text-muted-foreground">Sem atendimentos.</p>
                  )}
                  {dayAppts.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setEditing(a)}
                      className="w-full rounded-lg border border-border bg-background p-2 text-left text-xs transition hover:border-gold"
                      title="Clique para editar"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">
                          {format(new Date(a.scheduled_at), "HH:mm")}
                        </span>
                        <Badge variant={STATUS[a.status].variant} className="text-[10px]">
                          {STATUS[a.status].label}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate font-medium text-foreground">{a.client_name}</p>
                      <p className="truncate text-muted-foreground">{a.service_type}</p>
                      {a.location && <p className="truncate text-muted-foreground">📍 {a.location}</p>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditAppointmentDialog
        appt={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          qc.invalidateQueries({ queryKey: ["admin", "agenda"] });
          qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
        }}
      />
    </div>
  );
}

function NewAppointmentDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [clientId, setClientId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: clients } = useQuery({
    queryKey: ["admin", "clients", "all"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, full_name").order("full_name");
      return (data ?? []) as Pick<Client, "id" | "full_name">[];
    },
  });

  async function save() {
    const finalName = clientId
      ? clients?.find((c) => c.id === clientId)?.full_name ?? clientName
      : clientName;
    if (!finalName.trim()) return toast.error("Informe ou selecione um cliente.");
    setBusy(true);
    const { error } = await supabase.from("appointments").insert({
      client_id: clientId || null,
      client_name: finalName,
      service_type: service,
      scheduled_at: new Date(`${date}T${time}`).toISOString(),
      location: location || null,
      notes: notes || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Atendimento agendado.");
    qc.invalidateQueries({ queryKey: ["admin", "agenda"] });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Novo atendimento</DialogTitle>
        <DialogDescription>Selecione cliente, serviço, data e horário.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label>Cliente existente</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
            <SelectContent>
              {(clients ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!clientId && (
          <div>
            <Label>Ou novo cliente (nome)</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
        )}
        <div>
          <Label>Tipo de serviço</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Horário</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Local (endereço)</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Rua, nº, bairro" />
        </div>
        <div>
          <Label>Observações</Label>
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} disabled={busy} className="bg-gold text-gold-foreground hover:bg-gold/90">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agendar"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditAppointmentDialog({
  appt, onClose, onSaved,
}: { appt: Appointment | null; onClose: () => void; onSaved: () => void }) {
  const [clientName, setClientName] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Appointment["status"]>("agendado");
  const [busy, setBusy] = useState(false);

  useMemo(() => {
    if (appt) {
      const d = new Date(appt.scheduled_at);
      setClientName(appt.client_name);
      setService(appt.service_type);
      setDate(format(d, "yyyy-MM-dd"));
      setTime(format(d, "HH:mm"));
      setLocation(appt.location ?? "");
      setNotes(appt.notes ?? "");
      setStatus(appt.status);
    }
  }, [appt]);

  if (!appt) return null;

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("appointments").update({
      client_name: clientName,
      service_type: service,
      scheduled_at: new Date(`${date}T${time}`).toISOString(),
      location: location || null,
      notes: notes || null,
      status,
    }).eq("id", appt!.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Atendimento atualizado.");
    onSaved();
  }

  async function remove() {
    if (!confirm("Excluir este atendimento?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", appt!.id);
    if (error) return toast.error(error.message);
    toast.success("Atendimento excluído.");
    onSaved();
  }

  return (
    <Dialog open={!!appt} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar atendimento</DialogTitle>
          <DialogDescription>Atualize os dados ou cancele este atendimento.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div>
            <Label>Tipo de serviço</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Horário</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Appointment["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Local (endereço)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
          <Button variant="destructive" onClick={remove}>Excluir</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={save} disabled={busy} className="bg-gold text-gold-foreground hover:bg-gold/90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
