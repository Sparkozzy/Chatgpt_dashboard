import { useState } from 'react';
import { Lead } from '@/types/lead';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface LeadSearchProps {
  leads: Lead[];
}

export default function LeadSearchSidebar({ leads }: LeadSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);

  const onSearch = (value: string) => {
    setQuery(value);
    const lead = leads.find(
      (l) =>
        l.Nome.toLowerCase().includes(value.toLowerCase()) ||
        l.email_lead.toLowerCase().includes(value.toLowerCase()) ||
        l.Numero.includes(value)
    );
    setSelectedLead(lead || null);
    setOpen(!!lead);
  };

  return (
    <div>
      <Input
        placeholder="Buscar por nome, email ou telefone..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          {selectedLead ? (
            <div className="space-y-2">
              <h2 className="text-lg font-bold">{selectedLead.Nome}</h2>
              <p><strong>Email:</strong> {selectedLead.email_lead}</p>
              <p><strong>Telefone:</strong> {selectedLead.Numero}</p>
              <p><strong>Atendido:</strong> {selectedLead.atendido}</p>
              <p><strong>Tentativas:</strong> {selectedLead.tentativas}</p>
              <p><strong>Reunião Marcada:</strong> {selectedLead.reuniao_marcada}</p>
              <p><strong>Duração:</strong> {selectedLead.Duracao} segundos</p>
              <p><strong>Sentimento:</strong> {selectedLead.Sentimento_do_usuario}</p>
              <p><strong>Resumo:</strong> {selectedLead.Resumo_ligacao}</p>
            </div>
          ) : (
            <p>Nenhum lead encontrado.</p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
