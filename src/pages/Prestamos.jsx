import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { updatePrestamo, updateLibro } from '../services/dbActions';
import { Plus, CheckCircle, Clock } from 'lucide-react';
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

  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      {showModal && <AddPrestamoModal onClose={() => setShowModal(false)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Préstamos y Devoluciones</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuevo Préstamo
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
            <tr>
              <th>ID P.</th>
              <th>Estudiante</th>
              <th>Libro</th>
              <th>Fecha Préstamo</th>
              <th>Devolución Esperada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
              {(!prestamos || prestamos.length === 0) && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No hay préstamos registrados actualmente.
                  </td>
                </tr>
              )}
              {prestamos?.map(p => (
                 <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td style={{ fontWeight: '500' }}>{p.estudianteNombre}</td>
                    <td>{p.libroTitulo}</td>
                    <td>{p.fechaPrestamo}</td>
                    <td>{p.fechaDevolucionEsperada}</td>
                    <td>
                       {p.estado === 'activo' ? (
                          <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                             <Clock size={12} style={{marginRight: 4}}/> Activo
                          </span>
                       ) : (
                          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>
                             <CheckCircle size={12} style={{marginRight: 4}}/> Devuelto
                          </span>
                       )}
                    </td>
                    <td>
                       {p.estado === 'activo' && (
                          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }} onClick={() => handleDevolucion(p.id, p.libroId)}>
                             Recibir Devolución
                          </button>
                       )}
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
