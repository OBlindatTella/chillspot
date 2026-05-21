// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Esplora' },
    { to: '/add', label: '+ Spot' },
    { to: '/profile', label: 'Profilo' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-4 glass border-b border-white/5">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl">🌿</span>
        <span className="font-display text-lg text-white font-medium tracking-tight">
          ChillSpot
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              link.to === '/add'
                ? 'bg-sage-500/20 text-sage-300 hover:bg-sage-500/30 border border-sage-500/20'
                : pathname === link.to
                ? 'text-white bg-white/8'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Profilo */}
      {profile && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-2xl">
            <span className="text-base">{profile.avatarStyle?.emoji || '🌿'}</span>
            <span className="text-xs text-gray-300 font-medium">{profile.anonymousName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-300 text-xs px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
          >
            Esci
          </button>
        </div>
      )}
    </nav>
  );
}
