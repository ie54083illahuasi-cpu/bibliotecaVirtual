import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { deleteLibro } from '../services/dbActions';
import { Plus, Search, BookOpen, Smartphone, Trash2 } from 'lucide-react';
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
    (libro.autor || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este libro?')) {
      await deleteLibro(id);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      {showModal && <AddLibroModal onClose={() => setShowModal(false)} />}
      {editingLibro && <AddLibroModal editLibro={editingLibro} onClose={() => setEditingLibro(null)} />}
      {viewingVirtualBook && <BookViewer url={viewingVirtualBook.urlVirtual} title={viewingVirtualBook.titulo} onClose={() => setViewingVirtualBook(null)} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Gestión de Libros</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Añadir Libro
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por título o autor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
         </div>
         <button className="btn btn-secondary glass-panel" style={{ background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
           Filtros
         </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
            <tr>
              <th>ID</th>
              <th>Título y Autor</th>
              <th>Edición</th>
              <th>Tipo</th>
              <th>Inventario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros?.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No se encontraron libros. Añade tu primer libro a la biblioteca.
                </td>
              </tr>
            )}
            {libros?.map(libro => (
              <tr key={libro.id}>
                <td>{libro.id}</td>
                <td>
                  <div style={{ fontWeight: '500' }}>{libro.titulo}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{libro.autor}</div>
                </td>
                <td>{libro.edicion}</td>
                <td>
                  <span className="badge" style={{ background: libro.tipo === 'virtual' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: libro.tipo === 'virtual' ? 'var(--primary)' : 'var(--secondary)' }}>
                     {libro.tipo === 'virtual' ? <Smartphone size={12} style={{marginRight: 4}}/> : <BookOpen size={12} style={{marginRight: 4}}/>}
                     {libro.tipo === 'virtual' ? 'Virtual' : 'Físico'}
                  </span>
                </td>
                <td>{libro.cantidad} disponibles</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {libro.tipo === 'virtual' && (
                       <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--primary)' }} onClick={() => setViewingVirtualBook(libro)}>Leer</button>
                    )}
                    <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setEditingLibro(libro)}>Editar</button>
                    <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(libro.id)}><Trash2 size={16}/></button>
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
