import { database } from '../config/firebase';
import { ref, set, get, update, remove, push, child } from 'firebase/database';

const sanitizeKey = (key) => key.replace(/[.#$\[\]]/g, '');

// Estudiantes
export const addEstudiante = async (estudianteData) => {
  const rawKey = estudianteData.dni?.trim();
  const estId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'estudiantes')).key;
  await set(ref(database, `estudiantes/${estId}`), { ...estudianteData, id: estId });
  return estId;
};

export const updateEstudiante = async (id, estudianteData) => {
  await update(ref(database, `estudiantes/${id}`), estudianteData);
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
  const rawKey = libroData.codigoBarras?.trim();
  const bookId = rawKey ? sanitizeKey(rawKey) : push(ref(database, 'libros')).key;
  await set(ref(database, `libros/${bookId}`), { ...libroData, id: bookId });
  return bookId;
};

export const updateLibro = async (id, libroData) => {
  await update(ref(database, `libros/${id}`), libroData);
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
  const newPrestamoRef = push(ref(database, 'prestamos'));
  await set(newPrestamoRef, { ...prestamoData, id: newPrestamoRef.key });
  return newPrestamoRef.key;
};

export const updatePrestamo = async (id, prestamoData) => {
  await update(ref(database, `prestamos/${id}`), prestamoData);
};

export const deletePrestamo = async (id) => {
  await remove(ref(database, `prestamos/${id}`));
};

// Categorias (Áreas y Cursos)
export const addCategoria = async (categoriaData) => {
  const newCategoriaRef = push(ref(database, 'categorias'));
  await set(newCategoriaRef, { ...categoriaData, id: newCategoriaRef.key });
  return newCategoriaRef.key;
};

export const updateCategoria = async (id, categoriaData) => {
  await update(ref(database, `categorias/${id}`), categoriaData);
};

export const deleteCategoria = async (id) => {
  await remove(ref(database, `categorias/${id}`));
};
