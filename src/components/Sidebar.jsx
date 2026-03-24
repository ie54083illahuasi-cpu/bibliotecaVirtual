import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Handshake, Settings, LogOut, Grid } from 'lucide-react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
           <BookOpen size={32} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Biblioteca I.E 54083</h2>
        <span className="badge" style={{ background: 'var(--primary)', color: 'white', marginLeft: 'auto' }}>Pro</span>
      </div>

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
            onClick={async () => { await signOut(auth); window.location.href = '/'; }}
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
