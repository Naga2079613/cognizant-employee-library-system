import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import ModernBookSlideshow from './ModernBookSlideshow';
import type { BookRequest } from '../../types';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    availableBooks: 0,
    myRequests: 0,
    pendingRequests: 0,
    booksIssued: 0,
  });

  useEffect(() => {
    if (user) {
      const books = DataService.getAllBooks();
      const userRequests = DataService.getRequestsByUserId(user.id);
      
      setStats({
        availableBooks: books.filter(book => book.availableCopies > 0).length,
        myRequests: userRequests.length,
        pendingRequests: userRequests.filter((req: BookRequest) => req.status === 'pending').length,
        booksIssued: userRequests.filter((req: BookRequest) => req.status === 'dispatched').length,
      });
    }
  }, [user]);

  const StatCard = ({
    title,
    value,
    icon,
    color,
    description,
  }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    description: string;
  }) => (
    <div className="stat-card">
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <div className="text-3xl mb-1" style={{ color }}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {value}
        </div>
        <div className="text-sm font-semibold text-gray-600 text-center">
          {title}
        </div>
        <div className="text-xs text-gray-500 text-center px-2">
          {description}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-3 drop-shadow-lg">
        Welcome, {user?.name}!
        </h1>
        <p className="text-xl text-white/90 drop-shadow">
          Employee Dashboard - {user?.department}
        </p>
      </div>
      
      {/* Modern Book Slideshow - Full Width */}
      <ModernBookSlideshow />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          icon="📚"
          color="#1976d2"
          description="Ready to request"
        />
        <StatCard
          title="My Requests"
          value={stats.myRequests}
          icon="👤"
          color="#ed6c02"
          description="Total submitted"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon="⏰"
          color="#d32f2f"
          description="Awaiting approval"
        />
        <StatCard
          title="Books Issued"
          value={stats.booksIssued}
          icon="📖"
          color="#2e7d32"
          description="Currently with you"
        />
      </div>

      {/* Quick Actions */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text drop-shadow">
          Quick Actions
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="glass-card p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            📚 Browse Library
          </h3>
          <p className="text-gray-600 mb-4">
            Explore our collection of books
          </p>
          <button 
            onClick={() => navigate('/employee/books')}
            className="modern-button w-full"
          >
            Browse Books
          </button>
        </div>

        <div className="glass-card p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            📋 My Requests
          </h3>
          <p className="text-gray-600 mb-4">
            Track your book requests
          </p>
          <button 
            onClick={() => navigate('/employee/requests')}
            className="w-full px-6 py-3 rounded-2xl font-semibold border-2 border-primary-500 text-primary-500 hover:bg-primary-50"
          >
            View Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
