import { useState, useEffect, useCallback } from 'react';
import { Settings } from '@/types';
import { toast } from 'sonner';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ ceoPassword: '1234' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getSettings();
      setSettings(data);
    } catch (err) {
      const message = 'Sozlamalarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    try {
      const updated = await window.api.updateSettings(updates);
      setSettings(updated);
      toast.success('Sozlamalar saqlandi');
      return updated;
    } catch (err) {
      toast.error('Sozlamalarni saqlashda xatolik');
      throw err;
    }
  }, []);

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    updateSettings,
  };
}
