import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getProducts();
      setProducts(data);
    } catch (err) {
      const message = 'Mahsulotlarni yuklashda xatolik';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await window.api.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi');
      return newProduct;
    } catch (err) {
      toast.error('Mahsulot qo\'shishda xatolik');
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const updated = await window.api.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Mahsulot muvaffaqiyatli yangilandi');
      return updated;
    } catch (err) {
      toast.error('Mahsulot yangilashda xatolik');
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await window.api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Mahsulot o\'chirildi');
    } catch (err) {
      toast.error('Mahsulot o\'chirishda xatolik');
      throw err;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
