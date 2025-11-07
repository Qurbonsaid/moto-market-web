import { useState, useEffect, useCallback } from 'react';
import { Statistics } from '@/types';
import { toast } from 'sonner';

export function useStatistics(startDate?: string, endDate?: string) {
  const [statistics, setStatistics] = useState<Statistics>({
    jamiDaromad: 0,
    jamiXarajat: 0,
    sofFoyda: 0,
    jamiFoyda: 0,
    ombordagiTovarlar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getStatistics(startDate, endDate);
      setStatistics(data);
    } catch (err) {
      const message = 'Statistikani yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refresh: fetchStatistics,
  };
}
