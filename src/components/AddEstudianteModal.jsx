import React, { useState } from 'react';
import { addEstudiante, updateEstudiante } from '../services/dbActions';
import { X } from 'lucide-react';

const AddEstudianteModal = ({ onClose, editEstudiante }) => {
  const [formData, setFormData] = useState(editEstudiante || {
    nombre: '', apellidos: '', dni: '', telefono: '', email: '', grado: '', seccion: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editEstudiante) {
      await updateEstudiante(editEstudiante.id, formData);
    } else {
      await addEstudiante(formData);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>{editEstudiante ? 'Editar Estudiante' : 'Añadir Estudiante'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>DNI / Documento de Identidad</label>
                    <input required type="text" className="form-control" name="dni" value={formData.dni} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group">
                      <label>Nombre(s)</label>
                      <input required type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Apellidos</label>
                      <input required type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} />
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group">
                      <label>Grado</label>
                      <input type="text" className="form-control" name="grado" value={formData.grado} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                      <label>Sección</label>
                      <input type="text" className="form-control" name="seccion" value={formData.seccion} onChange={handleChange} />
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div className="form-group">
                       <label>Teléfono</label>
                       <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
                   </div>
                   <div className="form-group">
                       <label>Correo Electrónico</label>
                       <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                   </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editEstudiante ? 'Guardar Cambios' : 'Guardar Estudiante'}</button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default AddEstudianteModal;
