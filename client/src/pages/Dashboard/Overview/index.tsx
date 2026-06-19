import { useState, useEffect } from 'react';
import {
  PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { formatNumber, formatDateDisplay } from '../../../utils/helpers';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiAlertCircle, FiCheckCircle, FiClock, FiDownload, FiPackage, FiRefreshCw, FiShoppingBag, FiTrendingDown, FiTrendingUp, FiTruck, FiUsers } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';
import { Link } from 'react-router';
import Loader from '../../../components/Loader';
import { productType } from '../../../types';
import { fulfillmentStatuses } from '../../../components/ui/ShippingStatusBig';

interface DashboardData {
  period: { start: string; end: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
  };
  dailySales: Array<{ _id: string; revenue: number; orders: number; averageOrderValue: number }>;
  orderStatus: {
    pending: number; processing: number; shipped: number;
    out_for_delivery: number; delivered: number; cancelled: number; refunded: number;
  };
  topProducts: Array<{ _id: string; productTitle: string; totalQuantity: number; totalRevenue: number, productDetails: productType[] }>;
  lowStockAlert: { count: number; items: any[] };
  customers: {
    totalCustomers: number;
    averageCustomerLifetimeValue: number;
    topSpenders: any[];
  };
  inventoryValue: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/reports/dashboard');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    toast.success('Dashboard refreshed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={60} thickness={10}/>
      </div>
    );
  }

  if (!data) return null;

  const statusData = Object.entries(data.orderStatus).filter(([_, value],__)=>value!==0).map(([name, value], i) =>{
    return { 
      name: fulfillmentStatuses.find(s=>s.value===name)?.label, 
      value, 
      fill: CHART_COLORS[i % CHART_COLORS.length]
    }
  });
  const revenueGrowth = data.summary.revenueGrowth;
  const isPositiveGrowth = revenueGrowth >= 0;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between md:items-center gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-2xl font-[Comfortaa] text-[#1f1f1f]">Overview</h1>
              <p className="text-sm text-gray-500 mt-1">
                {formatDateDisplay(data.period.start)} - {formatDateDisplay(data.period.end)}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatNumber(data.summary.totalRevenue)}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveGrowth ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(revenueGrowth)}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaDollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{data.summary.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-2">Avg Order: {formatNumber(data.summary.averageOrderValue)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Customers</p>
                <p className="text-2xl font-bold mt-1">{data.customers.totalCustomers}</p>
                <p className="text-sm text-gray-500 mt-2">LTV: {formatNumber(data.customers.averageCustomerLifetimeValue)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold mt-1">{formatNumber(data.inventoryValue)}</p>
                <p className="text-sm text-red-600 mt-2">
                  <FiAlertCircle className="w-4 h-4 inline mr-1" />
                  {data.lowStockAlert.count} low stock items
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <FiPackage className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700">Daily</button>
                <button className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">Weekly</button>
                <button className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700">Monthly</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: any) => formatNumber(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => `${name}`}
                  // label={({ name, value, percent }) => `${name} ${((percent||0) * 100).toFixed(0)}%`}
                  // labelLine={false}
                />
                <Tooltip formatter={(v: any) => `${v} orders`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((status) => (
                <div key={status.name} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{status.name?.replace('_', ' ')}</span>
                  <span className="font-medium">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
              <Link to={'/dashboard/products'} className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
            </div>
            <div className="space-y-4">
              {data.topProducts.slice(0, 5).map((product, idx) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-sm font-bold">
                      #{idx + 1}
                    </div>
                    <div className='flex gap-3 items-center'>
                      <div className='w-10 aspect-square rounded-lg border border-[#d3d3d3] overflow-hidden'>
                        <img src={product.productDetails[0]?.imgs?.[0]?.url||''} alt="" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.productTitle}</p>
                        <p className="text-sm text-gray-500">{product.totalQuantity} units sold</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold">{formatNumber(product.totalRevenue)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-500" />
                Low Stock Alert
              </h3>
              <Link to={'/dashboard/products'} className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
            </div>
            {data.lowStockAlert.count === 0 ? (
              <div className="text-center py-8 text-green-600">
                <FiCheckCircle className="w-12 h-12 mx-auto mb-2" />
                <p>All products have sufficient stock</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.lowStockAlert.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-red-600">Stock: {item.totalStock} units left</p>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders & Delivery Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Simplified */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <Link to={'/dashboard/orders'} className="text-sm text-blue-600 hover:text-blue-700">View All Orders →</Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">ORD-2024-{1000 + i}</p>
                      <p className="text-sm text-gray-500">Customer Name • {2 + i} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(89.99 + i * 20).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors.pending}`}>
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Active Deliveries</span>
                </div>
                <span className="font-bold text-lg">{data.orderStatus.out_for_delivery + data.orderStatus.shipped}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Pending Approval</span>
                </div>
                <span className="font-bold text-lg">{data.orderStatus.pending}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Completed This Month</span>
                </div>
                <span className="font-bold text-lg">{data.orderStatus.delivered}</span>
              </div>
            </div>

            {/* Delivery Method Breakdown - Simplified */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carrier Delivery</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>In-House Delivery</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}