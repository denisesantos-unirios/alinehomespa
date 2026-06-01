import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/anamnese")({
  head: () => ({
    meta: [
      { title: "Ficha de Anamnese — Aline Home Spa Prime" },
      { name: "description", content: "Preencha sua ficha de anamnese de massoterapia clínica com segurança e tranquilidade." },
    ],
  }),
  component: AnamnesePage,
});

const STEPS = ["Identificação", "Saúde", "Hábitos & Dor", "Preferências & Termo"] as const;

const HEALTH_CONDITIONS = [
  "Hipertensão", "Hipotensão", "Diabetes", "Problemas cardíacos", "Insuficiência cardíaca",
  "Trombose", "Varizes", "Problemas circulatórios", "Problemas respiratórios", "Asma",
  "Ansiedade", "Depressão", "Fibromialgia", "Hérnia de disco", "Osteoporose",
  "Artrite/Artrose", "Enxaqueca", "Epilepsia", "Labirintite", "Problemas renais",
  "Problemas hepáticos", "Alergias", "Doença autoimune", "Gestação", "Processo oncológico",
  "Quimio/Radioterapia", "Prótese metálica", "Marca-passo",
];

const OBJETIVOS = [
  "Relaxamento", "Alívio de dores musculares", "Redução de estresse e ansiedade",
  "Tratamento terapêutico", "Recuperação muscular", "Drenagem", "Pós-operatório",
  "Bem-estar geral",
];

// helpers
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => [a && `(${a}`, a && a.length === 2 ? ") " : "", b, c && `-${c}`].filter(Boolean).join(""));
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
}
function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) => [a, b && `.${b}`, c && `.${c}`, d && `-${d}`].filter(Boolean).join(""));
}
function maskDate(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{2})(\d{2})(\d{0,4})/, (_, a, b, c) => [a, b && `/${b}`, c && `/${c}`].filter(Boolean).join(""));
}
function ageFromDate(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, d, mo, y] = m;
  const birth = new Date(+y, +mo - 1, +d);
  if (isNaN(birth.getTime())) return "";
  const t = new Date();
  let age = t.getFullYear() - birth.getFullYear();
  const md = t.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && t.getDate() < birth.getDate())) age--;
  return age >= 0 && age < 130 ? String(age) : "";
}

interface FormData {
  [k: string]: any;
}

function AnamnesePage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    objetivos: [] as string[],
    saude: {} as Record<string, "sim" | "nao">,
  });

  const set = (k: string, v: any) => setData((d) => ({ ...d, [k]: v }));
  const progress = ((step + 1) / STEPS.length) * 100;

  function next() {
    // simple required validation per step
    if (step === 0) {
      const need = ["nome", "nascimento", "cpf", "telefone", "email"];
      const miss = need.filter((k) => !String(data[k] ?? "").trim());
      if (miss.length) return toast.error("Preencha todos os campos obrigatórios.");
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function saveDraft() {
    try {
      localStorage.setItem("anamnese-draft", JSON.stringify(data));
      toast.success("Rascunho salvo com sucesso.");
    } catch {
      toast.error("Não foi possível salvar o rascunho.");
    }
  }
  function submit() {
    if (!data.aceitaTermo || !data.assinatura?.trim()) {
      return toast.error("Confirme o termo e informe sua assinatura.");
    }
    toast.success("Ficha enviada! A terapeuta entrará em contato em breve.");
    localStorage.removeItem("anamnese-draft");
    setData({ objetivos: [], saude: {} });
    setStep(0);
  }

  return (
    <SiteLayout>
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container-spa">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.25em]">Área do Cliente</p>
          <h1 className="font-display mt-2 text-3xl md:text-5xl">Ficha de Anamnese — Massoterapia Clínica</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            Suas respostas nos ajudam a oferecer um atendimento mais seguro e personalizado.
            Você pode salvar como rascunho a qualquer momento.
          </p>
        </div>
      </section>

      <section className="container-spa py-10">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Etapa {step + 1} de {STEPS.length}
              </p>
              <h2 className="font-display mt-1 text-2xl text-primary">{STEPS[step]}</h2>
            </div>
            <Button variant="outline" onClick={saveDraft} className="gap-2">
              <Save className="h-4 w-4" /> Salvar rascunho
            </Button>
          </div>
          <Progress value={progress} className="mt-5" />

          <div className="mt-8 space-y-6">
            {step === 0 && <StepIdentificacao data={data} set={set} />}
            {step === 1 && <StepSaude data={data} set={set} />}
            {step === 2 && <StepHabitos data={data} set={set} />}
            {step === 3 && <StepTermo data={data} set={set} />}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} className="bg-gold text-gold-foreground hover:bg-gold/90 gap-2">
                <ShieldCheck className="h-4 w-4" /> Enviar ficha
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, htmlFor, children, hint }: any) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StepIdentificacao({ data, set }: any) {
  const idade = useMemo(() => ageFromDate(data.nascimento ?? ""), [data.nascimento]);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Nome completo *" htmlFor="nome">
        <Input id="nome" value={data.nome ?? ""} onChange={(e) => set("nome", e.target.value)} />
      </Field>
      <Field label="Data de nascimento *" htmlFor="nascimento" hint="dd/mm/aaaa">
        <Input id="nascimento" inputMode="numeric" value={data.nascimento ?? ""} onChange={(e) => set("nascimento", maskDate(e.target.value))} placeholder="dd/mm/aaaa" />
      </Field>
      <Field label="Idade" htmlFor="idade">
        <Input id="idade" value={idade} readOnly className="bg-muted" />
      </Field>
      <Field label="Sexo" htmlFor="sexo">
        <Input id="sexo" value={data.sexo ?? ""} onChange={(e) => set("sexo", e.target.value)} placeholder="Feminino / Masculino / Outro" />
      </Field>
      <Field label="CPF *" htmlFor="cpf">
        <Input id="cpf" inputMode="numeric" value={data.cpf ?? ""} onChange={(e) => set("cpf", maskCPF(e.target.value))} placeholder="000.000.000-00" />
      </Field>
      <Field label="RG" htmlFor="rg">
        <Input id="rg" value={data.rg ?? ""} onChange={(e) => set("rg", e.target.value)} />
      </Field>
      <Field label="Telefone *" htmlFor="telefone">
        <Input id="telefone" inputMode="tel" value={data.telefone ?? ""} onChange={(e) => set("telefone", maskPhone(e.target.value))} placeholder="(00) 00000-0000" />
      </Field>
      <Field label="WhatsApp" htmlFor="whatsapp">
        <Input id="whatsapp" inputMode="tel" value={data.whatsapp ?? ""} onChange={(e) => set("whatsapp", maskPhone(e.target.value))} placeholder="(00) 00000-0000" />
      </Field>
      <Field label="E-mail *" htmlFor="email">
        <Input id="email" type="email" value={data.email ?? ""} onChange={(e) => set("email", e.target.value)} />
      </Field>
      <Field label="Endereço" htmlFor="endereco">
        <Input id="endereco" value={data.endereco ?? ""} onChange={(e) => set("endereco", e.target.value)} />
      </Field>
      <Field label="Profissão" htmlFor="profissao">
        <Input id="profissao" value={data.profissao ?? ""} onChange={(e) => set("profissao", e.target.value)} />
      </Field>
      <Field label="Estado civil" htmlFor="estadoCivil">
        <Input id="estadoCivil" value={data.estadoCivil ?? ""} onChange={(e) => set("estadoCivil", e.target.value)} />
      </Field>
      <Field label="Contato de emergência" htmlFor="emerg">
        <Input id="emerg" value={data.emerg ?? ""} onChange={(e) => set("emerg", e.target.value)} />
      </Field>
      <Field label="Telefone de emergência" htmlFor="emergTel">
        <Input id="emergTel" inputMode="tel" value={data.emergTel ?? ""} onChange={(e) => set("emergTel", maskPhone(e.target.value))} />
      </Field>
    </div>
  );
}

function StepSaude({ data, set }: any) {
  const objetivos: string[] = data.objetivos ?? [];
  const saude: Record<string, "sim" | "nao"> = data.saude ?? {};

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl text-primary">Objetivo do atendimento</h3>
        <p className="text-sm text-muted-foreground">Selecione todas as opções que se aplicam.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OBJETIVOS.map((o) => {
            const checked = objetivos.includes(o);
            return (
              <label key={o} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-gold/60">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    const next = v ? [...objetivos, o] : objetivos.filter((x) => x !== o);
                    set("objetivos", next);
                  }}
                />
                <span className="text-sm">{o}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4">
          <Field label="Outro objetivo" htmlFor="outroObj">
            <Input id="outroObj" value={data.outroObj ?? ""} onChange={(e) => set("outroObj", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl text-primary">Queixa principal</h3>
        <Textarea className="mt-3" rows={4} value={data.queixa ?? ""} onChange={(e) => set("queixa", e.target.value)} placeholder="Descreva sua principal queixa ou desconforto." />
      </div>

      <div>
        <h3 className="font-display text-xl text-primary">Histórico de saúde</h3>
        <p className="text-sm text-muted-foreground">Para cada condição, indique Sim ou Não.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {HEALTH_CONDITIONS.map((c) => (
            <div key={c} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className="text-sm">{c}</span>
              <RadioGroup
                className="flex gap-3"
                value={saude[c] ?? ""}
                onValueChange={(v) => set("saude", { ...saude, [c]: v as "sim" | "nao" })}
              >
                <label className="flex items-center gap-1 text-xs">
                  <RadioGroupItem value="sim" id={`${c}-s`} /> Sim
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <RadioGroupItem value="nao" id={`${c}-n`} /> Não
                </label>
              </RadioGroup>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Se sim, explique" htmlFor="saudeExp">
            <Textarea id="saudeExp" rows={3} value={data.saudeExp ?? ""} onChange={(e) => set("saudeExp", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Já realizou alguma cirurgia?" htmlFor="cirurgia">
          <RadioGroup className="flex gap-4" value={data.cirurgia ?? ""} onValueChange={(v) => set("cirurgia", v)}>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
          </RadioGroup>
        </Field>
        {data.cirurgia === "sim" && (
          <>
            <Field label="Quais?" htmlFor="cirurgiaQuais">
              <Input id="cirurgiaQuais" value={data.cirurgiaQuais ?? ""} onChange={(e) => set("cirurgiaQuais", e.target.value)} />
            </Field>
            <Field label="Data aproximada" htmlFor="cirurgiaData">
              <Input id="cirurgiaData" value={data.cirurgiaData ?? ""} onChange={(e) => set("cirurgiaData", e.target.value)} />
            </Field>
          </>
        )}
        <Field label="Uso contínuo de medicamentos?" htmlFor="medicamentos">
          <RadioGroup className="flex gap-4" value={data.medicamentos ?? ""} onValueChange={(v) => set("medicamentos", v)}>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
          </RadioGroup>
        </Field>
        {data.medicamentos === "sim" && (
          <Field label="Quais?" htmlFor="medQuais">
            <Input id="medQuais" value={data.medQuais ?? ""} onChange={(e) => set("medQuais", e.target.value)} />
          </Field>
        )}
      </div>
    </div>
  );
}

function StepHabitos({ data, set }: any) {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Pratica atividade física?" htmlFor="ativ">
          <RadioGroup className="flex gap-4" value={data.ativ ?? ""} onValueChange={(v) => set("ativ", v)}>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
          </RadioGroup>
        </Field>
        {data.ativ === "sim" && (
          <Field label="Qual frequência?" htmlFor="ativFreq">
            <Input id="ativFreq" value={data.ativFreq ?? ""} onChange={(e) => set("ativFreq", e.target.value)} placeholder="Ex: 3x por semana" />
          </Field>
        )}
        <Field label="Qualidade do sono" htmlFor="sono">
          <RadioGroup className="flex flex-wrap gap-3" value={data.sono ?? ""} onValueChange={(v) => set("sono", v)}>
            {["Excelente", "Boa", "Regular", "Ruim"].map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm"><RadioGroupItem value={o} /> {o}</label>
            ))}
          </RadioGroup>
        </Field>
        <Field label="Nível de estresse" htmlFor="estresse">
          <RadioGroup className="flex gap-3" value={data.estresse ?? ""} onValueChange={(v) => set("estresse", v)}>
            {["Baixo", "Moderado", "Alto"].map((o) => (
              <label key={o} className="flex items-center gap-2 text-sm"><RadioGroupItem value={o} /> {o}</label>
            ))}
          </RadioGroup>
        </Field>
        <Field label="Consumo de água por dia" htmlFor="agua">
          <Input id="agua" value={data.agua ?? ""} onChange={(e) => set("agua", e.target.value)} placeholder="Ex: 2 litros" />
        </Field>
        <Field label="Fuma?" htmlFor="fuma">
          <RadioGroup className="flex gap-4" value={data.fuma ?? ""} onValueChange={(v) => set("fuma", v)}>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
          </RadioGroup>
        </Field>
        <Field label="Consome bebida alcoólica?" htmlFor="alcool">
          <RadioGroup className="flex gap-4" value={data.alcool ?? ""} onValueChange={(v) => set("alcool", v)}>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
          </RadioGroup>
        </Field>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-display text-xl text-primary">Avaliação corporal e dor</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Apresenta dores?" htmlFor="dores">
            <RadioGroup className="flex gap-4" value={data.dores ?? ""} onValueChange={(v) => set("dores", v)}>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
            </RadioGroup>
          </Field>
          {data.dores === "sim" && (
            <>
              <Field label="Localização da dor" htmlFor="doresLoc">
                <Input id="doresLoc" value={data.doresLoc ?? ""} onChange={(e) => set("doresLoc", e.target.value)} />
              </Field>
              <Field label="Intensidade" htmlFor="doresInt">
                <RadioGroup className="flex gap-3" value={data.doresInt ?? ""} onValueChange={(v) => set("doresInt", v)}>
                  {["Leve", "Moderada", "Intensa"].map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm"><RadioGroupItem value={o} /> {o}</label>
                  ))}
                </RadioGroup>
              </Field>
              <Field label="Há quanto tempo?" htmlFor="doresTempo">
                <Input id="doresTempo" value={data.doresTempo ?? ""} onChange={(e) => set("doresTempo", e.target.value)} placeholder="Ex: 3 meses" />
              </Field>
            </>
          )}
          <Field label="Apresenta tensão muscular?" htmlFor="tensao">
            <RadioGroup className="flex gap-4" value={data.tensao ?? ""} onValueChange={(v) => set("tensao", v)}>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
            </RadioGroup>
          </Field>
          {data.tensao === "sim" && (
            <Field label="Regiões com maior tensão" htmlFor="tensaoReg">
              <Input id="tensaoReg" value={data.tensaoReg ?? ""} onChange={(e) => set("tensaoReg", e.target.value)} />
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTermo({ data, set }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-xl text-primary">Preferências do cliente</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Gostaria de" htmlFor="bebida">
            <RadioGroup className="flex gap-3" value={data.bebida ?? ""} onValueChange={(v) => set("bebida", v)}>
              {["Chá", "Suco"].map((o) => (
                <label key={o} className="flex items-center gap-2 text-sm"><RadioGroupItem value={o} /> {o}</label>
              ))}
            </RadioGroup>
          </Field>
          <Field label="Sabor de preferência" htmlFor="sabor">
            <Input id="sabor" value={data.sabor ?? ""} onChange={(e) => set("sabor", e.target.value)} />
          </Field>
          <Field label="Com açúcar?" htmlFor="acucar">
            <RadioGroup className="flex gap-4" value={data.acucar ?? ""} onValueChange={(v) => set("acucar", v)}>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
            </RadioGroup>
          </Field>
          <Field label="Restrição alimentar" htmlFor="restricao">
            <Input id="restricao" value={data.restricao ?? ""} onChange={(e) => set("restricao", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-gold/50 bg-accent/40 p-6">
        <h3 className="font-display text-xl text-primary">Termo de responsabilidade</h3>
        <p className="mt-3 text-sm text-foreground/85">
          Declaro que as informações acima são verdadeiras e me responsabilizo por qualquer
          omissão relevante sobre meu estado de saúde. Estou ciente de que a massoterapia
          não substitui acompanhamento médico.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Data" htmlFor="termoData">
            <Input id="termoData" value={data.termoData ?? ""} onChange={(e) => set("termoData", maskDate(e.target.value))} placeholder="dd/mm/aaaa" />
          </Field>
          <Field label="Assinatura do cliente (nome completo)" htmlFor="assinatura">
            <Input id="assinatura" value={data.assinatura ?? ""} onChange={(e) => set("assinatura", e.target.value)} />
          </Field>
        </div>
        <label className="mt-5 flex items-start gap-3 text-sm">
          <Checkbox
            checked={!!data.aceitaTermo}
            onCheckedChange={(v) => set("aceitaTermo", !!v)}
          />
          <span>Li e concordo com o termo de responsabilidade acima.</span>
        </label>
      </div>
    </div>
  );
}
