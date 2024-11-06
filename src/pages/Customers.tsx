import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Users, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';

function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<null | string>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerData = {
      id: editingCustomer || crypto.randomUUID(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      currentDebt: editingCustomer 
        ? customers.find(c => c.id === editingCustomer)?.currentDebt || 0 
        : 0,
      maxDebt: Number(formData.get('maxDebt')) || 100000,
      createdAt: editingCustomer 
        ? customers.find(c => c.id === editingCustomer)?.createdAt || new Date()
        : new Date(),
      updatedAt: new Date(),
    };

    if (editingCustomer) {
      updateCustomer(customerData);
    } else {
      addCustomer(customerData);
    }

    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold">{customer.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingCustomer(customer.id);
                    setIsModalOpen(true);
                  }}
                  className="text-gray-500 hover:text-indigo-500"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">
                Email: <span className="font-medium">{customer.email}</span>
              </p>
              <p className="text-gray-600">
                Phone: <span className="font-medium">{customer.phone}</span>
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Current Debt:</p>
                <span className={`font-medium ${
                  customer.currentDebt > 0 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  ${customer.currentDebt.toLocaleString()}
                </span>
              </div>
              {customer.currentDebt >= customer.maxDebt && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Credit limit reached</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
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
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.name : ''}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.email : ''}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.phone : ''}
                />
              </div>
              <div>
                <label htmlFor="maxDebt" className="block text-sm font-medium text-gray-700">
                  Credit Limit
                </label>
                <input
                  type="number"
                  id="maxDebt"
                  name="maxDebt"
                  min="0"
                  step="1000"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={editingCustomer ? customers.find(c => c.id === editingCustomer)?.maxDebt : 100000}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md"
                >
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;