// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Caricamento...</p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
