// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Bentornato nel chill 🌿');
      navigate('/dashboard');
    } catch (e) {
      setError('Errore con Google. Riprova.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Compila tutti i campi.');
      return;
    }
    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(email, password);
        toast.success('Benvenuto in ChillSpot 🌿 Il tuo profilo anonimo è pronto.');
      } else {
        await loginWithEmail(email, password);
        toast.success('Bentornato nel chill 🌙');
      }
      navigate('/dashboard');
    } catch (e) {
      const msg = {
        'auth/user-not-found': 'Nessun account trovato con questa email.',
        'auth/wrong-password': 'Password errata.',
        'auth/email-already-in-use': 'Email già in uso.',
        'auth/invalid-email': 'Email non valida.',
        'auth/too-many-requests': 'Troppi tentativi. Aspetta un momento.',
        'auth/invalid-credential': 'Credenziali non valide.',
      }[e.code] || 'Errore di accesso. Riprova.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Sfondo atmosferico */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-sage-800/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-night-800/20 blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #5c8a5c 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🌿</span>
            <span className="font-display text-xl text-white">ChillSpot</span>
          </Link>
          <h1 className="text-white font-medium text-2xl font-display">
            {mode === 'login' ? 'Torna a respirare.' : 'Unisciti in silenzio.'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login'
              ? 'Accedi al tuo profilo anonimo'
              : 'Crea il tuo profilo anonimo gratis'}
          </p>
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl
                       border border-white/10 hover:border-white/20 hover:bg-white/5
                       text-white text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continua con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-white/8" />
            <span className="text-gray-600 text-xs">oppure</span>
            <div className="flex-1 border-t border-white/8" />
          </div>

          {/* Form email */}
          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="input-field"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Password (min. 6 caratteri)' : 'Password'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className="input-field"
            />

            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 animate-fade-in">
                <span>⚠️</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {mode === 'login' ? 'Accedi' : 'Registrati gratis'}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-gray-500">
            {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-sage-400 hover:text-sage-300 transition-colors font-medium"
            >
              {mode === 'login' ? 'Registrati' : 'Accedi'}
            </button>
          </p>
        </div>

        {/* Nota privacy */}
        <p className="text-center text-gray-600 text-xs mt-6 leading-relaxed">
          Il tuo nome reale non sarà mai visibile.{' '}
          Riceverai un nickname anonimo generato automaticamente.
        </p>
      </div>
    </div>
  );
}
