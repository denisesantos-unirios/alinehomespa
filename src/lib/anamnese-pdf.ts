import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Client = {
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  cpf: string | null;
  birth_date: string | null;
  anamnesis: Record<string, any> | null;
  therapist_notes: string | null;
  fitness_status: string;
  created_at: string;
};

const GREEN: [number, number, number] = [25, 51, 38];
const GOLD: [number, number, number] = [197, 165, 89];

function val(v: any): string {
  if (v === undefined || v === null || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "object") {
    const yes = Object.entries(v)
      .filter(([, x]) => x === "sim")
      .map(([k]) => k);
    return yes.length ? yes.join(", ") : "Nenhuma";
  }
  return String(v);
}

export function exportAnamnesisPDF(client: Client) {
  const a = client.anamnesis ?? {};
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, pageW, 80, "F");
  doc.setTextColor(...GOLD);
  doc.setFont("times", "italic");
  doc.setFontSize(22);
  doc.text("Aline Home Spa Prime", 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Ficha de Anamnese — Massoterapia Clínica", 40, 60);
  doc.text(
    `Emitido em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageW - 40,
    60,
    { align: "right" },
  );

  doc.setTextColor(0, 0, 0);
  let y = 110;

  const section = (title: string) => {
    if (y > 760) {
      doc.addPage();
      y = 60;
    }
    doc.setFillColor(...GOLD);
    doc.rect(40, y - 14, pageW - 80, 20, "F");
    doc.setTextColor(...GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), 48, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    y += 14;
  };

  const table = (rows: [string, string][]) => {
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 160, fillColor: [245, 240, 230] },
      },
      body: rows.map(([k, v]) => [k, v]),
    });
    // @ts-expect-error lastAutoTable injected by plugin
    y = doc.lastAutoTable.finalY + 16;
  };

  section("Identificação do cliente");
  table([
    ["Nome completo", val(client.full_name)],
    ["Data de nascimento", val(a.nascimento ?? client.birth_date)],
    ["Idade", val(a.idade)],
    ["Sexo", val(a.sexo)],
    ["CPF", val(client.cpf ?? a.cpf)],
    ["RG", val(a.rg)],
    ["Telefone", val(client.phone)],
    ["WhatsApp", val(client.whatsapp)],
    ["E-mail", val(client.email)],
    ["Endereço", val(a.endereco)],
    ["Profissão", val(a.profissao)],
    ["Estado civil", val(a.estadoCivil)],
    ["Contato de emergência", val(a.emerg)],
    ["Telefone de emergência", val(a.emergTel)],
  ]);

  section("Objetivo e queixa");
  table([
    ["Objetivos", val(a.objetivos)],
    ["Outro objetivo", val(a.outroObj)],
    ["Queixa principal", val(a.queixa)],
  ]);

  section("Histórico de saúde");
  table([
    ["Condições relatadas", val(a.saude)],
    ["Observações", val(a.saudeExp)],
    ["Cirurgia", val(a.cirurgia)],
    ["Quais cirurgias", val(a.cirurgiaQuais)],
    ["Data da cirurgia", val(a.cirurgiaData)],
    ["Medicamentos contínuos", val(a.medicamentos)],
    ["Quais medicamentos", val(a.medQuais)],
  ]);

  section("Hábitos de vida");
  table([
    ["Atividade física", val(a.ativ)],
    ["Frequência", val(a.ativFreq)],
    ["Qualidade do sono", val(a.sono)],
    ["Nível de estresse", val(a.estresse)],
    ["Consumo de água", val(a.agua)],
    ["Fuma", val(a.fuma)],
    ["Consome álcool", val(a.alcool)],
  ]);

  section("Avaliação corporal e dor");
  table([
    ["Apresenta dores", val(a.dores)],
    ["Localização", val(a.doresLoc)],
    ["Intensidade", val(a.doresInt)],
    ["Há quanto tempo", val(a.doresTempo)],
    ["Tensão muscular", val(a.tensao)],
    ["Regiões com tensão", val(a.tensaoReg)],
  ]);

  section("Preferências do cliente");
  table([
    ["Bebida preferida", val(a.bebida)],
    ["Sabor", val(a.sabor)],
    ["Com açúcar", val(a.acucar)],
    ["Restrição alimentar", val(a.restricao)],
  ]);

  const statusLabel =
    client.fitness_status === "apto"
      ? "Apto para atendimento"
      : client.fitness_status === "requer_avaliacao"
      ? "Requer avaliação médica"
      : "Pendente de avaliação";

  section("Avaliação da terapeuta");
  table([
    ["Status", statusLabel],
    ["Observações do terapeuta", val(client.therapist_notes)],
  ]);

  if (y > 700) {
    doc.addPage();
    y = 60;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const termo =
    "Declaro que as informações acima são verdadeiras e me responsabilizo por qualquer omissão relevante sobre meu estado de saúde. Estou ciente de que a massoterapia não substitui acompanhamento médico.";
  const lines = doc.splitTextToSize(termo, pageW - 80);
  doc.text(lines, 40, y);
  y += lines.length * 11 + 30;

  doc.setDrawColor(...GREEN);
  doc.line(60, y, 260, y);
  doc.line(pageW - 260, y, pageW - 60, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Assinatura do cliente", 160, y + 14, { align: "center" });
  doc.text("Aline Souza — Terapeuta", pageW - 160, y + 14, { align: "center" });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Aline Home Spa Prime · Cuidado, bem-estar e excelência em cada atendimento.",
      pageW / 2,
      820,
      { align: "center" },
    );
    doc.text(`Página ${i} de ${pageCount}`, pageW - 40, 820, { align: "right" });
  }

  const safeName = (client.full_name || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_");
  doc.save(`ficha_${safeName}.pdf`);
}
