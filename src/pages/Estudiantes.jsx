import React, { useState, useRef } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { deleteEstudiante, addEstudiante } from '../services/dbActions';
import { Plus, Search, FileSpreadsheet, Trash2, Users, Pencil } from 'lucide-react';
import * as XLSX from 'xlsx';
import AddEstudianteModal from '../components/AddEstudianteModal';

const Estudiantes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const fileInputRef = useRef(null);
  
  const todosEstudiantes = useFirebaseData('estudiantes') || [];
  const estudiantes = todosEstudiantes.filter(est => 
    (est.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (est.apellidos || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (est.dni || '').includes(searchTerm)
  );

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que deseas eliminar este estudiante?')) {
      await deleteEstudiante(id);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const nuevosEstudiantes = data.map(row => ({
         dni: String(row.DNI || row.dni || ''),
         nombre: row.Nombre || row.nombre || '',
         apellidos: row.Apellidos || row.apellidos || '',
         grado: String(row.Grado || row.grado || ''),
         seccion: String(row.Seccion || row.seccion || row.Sección || row.sección || ''),
         telefono: String(row.Telefono || row.telefono || ''),
         email: row.Email || row.email || ''
      })).filter(est => est.dni && est.nombre); // Filtrar vacios
      
      if(nuevosEstudiantes.length > 0) {
         await Promise.all(nuevosEstudiantes.map(est => addEstudiante(est)));
         alert(`Se importaron ${nuevosEstudiantes.length} estudiantes correctamente.`);
      } else {
         alert('El archivo Excel no contenía datos válidos o faltaban columnas (DNI, Nombre).');
      }
      // reset input
      e.target.value = null;
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { DNI: '12345678', Nombre: 'Juan', Apellidos: 'Pérez García', Grado: '5', Seccion: 'A', Telefono: '987654321', Email: 'juan@ejemplo.com' },
      { DNI: '87654321', Nombre: 'María', Apellidos: 'López Silva', Grado: '3', Seccion: 'B', Telefono: '912345678', Email: 'maria@ejemplo.com' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
    XLSX.writeFile(wb, "Plantilla_Estudiantes.xlsx");
  };

  return (
    <div className="fade-in">
      {showModal && <AddEstudianteModal onClose={() => setShowModal(false)} />}
      {editingEstudiante && <AddEstudianteModal editEstudiante={editingEstudiante} onClose={() => setEditingEstudiante(null)} />}
      
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Gestión de Estudiantes</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleDownloadTemplate} title="Descargar Excel de ejemplo">
             Plantilla
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <FileSpreadsheet size={18} color="var(--primary)"/> Importar
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Nuevo Estudiante
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por nombre, apellidos o DNI..." 
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
              <th>DNI</th>
              <th>Estudiante</th>
              <th>Grado y Sec.</th>
              <th className="hide-mobile">Contacto</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes?.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <Users size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No hay estudiantes registrados en el sistema.</p>
                </td>
              </tr>
            )}
            {estudiantes?.map(est => (
              <tr key={est.id}>
                <td style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{est.dni}</td>
                <td>
                   <div style={{ fontWeight: '500' }}>{est.apellidos}, {est.nombre}</div>
                </td>
                <td>
                  {est.grado || est.seccion ? (
                    <span className="badge" style={{ background: 'rgba(2, 136, 209, 0.08)', color: 'var(--primary)', border: '1px solid rgba(2, 136, 209, 0.1)' }}>
                       {est.grado}° {est.seccion}
                    </span>
                  ) : '-'}
                </td>
                <td className="hide-mobile">
                   <div style={{ fontSize: '0.85rem' }}>{est.telefono || '-'}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{est.email}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                     <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }} onClick={() => setEditingEstudiante(est)} title="Editar">
                        <Pencil size={18} />
                     </button>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(est.id)} title="Eliminar">
                       <Trash2 size={18} />
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

export default Estudiantes;
