import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { BookOpen, FolderOpen, ArrowLeft, Smartphone } from 'lucide-react';
import BookViewer from '../components/BookViewer';

const AreasCurriculares = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [viewingVirtualBook, setViewingVirtualBook] = useState(null);

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
      <div style={{ animation: 'fadeIn 0.5s' }}>
        <button className="btn" onClick={() => setSelectedArea(null)} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          <ArrowLeft size={18} /> Volver a las Áreas Curriculares
        </button>

        <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <FolderOpen size={28} color="var(--primary)" /> 
          Libros de {selectedArea}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {librosArea.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No hay libros registrados en esta área</h3>
             </div>
          ) : (
            librosArea.map(libro => (
              <div key={libro.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                     {libro.urlPortada ? (
                        <img src={libro.urlPortada} alt={libro.titulo} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }} />
                     ) : (
                        libro.tipo === 'virtual' ? <Smartphone size={40} color="var(--primary)" /> : <BookOpen size={40} color="var(--secondary)" />
                     )}
                  </div>

                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', lineHeight: 1.3 }}>{libro.titulo}</h3>
                     <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{libro.autor}</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                     <span className="badge" style={{ background: libro.tipo === 'virtual' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: libro.tipo === 'virtual' ? 'var(--primary)' : 'var(--secondary)' }}>
                        {libro.tipo === 'virtual' ? 'Virtual' : 'Físico'}
                     </span>
                     {libro.tipo === 'virtual' && (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }} onClick={() => setViewingVirtualBook(libro)}>
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
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <h1 style={{ marginBottom: '2rem' }}>Explorar Áreas Curriculares</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {categorias.length === 0 ? (
           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <FolderOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Aún no se han creado áreas curriculares.</h3>
              <p>Ve a "Libros -&gt; Gestionar Áreas Curriculares" para añadir tu primera área.</p>
           </div>
        ) : (
          categorias.map(cat => {
            const count = getLibrosPorArea(cat.nombre).length;
            return (
              <div key={cat.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                   onClick={() => handleSelectArea(cat.nombre)}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ width: '80px', height: '80px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <FolderOpen size={36} color="var(--primary)" />
                  </div>

                  <h3 style={{ margin: 0, textAlign: 'center', fontSize: '1.2rem' }}>{cat.nombre}</h3>
                  <span className="badge" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                     {count} {count === 1 ? 'Libro' : 'Libros'} registrados
                  </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default AreasCurriculares;
