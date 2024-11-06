export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentDebt: number;
  maxDebt: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  customerId?: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  total: number;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'transfer' | 'account';
  status: 'completed' | 'returned' | 'modified';
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: Date;
  endDate: Date;
  productIds?: string[];
  minQuantity?: number;
  active: boolean;
}

export interface SaleChange {
  id: string;
  saleId: string;
  type: 'return' | 'exchange' | 'payment_method';
  previousData: any;
  newData: any;
  createdAt: Date;
}