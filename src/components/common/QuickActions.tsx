import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🚀 Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/admin/books')}
          className="quick-action-card"
        >
          <span className="font-bold text-center">
            📚 Manage Books
          </span>
        </button>
        
        <button 
          onClick={() => navigate('/admin/requests')}
          className="quick-action-card"
        >
          <span className="font-bold text-center">
            📋 Review Requests
          </span>
        </button>
        
        <button 
          onClick={() => navigate('/admin')}
          className="quick-action-card"
        >
          <span className="font-bold text-center">
            📊 View Reports
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
