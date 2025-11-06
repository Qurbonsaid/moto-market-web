// Local storage utilities for the app
export interface Product {
  id: string;
  nomi: string;
  model: string;
  miqdor: number;
  kirimNarxi: number;
  sotishNarxi: number;
}

export interface Sale {
  id: string;
  sana: string;
  mahsulotId: string;
  mahsulotNomi: string;
  miqdor: number;
  narx: number;
  jami: number;
  foyda: number;
  sotuvchi: string; // Now stores seller ID
  sotuvchiIsm?: string; // Seller name for display
  mijoz?: string;
}

export interface Expense {
  id: string;
  sana: string;
  tavsif: string;
  summa: number;
}

export interface Seller {
  id: string;
  ism: string;
  telefon?: string;
}

export type UserRole = 'direktor' | 'sotuvchi';

const STORAGE_KEYS = {
  PRODUCTS: 'motomarket_products',
  SALES: 'motomarket_sales',
  EXPENSES: 'motomarket_expenses',
  SELLERS: 'motomarket_sellers',
  USER_ROLE: 'motomarket_role',
  PASSWORD: 'motomarket_password',
};

// Initialize default password if not set
export const initializePassword = () => {
  const password = localStorage.getItem(STORAGE_KEYS.PASSWORD);
  if (!password) {
    localStorage.setItem(STORAGE_KEYS.PASSWORD, '1234'); // Default password
  }
};

export const verifyPassword = (password: string): boolean => {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD) === password;
};

export const changePassword = (currentPassword: string, newPassword: string): boolean => {
  if (verifyPassword(currentPassword)) {
    localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
    return true;
  }
  return false;
};

export const setUserRole = (role: UserRole) => {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
};

export const getUserRole = (): UserRole => {
  const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  return (role as UserRole) || 'sotuvchi'; // Default to seller mode
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
};

// Products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = (product: Omit<Product, 'id'> | Product) => {
  const products = getProducts();
  if ('id' in product) {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
    }
  } else {
    products.push({ ...product, id: Date.now().toString() });
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Sales
export const getSales = (): Sale[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const saveSale = (sale: Omit<Sale, 'id'>) => {
  const sales = getSales();
  sales.push({ ...sale, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  
  // Update product quantity
  const products = getProducts();
  const product = products.find(p => p.id === sale.mahsulotId);
  if (product) {
    product.miqdor -= sale.miqdor;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

// Expenses
export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = (expense: Omit<Expense, 'id'>) => {
  const expenses = getExpenses();
  expenses.push({ ...expense, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

export const deleteExpense = (id: string) => {
  const expenses = getExpenses().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

// Sellers
export const getSellers = (): Seller[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SELLERS);
  return data ? JSON.parse(data) : [];
};

export const saveSeller = (seller: Omit<Seller, 'id'>) => {
  const sellers = getSellers();
  sellers.push({ ...seller, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
};

export const deleteSeller = (id: string) => {
  const sellers = getSellers().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
};

// Seller statistics
export const getSellerStats = (sellerId: string) => {
  const sales = getSales().filter(s => s.sotuvchi === sellerId);
  
  return {
    sotuvlarSoni: sales.length,
    jamiSumma: sales.reduce((sum, sale) => sum + sale.jami, 0),
    jamiFoyda: sales.reduce((sum, sale) => sum + sale.foyda, 0),
  };
};

// Statistics
export const getStatistics = () => {
  const sales = getSales();
  const expenses = getExpenses();
  
  const jamiDaromad = sales.reduce((sum, sale) => sum + sale.jami, 0);
  const jamiFoyda = sales.reduce((sum, sale) => sum + sale.foyda, 0);
  const jamiXarajat = expenses.reduce((sum, expense) => sum + expense.summa, 0);
  const sofFoyda = jamiFoyda - jamiXarajat;
  
  return {
    jamiDaromad,
    jamiFoyda,
    jamiXarajat,
    sofFoyda,
  };
};
