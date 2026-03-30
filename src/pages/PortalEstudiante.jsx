import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Search, BookOpen, Smartphone, LogOut } from 'lucide-react';
import BookViewer from '../components/BookViewer';
import { useNavigate } from 'react-router-dom';
import './PortalEstudiante.css';

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
    <div className="portal-container">
      {/* Fondo decorativo */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>

      {viewingVirtualBook && <BookViewer url={viewingVirtualBook.urlVirtual} title={viewingVirtualBook.titulo} onClose={() => setViewingVirtualBook(null)} />}

      <div className="portal-content">
        
        <div className="portal-top-actions">
           <button onClick={() => navigate('/')} className="btn btn-secondary glass-panel">
              <LogOut size={18} /> Salir al Inicio
           </button>
        </div>

        <header className="portal-header">
          <div className="portal-logo-wrapper">
             <img src="/escudo.png" alt="Escudo I.E 54083" className="portal-logo" />
          </div>
          <h1>Biblioteca Virtual I.E 54083</h1>
          <p>
            Explora y lee nuestra colección de e-books interactivos desde cualquier lugar.
          </p>
        </header>

        <div className="glass-panel search-filter-panel">
           <div className="search-input-wrapper">
              <Search size={24} className="search-icon" />
              <input 
                type="text" 
                className="portal-search-input" 
                placeholder="Busca por título o autor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           {areasUnicas.length > 0 && (
              <div className="area-filters">
                 <select className="form-control area-select" value={filtroArea} onChange={e => setFiltroArea(e.target.value)}>
                    <option value="">Todas las Áreas</option>
                    {areasUnicas.map(area => <option key={area} value={area}>{area}</option>)}
                 </select>
              </div>
           )}
        </div>

        <div className="books-grid">
          {librosVirtuales?.length === 0 ? (
             <div className="empty-state glass-panel">
                <BookOpen size={64} style={{ opacity: 0.1, color: 'var(--primary)' }} />
                <h3>No se encontraron libros virtuales</h3>
                <p>Intenta con otra búsqueda o solicita nuevos libros a la administración.</p>
             </div>
          ) : (
            librosVirtuales?.map(libro => (
              <div key={libro.id} className="glass-panel book-card" onClick={() => setViewingVirtualBook(libro)}>
                  <div className="book-cover-wrapper">
                     {libro.urlPortada ? (
                        <img src={libro.urlPortada} alt={libro.titulo} className="book-cover-image" />
                     ) : (
                        <Smartphone size={64} color="var(--primary)" style={{ opacity: 0.4 }} />
                     )}
                  </div>

                  <div className="book-info">
                     <h3>{libro.titulo}</h3>
                     <p className="book-author">{libro.autor}</p>
                     {libro.areaCurricular && (
                        <span className="book-area-badge">
                           {libro.areaCurricular}
                        </span>
                     )}
                  </div>
                  
                  <div className="book-card-footer">
                     <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.1)', color: 'var(--primary)' }}>
                        E-Book
                     </span>
                     <button className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem' }} onClick={(e) => { e.stopPropagation(); setViewingVirtualBook(libro); }}>
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
