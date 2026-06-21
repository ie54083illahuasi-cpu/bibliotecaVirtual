import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Handshake, Settings, LogOut, Grid, Lock, ShieldCheck } from 'lucide-react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useFirebaseAuth();

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header" style={{ marginBottom: '1rem', paddingBottom: '1rem' }}>
        <div className="logo-icon" style={{ background: 'transparent', padding: 0 }}>
           <img src="/escudo.png" alt="Escudo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </div>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Biblioteca I.E 54083</h2>
      </div>

      {user && (
        <div className="hide-mobile" style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem', background: 'rgba(2, 136, 209, 0.05)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.2rem', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.nombre}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user.isSuperAdmin ? 'ADMINISTRADOR' : 'COLABORADOR'}</span>
        </div>
      )}

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/areas" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Grid size={20} />
          <span>Áreas Curriculares</span>
        </NavLink>
        <NavLink to="/admin/libros" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <BookOpen size={20} />
          <span>Libros</span>
        </NavLink>
        <NavLink to="/admin/estudiantes" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Users size={20} />
          <span>Estudiantes</span>
        </NavLink>
        
        {user?.isSuperAdmin && (
          <>
            <NavLink to="/admin/usuarios-privados" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Lock size={20} />
              <span>Usuarios Privados</span>
            </NavLink>
            <NavLink to="/admin/usuarios-sistema" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <ShieldCheck size={20} />
              <span>Usuarios del Sistema</span>
            </NavLink>
          </>
        )}
        
        <NavLink to="/admin/prestamos" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Handshake size={20} />
          <span>Préstamos</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
         <button 
            className="nav-item border-none bg-transparent" 
            onClick={() => {
               const isDark = document.body.classList.toggle('dark-mode');
               localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }}
            title="Alternar Modo Oscuro"
         >
            <Settings size={20} />
            <span>Modo Oscuro / Claro</span>
         </button>
         <button 
            className="nav-item border-none bg-transparent" 
            onClick={async () => {
               sessionStorage.removeItem('colaborador_session');
               await signOut(auth);
               window.location.href = '/';
            }}
            style={{ color: 'var(--danger)', marginTop: '0.5rem' }}
         >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
