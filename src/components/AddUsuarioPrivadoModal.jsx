import React, { useState } from 'react';
import { addUsuarioPrivado, updateUsuarioPrivado } from '../services/dbActions';
import { X, Lock, User, UserCheck } from 'lucide-react';

const AddUsuarioPrivadoModal = ({ onClose, editUsuario }) => {
  const [formData, setFormData] = useState(editUsuario || {
    nombre: '', usuario: '', contrasena: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.usuario.trim() || !formData.contrasena.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editUsuario) {
        await updateUsuarioPrivado(editUsuario.id, formData);
      } else {
        await addUsuarioPrivado(formData);
      }
      onClose();
    } catch (err) {
      setError('Ocurrió un error al guardar el usuario.');
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem', animation: 'fadeIn 0.3s', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>{editUsuario ? 'Editar Usuario Privado' : 'Añadir Usuario Privado'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div className="form-group">
                   <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Nombre Completo</label>
                   <div style={{ position: 'relative' }}>
                      <UserCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        required 
                        type="text" 
                        className="form-control" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        placeholder="Nombre Completo" 
                        style={{ paddingLeft: '2.5rem' }}
                      />
                   </div>
                </div>

                <div className="form-group">
                   <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Nombre de Usuario (Login)</label>
                   <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        required 
                        type="text" 
                        className="form-control" 
                        name="usuario" 
                        value={formData.usuario} 
                        onChange={handleChange} 
                        placeholder="Nombre de Usuario" 
                        style={{ paddingLeft: '2.5rem' }}
                        disabled={!!editUsuario} // No permitir cambiar el nombre de usuario ya que sirve de ID
                      />
                   </div>
                </div>

                <div className="form-group">
                   <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Contraseña de Acceso</label>
                   <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                        required 
                        type="text" 
                        className="form-control" 
                        name="contrasena" 
                        value={formData.contrasena} 
                        onChange={handleChange} 
                        placeholder="Escribe la contraseña" 
                        style={{ paddingLeft: '2.5rem' }}
                      />
                   </div>
                </div>

            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editUsuario ? 'Guardar Cambios' : 'Registrar Usuario'}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsuarioPrivadoModal;
