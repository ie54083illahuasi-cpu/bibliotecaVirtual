import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Libros from './pages/Libros';
import Estudiantes from './pages/Estudiantes';
import Prestamos from './pages/Prestamos';
import PortalEstudiante from './pages/PortalEstudiante';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isAdmin) {
    // Si intentas acceder a admin y no estás logueado, ve al inicio
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Ruta Pública (Estudiantes) */}
        <Route path="/portal" element={<PortalEstudiante />} />
        
        {/* Rutas Administrativas Protegidas */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <main className="main-content glass-panel" style={{ padding: '2rem' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/libros" element={<Libros />} />
                  <Route path="/estudiantes" element={<Estudiantes />} />
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
