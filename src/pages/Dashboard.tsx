import { useState, useMemo } from "react";
import { StatsCard } from "@/components/StatsCard";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { useStatistics } from "@/hooks/useStatistics";
import { useSales } from "@/hooks/useSales";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDateTime, getFilterLabel } from "@/lib/format";
import { DateFilter } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { isCeo } = useAuthStore();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<DateFilter>('barchasi');

  const { statistics, loading: statsLoading } = useStatistics(
    startDate?.toISOString(),
    endDate?.toISOString()
  );
  const { sales, loading: salesLoading } = useSales();

  const filteredSales = useMemo(() => {
    if (!startDate || !endDate) return sales.slice(0, 20);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.sana);
      return saleDate >= startDate && saleDate <= endDate;
    }).slice(0, 20);
  }, [sales, startDate, endDate]);

  const handleFilterChange = (start: Date | null, end: Date | null, filter: DateFilter) => {
    setStartDate(start);
    setEndDate(end);
    setActiveFilter(filter);
  };

  if (statsLoading || salesLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bosh sahifa</h1>
      
      <DateRangeFilter onFilterChange={handleFilterChange} />
      
      <div className="my-4">
        <p className="text-sm text-muted-foreground">
          Ko'rsatilmoqda: <span className="font-medium">{getFilterLabel(activeFilter)}</span>
        </p>
      </div>

      <div className={`grid ${isCeo ? 'grid-cols-4' : 'grid-cols-3'} gap-6 mb-8`}>
        <StatsCard
          title="Jami daromad"
          value={formatCurrency(statistics.jamiDaromad)}
          subtitle="Sotuvlardan"
        />
        <StatsCard
          title="Jami xarajatlar"
          value={formatCurrency(statistics.jamiXarajat)}
          subtitle="Xarajatlar"
          variant="danger"
        />
        {isCeo && (
          <StatsCard
            title="Sof foyda"
            value={formatCurrency(statistics.sofFoyda)}
            subtitle="Haqiqiy foyda"
            variant={statistics.sofFoyda >= 0 ? 'success' : 'danger'}
          />
        )}
        <StatsCard
          title="Ombordagi tovarlar"
          value={statistics.ombordagiTovarlar.toString()}
          subtitle="Mahsulotlar"
        />
      </div>

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">So'nggi sotuvlar</h2>
        
        {filteredSales.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {activeFilter === 'barchasi' 
              ? "Hozircha sotuvlar yo'q" 
              : "Tanlangan davrda sotuvlar yo'q"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Miqdor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Summa</th>
                  {isCeo && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Foyda</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sotuvchi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{formatDateTime(sale.sana)}</td>
                    <td className="py-3 px-4 text-sm">{sale.mahsulotNomi}</td>
                    <td className="py-3 px-4 text-sm">{sale.miqdor} dona</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(sale.jami)}</td>
                    {isCeo && (
                      <td className="py-3 px-4 text-sm font-medium text-success">{formatCurrency(sale.foyda)}</td>
                    )}
                    <td className="py-3 px-4 text-sm">{sale.sotuvchiIsm || sale.sotuvchi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
