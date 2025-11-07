import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { DateFilter } from '@/types';

interface DateRangeFilterProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null, filter: DateFilter) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<DateFilter>('barchasi');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleQuickFilter = (filter: DateFilter) => {
    setActiveFilter(filter);
    const now = new Date();
    
    switch (filter) {
      case 'bugun':
        onFilterChange(startOfDay(now), endOfDay(now), filter);
        break;
      case 'bu_hafta':
        onFilterChange(startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }), filter);
        break;
      case 'bu_oy':
        onFilterChange(startOfMonth(now), endOfMonth(now), filter);
        break;
      case 'barchasi':
        onFilterChange(null, null, filter);
        break;
    }
  };

  const handleCustomFilter = () => {
    if (customStart && customEnd) {
      setActiveFilter('custom');
      onFilterChange(
        startOfDay(new Date(customStart)),
        endOfDay(new Date(customEnd)),
        'custom'
      );
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex gap-2">
        <Button
          variant={activeFilter === 'bugun' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFilter('bugun')}
        >
          Bugun
        </Button>
        <Button
          variant={activeFilter === 'bu_hafta' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFilter('bu_hafta')}
        >
          Bu hafta
        </Button>
        <Button
          variant={activeFilter === 'bu_oy' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFilter('bu_oy')}
        >
          Bu oy
        </Button>
        <Button
          variant={activeFilter === 'barchasi' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFilter('barchasi')}
        >
          Barchasi
        </Button>
      </div>
      
      <div className="flex items-end gap-2">
        <div>
          <Label htmlFor="start-date" className="text-xs">Dan</Label>
          <Input
            id="start-date"
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="w-36"
          />
        </div>
        <div>
          <Label htmlFor="end-date" className="text-xs">Gacha</Label>
          <Input
            id="end-date"
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="w-36"
          />
        </div>
        <Button
          variant={activeFilter === 'custom' ? 'default' : 'outline'}
          size="sm"
          onClick={handleCustomFilter}
          disabled={!customStart || !customEnd}
        >
          Qo'llash
        </Button>
      </div>
    </div>
  );
}
