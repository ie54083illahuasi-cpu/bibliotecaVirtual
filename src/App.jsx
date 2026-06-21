import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Libros from './pages/Libros';
import Estudiantes from './pages/Estudiantes';
import Prestamos from './pages/Prestamos';
import PortalEstudiante from './pages/PortalEstudiante';
import AreasCurriculares from './pages/AreasCurriculares';
import Login from './pages/Login';
import UsuariosPrivados from './pages/UsuariosPrivados';
import UsuariosSistema from './pages/UsuariosSistema';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useFirebaseAuth();

  if (authLoading) {
    return (
      <div className="login-container" style={{ justifyContent: 'center' }}>
         <h3 style={{ color: 'var(--text-primary)' }}>Comprobando sesión...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useFirebaseAuth();
  if (user && !user.isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/portal" element={<PortalEstudiante />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <main className="main-content glass-panel">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/areas" element={<AreasCurriculares />} />
                  <Route path="/libros" element={<Libros />} />
                  <Route path="/estudiantes" element={<Estudiantes />} />
                  <Route path="/usuarios-privados" element={
                    <AdminRoute>
                      <UsuariosPrivados />
                    </AdminRoute>
                  } />
                  <Route path="/usuarios-sistema" element={
                    <AdminRoute>
                      <UsuariosSistema />
                    </AdminRoute>
                  } />
                  <Route path="/prestamos" element={<Prestamos />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
