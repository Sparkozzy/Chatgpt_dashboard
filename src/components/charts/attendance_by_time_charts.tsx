import { Lead } from '@/types/lead';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { parseISO, getHours, format, getDay } from 'date-fns';

interface Props {
  leads: Lead[];
}

function calcularTaxaAtendimento(leads: Lead[], agrupador: (lead: Lead) => string): { label: string; taxa: number }[] {
  const totalPorGrupo: Record<string, number> = {};
  const atendidosPorGrupo: Record<string, number> = {};

  leads.forEach(lead => {
    const grupo = agrupador(lead);
    totalPorGrupo[grupo] = (totalPorGrupo[grupo] || 0) + 1;
    if (lead.atendido === 'Sim') {
      atendidosPorGrupo[grupo] = (atendidosPorGrupo[grupo] || 0) + 1;
    }
  });

  return Object.keys(totalPorGrupo).map(label => ({
    label,
    taxa: Math.round((100 * (atendidosPorGrupo[label] || 0)) / totalPorGrupo[label]),
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function TaxaPorHorario({ leads }: Props) {
  const data = calcularTaxaAtendimento(leads, (lead) => {
    const hora = getHours(parseISO(lead.dateTime));
    return `${hora.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Bar dataKey="taxa" fill="#28a745" name="Taxa de Atendimento (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaxaPorDiaSemana({ leads }: Props) {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const data = calcularTaxaAtendimento(leads, (lead) => dias[getDay(parseISO(lead.dateTime))]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" />
          <YAxis dataKey="label" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="taxa" fill="#007bff" name="Taxa de Atendimento (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

