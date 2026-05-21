// src/components/BottomNav.jsx
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/dashboard', label: 'Esplora', icon: '🗺️' },
  { to: '/add', label: 'Aggiungi', icon: '✦', isAdd: true },
  { to: '/profile', label: 'Profilo', icon: '🌿' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/5 px-4 pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map(tab => {
          const active = pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all duration-200 ${
                tab.isAdd
                  ? 'bg-sage-500 text-white shadow-glow-sage scale-110 -mt-4 px-5 py-3'
                  : active
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className={tab.isAdd ? 'text-xl font-bold' : 'text-xl'}>
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
