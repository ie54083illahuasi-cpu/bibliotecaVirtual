import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { BookOpen, FolderOpen, ArrowLeft, Smartphone, Plus } from 'lucide-react';
import BookViewer from '../components/BookViewer';
import ManageCategoriasModal from '../components/ManageCategoriasModal';

const AreasCurriculares = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [viewingVirtualBook, setViewingVirtualBook] = useState(null);
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

  const categorias = useFirebaseData('categorias') || [];
  const libros = useFirebaseData('libros') || [];

  const handleSelectArea = (areaNombre) => {
    setSelectedArea(areaNombre);
  };

  const getLibrosPorArea = (areaNombre) => {
    return libros.filter(libro => libro.areaCurricular === areaNombre);
  };

  if (viewingVirtualBook) {
     return <BookViewer url={viewingVirtualBook.urlVirtual} title={viewingVirtualBook.titulo} onClose={() => setViewingVirtualBook(null)} />;
  }

  // Vista de libros dentro de un área específica
  if (selectedArea) {
    const librosArea = getLibrosPorArea(selectedArea);
    return (
    <div className="fade-in">
      <button className="btn btn-secondary" onClick={() => setSelectedArea(null)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Volver a las Áreas
      </button>

      <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(2, 136, 209, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
           <FolderOpen size={24} /> 
        </div>
        <h1>Libros de {selectedArea}</h1>
      </div>

      <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {librosArea.length === 0 ? (
           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-panel">
              <BookOpen size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <h3>No hay libros en esta área</h3>
           </div>
        ) : (
          librosArea.map(libro => (
            <div key={libro.id} className="glass-panel book-card">
                <div className="book-cover-wrapper" style={{ height: '180px' }}>
                   {libro.urlPortada ? (
                      <img src={libro.urlPortada} alt={libro.titulo} className="book-cover-image" />
                   ) : (
                      <div style={{ opacity: 0.3 }}>
                         {libro.tipo === 'virtual' ? <Smartphone size={48} color="var(--primary)" /> : <BookOpen size={48} color="var(--secondary)" />}
                      </div>
                   )}
                </div>

                <div className="book-info">
                   <h3 style={{ fontSize: '1.1rem' }}>{libro.titulo}</h3>
                   <p className="book-author">{libro.autor}</p>
                </div>
                
                <div className="book-card-footer">
                   <span className="badge" style={{ 
                     background: libro.tipo === 'virtual' ? 'rgba(2, 136, 209, 0.1)' : 'rgba(198, 40, 40, 0.1)', 
                     color: libro.tipo === 'virtual' ? 'var(--primary)' : 'var(--secondary)' 
                   }}>
                      {libro.tipo === 'virtual' ? 'Digital' : 'Físico'}
                   </span>
                   {libro.tipo === 'virtual' && (
                      <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem' }} onClick={() => setViewingVirtualBook(libro)}>
                         Leer
                      </button>
                   )}
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Vista principal de Áreas
return (
  <div className="fade-in">
    {showCategoriasModal && <ManageCategoriasModal onClose={() => setShowCategoriasModal(false)} />}
    <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
       <div>
          <h1>Explorar Áreas Curriculares</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Navega por las colecciones organizadas por especialidad.</p>
       </div>
       <button className="btn btn-primary" onClick={() => setShowCategoriasModal(true)}>
          <Plus size={18} /> Gestionar Áreas
       </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
      {categorias.length === 0 ? (
         <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-panel">
            <FolderOpen size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h3>No se han creado áreas aún.</h3>
            <p>Gestiona las áreas desde la sección de Libros.</p>
         </div>
      ) : (
        categorias.map(cat => {
          const count = getLibrosPorArea(cat.nombre).length;
          return (
            <div key={cat.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', transition: 'all 0.3s' }}
                 onClick={() => handleSelectArea(cat.nombre)}
                 onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                 }}
                 onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                 }}>
                
                <div style={{ width: '70px', height: '70px', background: 'rgba(2, 136, 209, 0.08)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                   <FolderOpen size={32} />
                </div>

                <div style={{ textAlign: 'center' }}>
                   <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '700' }}>{cat.nombre}</h3>
                   <span className="badge" style={{ background: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      {count} {count === 1 ? 'Libro' : 'Libros'}
                   </span>
                </div>
            </div>
          )
        })
      )}
    </div>
  </div>
  );
};

export default AreasCurriculares;
