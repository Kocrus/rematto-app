import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, FIREBASE_SIN_CONFIGURAR } from './firebase';

export interface Anuncio {
  activo: boolean;
  mensaje: string;
  emoji?: string;
  // Identificador de versión del aviso (ej. una fecha). Cuando cambia,
  // el banner vuelve a mostrarse aunque el usuario ya haya cerrado uno anterior.
  version: string;
}

// Hook: escucha en tiempo real el documento config/anuncio en Firestore.
// Permite mostrar avisos llamativos (ej. "remates actualizados") sin
// necesidad de subir una nueva versión de la app — solo se edita el doc.
export function useAnuncio() {
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);

  useEffect(() => {
    if (FIREBASE_SIN_CONFIGURAR) return;
    try {
      const ref = doc(db, 'config', 'anuncio');
      const unsub = onSnapshot(
        ref,
        (snap) => setAnuncio(snap.exists() ? (snap.data() as Anuncio) : null),
        () => setAnuncio(null)
      );
      return unsub;
    } catch {
      setAnuncio(null);
    }
  }, []);

  return anuncio;
}
