import { useState, useEffect, useCallback } from 'react';
import { IncomingStock } from '@/types';
import { toast } from 'sonner';

export function useIncomingStock() {
  const [incomingStock, setIncomingStock] = useState<IncomingStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomingStock = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getIncomingStock();
      setIncomingStock(data);
    } catch (err) {
      const message = 'Kirim tovarlarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingStock();
  }, [fetchIncomingStock]);

  const addIncomingStock = useCallback(async (stock: Omit<IncomingStock, 'id'>) => {
    try {
      const newStock = await window.api.addIncomingStock(stock);
      setIncomingStock(prev => [newStock, ...prev]);
      toast.success('Kirim tovar muvaffaqiyatli qo\'shildi');
      return newStock;
    } catch (err) {
      toast.error('Kirim tovar qo\'shishda xatolik');
      throw err;
    }
  }, []);

  const deleteIncomingStock = useCallback(async (id: string) => {
    try {
      await window.api.deleteIncomingStock(id);
      setIncomingStock(prev => prev.filter(s => s.id !== id));
      toast.success('O\'chirildi');
    } catch (err) {
      toast.error('O\'chirishda xatolik');
      throw err;
    }
  }, []);

  return {
    incomingStock,
    loading,
    error,
    refresh: fetchIncomingStock,
    addIncomingStock,
    deleteIncomingStock,
  };
}
