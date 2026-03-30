import React, { useState } from 'react';
import { addPrestamo, updateLibro } from '../services/dbActions';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { X } from 'lucide-react';

const AddPrestamoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    estudianteId: '', libroId: '', fechaPrestamo: new Date().toISOString().split('T')[0], fechaDevolucionEsperada: ''
  });
  const [filterGrado, setFilterGrado] = useState('');
  const [filterSeccion, setFilterSeccion] = useState('');

  const todosEstudiantes = useFirebaseData('estudiantes') || [];
  const todosLibros = useFirebaseData('libros') || [];
  
  // Lógica de Filtrado
  const estudiantes = todosEstudiantes.filter(est => {
     const matchGrado = filterGrado ? String(est.grado) === filterGrado : true;
     const matchSeccion = filterSeccion ? String(est.seccion).toUpperCase() === filterSeccion.toUpperCase() : true;
     return matchGrado && matchSeccion;
  });

  const libros = todosLibros.filter(l => l.cantidad > 0 && l.tipo === 'fisico');

  // Obtener opciones únicas para los filtros
  const gradosDisponibles = [...new Set(todosEstudiantes.map(e => String(e.grado)).filter(Boolean))].sort();
  const seccionesDisponibles = [...new Set(todosEstudiantes.map(e => String(e.seccion).toUpperCase()).filter(Boolean))].sort();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.estudianteId || !formData.libroId || !formData.fechaDevolucionEsperada) {
       alert('Completa todos los campos obligatorios');
       return;
    }

    try {
      const libroId = formData.libroId;
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '2rem', animation: 'fadeIn 0.3s', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>Nuevo Préstamo</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(2, 136, 209, 0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
               <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)' }}>Filtrar Estudiantes por:</p>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                     <label style={{ fontSize: '0.75rem' }}>Grado</label>
                     <select className="form-control" value={filterGrado} onChange={(e) => { setFilterGrado(e.target.value); setFormData({...formData, estudianteId: ''}); }}>
                        <option value="">Todos</option>
                        {gradosDisponibles.map(g => <option key={g} value={g}>{g}° Grado</option>)}
                     </select>
                  </div>
                  <div className="form-group">
                     <label style={{ fontSize: '0.75rem' }}>Sección</label>
                     <select className="form-control" value={filterSeccion} onChange={(e) => { setFilterSeccion(e.target.value); setFormData({...formData, estudianteId: ''}); }}>
                        <option value="">Todas</option>
                        {seccionesDisponibles.map(s => <option key={s} value={s}>Sección {s}</option>)}
                     </select>
                  </div>
               </div>
            </div>

            <div className="form-grid">
                <div className="form-group full-width">
                    <label>Seleccionar Estudiante <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({estudiantes.length} encontrados)</span></label>
                    <select className="form-control" name="estudianteId" value={formData.estudianteId} onChange={handleChange} required>
                       <option value="">-- Elige un estudiante --</option>
                       {estudiantes?.map(est => <option key={est.id} value={est.id}>{est.apellidos}, {est.nombre} (DNI: {est.dni})</option>)}
                    </select>
                </div>
                <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
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
