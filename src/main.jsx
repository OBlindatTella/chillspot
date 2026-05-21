// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1c2633',
              color: '#e6ede6',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            },
            success: {
              iconTheme: { primary: '#5c8a5c', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#e05252', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
