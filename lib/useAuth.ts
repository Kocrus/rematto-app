import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, FIREBASE_SIN_CONFIGURAR } from './firebase';

// Estado de sesión compartido. En modo demo (sin Firebase) se considera
// sesión iniciada para poder probar toda la app.
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [listo, setListo] = useState(FIREBASE_SIN_CONFIGURAR);

  useEffect(() => {
    if (FIREBASE_SIN_CONFIGURAR) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setListo(true);
    });
  }, []);

  return {
    user,
    listo,
    logueado: FIREBASE_SIN_CONFIGURAR ? true : user != null,
    esDemo: FIREBASE_SIN_CONFIGURAR,
  };
}
