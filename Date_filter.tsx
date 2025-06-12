import { useState } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface DateRangeFilterProps {
  onFilter: (start: Date, end: Date) => void;
}

export default function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const [range, setRange] = useState<{ from: Date; to: Date } | null>(null);

  const handleSelect = (value: { from: Date; to: Date }) => {
    setRange(value);
    onFilter(value.from, value.to);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {range
          ? `De ${format(range.from, 'dd/MM/yyyy')} até ${format(range.to, 'dd/MM/yyyy')}`
          : 'Selecione um intervalo de datas'}
      </p>
      <Calendar
        mode="range"
        selected={range}
        onSelect={handleSelect}
        numberOfMonths={2}
      />
    </div>
  );
}

export function filtrarPorIntervalo(leads: any[], from: Date, to: Date) {
  return leads.filter((lead) => {
    const date = parseISO(lead.dateTime);
    return isWithinInterval(date, { start: from, end: to });
  });
}
