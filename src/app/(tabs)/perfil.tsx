import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../lib/useAuth';
import { useUsuario } from '../../lib/useUsuario';
import { usePro, restaurarCompras } from '../../lib/purchases';
import { C, F } from '../../lib/theme';
import LoginForm from '../../components/LoginForm';

export default function Perfil() {
  const router = useRouter();
  const { user, esDemo } = useAuth();
  const { rol, esOrganizador } = useUsuario();
  const { clientePro, martilleroPro } = usePro();

  const restaurar = async () => {
    try {
      await restaurarCompras();
      Alert.alert('Compras restauradas', 'Revisamos tu cuenta de App Store.');
    } catch {
      Alert.alert('No se pudo restaurar', 'Intenta nuevamente más tarde.');
    }
  };

  if (user || esDemo) {
    // Ordenamos el Pro que más le sirve a este usuario primero, según su rol.
    const filasPro = esOrganizador
      ? [
          { href: '/pro?tipo=martillero' as const, icono: 'hammer-outline' as const, titulo: 'Rematto Pro Martillero', activo: martilleroPro },
          { href: '/pro?tipo=cliente' as const, icono: 'sparkles-outline' as const, titulo: 'Rematto Pro', activo: clientePro },
        ]
      : [
          { href: '/pro?tipo=cliente' as const, icono: 'sparkles-outline' as const, titulo: 'Rematto Pro', activo: clientePro },
          { href: '/pro?tipo=martillero' as const, icono: 'hammer-outline' as const, titulo: 'Rematto Pro Martillero', activo: martilleroPro },
        ];

    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={F.title}>Mi perfil</Text>

          <View style={s.card}>
            <Text style={s.email}>{user?.email ?? 'Modo demostración'}</Text>
            <View style={s.estadoRow}>
              <Ionicons name="checkmark-circle" size={18} color={C.ok} />
              <Text style={s.estadoTxt}>Sesión activa</Text>
            </View>
            {rol && (
              <View style={s.rolRow}>
                <Text style={s.rolTxt}>
                  Cuenta {esOrganizador ? 'de organizador' : 'de cliente'}
                </Text>
                <Pressable onPress={() => router.push('/elegir-rol')}>
                  <Text style={s.rolCambiar}>Cambiar</Text>
                </Pressable>
              </View>
            )}
          </View>

          {esOrganizador && (
            <Pressable style={s.fila} onPress={() => router.push('/publicar')}>
              <Ionicons name="add-circle-outline" size={20} color={C.text} />
              <Text style={s.filaTxt}>Publicar remate</Text>
              <Ionicons name="chevron-forward" size={18} color={C.sub} />
            </Pressable>
          )}

          {filasPro.map((f) => (
            <Pressable key={f.href} style={s.fila} onPress={() => router.push(f.href)}>
              <Ionicons name={f.icono} size={20} color={C.text} />
              <Text style={s.filaTxt}>{f.titulo}</Text>
              {f.activo ? (
                <View style={s.badgeActivo}><Text style={s.badgeActivoTxt}>Activo</Text></View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={C.sub} />
              )}
            </Pressable>
          ))}

          <Pressable style={s.fila} onPress={() => router.push('/aprender')}>
            <Ionicons name="school-outline" size={20} color={C.text} />
            <Text style={s.filaTxt}>Aprende a rematar</Text>
            <Ionicons name="chevron-forward" size={18} color={C.sub} />
          </Pressable>
          <Pressable style={s.fila} onPress={() => router.push('/legal/terminos')}>
            <Ionicons name="document-text-outline" size={20} color={C.text} />
            <Text style={s.filaTxt}>Términos y condiciones</Text>
            <Ionicons name="chevron-forward" size={18} color={C.sub} />
          </Pressable>
          <Pressable style={s.fila} onPress={restaurar}>
            <Ionicons name="refresh-outline" size={20} color={C.text} />
            <Text style={s.filaTxt}>Restaurar compras</Text>
          </Pressable>

          {user && (
            <Pressable style={s.btnSalir} onPress={() => signOut(auth)}>
              <Text style={s.btnSalirTxt}>Cerrar sesión</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <LoginForm titulo="Inicia sesión" />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  email: { fontSize: 16, fontWeight: '700', color: C.text },
  estadoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  estadoTxt: { fontSize: 13, color: C.sub },
  rolRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border,
  },
  rolTxt: { fontSize: 13, fontWeight: '600', color: C.text },
  rolCambiar: { fontSize: 13, fontWeight: '700', color: C.text, textDecorationLine: 'underline' },
  notaPublicar: { fontSize: 12, color: C.sub, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  filaTxt: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  badgeActivo: {
    backgroundColor: C.black, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeActivoTxt: { color: C.white, fontSize: 11, fontWeight: '700' },
  btnSalir: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
    borderWidth: 1,
    borderColor: C.border,
  },
  btnSalirTxt: { color: C.text, fontSize: 15, fontWeight: '600' },
});
