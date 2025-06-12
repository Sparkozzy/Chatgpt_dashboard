import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { calcularKPIs } from '@/utils/kpi';

const supabaseUrl = 'https://ghayhpwthdbmnpsptcnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXlocHd0aGRibW5wc3B0Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI3MTMsImV4cCI6MjA2MjI4ODcxM30.S2eyQXNn222n7eHMAXIzfAub8dBiWYlOSyXGFo1LIpA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MindflowDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error } = await supabase.from('Retell_Leads').select('*');
      if (!error && data) setLeads(data);
    };

    fetchLeads();

    const subscription = supabase
      .channel('public:Retell_Leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Retell_Leads' }, payload => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const kpis = calcularKPIs(leads);

  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-600">Mindflow</h1>
          <p>Agente SDR de ligação - Retell</p>
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

      <section className="mt-6">
        {/* Gráficos serão adicionados aqui */}
        <div className="mb-6">Funil de Conversão</div>
        <div className="mb-6">Evolução Custo vs Reuniões</div>
        <div className="mb-6">Taxa de Atendimento por Horário</div>
        <div className="mb-6">Taxa de Atendimento por Dia da Semana</div>
        <div className="mb-6">Análise de Sentimento</div>
        <div className="mb-6">Taxa de Reuniões por Horário</div>
        <div className="mb-6">Taxa de Reuniões por Dia da Semana</div>
      </section>
    </div>
  );
}
