import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Lock, ChevronRight, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleStudentAccess = () => {
    navigate('/portal');
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-color)', overflow: 'hidden', zIndex: 1000
    }}>
      {/* Elementos Decorativos de Fondo */}
      <div className="bg-shape shape1" style={{ width: '600px', height: '600px', position: 'absolute', top: '-20%', left: '-10%' }}></div>
      <div className="bg-shape shape2" style={{ width: '500px', height: '500px', position: 'absolute', bottom: '-20%', right: '-10%' }}></div>

      <div style={{ maxWidth: '1000px', width: '90%', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInDown 0.8s' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>E-Biblioteca</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Selecciona tu rol para ingresar al sistema</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Tarjeta de Estudiante */}
          <div className="glass-panel" 
               style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s', animation: 'fadeInLeft 0.8s' }}
               onClick={handleStudentAccess}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
               <Users size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Soy Estudiante</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1 }}>
               Acceso libre y directo al catálogo digital. Busca, explora y lee los libros virtuales alojados en nuestra biblioteca sin necesidad de contraseña.
            </p>
            
            <button className="btn btn-primary" style={{ border: 'none', background: 'var(--secondary)', width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '30px', padding: '1rem' }}>
               Entrar al Catálogo <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </div>

          {/* Tarjeta de Administrador */}
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeInRight 0.8s' }}>
            
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
               <Shield size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Soy Administrador</h2>
            
            {!showAdminLogin ? (
              <>
                 <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1 }}>
                    Acceso exclusivo para el personal bibliotecario. Gestiona el inventario, estudiantes, préstamos y visualiza las estadísticas en tiempo real.
                 </p>
                 <button className="btn btn-primary" onClick={() => setShowAdminLogin(true)} style={{ width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '30px', padding: '1rem' }}>
                    Identificarse <ChevronRight size={20} style={{ marginLeft: '10px' }} />
                 </button>
              </>
            ) : (
              <form onSubmit={handleAdminLogin} style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'fadeIn 0.4s' }}>
                 <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Por favor, ingresa tu contraseña maestra.<br/>
                    <small style={{opacity: 0.5}}>(Hint provisional: admin123)</small>
                 </p>
                 
                 <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Lock size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingLeft: '3rem', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: error ? '1px solid var(--danger)' : '1px solid var(--border)' }}
                      autoFocus
                    />
                    {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', position: 'absolute', left: 0, bottom: '-20px' }}>Contraseña incorrecta</span>}
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" className="btn" onClick={() => setShowAdminLogin(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', flex: 1 }}>
                       Volver
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                       Ingresar
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
