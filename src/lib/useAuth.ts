import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, FIREBASE_SIN_CONFIGURAR } from './firebase';
import { sincronizarUsuarioPurchases } from './purchases';

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
      // Vincula/desvincula el usuario en RevenueCat para que su suscripción
      // Rematto Pro se reconozca sin importar en qué dispositivo inicie sesión.
      sincronizarUsuarioPurchases(u?.uid ?? null);
    });
  }, []);

  return {
    user,
    listo,
    logueado: FIREBASE_SIN_CONFIGURAR ? true : user != null,
    esDemo: FIREBASE_SIN_CONFIGURAR,
  };
}
