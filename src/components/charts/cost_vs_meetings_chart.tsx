import { Lead } from '@/types/lead';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { parseISO, format } from 'date-fns';

interface Props {
  leads: Lead[];
}

export default function CostVsMeetingsChart({ leads }: Props) {
  const groupedData = leads.reduce<Record<string, { date: string; custo: number; reunioes: number }>>((acc, lead) => {
    const dateKey = format(parseISO(lead.dateTime), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        custo: 0,
        reunioes: 0,
      };
    }
    acc[dateKey].custo += lead.Custo_total / 100;
    if (lead.reuniao_marcada === 'Sim') {
      acc[dateKey].reunioes++;
    }
    return acc;
  }, {});

  const data = Object.values(groupedData).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="custo" fill="#8884d8" name="Custo Total (R$)" />
          <Line yAxisId="right" type="monotone" dataKey="reunioes" stroke="#82ca9d" name="Reuniões Marcadas" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
