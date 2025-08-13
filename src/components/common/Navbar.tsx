import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="glass-card mb-0 rounded-none border-x-0 border-t-0 border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📚</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Cognizant Digital Library
              </h1>
              <p className="text-xs text-gray-600">
                {user.role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user.role === 'employee' && (
              <>
                <button
                  onClick={() => navigate('/employee')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/employee' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={() => navigate('/employee/books')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/books' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📚 Browse Books
                </button>
                <button
                  onClick={() => navigate('/employee/requests')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/requests' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📋 My Requests
                </button>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/admin' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={() => navigate('/admin/books')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/admin/books' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📚 Manage Books
                </button>
                <button
                  onClick={() => navigate('/admin/requests')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/admin/requests' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  📋 Manage Requests
                </button>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 rounded-xl border border-white/20 bg-white/30 backdrop-blur-sm shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-medium text-gray-800 text-sm">{user.name}</div>
                <div className="text-xs text-gray-600">{user.role}</div>
              </div>
            </div>

            {/* Simple Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 bg-white shadow-sm"
              title="Sign Out"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/30 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {user.role === 'employee' && (
            <>
              <button
                onClick={() => navigate('/employee')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/employee' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                🏠 Dashboard
              </button>
              <button
                onClick={() => navigate('/employee/books')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/books' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                📚 Books
              </button>
              <button
                onClick={() => navigate('/employee/requests')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/requests' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                📋 Requests
              </button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <button
                onClick={() => navigate('/admin')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                🏠 Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/books')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/admin/books' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                📚 Books
              </button>
              <button
                onClick={() => navigate('/admin/requests')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${location.pathname === '/admin/requests' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                📋 Requests
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
