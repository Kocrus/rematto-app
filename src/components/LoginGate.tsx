import { ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/useAuth';
import { MODO_ACCESO } from '../lib/config';
import { C } from '../lib/theme';
import LoginForm from './LoginForm';

// Muro de acceso configurable (ver lib/config.ts).
// contexto 'app'   → se usa envolviendo las tabs (modo 'total')
// contexto 'ficha' → se usa envolviendo la ficha del remate (modo 'ficha' o 'total')
export default function LoginGate({
  children,
  contexto,
}: {
  children: ReactNode;
  contexto: 'app' | 'ficha';
}) {
  const { logueado, listo } = useAuth();

  const exigeLogin =
    MODO_ACCESO === 'total' || (MODO_ACCESO === 'ficha' && contexto === 'ficha');

  if (!exigeLogin || (listo && logueado)) return <>{children}</>;
  if (!listo) return <View style={s.safe} />;

  return (
    <ScrollView style={s.safe} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <Text style={s.marca}>REMATTO</Text>
      <View style={s.iconoWrap}>
        <Ionicons name="lock-closed-outline" size={26} color={C.text} />
      </View>
      <Text style={s.titulo}>
        {contexto === 'ficha' ? 'Crea tu cuenta gratis para ver el detalle' : 'Bienvenido a Rematto'}
      </Text>
      <Text style={s.sub}>
        {contexto === 'ficha'
          ? 'Accede a la información completa del remate: precio, garantía, mapa, checklist y el enlace oficial. Es gratis, para siempre.'
          : 'Todos los remates de Chile en un solo lugar. Crea tu cuenta gratis para comenzar.'}
      </Text>
      <LoginForm />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 60 },
  marca: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5, color: C.text },
  iconoWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  titulo: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 14 },
  sub: { fontSize: 14, color: C.sub, lineHeight: 21, marginTop: 8, marginBottom: 24 },
});
