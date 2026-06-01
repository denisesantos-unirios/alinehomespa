import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/configuracoes")({
  component: Config,
});

function Config() {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); toast.success("Configurações salvas."); }}
      className="max-w-3xl space-y-6"
    >
      <h1 className="font-display text-3xl text-primary">Configurações</h1>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Dados da clínica</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Item label="Nome" defaultValue="Aline Home Spa Prime" />
          <Item label="Telefone" defaultValue="(00) 00000-0000" />
          <Item label="WhatsApp" defaultValue="(00) 00000-0000" />
          <Item label="E-mail" defaultValue="contato@alinehomespaprime.com" />
          <Item label="Instagram" defaultValue="@alinehomespaprime" />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl text-primary">Mensagem padrão de confirmação</h2>
        <Label className="mt-4 block text-sm">Texto enviado por WhatsApp/E-mail</Label>
        <Textarea
          rows={5}
          className="mt-1.5"
          defaultValue="Olá! Confirmando seu atendimento na Aline Home Spa Prime no dia [data] às [hora]. Em caso de dúvidas, é só responder esta mensagem. ✨"
        />
      </div>
      <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">
        Salvar alterações
      </Button>
    </form>
  );
}

function Item({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Input defaultValue={defaultValue} className="mt-1.5" />
    </div>
  );
}
