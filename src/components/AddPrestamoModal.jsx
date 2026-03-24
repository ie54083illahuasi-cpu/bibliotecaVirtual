import React, { useState } from 'react';
import { addPrestamo, updateLibro } from '../services/dbActions';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { X } from 'lucide-react';

const AddPrestamoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    estudianteId: '', libroId: '', fechaPrestamo: new Date().toISOString().split('T')[0], fechaDevolucionEsperada: ''
  });

  const todosEstudiantes = useFirebaseData('estudiantes') || [];
  const todosLibros = useFirebaseData('libros') || [];
  const estudiantes = todosEstudiantes;
  const libros = todosLibros.filter(l => l.cantidad > 0 && l.tipo === 'fisico');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.estudianteId || !formData.libroId || !formData.fechaDevolucionEsperada) {
       alert('Completa todos los campos obligatorios');
       return;
    }

    try {
      const libroId = formData.libroId; // Firebase ID is string
      const libro = libros.find(l => l.id === libroId);
      if(libro && libro.cantidad > 0) {
         await addPrestamo({
            ...formData,
            estado: 'activo'
         });
         await updateLibro(libroId, { cantidad: libro.cantidad - 1});
      }
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error registrando préstamo.');
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.3s', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>Nuevo Préstamo</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label>Estudiante</label>
                    <select className="form-control" name="estudianteId" value={formData.estudianteId} onChange={handleChange} required>
                       <option value="">-- Seleccionar Estudiante --</option>
                       {estudiantes?.map(est => <option key={est.id} value={est.id}>{est.dni} - {est.nombre} {est.apellidos}</option>)}
                    </select>
                </div>
                <div className="form-group full-width">
                    <label>Libro (Disponibles)</label>
                    <select className="form-control" name="libroId" value={formData.libroId} onChange={handleChange} required>
                       <option value="">-- Seleccionar Libro --</option>
                       {libros?.map(libro => <option key={libro.id} value={libro.id}>{libro.titulo} ({libro.cantidad} disp.)</option>)}
                    </select>
                </div>
                <div className="form-group">
                   <label>Fecha de Préstamo</label>
                   <input required type="date" className="form-control" name="fechaPrestamo" value={formData.fechaPrestamo} onChange={handleChange} />
                </div>
                <div className="form-group">
                   <label>Devolución Esperada</label>
                   <input required type="date" className="form-control" name="fechaDevolucionEsperada" value={formData.fechaDevolucionEsperada} onChange={handleChange} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar Préstamo</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddPrestamoModal;
