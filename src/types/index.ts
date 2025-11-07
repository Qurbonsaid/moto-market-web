// Core type definitions
export interface Product {
  id: string;
  nomi: string;
  model: string;
  miqdor: number;
  kirimNarxi: number;
  sotishNarxi: number;
}

export interface Seller {
  id: string;
  ism: string;
  telefon?: string;
}

export interface Sale {
  id: string;
  sana: string;
  mahsulotId: string;
  mahsulotNomi: string;
  mahsulotModel: string;
  miqdor: number;
  narx: number;
  jami: number;
  foyda: number;
  sotuvchi: string;
  sotuvchiIsm: string;
  mijoz?: string;
}

export interface Expense {
  id: string;
  sana: string;
  tavsif: string;
  summa: number;
  kategoriya?: string;
}

export interface IncomingStock {
  id: string;
  sana: string;
  mahsulotId: string;
  mahsulotNomi: string;
  mahsulotModel: string;
  miqdor: number;
  kirimNarxi: number;
  jamiXarajat: number;
  izoh?: string;
}

export interface Settings {
  ceoPassword: string;
  shopName?: string;
  address?: string;
  phone?: string;
  currency?: string;
}

export interface Statistics {
  jamiDaromad: number;
  jamiXarajat: number;
  sofFoyda: number;
  jamiFoyda: number;
  ombordagiTovarlar: number;
}

export interface SellerStatistics {
  sotuvlarSoni: number;
  jamiSumma: number;
  jamiFoyda: number;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export type DateFilter = 'bugun' | 'bu_hafta' | 'bu_oy' | 'barchasi' | 'custom';

// Window API types
declare global {
  interface Window {
    api: {
      // Products
      getProducts: () => Promise<Product[]>;
      addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
      updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
      deleteProduct: (id: string) => Promise<void>;
      
      // Sellers
      getSellers: () => Promise<Seller[]>;
      addSeller: (seller: Omit<Seller, 'id'>) => Promise<Seller>;
      deleteSeller: (id: string) => Promise<void>;
      getSellerStatistics: (sellerId: string) => Promise<SellerStatistics>;
      
      // Sales
      getSales: () => Promise<Sale[]>;
      addSale: (sale: Omit<Sale, 'id'>) => Promise<Sale>;
      deleteSale: (id: string) => Promise<void>;
      
      // Expenses
      getExpenses: () => Promise<Expense[]>;
      addExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense>;
      deleteExpense: (id: string) => Promise<void>;
      
      // Incoming Stock
      getIncomingStock: () => Promise<IncomingStock[]>;
      addIncomingStock: (stock: Omit<IncomingStock, 'id'>) => Promise<IncomingStock>;
      deleteIncomingStock: (id: string) => Promise<void>;
      
      // Settings
      getSettings: () => Promise<Settings>;
      updateSettings: (updates: Partial<Settings>) => Promise<Settings>;
      verifyCeoPassword: (password: string) => Promise<boolean>;
      
      // Statistics
      getStatistics: (startDate?: string, endDate?: string) => Promise<Statistics>;
    };
  }
}
