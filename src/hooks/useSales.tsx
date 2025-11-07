import { useState, useEffect, useCallback } from 'react';
import { Sale } from '@/types';
import { toast } from 'sonner';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getSales();
      setSales(data);
    } catch (err) {
      const message = 'Sotuvlarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const addSale = useCallback(async (sale: Omit<Sale, 'id'>) => {
    try {
      const newSale = await window.api.addSale(sale);
      setSales(prev => [newSale, ...prev]);
      toast.success('Sotuv muvaffaqiyatli amalga oshirildi');
      return newSale;
    } catch (err) {
      toast.error('Sotuv amalga oshirishda xatolik');
      throw err;
    }
  }, []);

  const deleteSale = useCallback(async (id: string) => {
    try {
      await window.api.deleteSale(id);
      setSales(prev => prev.filter(s => s.id !== id));
      toast.success('Sotuv o\'chirildi');
    } catch (err) {
      toast.error('Sotuv o\'chirishda xatolik');
      throw err;
    }
  }, []);

  return {
    sales,
    loading,
    error,
    refresh: fetchSales,
    addSale,
    deleteSale,
  };
}
