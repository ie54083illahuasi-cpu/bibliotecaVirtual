import React, { useState } from 'react';
import { addLibro, updateLibro } from '../services/dbActions';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { X, QrCode } from 'lucide-react';
import Scanner from './Scanner';

const AddLibroModal = ({ onClose, editLibro }) => {
  const [formData, setFormData] = useState(() => {
    if (editLibro) {
      return {
        destinatario: '',
        grado: 'Todos',
        acceso: 'publico',
        ...editLibro
      };
    }
    return {
      titulo: '', autor: '', edicion: '', cantidad: 1, tipo: 'fisico', codigoBarras: '', urlVirtual: '', areaCurricular: '', urlPortada: '', destinatario: '', grado: 'Todos', acceso: 'publico'
    };
  });
  const [showScanner, setShowScanner] = useState(false);
  
  const categorias = useFirebaseData('categorias') || [];

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleScan = (decodedText) => {
    // Si escaneamos algo, lo ponemos como código de barras y hacemos un auto-fetch ficticio o permitimos llenado rápido.
    setFormData({ ...formData, codigoBarras: decodedText });
    setShowScanner(false);
  };

  const handleAutoGenerateCode = () => {
    const generatedCode = `LIB${Math.floor(10000000 + Math.random() * 90000000)}`;
    setFormData({ ...formData, codigoBarras: generatedCode });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            let scaleSize = 1;
            if (img.width > MAX_WIDTH) {
                scaleSize = MAX_WIDTH / img.width;
            }
            canvas.width = img.width * scaleSize;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const base64String = canvas.toDataURL('image/jpeg', 0.7);
            setFormData(prev => ({ ...prev, urlPortada: base64String }));
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalData = { ...formData };
    
    // Auto-generación de código de barras/QR si está vacío
    if (!finalData.codigoBarras || !finalData.codigoBarras.trim()) {
      finalData.codigoBarras = `LIB${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    // Auto-generación de portada para virtuales (si está vacía o es igual al enlace de lectura por error/autocompletado)
    const hasInvalidCover = !finalData.urlPortada || finalData.urlPortada.trim() === "" || finalData.urlPortada === finalData.urlVirtual;
    if (finalData.tipo === 'virtual' && finalData.urlVirtual && hasInvalidCover) {
        if (finalData.urlVirtual.includes('fliphtml5.com')) {
           const cleanUrl = finalData.urlVirtual.trim().replace(/\/$/, ""); 
           finalData.urlPortada = `${cleanUrl}/files/shot.jpg`;
        } else {
           const driveMatch = finalData.urlVirtual.match(/\/d\/(.*?)\//);
           if (driveMatch && driveMatch[1]) {
             finalData.urlPortada = `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w500`;
           }
        }
    }

    if (editLibro) {
      await updateLibro(editLibro.id, { ...finalData, cantidad: parseInt(finalData.cantidad, 10) });
    } else {
       await addLibro({ ...finalData, cantidad: parseInt(finalData.cantidad, 10) });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', animation: 'fadeIn 0.3s', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>{editLibro ? 'Editar Libro' : 'Añadir Nuevo Libro'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24}/></button>
        </div>

        {showScanner ? (
           <div style={{ marginBottom: '1rem' }}>
              <Scanner onScanSuccess={handleScan} onClose={() => setShowScanner(false)} />
           </div>
        ) : (
           <form onSubmit={handleSubmit}>
              <div className="form-grid">
                  <div className="form-group full-width">
                     <label>Código de Barras / QR</label>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" className="form-control" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="Escanea, escribe o autogenera el código" />
                        <button type="button" className="btn btn-secondary" onClick={handleAutoGenerateCode} title="Generar código de barras automáticamente">
                           Generar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowScanner(true)}>
                           <QrCode size={18} /> Escanear
                        </button>
                     </div>
                  </div>
                  <div className="form-group full-width">
                     <label>Título del Libro</label>
                     <input required type="text" className="form-control" name="titulo" value={formData.titulo} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                     <label>Autor(es)</label>
                     <input required type="text" className="form-control" name="autor" value={formData.autor} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                     <label>Edición / Editorial</label>
                     <input type="text" className="form-control" name="edicion" value={formData.edicion} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                     <label>Área Curricular</label>
                     <select className="form-control" name="areaCurricular" value={formData.areaCurricular || ''} onChange={handleChange}>
                        <option value="">-- Seleccionar Área --</option>
                        {categorias.map(cat => <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>)}
                     </select>
                  </div>
                  <div className="form-group">
                     <label>Destinatario (Sección)</label>
                     <select required className="form-control" name="destinatario" value={formData.destinatario || ''} onChange={handleChange}>
                        <option value="">-- Seleccionar Destinatario --</option>
                        <option value="Estudiantes">Estudiantes</option>
                        <option value="Docentes">Docentes</option>
                     </select>
                  </div>
                  <div className="form-group">
                     <label>Acceso del Libro</label>
                     <select className="form-control" name="acceso" value={formData.acceso || 'publico'} onChange={handleChange}>
                        <option value="publico">Público (Libre)</option>
                        <option value="privado">Privado (Con Contraseña)</option>
                     </select>
                  </div>
                  <div className="form-group">
                     <label>Grado del Libro</label>
                     <select className="form-control" name="grado" value={formData.grado || ''} onChange={handleChange}>
                        <option value="">-- Seleccionar Grado --</option>
                        <option value="1° Grado">1° Grado</option>
                        <option value="2° Grado">2° Grado</option>
                        <option value="3° Grado">3° Grado</option>
                        <option value="4° Grado">4° Grado</option>
                        <option value="5° Grado">5° Grado</option>
                        <option value="6° Grado">6° Grado</option>
                        <option value="Todos">Todos los Grados</option>
                     </select>
                  </div>
                  <div className="form-group">
                     <label>Tipo de Libro</label>
                     <select className="form-control" name="tipo" value={formData.tipo} onChange={handleChange}>
                        <option value="fisico">Libro Físico</option>
                        <option value="virtual">Libro Virtual (E-book)</option>
                     </select>
                  </div>
                  {formData.tipo === 'fisico' && (
                     <div className="form-group">
                        <label>Cantidad de Copias</label>
                        <input required type="number" min="1" className="form-control" name="cantidad" value={formData.cantidad} onChange={handleChange} />
                     </div>
                  )}
                  {formData.tipo === 'virtual' ? (
                     <>
                        <div className="form-group full-width">
                           <label>URL de Imagen de Portada Alternativa (Opcional)</label>
                           <input type="url" className="form-control" name="urlPortada" value={formData.urlPortada || ''} onChange={handleChange} placeholder="Deja vacío para auto-detectar Portada (Solo Drive o FlipHTML5)" />
                           <small style={{ color: 'var(--text-secondary)' }}>Por defecto, el sistema extraerá automáticamente la 1° hoja de FlipHTML5 o Drive.</small>
                        </div>
                        <div className="form-group full-width">
                           <label>Enlace del Libro Virtual (Drive, FlipHTML5, etc.)</label>
                           <input type="url" className="form-control" name="urlVirtual" value={formData.urlVirtual} onChange={handleChange} placeholder="https://..." required />
                           <small style={{ color: 'var(--text-secondary)' }}>Proporciona el enlace para cargar el documento virtual.</small>
                        </div>
                     </>
                  ) : (
                     <div className="form-group full-width">
                        <label>Subir Imagen de Portada</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                           <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} style={{ flex: 1 }} />
                           {formData.urlPortada && (
                              <img src={formData.urlPortada} alt="Preview" style={{ height: '50px', borderRadius: '4px', border: '1px solid var(--border)' }} />
                           )}
                        </div>
                        <small style={{ color: 'var(--text-secondary)' }}>La imagen se optimizará automáticamente para ocupar poco espacio.</small>
                     </div>
                  )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                 <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                 <button type="submit" className="btn btn-primary">{editLibro ? 'Guardar Cambios' : 'Guardar Libro'}</button>
              </div>
           </form>
        )}
      </div>
    </div>
  );
}

export default AddLibroModal;
