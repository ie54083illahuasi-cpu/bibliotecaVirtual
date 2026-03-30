import React, { useMemo } from 'react';
import { BookOpen, Users, Handshake, TrendingUp, Clock, List } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import './Dashboard.css';

const Dashboard = () => {
  const libros = useFirebaseData('libros') || [];
  const estudiantes = useFirebaseData('estudiantes') || [];
  const prestamos = useFirebaseData('prestamos') || [];

  // Memorizar estadísticas para evitar cálculos en cada renderizado
  const stats = useMemo(() => {
    const librosCount = libros.length;
    const estudiantesCount = estudiantes.length;
    const prestamosActivos = prestamos.filter(p => p.estado === 'activo');
    const today = new Date().toISOString().split('T')[0];
    const devolucionesPendientes = prestamosActivos.filter(p => p.fechaDevolucionEsperada < today).length;

    return {
      librosCount,
      estudiantesCount,
      prestamosActivosCount: prestamosActivos.length,
      devolucionesPendientes
    };
  }, [libros, estudiantes, prestamos]);

  // Memorizar las listas filtradas
  const dataListas = useMemo(() => {
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

    return { ultimosLibros, ultimosPrestamos };
  }, [libros, estudiantes, prestamos]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Resumen General</h1>
        <p>Estado actual de la Biblioteca Institucional 54083.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon icon-libros">
            <BookOpen size={28} />
          </div>
          <div className="stat-info">
            <h3>Libros en Catálogo</h3>
            <p>{stats.librosCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon icon-estudiantes">
            <Users size={28} />
          </div>
          <div className="stat-info">
            <h3>Estudiantes</h3>
            <p>{stats.estudiantesCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon icon-activos">
            <Handshake size={28} />
          </div>
          <div className="stat-info">
            <h3>Préstamos Activos</h3>
            <p>{stats.prestamosActivosCount}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon icon-atrasados">
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <h3>Atrasos Pendientes</h3>
            <p>{stats.devolucionesPendientes}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-content">
         <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="panel-title"><List size={22} style={{ color: 'var(--primary)' }} /> Últimos Añadidos</h2>
            {dataListas.ultimosLibros.length === 0 ? (
               <p className="item-sub">Aún no hay libros en el sistema.</p>
            ) : (
               <ul className="dashboard-list">
                 {dataListas.ultimosLibros.map(libro => (
                    <li key={libro.id} className="list-item">
                       <div className="item-main">
                          <span className="truncate">{libro.titulo}</span>
                          {libro.tipo === 'virtual' && <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.1)', color: 'var(--primary)' }}>E-Book</span>}
                       </div>
                       <div className="item-sub">{libro.autor} • {libro.cantidad} copias</div>
                    </li>
                 ))}
               </ul>
            )}
         </div>

         <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 className="panel-title"><Clock size={22} style={{ color: 'var(--secondary)' }} /> Actividad Reciente</h2>
            {dataListas.ultimosPrestamos.length === 0 ? (
               <p className="item-sub">No hay registros de préstamos recientes.</p>
            ) : (
               <ul className="dashboard-list">
                 {dataListas.ultimosPrestamos.map(p => (
                    <li key={p.id} className="list-item">
                       <div className="item-main">
                          <span className="truncate">{p.libroTitulo}</span>
                          <span className="badge" style={{ 
                            background: p.estado === 'activo' ? 'rgba(251, 192, 45, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                            color: p.estado === 'activo' ? 'var(--accent-gold)' : 'var(--secondary)' 
                          }}>
                             {p.estado === 'activo' ? 'Pendiente' : 'Devuelto'}
                          </span>
                       </div>
                       <div className="item-sub">Prestado a: {p.estudianteNombre}</div>
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
