import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<null | string>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      id: editingProduct || crypto.randomUUID(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product.id);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-500 hover:text-indigo-500"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">
                Price: <span className="font-semibold">${product.price}</span>
              </p>
              <p className="text-gray-600">
                Stock: <span className="font-semibold">{product.stock} units</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingProduct ? products.find(p => p.id === editingProduct)?.name : ''}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingProduct ? products.find(p => p.id === editingProduct)?.price : ''}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingProduct ? products.find(p => p.id === editingProduct)?.stock : ''}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;