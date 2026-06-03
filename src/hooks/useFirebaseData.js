import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

export const useFirebaseData = (path) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, path);
    // onValue sets up a listener that triggers on every change to the data
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert object to array of objects if needed, assuming keys are IDs
        const dataList = Object.keys(val).map(key => {
          const item = { ...val[key], id: key };
          if (typeof item.tipo === 'string') item.tipo = item.tipo.toLowerCase();
          if (typeof item.estado === 'string') item.estado = item.estado.toLowerCase();
          
          if (path === 'libros' && typeof item.areaCurricular === 'string') {
            item.areaCurricular = item.areaCurricular.toUpperCase().trim();
          }
          if (path === 'categorias' && typeof item.nombre === 'string') {
            item.nombre = item.nombre.toUpperCase().trim();
          }
          return item;
        });
        setData(dataList);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe();
  }, [path]);

  return data;
};
