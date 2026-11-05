import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAnuncio } from '../lib/useAnuncio';

const KEY = '@rematto_anuncio_visto';

// Banner llamativo en la pantalla principal, controlado 100% desde Firestore
// (config/anuncio). Se puede cambiar el mensaje cuando se quiera sin subir
// una nueva versión de la app. Cada usuario lo ve una vez por "version" y
// se cierra tocándolo.
export default function AnuncioBanner() {
  const anuncio = useAnuncio();
  const [oculto, setOculto] = useState(true);

  useEffect(() => {
    if (!anuncio?.activo || !anuncio.version) {
      setOculto(true);
      return;
    }
    AsyncStorage.getItem(KEY).then((visto) => {
      setOculto(visto === anuncio.version);
    });
  }, [anuncio?.version, anuncio?.activo]);

  if (!anuncio?.activo || oculto) return null;

  const cerrar = () => {
    AsyncStorage.setItem(KEY, anuncio.version);
    setOculto(true);
  };

  return (
    <Pressable style={s.banner} onPress={cerrar}>
      <Text style={s.emoji}>{anuncio.emoji ?? '🔥'}</Text>
      <Text style={s.texto}>{anuncio.mensaje}</Text>
      <Ionicons name="close" size={16} color="#0B0B0B" style={s.cerrar} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD60A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  emoji: { fontSize: 18 },
  texto: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0B0B0B' },
  cerrar: { marginLeft: 4 },
});
