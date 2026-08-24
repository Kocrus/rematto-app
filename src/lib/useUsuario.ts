import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './useAuth';

export type Rol = 'cliente' | 'organizador';

/**
 * Perfil de Rematto guardado en Firestore (colección `usuarios`), separado
 * de la cuenta de Firebase Auth. Es la fuente única de verdad de si alguien
 * es "cliente" (busca y puja) u "organizador" (martillero, casa de remates
 * o empresa que publica). De acá se derivan tres cosas a la vez:
 *   1. Si puede publicar remates (app/publicar.tsx).
 *   2. Qué Rematto Pro se le ofrece primero (Perfil, paywall).
 *   3. Qué ve en su perfil.
 *
 * "Martillero" y "subastador" hoy son la misma cosa a nivel de producto
 * (organizador que publica remates de terceros). El día que Rematto lance
 * subastas propias entre particulares (Fase 3 del roadmap, pendiente de
 * revisión legal), se puede agregar un tercer valor a este mismo campo sin
 * tocar el resto de la app — por eso conviene mantenerlo como un solo `rol`
 * central en vez de flags sueltos por pantalla.
 */
export function useUsuario() {
  const { user, esDemo } = useAuth();
  const [rol, setRol] = useState<Rol | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (esDemo) {
      setRol('cliente');
      setCargando(false);
      return;
    }
    if (!user) {
      setRol(null);
      setCargando(false);
      return;
    }
    setCargando(true);
    const ref = doc(db, 'usuarios', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setRol((snap.data()?.rol as Rol) ?? null);
      setCargando(false);
    });
    return unsub;
  }, [user, esDemo]);

  /**
   * Guarda o cambia el rol. Se puede llamar de nuevo más adelante para
   * cambiarlo.
   *
   * Reintenta un par de veces con una pequeña espera: justo después de
   * crear una cuenta nueva, el token de autenticación a veces no ha
   * terminado de propagarse al SDK de Firestore todavía, y el primer
   * intento de escritura puede fallar con "permission-denied" aunque el
   * usuario ya esté autenticado. Sin este reintento, el onboarding
   * mostraba un error justo al elegir cómo usar la app.
   */
  const elegirRol = async (nuevoRol: Rol, nombreOrganizacion?: string) => {
    if (!user) return;
    const datos = {
      uid: user.uid,
      email: user.email,
      rol: nuevoRol,
      ...(nombreOrganizacion ? { nombreOrganizacion } : {}),
      actualizadoEn: new Date().toISOString(),
    };
    const intentos = 3;
    for (let i = 0; i < intentos; i++) {
      try {
        await setDoc(doc(db, 'usuarios', user.uid), datos, { merge: true });
        return;
      } catch (e) {
        if (i === intentos - 1) throw e;
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
    }
  };

  return {
    rol,
    cargando,
    tieneRol: rol != null,
    esOrganizador: rol === 'organizador',
    esCliente: rol === 'cliente',
    elegirRol,
  };
}
