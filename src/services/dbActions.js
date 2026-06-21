import { database } from '../config/firebase';
import { ref, set, get, update, remove, push, child } from 'firebase/database';

const sanitizeKey = (key) => key.replace(/[.#$[\]]/g, '');

const formatDataToUppercase = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const formatted = { ...data };
  Object.keys(formatted).forEach(key => {
    // No convertir IDs, URLs de imagen, direcciones de email, tipos ni estados
    const isProtectedKey = ['id', 'urlPortada', 'urlVirtual', 'email', 'libroId', 'estudianteId', 'tipo', 'estado', 'destinatario', 'grado', 'usuario', 'contrasena', 'acceso', 'materialDidactico'].includes(key);
    
    if (typeof formatted[key] === 'string' && !isProtectedKey) {
      formatted[key] = formatted[key].toUpperCase().trim();
    }
  });
  return formatted;
};

// Estudiantes
export const addEstudiante = async (estudianteData) => {
  const data = formatDataToUppercase(estudianteData);
  const rawKey = data.dni?.trim();
  const estId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'estudiantes')).key;
  await set(ref(database, `estudiantes/${estId}`), { ...data, id: estId });
  return estId;
};

export const updateEstudiante = async (id, estudianteData) => {
  const data = formatDataToUppercase(estudianteData);
  await update(ref(database, `estudiantes/${id}`), data);
};

export const deleteEstudiante = async (id) => {
  await remove(ref(database, `estudiantes/${id}`));
};

export const getEstudiante = async (id) => {
  const snapshot = await get(child(ref(database), `estudiantes/${id}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

// Libros
export const addLibro = async (libroData) => {
  const data = formatDataToUppercase(libroData);
  const rawKey = data.codigoBarras?.trim();
  const bookId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'libros')).key;
  await set(ref(database, `libros/${bookId}`), { ...data, id: bookId });
  return bookId;
};

export const updateLibro = async (id, libroData) => {
  const data = formatDataToUppercase(libroData);
  await update(ref(database, `libros/${id}`), data);
};

export const deleteLibro = async (id) => {
  await remove(ref(database, `libros/${id}`));
};

export const getLibro = async (id) => {
  const snapshot = await get(child(ref(database), `libros/${id}`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

// Prestamos
export const addPrestamo = async (prestamoData) => {
  const data = formatDataToUppercase(prestamoData);
  const newPrestamoRef = push(ref(database, 'prestamos'));
  await set(newPrestamoRef, { ...data, id: newPrestamoRef.key });
  return newPrestamoRef.key;
};

export const updatePrestamo = async (id, prestamoData) => {
  const data = formatDataToUppercase(prestamoData);
  await update(ref(database, `prestamos/${id}`), data);
};

export const deletePrestamo = async (id) => {
  await remove(ref(database, `prestamos/${id}`));
};

// Categorias (Áreas y Cursos)
export const addCategoria = async (categoriaData) => {
  const data = formatDataToUppercase(categoriaData);
  const newCategoriaRef = push(ref(database, 'categorias'));
  await set(newCategoriaRef, { ...data, id: newCategoriaRef.key });
  return newCategoriaRef.key;
};

export const updateCategoria = async (id, categoriaData) => {
  const data = formatDataToUppercase(categoriaData);
  await update(ref(database, `categorias/${id}`), data);
};

export const deleteCategoria = async (id) => {
  await remove(ref(database, `categorias/${id}`));
};

// Usuarios Privados
export const addUsuarioPrivado = async (userData) => {
  const data = formatDataToUppercase(userData);
  const rawKey = data.usuario?.trim().toLowerCase();
  const userId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'usuariosPrivados')).key;
  await set(ref(database, `usuariosPrivados/${userId}`), { ...data, id: userId });
  return userId;
};

export const updateUsuarioPrivado = async (id, userData) => {
  const data = formatDataToUppercase(userData);
  await update(ref(database, `usuariosPrivados/${id}`), data);
};

export const deleteUsuarioPrivado = async (id) => {
  await remove(ref(database, `usuariosPrivados/${id}`));
};

// Usuarios del Sistema (Colaboradores/Bibliotecarios)
export const addUsuarioSistema = async (userData) => {
  const data = formatDataToUppercase(userData);
  const rawKey = data.usuario?.trim().toLowerCase();
  const userId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'usuariosSistema')).key;
  await set(ref(database, `usuariosSistema/${userId}`), { ...data, id: userId });
  return userId;
};

export const updateUsuarioSistema = async (id, userData) => {
  const data = formatDataToUppercase(userData);
  await update(ref(database, `usuariosSistema/${id}`), data);
};

export const deleteUsuarioSistema = async (id) => {
  await remove(ref(database, `usuariosSistema/${id}`));
};
