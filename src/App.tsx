import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/common/Navbar';
import NotificationList from './components/common/NotificationList';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load components for code splitting
const Login = lazy(() => import('./components/Auth/Login'));
const EmployeeDashboard = lazy(() => import('./components/EmployeePortal/Dashboard'));
const AdminDashboard = lazy(() => import('./components/AdminPortal/Dashboard'));
const BookCatalog = lazy(() => import('./components/EmployeePortal/BookCatalog'));
const RequestHistory = lazy(() => import('./components/EmployeePortal/RequestHistory'));
const ManageBooks = lazy(() => import('./components/AdminPortal/ManageBooks'));
const ManageRequests = lazy(() => import('./components/AdminPortal/ManageRequests'));

function App() {
  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[50vh] flex-col gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      <div className="text-gray-600 text-lg">Loading...</div>
    </div>
  );

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1 w-full min-h-[calc(100vh-64px)]">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/employee"
                    element={
                      <ProtectedRoute requiredRole="employee">
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/books"
                    element={
                      <ProtectedRoute requiredRole="employee">
                        <BookCatalog />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employee/requests"
                    element={
                      <ProtectedRoute requiredRole="employee">
                        <RequestHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/books"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ManageBooks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/requests"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ManageRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </main>
            <NotificationList />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
