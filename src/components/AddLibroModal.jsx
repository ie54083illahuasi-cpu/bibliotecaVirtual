import React, { useState } from 'react';
import { addLibro, updateLibro } from '../services/dbActions';
import { X, QrCode } from 'lucide-react';
import Scanner from './Scanner';

const AddLibroModal = ({ onClose, editLibro }) => {
  const [formData, setFormData] = useState(editLibro || {
    titulo: '', autor: '', edicion: '', cantidad: 1, tipo: 'fisico', codigoBarras: '', urlVirtual: ''
  });
  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleScan = (decodedText) => {
    // Si escaneamos algo, lo ponemos como código de barras y hacemos un auto-fetch ficticio o permitimos llenado rápido.
    setFormData({...formData, codigoBarras: decodedText});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editLibro) {
       await updateLibro(editLibro.id, {...formData, cantidad: parseInt(formData.cantidad, 10)});
    } else {
       await addLibro({...formData, cantidad: parseInt(formData.cantidad, 10)});
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
                        <input type="text" className="form-control" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} placeholder="Escanea o escribe el código" />
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
                  {formData.tipo === 'virtual' && (
                     <div className="form-group full-width">
                        <label>URL o Archivo PDF</label>
                        <input required type="text" className="form-control" name="urlVirtual" value={formData.urlVirtual} onChange={handleChange} placeholder="https://..." />
                        <small style={{ color: 'var(--text-secondary)' }}>Proporciona el enlace al libro para el visor virtual.</small>
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
