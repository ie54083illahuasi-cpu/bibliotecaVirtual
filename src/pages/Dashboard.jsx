import React, { useMemo, useState } from 'react';
import { BookOpen, Users, Handshake, TrendingUp, Clock, PieChart as ChartIcon } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import './Dashboard.css';

const colors = [
  '#0288D1', // Azul Institucional
  '#C62828', // Rojo Institucional
  '#FBC02D', // Dorado
  '#795548', // Marrón
  '#2E7D32', // Verde
  '#EF6C00', // Naranja
  '#6A1B9A', // Púrpura
  '#00695C', // Teal
];

const Dashboard = () => {
  const libros = useFirebaseData('libros') || [];
  const estudiantes = useFirebaseData('estudiantes') || [];
  const prestamos = useFirebaseData('prestamos') || [];

  const [chartMode, setChartMode] = useState('area'); // 'area' o 'grado'
  const [hoveredSlice, setHoveredSlice] = useState(null);

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
    const ultimosPrestamos = [...prestamos].reverse().slice(0, 5).map(p => {
      const estudiante = estudiantes.find(e => e.id === p.estudianteId);
      const libro = libros.find(l => l.id === p.libroId);
      return {
        ...p,
        estudianteNombre: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Eliminado',
        libroTitulo: libro ? libro.titulo : 'Eliminado'
      };
    });

    return { ultimosPrestamos };
  }, [libros, estudiantes, prestamos]);

  // Procesar datos para el gráfico circular
  const chartData = useMemo(() => {
    if (chartMode === 'area') {
      const areasMap = {};
      libros.forEach(l => {
        const area = l.areaCurricular || 'SIN ÁREA';
        areasMap[area] = (areasMap[area] || 0) + 1;
      });
      return Object.keys(areasMap).map((area, idx) => ({
        label: area,
        count: areasMap[area],
        color: colors[idx % colors.length]
      })).sort((a, b) => b.count - a.count);
    } else {
      const gradosMap = {};
      libros.forEach(l => {
        const grado = l.grado || 'SIN CLASIFICAR';
        gradosMap[grado] = (gradosMap[grado] || 0) + 1;
      });
      return Object.keys(gradosMap).map((grado, idx) => ({
        label: grado === 'Todos' ? 'Todos los Grados' : grado,
        count: gradosMap[grado],
        color: colors[idx % colors.length]
      })).sort((a, b) => b.count - a.count);
    }
  }, [libros, chartMode]);

  // Calcular las porciones del gráfico SVG
  const chartSlices = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) return [];
    
    const radius = 50;
    const circumference = 2 * Math.PI * radius; // 314.159
    
    let accumulatedPercent = 0;
    return chartData.map((item) => {
      const percent = item.count / total;
      const strokeDasharray = `${(percent * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
      const strokeDashoffset = (-accumulatedPercent * circumference).toFixed(2);
      accumulatedPercent += percent;
      return {
        ...item,
        strokeDasharray,
        strokeDashoffset,
        percent: (percent * 100).toFixed(1)
      };
    });
  }, [chartData]);

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
          {/* Gráfico circular en lugar de últimos añadidos */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 className="panel-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <ChartIcon size={22} style={{ color: 'var(--primary)' }} /> Distribución de Libros
                </h2>
                <div style={{ display: 'flex', background: 'var(--background)', padding: '0.2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                   <button 
                     type="button"
                     className="btn" 
                     onClick={() => { setChartMode('area'); setHoveredSlice(null); }}
                     style={{ 
                       padding: '0.3rem 0.8rem', 
                       fontSize: '0.8rem', 
                       borderRadius: '16px', 
                       background: chartMode === 'area' ? 'var(--primary)' : 'transparent',
                       color: chartMode === 'area' ? 'white' : 'var(--text-secondary)',
                       boxShadow: chartMode === 'area' ? '0 2px 6px rgba(2,136,209,0.3)' : 'none',
                       border: 'none',
                       cursor: 'pointer'
                     }}
                   >
                      Áreas
                   </button>
                   <button 
                     type="button"
                     className="btn" 
                     onClick={() => { setChartMode('grado'); setHoveredSlice(null); }}
                     style={{ 
                       padding: '0.3rem 0.8rem', 
                       fontSize: '0.8rem', 
                       borderRadius: '16px', 
                       background: chartMode === 'grado' ? 'var(--primary)' : 'transparent',
                       color: chartMode === 'grado' ? 'white' : 'var(--text-secondary)',
                       boxShadow: chartMode === 'grado' ? '0 2px 6px rgba(2,136,209,0.3)' : 'none',
                       border: 'none',
                       cursor: 'pointer'
                     }}
                   >
                      Grados
                   </button>
                </div>
             </div>

             {chartData.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '3rem 0', color: 'var(--text-secondary)' }}>
                   <BookOpen size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                   <p>No hay libros registrados para graficar.</p>
                </div>
             ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', flex: 1 }}>
                   
                   {/* Gráfico de Torta SVG */}
                   <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="180" height="180" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.06))' }}>
                         {chartSlices.map((slice, i) => (
                            <circle
                              key={i}
                              cx="60"
                              cy="60"
                              r="50"
                              fill="transparent"
                              stroke={slice.color}
                              strokeWidth={hoveredSlice === i ? "18" : "15"}
                              strokeDasharray={slice.strokeDasharray}
                              strokeDashoffset={slice.strokeDashoffset}
                              style={{ 
                                transition: 'all 0.3s ease', 
                                cursor: 'pointer'
                              }}
                              onMouseEnter={() => setHoveredSlice(i)}
                              onMouseLeave={() => setHoveredSlice(null)}
                            />
                         ))}
                      </svg>
                      {/* Centro del Donut */}
                      <div style={{ 
                         position: 'absolute', 
                         top: '50%', 
                         left: '50%', 
                         transform: 'translate(-50%, -50%)', 
                         textAlign: 'center', 
                         pointerEvents: 'none' 
                      }}>
                         <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                            {libros.length}
                         </div>
                         <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                            Libros
                         </div>
                      </div>
                   </div>

                   {/* Leyenda */}
                   <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {chartSlices.map((slice, i) => (
                         <div 
                           key={i} 
                           style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'space-between', 
                             padding: '0.3rem 0.5rem',
                             borderRadius: '8px',
                             background: hoveredSlice === i ? 'rgba(2, 136, 209, 0.08)' : 'transparent',
                             transition: 'background 0.2s',
                             cursor: 'pointer'
                           }}
                           onMouseEnter={() => setHoveredSlice(i)}
                           onMouseLeave={() => setHoveredSlice(null)}
                         >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                               <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: slice.color, flexShrink: 0 }}></div>
                               <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {slice.label}
                               </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: '0.5rem' }}>
                               {slice.count} ({slice.percent}%)
                            </span>
                         </div>
                      ))}
                   </div>

                </div>
             )}
          </div>

          {/* Actividad Reciente */}
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
