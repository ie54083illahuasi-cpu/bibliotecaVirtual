import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { deleteUsuarioPrivado } from '../services/dbActions';
import { Plus, Search, Trash2, ShieldAlert, Pencil, Key } from 'lucide-react';
import AddUsuarioPrivadoModal from '../components/AddUsuarioPrivadoModal';

const UsuariosPrivados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  const todosUsuarios = useFirebaseData('usuariosPrivados') || [];
  
  // Filtrar usuarios
  const usuarios = todosUsuarios.filter(usr => 
    (usr.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (usr.usuario || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario privado? Perderá el acceso de inmediato.')) {
      await deleteUsuarioPrivado(id);
    }
  };

  return (
    <div className="fade-in">
      {showModal && <AddUsuarioPrivadoModal onClose={() => setShowModal(false)} />}
      {editingUsuario && <AddUsuarioPrivadoModal editUsuario={editingUsuario} onClose={() => setEditingUsuario(null)} />}
      
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h1>Usuarios Zona Privada</h1>
           <p style={{ color: 'var(--text-secondary)' }}>Gestiona los usuarios con acceso autorizado al catálogo privado.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuevo Usuario Privado
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por nombre o usuario..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
         </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Nombre de Usuario (ID)</th>
              <th>Contraseña</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <Key size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No se encontraron usuarios privados registrados.</p>
                </td>
              </tr>
            ) : (
              usuarios.map(usr => (
                <tr key={usr.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{usr.nombre}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{usr.usuario}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{usr.contrasena}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                       <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setEditingUsuario(usr)} title="Editar">
                          <Pencil size={18} />
                       </button>
                       <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(usr.id)} title="Eliminar">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuariosPrivados;
