import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Package, 
  Users, 
  Receipt, 
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

function Dashboard() {
  const { products, customers, sales } = useStore();

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const lowStockProducts = products.filter((product) => product.stock < 5);
  const customersWithDebt = customers.filter((customer) => customer.currentDebt > 0);

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Stock',
      value: totalStock,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Sales',
      value: `$${totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
              </div>
              <div className={`${color} p-3 rounded-full`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600">{product.name}</span>
                <span className="text-red-500 font-medium">
                  {product.stock} units
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Outstanding Debts</h2>
            <Receipt className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {customersWithDebt.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600">{customer.name}</span>
                <span className="text-orange-500 font-medium">
                  ${customer.currentDebt.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;