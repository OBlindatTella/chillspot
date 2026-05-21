// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SpotDetail from './pages/SpotDetail';
import ProfilePage from './pages/ProfilePage';
import AddSpotPage from './pages/AddSpotPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import InstallPWA from './components/InstallPWA';
import { useLocation } from 'react-router-dom';

function AppLayout({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const isLogin = pathname === '/login';
  const showNav = user && !isLanding && !isLogin;

  return (
    <div className="min-h-screen bg-dark-900">
      {showNav && <Navbar />}
      <main className={showNav ? 'pb-20 md:pb-0 md:pt-16' : ''}>
        {children}
      </main>
      {showNav && <BottomNav />}
      <InstallPWA />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spot/:id" element={<SpotDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add" element={<AddSpotPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
