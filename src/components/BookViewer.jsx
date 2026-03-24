import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as PdfPage, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './BookViewer.css';

// Usar CDN público garantiza que el worker cargue 100% de las veces sin importar la configuración de Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookPage = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} data-density="soft" style={{ padding: 0 }}>
      {props.children}
    </div>
  );
});

const BookViewer = ({ url, title, onClose }) => {
  const bookRef = useRef();
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const isGoogleDrive = url && url.includes('drive.google.com');
  let driveId = '';
  if (isGoogleDrive) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) driveId = match[1];
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error('Error cargando PDF:', error);
    setLoadError(error.message || "Error desconocido al cargar");
    setLoading(false);
  }

  return (
    <div className="viewer-backdrop">
      <div className="viewer-header">
        <h3 style={{ color: 'white', margin: 0 }}>{title || 'Lector Virtual'}</h3>
        <button onClick={onClose} className="btn-close"><X size={24} /></button>
      </div>
      
      <div className="book-container" style={{ flexDirection: 'column', padding: isGoogleDrive ? 0 : '2rem', overflow: 'hidden' }}>
        
        {isGoogleDrive && driveId ? (
           <div style={{ width: '100%', height: '100%', flex: 1, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
              <iframe 
                 src={`https://drive.google.com/file/d/${driveId}/preview`} 
                 width="100%" 
                 height="100%" 
                 allow="autoplay" 
                 title="Visor de Google Drive"
                 style={{ border: 'none', flex: 1, display: 'block' }}
              ></iframe>
           </div>
        ) : (
          <>
            {loading && !loadError && (
               <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'center' }}>
                  <Loader2 className="lucide-spin" size={48} />
                  <p>Descargando libro PDF...</p>
               </div>
            )}
            
            {loadError && (
               <div style={{ color: '#fca5a5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '12px', flex: 1, justifyContent: 'center' }}>
                  <AlertCircle size={48} />
                  <h3 style={{margin: 0}}>Error al Cargar PDF</h3>
                  <p style={{fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'center'}}>{loadError}</p>
                  <p style={{fontSize: '0.85rem', color: '#ccc', maxWidth: '400px', textAlign: 'center'}}>Asegúrate de que la URL termine en .pdf y de que el servidor de origen permita lectura pública (CORS).</p>
               </div>
            )}

            {!url && !loading ? (
                <div style={{color: 'white', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   <h3>No se proporcionó un enlace válido.</h3>
                </div>
            ) : (
              !loading && !loadError && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '2rem' }}>
                  <Document 
                    file={url} 
                    onLoadSuccess={onDocumentLoadSuccess} 
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    error={null}
                  >
                    {numPages && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <button className="book-nav-btn left" onClick={() => bookRef.current?.pageFlip().flipPrev()}><ChevronLeft size={32}/></button>

                        <HTMLFlipBook 
                          width={400} 
                          height={565} 
                          size="stretch"
                          minWidth={315}
                          maxWidth={800}
                          minHeight={400}
                          maxHeight={1130}
                          maxShadowOpacity={0.5}
                          showCover={true}
                          mobileScrollSupport={true}
                          ref={bookRef}
                          className="demo-book"
                        >
                          {Array.from(new Array(numPages), (el, index) => (
                            <BookPage key={`page_${index + 1}`}>
                              <PdfPage 
                                 pageNumber={index + 1} 
                                 width={400} 
                                 renderTextLayer={false} 
                                 renderAnnotationLayer={false}
                              />
                            </BookPage>
                          ))}
                        </HTMLFlipBook>

                        <button className="book-nav-btn right" onClick={() => bookRef.current?.pageFlip().flipNext()}><ChevronRight size={32}/></button>
                      </div>
                    )}
                  </Document>
                </div>
              )
            )}
            
            {/* Truco: Montamos pasivamente el Document al inicio solo para parsear cuantas paginas son y manejar estado, pero invisible hasta cargar */}
            {loading && url && (
               <div style={{ display: 'none' }}>
                 <Document file={url} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} />
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookViewer;
