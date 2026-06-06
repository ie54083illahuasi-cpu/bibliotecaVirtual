import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { deleteLibro } from '../services/dbActions';
import { Plus, Search, BookOpen, Smartphone, Trash2, Pencil } from 'lucide-react';
import AddLibroModal from '../components/AddLibroModal';
import BookViewer from '../components/BookViewer';

const Libros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLibro, setEditingLibro] = useState(null);
  const [viewingVirtualBook, setViewingVirtualBook] = useState(null);
  
  const todosLibros = useFirebaseData('libros') || [];
  const libros = todosLibros.filter(libro => 
    (libro.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (libro.autor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (libro.areaCurricular || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este libro?')) {
      await deleteLibro(id);
    }
  };

  return (
    <div className="fade-in">
      {showModal && <AddLibroModal onClose={() => setShowModal(false)} />}
      {editingLibro && <AddLibroModal editLibro={editingLibro} onClose={() => setEditingLibro(null)} />}
      {viewingVirtualBook && <BookViewer url={viewingVirtualBook.urlVirtual} title={viewingVirtualBook.titulo} onClose={() => setViewingVirtualBook(null)} />}
      
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Gestión de Libros</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
             <Plus size={18} /> Añadir Libro
           </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por título, autor o área..." 
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
              <th>Portada</th>
              <th>Información del Libro</th>
              <th className="hide-mobile">Edición</th>
              <th>Tipo</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros?.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <BookOpen size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No se encontraron libros en el catálogo.</p>
                </td>
              </tr>
            )}
            {libros?.map(libro => (
              <tr key={libro.id}>
                <td style={{ width: '80px' }}>
                    <div style={{ width: '45px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--background)' }}>
                       {libro.urlPortada ? (
                          <img src={libro.urlPortada} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {libro.tipo === 'virtual' ? <Smartphone size={20} color="var(--primary)" style={{ opacity: 0.5 }} /> : <BookOpen size={20} color="var(--secondary)" style={{ opacity: 0.5 }} />}
                          </div>
                       )}
                    </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{libro.titulo}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{libro.autor}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {libro.areaCurricular && (
                       <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.08)', color: 'var(--primary)', border: 'none' }}>
                          {libro.areaCurricular}
                       </span>
                    )}
                    {libro.destinatario && (
                       <span className="badge" style={{ background: 'rgba(121, 85, 72, 0.08)', color: 'var(--accent-brown)', border: 'none' }}>
                          {libro.destinatario}
                       </span>
                    )}
                    {libro.grado && (
                       <span className="badge" style={{ background: 'rgba(251, 192, 45, 0.15)', color: 'var(--accent-gold)', border: 'none' }}>
                          {libro.grado}
                       </span>
                    )}
                    <span className="badge" style={{ 
                      background: libro.acceso === 'privado' ? 'rgba(229, 62, 98, 0.1)' : 'rgba(76, 175, 80, 0.1)', 
                      color: libro.acceso === 'privado' ? 'var(--danger)' : '#2E7D32',
                      border: 'none' 
                    }}>
                       {libro.acceso === 'privado' ? 'Privado' : 'Público'}
                    </span>
                  </div>
                </td>
                <td className="hide-mobile">{libro.edicion || '-'}</td>
                <td>
                  <span className="badge" style={{ 
                    background: libro.tipo === 'virtual' ? 'rgba(2, 136, 209, 0.1)' : 'rgba(198, 40, 40, 0.1)', 
                    color: libro.tipo === 'virtual' ? 'var(--primary)' : 'var(--secondary)' 
                  }}>
                     {libro.tipo === 'virtual' ? 'Digital' : 'Físico'}
                  </span>
                </td>
                <td>
                   <div style={{ fontWeight: '500' }}>{libro.cantidad}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ejemplares</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    {libro.tipo === 'virtual' && (
                       <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--primary)' }} onClick={() => setViewingVirtualBook(libro)} title="Leer">
                          <BookOpen size={18} />
                       </button>
                    )}
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setEditingLibro(libro)} title="Editar">
                       <Pencil size={18} />
                    </button>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(libro.id)} title="Eliminar">
                       <Trash2 size={18}/>
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

export default Libros;
