import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Search, BookOpen, Smartphone, Library, LogOut } from 'lucide-react';
import BookViewer from '../components/BookViewer';
import { useNavigate } from 'react-router-dom';

const PortalEstudiante = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingVirtualBook, setViewingVirtualBook] = useState(null);
  const [filtroArea, setFiltroArea] = useState('');

  // Solo traemos los libros virtuales para el catálogo público
  const todosLibros = useFirebaseData('libros') || [];
  
  // Extraer áreas únicas de libros virtuales
  const virtualesBase = todosLibros.filter(l => l.tipo === 'virtual');
  const areasUnicas = [...new Set(virtualesBase.map(l => l.areaCurricular).filter(Boolean))];

  const librosVirtuales = virtualesBase.filter(libro => {
    const matchBusqueda = (libro.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (libro.autor || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchArea = filtroArea ? libro.areaCurricular === filtroArea : true;
    return matchBusqueda && matchArea;
  });

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '2rem', background: 'var(--bg-color)', color: 'var(--text-primary)', animation: 'fadeIn 0.5s', position: 'relative' }}>
      {/* Fondo decorativo */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>

      {viewingVirtualBook && <BookViewer url={viewingVirtualBook.urlVirtual} title={viewingVirtualBook.titulo} onClose={() => setViewingVirtualBook(null)} />}

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
           <button onClick={() => navigate('/')} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <LogOut size={18} /> Salir al Inicio
           </button>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '1rem', border: '1px solid var(--border)' }}>
             <Library size={48} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Biblioteca Digital</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Explora y lee nuestra colección de e-books interactivos desde cualquier lugar.
          </p>
        </header>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto 3rem auto', borderRadius: '30px' }}>
           <div style={{ position: 'relative' }}>
              <Search size={24} style={{ position: 'absolute', left: '20px', top: '12px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Busca por título del libro o nombre del autor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3.5rem', border: 'none', background: 'transparent', fontSize: '1.1rem', width: '100%', outline: 'none', color: 'var(--text-primary)' }}
              />
           </div>
           
           {areasUnicas.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                 <select className="form-control" style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.2)', border: 'none' }} value={filtroArea} onChange={e => setFiltroArea(e.target.value)}>
                    <option value="">Todas las Áreas</option>
                    {areasUnicas.map(area => <option key={area} value={area}>{area}</option>)}
                 </select>
              </div>
           )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
          {librosVirtuales?.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <h3>No se encontraron libros virtuales</h3>
                <p>Intenta con otra búsqueda o solicita nuevos libros a la administración.</p>
             </div>
          ) : (
            librosVirtuales?.map(libro => (
              <div key={libro.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }}
                   onClick={() => setViewingVirtualBook(libro)}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(16, 185, 129, 0.2))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <Smartphone size={48} color="var(--primary)" style={{ opacity: 0.8 }} />
                  </div>

                  <div style={{ flex: 1 }}>
                     <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', lineHeight: 1.3 }}>{libro.titulo}</h3>
                     <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{libro.autor}</p>
                     {libro.areaCurricular && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'inline-block', background: 'rgba(79, 70, 229, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                           {libro.areaCurricular}
                        </div>
                     )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                     <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                        Libro Virtual
                     </span>
                     <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '20px' }} onClick={(e) => { e.stopPropagation(); setViewingVirtualBook(libro); }}>
                        Leer Ahora
                     </button>
                  </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalEstudiante;
