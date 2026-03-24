import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Handshake, TrendingUp } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';

const Dashboard = () => {
  const libros = useFirebaseData('libros') || [];
  const estudiantes = useFirebaseData('estudiantes') || [];
  const prestamos = useFirebaseData('prestamos') || [];

  const librosCount = libros.length;
  const estudiantesCount = estudiantes.length;
  
  const prestamosActivos = prestamos.filter(p => p.estado === 'activo');
  const prestamosActivosCount = prestamosActivos.length;

  const devolucionesPendientes = prestamosActivos.filter(p => {
    const today = new Date().toISOString().split('T')[0];
    return p.fechaDevolucionEsperada < today;
  }).length;

  const ultimosLibros = [...libros].reverse().slice(0, 5);
  
  const ultimosPrestamos = [...prestamos].reverse().slice(0, 5).map(p => {
     const estudiante = estudiantes.find(e => e.id === p.estudianteId);
     const libro = libros.find(l => l.id === p.libroId);
     return {
       ...p,
       estudianteNombre: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Eliminado',
       libroTitulo: libro ? libro.titulo : 'Eliminado'
     };
  });

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <h1>Dashboard Principal</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Resumen del estado actual de la Biblioteca.</p>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="stat-card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '14px' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Libros</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{librosCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: '14px' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Estudiantes</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{estudiantesCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '1rem', borderRadius: '14px' }}>
            <Handshake size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Préstamos Activos</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{prestamosActivosCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '14px' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Devoluciones Atrasadas</h3>
            <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>{devolucionesPendientes}</p>
          </div>
        </div>

      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
         <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            <h2>Últimos Libros Añadidos</h2>
            {ultimosLibros.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)' }}>Aún no hay datos disponibles.</p>
            ) : (
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {ultimosLibros.map(libro => (
                    <li key={libro.id} style={{ paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                       <div style={{ fontWeight: '600' }}>{libro.titulo}</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{libro.autor} • {libro.cantidad} copias</div>
                    </li>
                 ))}
               </ul>
            )}
         </div>
         <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            <h2>Préstamos Recientes</h2>
            {ultimosPrestamos.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)' }}>Aún no hay datos disponibles.</p>
            ) : (
               <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {ultimosPrestamos.map(p => (
                    <li key={p.id} style={{ paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                       <div style={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                         <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }}>{p.libroTitulo}</span>
                         <span className="badge" style={{ background: p.estado === 'activo' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: p.estado === 'activo' ? 'var(--warning)' : 'var(--secondary)' }}>
                            {p.estado === 'activo' ? 'Pendiente' : 'Devuelto'}
                         </span>
                       </div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Prestado a: {p.estudianteNombre}</div>
                    </li>
                 ))}
               </ul>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
