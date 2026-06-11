import React, { useState } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { Search, BookOpen, Smartphone, LogOut, Users, GraduationCap, Lock, User, Key } from 'lucide-react';
import BookViewer from '../components/BookViewer';
import { useNavigate } from 'react-router-dom';
import './PortalEstudiante.css';

const PortalEstudiante = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('estudiantes');
  
  // Autenticación de Zona Privada
  const [isPrivateAuth, setIsPrivateAuth] = useState(() => {
    return sessionStorage.getItem('private_auth') === 'true';
  });
  const [privateUserName, setPrivateUserName] = useState(() => {
    return sessionStorage.getItem('private_user_name') || '';
  });

  // Estados independientes para Estudiantes
  const [searchEstudiantes, setSearchEstudiantes] = useState('');
  const [areaEstudiantes, setAreaEstudiantes] = useState('');
  const [gradoEstudiantes, setGradoEstudiantes] = useState('');

  // Estados independientes para Docentes
  const [searchDocentes, setSearchDocentes] = useState('');
  const [areaDocentes, setAreaDocentes] = useState('');
  const [gradoDocentes, setGradoDocentes] = useState('');

  // Estados independientes para Zona Privada
  const [searchPrivado, setSearchPrivado] = useState('');
  const [areaPrivado, setAreaPrivado] = useState('');
  const [gradoPrivado, setGradoGrado] = useState('');

  // Formulario de login privado
  const [loginUsuario, setLoginUsuario] = useState('');
  const [loginContrasena, setLoginContrasena] = useState('');
  const [loginError, setLoginError] = useState('');

  const [viewingVirtualBook, setViewingVirtualBook] = useState(null);

  // Traer colecciones de Firebase
  const todosLibros = useFirebaseData('libros') || [];
  const todosUsuariosPrivados = useFirebaseData('usuariosPrivados') || [];

  const virtualesBase = todosLibros.filter(l => l.tipo === 'virtual');

  // Dividir libros por destinatario y nivel de acceso
  // Los libros privados se ocultan de las pestañas públicas
  const librosEstudiantesBase = virtualesBase.filter(l => 
    l.acceso !== 'privado' && (l.destinatario === 'Estudiantes' || l.destinatario === 'Ambos' || !l.destinatario)
  );
  const librosDocentesBase = virtualesBase.filter(l => 
    l.acceso !== 'privado' && (l.destinatario === 'Docentes' || l.destinatario === 'Ambos')
  );
  const librosPrivadosBase = virtualesBase.filter(l => 
    l.acceso === 'privado'
  );

  // Obtener libros base y filtros según la pestaña activa
  const isEstudiantes = activeTab === 'estudiantes';
  const isDocentes = activeTab === 'docentes';
  const isPrivado = activeTab === 'privado';

  const librosBasePestaña = isEstudiantes 
    ? librosEstudiantesBase 
    : isDocentes 
      ? librosDocentesBase 
      : librosPrivadosBase;
  
  const currentSearch = isEstudiantes 
    ? searchEstudiantes 
    : isDocentes 
      ? searchDocentes 
      : searchPrivado;

  const setCurrentSearch = isEstudiantes 
    ? setSearchEstudiantes 
    : isDocentes 
      ? setSearchDocentes 
      : setSearchPrivado;
  
  const currentArea = isEstudiantes 
    ? areaEstudiantes 
    : isDocentes 
      ? areaDocentes 
      : areaPrivado;

  const setCurrentArea = isEstudiantes 
    ? setAreaEstudiantes 
    : isDocentes 
      ? setAreaDocentes 
      : setAreaPrivado;

  const currentGrado = isEstudiantes 
    ? gradoEstudiantes 
    : isDocentes 
      ? gradoDocentes 
      : gradoPrivado;

  const setCurrentGrado = isEstudiantes 
    ? setGradoEstudiantes 
    : isDocentes 
      ? setGradoDocentes 
      : setGradoGrado;

  // Extraer áreas únicas dinámicamente para la sección activa
  const areasUnicas = [...new Set(librosBasePestaña.map(l => l.areaCurricular).filter(Boolean))];

  // Filtrar libros
  const librosFiltrados = librosBasePestaña.filter(libro => {
    const matchBusqueda = (libro.titulo || '').toLowerCase().includes(currentSearch.toLowerCase()) || 
                          (libro.autor || '').toLowerCase().includes(currentSearch.toLowerCase());
    
    const matchArea = currentArea ? libro.areaCurricular === currentArea : true;
    
    const matchGrado = currentGrado 
      ? (libro.grado === currentGrado || libro.grado === 'Todos') 
      : true;

    return matchBusqueda && matchArea && matchGrado;
  });

  const handlePrivateLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const matchedUser = todosUsuariosPrivados.find(u => 
      (u.usuario || '').toLowerCase() === loginUsuario.trim().toLowerCase() && 
      u.contrasena === loginContrasena
    );
    
    if (matchedUser) {
      setIsPrivateAuth(true);
      setPrivateUserName(matchedUser.nombre);
      sessionStorage.setItem('private_auth', 'true');
      sessionStorage.setItem('private_user_name', matchedUser.nombre);
      setLoginUsuario('');
      setLoginContrasena('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handlePrivateLogout = () => {
    setIsPrivateAuth(false);
    setPrivateUserName('');
    sessionStorage.removeItem('private_auth');
    sessionStorage.removeItem('private_user_name');
  };

  return (
    <div className="portal-container">
      {/* Fondo decorativo */}
      <div className="bg-shape shape1"></div>
      <div className="bg-shape shape2"></div>

      {viewingVirtualBook && (
        <BookViewer 
          url={viewingVirtualBook.urlVirtual} 
          title={viewingVirtualBook.titulo} 
          materialDidactico={viewingVirtualBook.materialDidactico}
          onClose={() => setViewingVirtualBook(null)} 
        />
      )}

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

        {/* Pestañas de Navegación (Secciones) */}
        <div className="portal-tabs">
          <button 
            className={`portal-tab ${isEstudiantes ? 'active' : ''}`}
            onClick={() => setActiveTab('estudiantes')}
          >
            <GraduationCap size={20} />
            Sección Estudiantes
          </button>
          <button 
            className={`portal-tab ${isDocentes ? 'active' : ''}`}
            onClick={() => setActiveTab('docentes')}
          >
            <BookOpen size={20} />
            Sección Docentes
          </button>
          <button 
            className={`portal-tab ${isPrivado ? 'active border-danger' : ''}`}
            onClick={() => setActiveTab('privado')}
            style={{ 
               borderColor: isPrivado ? 'var(--danger)' : '', 
               boxShadow: isPrivado ? '0 8px 20px rgba(229, 62, 98, 0.25)' : ''
            }}
          >
            <Lock size={20} color={isPrivado ? 'white' : 'var(--text-secondary)'} />
            Material Especializado
          </button>
        </div>

        {/* Renderizado de Contenidos por Pestaña */}
        {isPrivado && !isPrivateAuth ? (
          /* Formulario de Inicio de Sesión para Material Especializado */
          <div className="glass-panel private-login-card" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(229, 62, 98, 0.1)', color: 'var(--danger)', borderRadius: '50%', marginBottom: '1.5rem' }}>
               <Lock size={32} />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Acceso Restringido</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
               Ingresa las credenciales proporcionadas por el administrador para acceder al material especializado.
            </p>
            
            {loginError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{loginError}</div>}
            
            <form onSubmit={handlePrivateLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               <div className="input-group" style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 10 }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Usuario" 
                    value={loginUsuario}
                    onChange={e => setLoginUsuario(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
               </div>
               
               <div className="input-group" style={{ position: 'relative' }}>
                  <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 10 }} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Contraseña" 
                    value={loginContrasena}
                    onChange={e => setLoginContrasena(e.target.value)}
                    style={{ paddingLeft: '2.5rem', textTransform: 'none' }} // Evita mayúsculas visuales en contraseña
                    required
                  />
               </div>
               
               <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', borderRadius: '30px', background: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  Ingresar a Material Especializado
               </button>
            </form>
          </div>
        ) : (
          /* Mostrar Panel Normal de Búsqueda, Filtros y Libros (Docentes, Estudiantes o Privado Autenticado) */
          <>
            {isPrivado && isPrivateAuth && (
              <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 1.5rem auto', padding: '1rem 2rem', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Lock size={20} color="var(--danger)" />
                   <span style={{ fontWeight: 600 }}>Material Especializado activo: Bienvenido, {privateUserName}!</span>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }} onClick={handlePrivateLogout}>
                   Cerrar Sesión Especializada
                </button>
              </div>
            )}

            <div className="glass-panel search-filter-panel">
               <div className="search-input-wrapper">
                  <Search size={24} className="search-icon" />
                  <input 
                    type="text" 
                    className="portal-search-input" 
                    placeholder={
                       isEstudiantes 
                         ? "Buscar libros para estudiantes..." 
                         : isDocentes 
                           ? "Buscar libros para docentes..." 
                           : "Buscar en la colección especializada..."
                    }
                    value={currentSearch}
                    onChange={(e) => setCurrentSearch(e.target.value)}
                  />
               </div>
               
               <div className="area-filters">
                  {/* Filtro de Área Curricular */}
                  <select className="form-control area-select" value={currentArea} onChange={e => setCurrentArea(e.target.value)}>
                     <option value="">Todas las Áreas</option>
                     {areasUnicas.map(area => <option key={area} value={area}>{area}</option>)}
                  </select>

                  {/* Filtro de Grado/Sección */}
                  <select className="form-control area-select" value={currentGrado} onChange={e => setCurrentGrado(e.target.value)}>
                     <option value="">Todos los Grados</option>
                     <option value="1° Grado">1° Grado</option>
                     <option value="2° Grado">2° Grado</option>
                     <option value="3° Grado">3° Grado</option>
                     <option value="4° Grado">4° Grado</option>
                     <option value="5° Grado">5° Grado</option>
                     <option value="6° Grado">6° Grado</option>
                  </select>
               </div>
            </div>

            {/* Grid de Libros */}
            <div className="books-grid">
              {librosFiltrados.length === 0 ? (
                 <div className="empty-state glass-panel">
                    <BookOpen size={64} style={{ opacity: 0.1, color: isPrivado ? 'var(--danger)' : 'var(--primary)' }} />
                    <h3>No se encontraron libros</h3>
                    <p>Intenta con otra búsqueda o selecciona otros filtros.</p>
                 </div>
              ) : (
                 librosFiltrados.map(libro => (
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
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                            {libro.areaCurricular && (
                               <span className="book-area-badge" style={{ marginTop: 0 }}>
                                  {libro.areaCurricular}
                               </span>
                            )}
                            {libro.grado && (
                               <span className="book-area-badge" style={{ marginTop: 0, background: 'rgba(251, 192, 45, 0.15)', color: 'var(--accent-gold)' }}>
                                  {libro.grado}
                               </span>
                            )}
                            {libro.acceso === 'privado' && (
                               <span className="book-area-badge" style={{ marginTop: 0, background: 'rgba(229, 62, 98, 0.15)', color: 'var(--danger)' }}>
                                  Especializado
                               </span>
                            )}
                          </div>
                       </div>
                       
                       <div className="book-card-footer">
                          <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.1)', color: 'var(--primary)' }}>
                             E-Book
                          </span>
                          <button className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem', background: isPrivado ? 'var(--danger)' : '', borderColor: isPrivado ? 'var(--danger)' : '' }} onClick={(e) => { e.stopPropagation(); setViewingVirtualBook(libro); }}>
                             Leer Ahora
                          </button>
                       </div>
                   </div>
                 ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PortalEstudiante;
