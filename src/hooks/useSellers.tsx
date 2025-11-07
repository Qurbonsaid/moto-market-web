import { useState, useEffect, useCallback } from 'react';
import { Seller, SellerStatistics } from '@/types';
import { toast } from 'sonner';

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getSellers();
      setSellers(data);
    } catch (err) {
      const message = 'Sotuvchilarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const addSeller = useCallback(async (seller: Omit<Seller, 'id'>) => {
    try {
      const newSeller = await window.api.addSeller(seller);
      setSellers(prev => [...prev, newSeller]);
      toast.success('Sotuvchi qo\'shildi');
      return newSeller;
    } catch (err) {
      toast.error('Sotuvchi qo\'shishda xatolik');
      throw err;
    }
  }, []);

  const deleteSeller = useCallback(async (id: string) => {
    try {
      await window.api.deleteSeller(id);
      setSellers(prev => prev.filter(s => s.id !== id));
      toast.success('O\'chirildi');
    } catch (err) {
      toast.error('O\'chirishda xatolik');
      throw err;
    }
  }, []);

  const getSellerStats = useCallback(async (sellerId: string): Promise<SellerStatistics> => {
    try {
      return await window.api.getSellerStatistics(sellerId);
    } catch (err) {
      console.error('Error fetching seller stats:', err);
      return { sotuvlarSoni: 0, jamiSumma: 0, jamiFoyda: 0 };
    }
  }, []);

  return {
    sellers,
    loading,
    error,
    refresh: fetchSellers,
    addSeller,
    deleteSeller,
    getSellerStats,
  };
}
