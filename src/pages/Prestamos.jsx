import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { updatePrestamo, updateLibro, deletePrestamo } from '../services/dbActions';
import { Plus, CheckCircle, Clock, Trash2 } from 'lucide-react';
import AddPrestamoModal from '../components/AddPrestamoModal';

const Prestamos = () => {
  const [showModal, setShowModal] = useState(false);

  const todosPrestamos = useFirebaseData('prestamos') || [];
  const estudiantes = useFirebaseData('estudiantes') || [];
  const libros = useFirebaseData('libros') || [];

  const prestamos = todosPrestamos.map(p => {
     const estudiante = estudiantes.find(e => e.id === p.estudianteId);
     const libro = libros.find(l => l.id === p.libroId);
     return {
       ...p,
       estudianteNombre: estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : 'Eliminado',
       libroTitulo: libro ? libro.titulo : 'Eliminado'
     };
  });

  const handleDevolucion = async (prestamoId, libroId) => {
     if(window.confirm('¿Confirmar devolución de este libro?')) {
        await updatePrestamo(prestamoId, {
           estado: 'devuelto',
           fechaDevuelto: new Date().toISOString().split('T')[0]
        });
        const libro = libros.find(l => l.id === libroId);
        if(libro) {
           await updateLibro(libroId, { cantidad: libro.cantidad + 1 });
        }
     }
  };

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar permanentemente este registro de préstamo?')) {
      await deletePrestamo(id);
    }
  };

  return (
    <div className="fade-in">
      {showModal && <AddPrestamoModal onClose={() => setShowModal(false)} />}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Préstamos y Devoluciones</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuevo Préstamo
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Libro</th>
              <th className="hide-mobile">F. Préstamo</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
              {(!prestamos || prestamos.length === 0) && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                     <Clock size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                     <p>No hay registros de préstamos activos.</p>
                  </td>
                </tr>
              )}
              {prestamos?.map(p => (
                 <tr key={p.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>#{p.id}</td>
                    <td style={{ fontWeight: '600' }}>{p.estudianteNombre}</td>
                    <td style={{ fontWeight: '500' }}>{p.libroTitulo}</td>
                    <td className="hide-mobile">{p.fechaPrestamo}</td>
                    <td>
                       <div style={{ color: p.estado === 'activo' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {p.fechaDevolucionEsperada}
                       </div>
                    </td>
                    <td>
                       {p.estado === 'activo' ? (
                          <span className="badge" style={{ background: 'rgba(251, 192, 45, 0.12)', color: 'var(--accent-gold)', border: '1px solid rgba(251, 192, 45, 0.2)' }}>
                             Pendiente
                          </span>
                       ) : (
                          <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.1)', color: 'var(--primary)' }}>
                             Devuelto
                          </span>
                       )}
                    </td>
                    <td>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {p.estado === 'activo' && (
                             <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDevolucion(p.id, p.libroId)}>
                                Recibir
                             </button>
                          )}
                          <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(p.id)} title="Eliminar Registro">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                 </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prestamos;
