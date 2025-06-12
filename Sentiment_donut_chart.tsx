import { Lead } from '@/types/lead';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Props {
  leads: Lead[];
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d62728'];

export default function SentimentDonutChart({ leads }: Props) {
  const sentimentCount: Record<string, number> = {};

  leads.forEach(lead => {
    const sentiment = lead.Sentimento_do_usuario;
    sentimentCount[sentiment] = (sentimentCount[sentiment] || 0) + 1;
  });

  const data = Object.entries(sentimentCount).map(([sentiment, count]) => ({
    name: sentiment,
    value: count,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
