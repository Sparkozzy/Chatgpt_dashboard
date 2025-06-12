import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { calcularKPIs } from '@/utils/kpi';
import FunnelConversao from '@/components/charts/funnel_chart';
import CostVsMeetingsChart from '@/components/charts/cost_vs_meetings_chart';
import DateRangeFilter, { filtrarPorIntervalo } from '@/components/ui/date_filter';

const supabaseUrl = 'https://ghayhpwthdbmnpsptcnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXlocHd0aGRibW5wc3B0Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI3MTMsImV4cCI6MjA2MjI4ODcxM30.S2eyQXNn222n7eHMAXIzfAub8dBiWYlOSyXGFo1LIpA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MindflowDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase.from('Retell_Leads').select('*');
      if (!error && data) {
        setLeads(data);
        setFilteredLeads(data);
      }
    };

    fetchLeads();

    const subscription = supabase
      .channel('public:Retell_Leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Retell_Leads' }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDateFilter = (start: Date, end: Date) => {
    const results = filtrarPorIntervalo(leads, start, end);
    setFilteredLeads(results);
  };

  const kpis = calcularKPIs(filteredLeads);

  return (
    <div className="p-4">
      <header className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-green-600">Mindflow</h1>
          <p>Agente SDR de ligação - Retell</p>
        </div>
        <div className="flex-1 flex justify-center">
          <DateRangeFilter onFilter={handleDateFilter} />
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="Buscar por nome, email ou telefone..." />
          <Button variant="outline">🌙</Button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <Card><CardContent>{`Ligações Efetuadas: ${kpis.totalLigações}`}</CardContent></Card>
        <Card><CardContent>{`Ligações Atendidas: ${kpis.totalAtendidas}`}</CardContent></Card>
        <Card><CardContent>{`Reuniões Marcadas: ${kpis.reunioesMarcadas}`}</CardContent></Card>
        <Card><CardContent>{`Duração Total: ${kpis.duracaoTotal}`}</CardContent></Card>
        <Card><CardContent>{`Duração Média: ${kpis.duracaoMedia}`}</CardContent></Card>
        <Card><CardContent>{`Taxa de Atendimento: ${kpis.taxaAtendimento}`}</CardContent></Card>
      </section>

      <section className="mt-6 space-y-10">
        <div>
          <h2 className="text-lg font-semibold mb-2">Funil de Conversão</h2>
          <FunnelConversao leads={filteredLeads} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Evolução de Custo vs. Reuniões</h2>
          <CostVsMeetingsChart leads={filteredLeads} />
        </div>

        {/* Próximos gráficos aqui */}
      </section>
    </div>
  );
}
