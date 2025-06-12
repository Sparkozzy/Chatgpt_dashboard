import { Lead } from '@/types/lead';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { parseISO, getHours, getDay } from 'date-fns';

interface Props {
  leads: Lead[];
}

function calcularTaxaReuniao(leads: Lead[], agrupador: (lead: Lead) => string): { label: string; taxa: number }[] {
  const totalAtendidasPorGrupo: Record<string, number> = {};
  const reunioesPorGrupo: Record<string, number> = {};

  leads.forEach(lead => {
    if (lead.atendido !== 'Sim') return;
    const grupo = agrupador(lead);
    totalAtendidasPorGrupo[grupo] = (totalAtendidasPorGrupo[grupo] || 0) + 1;
    if (lead.reuniao_marcada === 'Sim') {
      reunioesPorGrupo[grupo] = (reunioesPorGrupo[grupo] || 0) + 1;
    }
  });

  return Object.keys(totalAtendidasPorGrupo).map(label => ({
    label,
    taxa: Math.round((100 * (reunioesPorGrupo[label] || 0)) / totalAtendidasPorGrupo[label]),
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function TaxaReuniaoPorHorario({ leads }: Props) {
  const data = calcularTaxaReuniao(leads, (lead) => {
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
          <Bar dataKey="taxa" fill="#17a2b8" name="Taxa de Reuniões (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaxaReuniaoPorDiaSemana({ leads }: Props) {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const data = calcularTaxaReuniao(leads, (lead) => dias[getDay(parseISO(lead.dateTime))]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" />
          <YAxis dataKey="label" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="taxa" fill="#20c997" name="Taxa de Reuniões (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
