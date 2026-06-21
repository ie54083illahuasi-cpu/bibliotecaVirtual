import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(() => {
    // Verificar si hay una sesión activa de colaborador en sessionStorage
    const storedColaborador = sessionStorage.getItem('colaborador_session');
    if (storedColaborador) {
      return {
        ...JSON.parse(storedColaborador),
        isSuperAdmin: false
      };
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState(!user);

  useEffect(() => {
    // onAuthStateChanged se dispara cada vez que cambia el estado de conexión del usuario
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Si hay un usuario colaborador en sessionStorage, mantenemos ese y no lo sobreescribimos
      if (sessionStorage.getItem('colaborador_session')) {
        return;
      }

      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          nombre: currentUser.displayName || 'ADMINISTRADOR',
          usuario: currentUser.email,
          isSuperAdmin: true
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, authLoading };
};
