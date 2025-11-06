import { StatsCard } from "@/components/StatsCard";
import { getStatistics, getSales, getUserRole } from "@/lib/storage";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function Dashboard() {
  const role = getUserRole();
  const stats = getStatistics();
  const sales = getSales().slice(-20).reverse();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bosh sahifa</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Jami daromad"
          value={formatCurrency(stats.jamiDaromad)}
          subtitle="Sotuvlardan"
        />
        <StatsCard
          title="Jami xarajatlar"
          value={formatCurrency(stats.jamiXarajat)}
          subtitle="Xarajatlar"
          variant="danger"
        />
        {role === 'direktor' && (
          <StatsCard
            title="Sof foyda"
            value={formatCurrency(stats.sofFoyda)}
            subtitle="Haqiqiy foyda"
            variant={stats.sofFoyda >= 0 ? 'success' : 'danger'}
          />
        )}
      </div>

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">So'nggi sotuvlar</h2>
        
        {sales.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Hozircha sotuvlar yo'q</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Miqdor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Summa</th>
                  {role === 'direktor' && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Foyda</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sotuvchi</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{formatDateTime(sale.sana)}</td>
                    <td className="py-3 px-4 text-sm">{sale.mahsulotNomi}</td>
                    <td className="py-3 px-4 text-sm">{sale.miqdor} dona</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(sale.jami)}</td>
                    {role === 'direktor' && (
                      <td className="py-3 px-4 text-sm font-medium text-success">{formatCurrency(sale.foyda)}</td>
                    )}
                    <td className="py-3 px-4 text-sm">{sale.sotuvchi}</td>
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
