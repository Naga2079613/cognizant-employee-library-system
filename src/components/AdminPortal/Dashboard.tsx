import { useState, useEffect } from 'react';
import { DataService } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import QuickActions from '../common/QuickActions';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    dispatchedRequests: 0,
    returnedRequests: 0,
  });

  useEffect(() => {
    const books = DataService.getAllBooks();
    const requests = DataService.getAllRequests();

    setStats({
      totalBooks: books.length,
      availableBooks: books.filter(book => book.availableCopies > 0).length,
      totalRequests: requests.length,
      pendingRequests: requests.filter(req => req.status === 'pending').length,
      approvedRequests: requests.filter(req => req.status === 'approved').length,
      dispatchedRequests: requests.filter(req => req.status === 'dispatched').length,
      returnedRequests: requests.filter(req => req.status === 'returned').length,
    });
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <div className="stat-card">
      <div className="w-full text-center p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-2xl mb-2" style={{ color }}>
            {icon}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {value}
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {title}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-3 drop-shadow-lg">
          🔧 Admin Dashboard 🔧
        </h1>
        <p className="text-xl text-white/90 drop-shadow">
          Welcome back, {user?.name}! Manage your library system
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon="📚"
          color="#1976d2"
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          icon="✅"
          color="#388e3c"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon="📋"
          color="#f57c00"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon="⏰"
          color="#f44336"
        />
        <StatCard
          title="Approved"
          value={stats.approvedRequests}
          icon="✔️"
          color="#4caf50"
        />
        <StatCard
          title="Dispatched"
          value={stats.dispatchedRequests}
          icon="🚚"
          color="#2196f3"
        />
        <StatCard
          title="Returned"
          value={stats.returnedRequests}
          icon="↩️"
          color="#9c27b0"
        />
      </div>

      {/* System Overview */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📊 System Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Book Availability Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📚 Book Availability
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Available Books</span>
                <span className="font-bold text-green-600 text-lg">{stats.availableBooks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full shadow-sm"
                  style={{ width: `${stats.totalBooks > 0 ? (stats.availableBooks / stats.totalBooks) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Books</span>
                <span className="font-bold text-blue-600 text-lg">{stats.totalBooks}</span>
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {stats.totalBooks > 0 ? Math.round((stats.availableBooks / stats.totalBooks) * 100) : 0}%
                  </span> of books are currently available
                </p>
              </div>
            </div>
          </div>

          {/* Request Status Chart */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📋 Request Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Pending</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600 text-lg">{stats.pendingRequests}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full"
                      style={{ width: `${stats.totalRequests > 0 ? (stats.pendingRequests / stats.totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Approved</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-600 text-lg">{stats.approvedRequests}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${stats.totalRequests > 0 ? (stats.approvedRequests / stats.totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Dispatched</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600 text-lg">{stats.dispatchedRequests}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                      style={{ width: `${stats.totalRequests > 0 ? (stats.dispatchedRequests / stats.totalRequests) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{stats.totalRequests}</span> total requests processed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section - Moved to bottom */}
      <QuickActions />
    </div>
  );
};

export default AdminDashboard;
