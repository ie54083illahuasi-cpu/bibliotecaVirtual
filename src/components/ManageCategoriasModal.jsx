import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { addCategoria, updateCategoria, deleteCategoria } from '../services/dbActions';
import { X, Trash2, Edit2, Plus, Grip } from 'lucide-react';

const ManageCategoriasModal = ({ onClose }) => {
  const categorias = useFirebaseData('categorias') || [];
  const [nuevaArea, setNuevaArea] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');

  const handleCreateArea = async (e) => {
    e.preventDefault();
    if (!nuevaArea.trim()) return;
    await addCategoria({ nombre: nuevaArea.trim() });
    setNuevaArea('');
  };

  const handleRenameArea = async (id) => {
    if (!editNombre.trim()) return;
    await updateCategoria(id, { nombre: editNombre.trim() });
    setEditingId(null);
    setEditNombre('');
  };

  const handleDeleteArea = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta Área Curricular? Esta acción es irreversible.")) {
       await deleteCategoria(id);
    }
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', animation: 'fadeIn 0.3s', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <h2>Gestión de Áreas Curriculares</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        <form onSubmit={handleCreateArea} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
           <input 
              type="text" 
              className="form-control" 
              placeholder="Nombre de la nueva Área Curricular" 
              value={nuevaArea} 
              onChange={e => setNuevaArea(e.target.value)} 
           />
           <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}><Plus size={18}/> Crear Área</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           {categorias.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No hay Áreas Curriculares creadas aún. ¡Crea tu primera área arriba!</p>}
           
           {categorias.map(cat => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.02)' }}>
                    {editingId === cat.id ? (
                       <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginRight: '1rem' }}>
                          <input type="text" className="form-control" value={editNombre} onChange={e => setEditNombre(e.target.value)} autoFocus />
                          <button className="btn btn-primary" onClick={() => handleRenameArea(cat.id)}>Guardar</button>
                          <button className="btn" onClick={() => setEditingId(null)}>Cancelar</button>
                       </div>
                    ) : (
                       <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.1rem' }}>
                          <Grip size={18} color="var(--text-secondary)" /> {cat.nombre}
                       </h3>
                    )}
                    
                    {editingId !== cat.id && (
                       <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn" style={{ padding: '0.4rem', color: 'var(--text-secondary)', background: 'transparent' }} onClick={() => { setEditingId(cat.id); setEditNombre(cat.nombre); }}>
                             <Edit2 size={16}/>
                          </button>
                          <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)', background: 'transparent' }} onClick={() => handleDeleteArea(cat.id)}>
                             <Trash2 size={16}/>
                          </button>
                       </div>
                    )}
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriasModal;
