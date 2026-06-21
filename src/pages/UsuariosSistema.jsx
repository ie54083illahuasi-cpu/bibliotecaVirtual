import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { deleteUsuarioSistema } from '../services/dbActions';
import { Plus, Search, Trash2, Pencil, Key, ShieldCheck } from 'lucide-react';
import AddUsuarioSistemaModal from '../components/AddUsuarioSistemaModal';

const UsuariosSistema = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  const todosUsuarios = useFirebaseData('usuariosSistema') || [];
  
  // Filtrar usuarios
  const usuarios = todosUsuarios.filter(usr => 
    (usr.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (usr.usuario || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este colaborador? Perderá el acceso administrativo de inmediato.')) {
      await deleteUsuarioSistema(id);
    }
  };

  return (
    <div className="fade-in">
      {showModal && <AddUsuarioSistemaModal onClose={() => setShowModal(false)} />}
      {editingUsuario && <AddUsuarioSistemaModal editUsuario={editingUsuario} onClose={() => setEditingUsuario(null)} />}
      
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h1>Usuarios del Sistema</h1>
           <p style={{ color: 'var(--text-secondary)' }}>Gestiona los usuarios colaboradores con acceso de edición y registro de préstamos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuevo Colaborador
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
                  <ShieldCheck size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No se encontraron colaboradores registrados.</p>
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

export default UsuariosSistema;
