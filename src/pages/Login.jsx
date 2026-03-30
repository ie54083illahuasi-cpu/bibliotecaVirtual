import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Lock, ChevronRight, ArrowRight, User } from 'lucide-react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentAccess = () => {
    navigate('/portal');
  };

  return (
    <div className="login-container">
      {/* Fondo decorativo */}
      <div className="login-bg-decorations">
         <div className="bg-shape shape1"></div>
         <div className="bg-shape shape2"></div>
      </div>

      <div className="login-content">
        <header className="login-header">
          <div className="login-logo-container">
             <img src="/escudo.png" alt="Escudo I.E 54083" className="login-logo" />
          </div>
          <h1 className="login-title">Biblioteca Virtual I.E 54083</h1>
          <p className="login-subtitle">Selecciona tu rol para ingresar al sistema</p>
        </header>

        <div className="role-cards-grid">
          
          {/* Tarjeta de Estudiante */}
          <div className="glass-panel role-card student-card" onClick={handleStudentAccess}>
            <div className="role-icon-wrapper student-icon-wrapper">
               <Users size={40} />
            </div>
            
            <h2>Soy Estudiante</h2>
            <p className="role-description">
               Acceso libre al catálogo digital. Explora y lee los libros virtuales alojados en nuestra biblioteca sin necesidad de contraseña.
            </p>
            
            <button className="btn btn-primary" style={{ background: 'var(--secondary)', width: '100%', borderRadius: '30px' }}>
               Entrar al Catálogo <ArrowRight size={20} />
            </button>
          </div>

          {/* Tarjeta de Administrador */}
          <div className="glass-panel role-card admin-card">
            <div className="role-icon-wrapper admin-icon-wrapper">
               <Shield size={40} />
            </div>
            
            <h2>Soy Administrador</h2>
            
            {!showAdminLogin ? (
              <>
                 <p className="role-description">
                    Acceso exclusivo para el personal bibliotecario. Gestiona el inventario, estudiantes, préstamos y estadísticas.
                 </p>
                 <button className="btn btn-primary" onClick={() => setShowAdminLogin(true)} style={{ width: '100%', borderRadius: '30px' }}>
                    Identificarse <ChevronRight size={20} />
                 </button>
              </>
            ) : (
              <form onSubmit={handleAdminLogin} className="login-form">
                 <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Ingresa tus credenciales de administrador.
                 </p>
                 
                 <div className="input-group">
                    <User size={20} className="input-icon" />
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                 </div>

                 <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ borderColor: error ? 'var(--danger)' : 'var(--border)' }}
                      required
                    />
                    {error && <span className="error-message">Credenciales incorrectas</span>}
                 </div>

                 <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAdminLogin(false)} style={{ flex: 1 }}>
                       Volver
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                       {loading ? '...' : 'Ingresar'}
                    </button>
                 </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
