import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Onboarding } from './components/Onboarding/Onboarding';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <style>{`
                .loader {border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #c3f53c; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;}
                @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
            `}</style>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={!session ? <Login /> : (session.user.email.includes('admin') ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)} />
          <Route path="/register" element={!session ? <Register /> : <Navigate to="/dashboard" replace />} />

          <Route
            path="/onboarding"
            element={session ? <Onboarding /> : <Navigate to="/" replace />}
          />

          <Route
            path="/dashboard"
            element={session ? <Dashboard session={session} /> : <Navigate to="/" replace />}
          />

          <Route
            path="/admin"
            element={session ? <AdminDashboard session={session} /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
