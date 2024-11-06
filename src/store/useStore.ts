import { create } from 'zustand';
import { Product, Customer, Sale, Promotion } from '../types';

interface StoreState {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  promotions: Promotion[];
  setProducts: (products: Product[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setSales: (sales: Sale[]) => void;
  setPromotions: (promotions: Promotion[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addSale: (sale: Sale) => void;
  updateSale: (sale: Sale) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  customers: [],
  sales: [],
  promotions: [],
  
  setProducts: (products) => set({ products }),
  setCustomers: (customers) => set({ customers }),
  setSales: (sales) => set({ sales }),
  setPromotions: (promotions) => set({ promotions }),
  
  addProduct: (product) => 
    set((state) => ({ products: [...state.products, product] })),
  
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => 
        p.id === product.id ? product : p
      ),
    })),
  
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),
  
  updateCustomer: (customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customer.id ? customer : c
      ),
    })),
  
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
  
  addSale: (sale) =>
    set((state) => ({ sales: [...state.sales, sale] })),
  
  updateSale: (sale) =>
    set((state) => ({
      sales: state.sales.map((s) =>
        s.id === sale.id ? sale : s
      ),
    })),
  
  addPromotion: (promotion) =>
    set((state) => ({ promotions: [...state.promotions, promotion] })),
  
  updatePromotion: (promotion) =>
    set((state) => ({
      promotions: state.promotions.map((p) =>
        p.id === promotion.id ? promotion : p
      ),
    })),
  
  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter((p) => p.id !== id),
    })),
}));