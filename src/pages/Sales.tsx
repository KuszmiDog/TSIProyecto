import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Receipt, Plus, Search, X } from 'lucide-react';
import { Product, Customer } from '../types';

function Sales() {
  const { products, customers, sales, addSale, updateProduct, updateCustomer } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    product: Product;
    quantity: number;
    discount: number;
  }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'debit' | 'transfer' | 'account'>('cash');

  const handleAddProduct = (product: Product) => {
    if (product.stock > 0) {
      setSelectedProducts(prev => {
        const existing = prev.find(p => p.product.id === product.id);
        if (existing) {
          return prev.map(p =>
            p.product.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        }
        return [...prev, { product, quantity: 1, discount: 0 }];
      });
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && quantity <= product.stock && quantity > 0) {
      setSelectedProducts(prev =>
        prev.map(p =>
          p.product.id === productId
            ? { ...p, quantity }
            : p
        )
      );
    }
  };

  const handleDiscountChange = (productId: string, discount: number) => {
    if (discount >= 0 && discount <= 100) {
      setSelectedProducts(prev =>
        prev.map(p =>
          p.product.id === productId
            ? { ...p, discount }
            : p
        )
      );
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, { product, quantity, discount }) => {
      const price = product.price * quantity;
      const discountAmount = price * (discount / 100);
      return total + (price - discountAmount);
    }, 0);
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    
    // Check credit limit if payment method is account
    if (paymentMethod === 'account' && selectedCustomer) {
      const newDebt = selectedCustomer.currentDebt + total;
      if (newDebt > selectedCustomer.maxDebt) {
        alert('This sale would exceed the customer\'s credit limit');
        return;
      }
    }

    const sale = {
      id: crypto.randomUUID(),
      customerId: selectedCustomer?.id,
      products: selectedProducts.map(({ product, quantity, discount }) => ({
        productId: product.id,
        quantity,
        price: product.price,
        discount,
      })),
      total,
      paymentMethod,
      status: 'completed' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update product stock
    selectedProducts.forEach(({ product, quantity }) => {
      updateProduct({
        ...product,
        stock: product.stock - quantity,
        updatedAt: new Date(),
      });
    });

    // Update customer debt if payment method is account
    if (paymentMethod === 'account' && selectedCustomer) {
      updateCustomer({
        ...selectedCustomer,
        currentDebt: selectedCustomer.currentDebt + total,
        updatedAt: new Date(),
      });
    }

    addSale(sale);
    setIsModalOpen(false);
    setSelectedProducts([]);
    setSelectedCustomer(null);
    setPaymentMethod('cash');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4" />
          <span>New Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Receipt className="w-5 h-5 text-indigo-500" />
                <div>
                  <h3 className="text-lg font-semibold">
                    Sale #{sale.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  ${sale.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {sale.paymentMethod}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Products:</h4>
              <div className="space-y-2">
                {sale.products.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{product?.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">New Sale</h2>
            
            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Select Customer (Optional)</h3>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(customer || null);
                  }}
                  value={selectedCustomer?.id || ''}
                >
                  <option value="">No customer (Walk-in)</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter(product => product.stock > 0)
                    .map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        className="text-left p-4 border rounded-md hover:bg-gray-50"
                      >
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          ${product.price} - {product.stock} in stock
                        </p>
                      </button>
                    ))}
                </div>
              </div>

              {/* Selected Products */}
              {selectedProducts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Products</h3>
                  <div className="space-y-4">
                    {selectedProducts.map(({ product, quantity, discount }) => (
                      <div key={product.id} className="flex items-center space-x-4">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="flex-grow">{product.name}</span>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => handleDiscountChange(product.id, Number(e.target.value))}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Discount %"
                        />
                        <span className="w-24 text-right">
                          ${((product.price * quantity) * (1 - discount / 100)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="text-right font-semibold">
                      Total: ${calculateTotal().toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                  {selectedCustomer && (
                    <option value="account">Account (Credit Line)</option>
                  )}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProducts([]);
                    setSelectedCustomer(null);
                    setPaymentMethod('cash');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedProducts.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;