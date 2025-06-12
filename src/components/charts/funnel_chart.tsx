import { Lead } from '@/types/lead';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';

interface FunnelChartProps {
  leads: Lead[];
}

export default function FunnelConversao({ leads }: FunnelChartProps) {
  const totalContatados = new Set(leads.map(l => l.email_lead)).size;
  const totalAtendidos = leads.filter(l => l.atendido === 'Sim').length;
  const totalReunioes = leads.filter(l => l.reuniao_marcada === 'Sim').length;

  const data = [
    {
      stage: 'Leads Contatados',
      value: totalContatados,
    },
    {
      stage: 'Ligações Atendidas',
      value: totalAtendidos,
    },
    {
      stage: 'Reuniões Marcadas',
      value: totalReunioes,
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <FunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="#333" stroke="none" dataKey="stage" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
