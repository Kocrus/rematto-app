import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
    return false;
  }

  await AsyncStorage.setItem(KEY, JSON.stringify([...favs, remate.id]));
  await programarRecordatorio(remate);
  return true;
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
