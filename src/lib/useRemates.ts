import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, FIREBASE_SIN_CONFIGURAR } from './firebase';
import { MOCK_REMATES } from './mock';
import { Remate } from './types';

// Hook central: lee remates en tiempo real desde Firestore.
// Si Firebase no está configurado o la colección está vacía, usa datos de ejemplo.
export function useRemates() {
  const [remates, setRemates] = useState<Remate[]>(MOCK_REMATES);
  const [cargando, setCargando] = useState(!FIREBASE_SIN_CONFIGURAR);
  const [esDemo, setEsDemo] = useState(true);

  useEffect(() => {
    if (FIREBASE_SIN_CONFIGURAR) return;
    try {
      const q = query(collection(db, 'remates'), orderBy('fechaRemate', 'asc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            setRemates(MOCK_REMATES);
            setEsDemo(true);
          } else {
            setRemates(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Remate, 'id'>) }))
            );
            setEsDemo(false);
          }
          setCargando(false);
        },
        () => {
          setRemates(MOCK_REMATES);
          setEsDemo(true);
          setCargando(false);
        }
      );
      return unsub;
    } catch {
      setCargando(false);
    }
  }, []);

  return { remates, cargando, esDemo };
}
