import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db, auth, FIREBASE_SIN_CONFIGURAR } from './firebase';
import { Remate } from './types';

const KEY = 'rematto_favoritos';

// Notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getFavoritos(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function esFavorito(id: string): Promise<boolean> {
  return (await getFavoritos()).includes(id);
}

// Favorito = recordatorio automático 1 hora antes del remate (diferenciador clave)
export async function toggleFavorito(remate: Remate): Promise<boolean> {
  const favs = await getFavoritos();
  const ya = favs.includes(remate.id);

  if (ya) {
    await AsyncStorage.setItem(KEY, JSON.stringify(favs.filter((f) => f !== remate.id)));
    await cancelarRecordatorio(remate.id);
    actualizarContadorFavoritos(remate.id, -1);
    return false;
  }

  await AsyncStorage.setItem(KEY, JSON.stringify([...favs, remate.id]));
  await programarRecordatorio(remate);
  actualizarContadorFavoritos(remate.id, 1);
  return true;
}

// Estadística para el organizador (Rematto Pro Martillero): cuántos usuarios
// tienen este remate en favoritos ahora mismo. Best-effort — si falla (sin
// sesión, remate mock, sin conexión) no interrumpe el favorito local, que ya
// quedó guardado igual.
function actualizarContadorFavoritos(remateId: string, delta: 1 | -1) {
  if (FIREBASE_SIN_CONFIGURAR || !auth.currentUser || remateId.startsWith('m')) return;
  updateDoc(doc(db, 'remates', remateId), { favoritosCount: increment(delta) }).catch(() => {});
}

async function programarRecordatorio(remate: Remate) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const unaHoraAntes = new Date(remate.fechaRemate).getTime() - 3600_000;
  if (unaHoraAntes <= Date.now()) return; // ya está muy encima

  await Notifications.scheduleNotificationAsync({
    identifier: `remate-${remate.id}`,
    content: {
      title: 'Tu remate comienza en 1 hora',
      body: `${remate.titulo} — ${remate.comuna}. Revisa los requisitos antes de participar.`,
      data: { remateId: remate.id },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(unaHoraAntes) },
  });
}

async function cancelarRecordatorio(remateId: string) {
  await Notifications.cancelScheduledNotificationAsync(`remate-${remateId}`);
}

// Agrega el remate al calendario del teléfono (app Calendario de iOS/Android).
// Usa expo-calendar de forma opcional: si no está instalado, no rompe nada
// (la agenda interna y el aviso ya funcionan). Devuelve true si logró crear el evento.
export async function agregarACalendarioTelefono(remate: Remate): Promise<boolean> {
  try {
    const Calendar = await import('expo-calendar');
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') return false;

    const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const cal =
      cals.find((c: any) => c.allowsModifications && c.source?.name === 'Default') ||
      cals.find((c: any) => c.allowsModifications);
    if (!cal) return false;

    const inicio = new Date(remate.fechaRemate);
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
    await Calendar.createEventAsync(cal.id, {
      title: `Remate — ${remate.comuna}: ${remate.titulo}`,
      startDate: inicio,
      endDate: fin,
      location: remate.direccion ?? remate.comuna,
      notes:
        `${remate.descripcion}\n\nMínimo: ${remate.moneda} ${remate.precioMinimo.toLocaleString('es-CL')}.` +
        (remate.urlFuente ? `\nFuente oficial: ${remate.urlFuente}` : ''),
      alarms: [{ relativeOffset: -60 }], // aviso 1 hora antes
    });
    return true;
  } catch {
    // expo-calendar no instalado o sin permisos — se ignora sin romper la app
    return false;
  }
}
