import { database } from '../config/firebase';
import { ref, set, get, update, remove, push, child } from 'firebase/database';

// Estudiantes
export const addEstudiante = async (estudianteData) => {
  const newEstudianteRef = push(ref(database, 'estudiantes'));
  await set(newEstudianteRef, { ...estudianteData, id: newEstudianteRef.key });
  return newEstudianteRef.key;
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
  const newLibroRef = push(ref(database, 'libros'));
  await set(newLibroRef, { ...libroData, id: newLibroRef.key });
  return newLibroRef.key;
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
