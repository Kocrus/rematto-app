import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../lib/theme';
import { useUsuario, Rol } from '../lib/useUsuario';

// Paso único al crear la cuenta (ver components/LoginForm.tsx) que define
// si el usuario es cliente u organizador. También se puede volver a abrir
// desde Perfil para cambiar de rol más adelante.
export default function ElegirRol() {
  const router = useRouter();
  const { elegirRol } = useUsuario();
  const [guardando, setGuardando] = useState<Rol | null>(null);

  const elegir = async (rol: Rol) => {
    try {
      setGuardando(rol);
      await elegirRol(rol);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'No se pudo guardar tu elección. Intenta nuevamente.');
    } finally {
      setGuardando(null);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.marca}>REMATTO</Text>
      <Text style={s.titulo}>¿Cómo vas a usar Rematto?</Text>
      <Text style={s.sub}>Puedes cambiarlo cuando quieras desde tu perfil.</Text>

      <Pressable style={s.card} onPress={() => elegir('cliente')} disabled={!!guardando}>
        <Ionicons name="search-outline" size={26} color={C.text} />
        <Text style={s.cardTitulo}>Busco y pujo en remates</Text>
        <Text style={s.cardSub}>
          Quiero encontrar propiedades, vehículos u otros bienes en remate cerca de mí.
        </Text>
        {guardando === 'cliente' && <ActivityIndicator style={{ marginTop: 10 }} color={C.text} />}
      </Pressable>

      <Pressable style={s.card} onPress={() => elegir('organizador')} disabled={!!guardando}>
        <Ionicons name="hammer-outline" size={26} color={C.text} />
        <Text style={s.cardTitulo}>Publico remates</Text>
        <Text style={s.cardSub}>
          Soy martillero, casa de remates o empresa y quiero publicar mis remates en Rematto.
        </Text>
        {guardando === 'organizador' && <ActivityIndicator style={{ marginTop: 10 }} color={C.text} />}
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 24 },
  marca: { fontSize: 16, fontWeight: '900', letterSpacing: -0.5, color: C.text },
  titulo: { fontSize: 26, fontWeight: '800', color: C.text, marginTop: 20, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: C.sub, marginTop: 6, marginBottom: 28 },
  card: {
    borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 20,
    marginBottom: 14, backgroundColor: C.card,
  },
  cardTitulo: { fontSize: 17, fontWeight: '800', color: C.text, marginTop: 12 },
  cardSub: { fontSize: 13, color: C.sub, marginTop: 6, lineHeight: 19 },
});
