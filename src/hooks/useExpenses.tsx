import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types';
import { toast } from 'sonner';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getExpenses();
      setExpenses(data);
    } catch (err) {
      const message = 'Xarajatlarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await window.api.addExpense(expense);
      setExpenses(prev => [newExpense, ...prev]);
      toast.success('Xarajat saqlandi');
      return newExpense;
    } catch (err) {
      toast.error('Xarajat saqlashda xatolik');
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await window.api.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('O\'chirildi');
    } catch (err) {
      toast.error('O\'chirishda xatolik');
      throw err;
    }
  }, []);

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
    addExpense,
    deleteExpense,
  };
}
