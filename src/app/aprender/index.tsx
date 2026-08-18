import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GUIAS } from '../../lib/guias';
import { C, F } from '../../lib/theme';

export default function Aprender() {
  const router = useRouter();

  return (
    <ScrollView style={s.safe} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={F.title}>Aprende a rematar</Text>
      <Text style={s.sub}>
        Guías gratuitas para participar informado. Porque un postor preparado remata mejor.
      </Text>

      {GUIAS.map((g, i) => (
        <Pressable
          key={g.slug}
          style={s.card}
          onPress={() => router.push(`/aprender/${g.slug}`)}
        >
          <View style={s.iconoWrap}>
            <Ionicons name={g.icono as any} size={22} color={C.text} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.numero}>Guía {i + 1} · {g.minutos} min de lectura</Text>
            <Text style={s.titulo}>{g.titulo}</Text>
            <Text style={s.resumen} numberOfLines={2}>{g.resumen}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.sub} style={{ alignSelf: 'center' }} />
        </Pressable>
      ))}

      <View style={s.aviso}>
        <Ionicons name="information-circle-outline" size={18} color={C.sub} />
        <Text style={s.avisoTxt}>
          Contenido informativo general. No constituye asesoría legal ni financiera; verifica siempre
          las bases y la fuente oficial de cada remate.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  sub: { ...F.sub, marginTop: 4, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  iconoWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numero: { fontSize: 11, color: C.sub, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  titulo: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 2 },
  resumen: { fontSize: 13, color: C.sub, marginTop: 3, lineHeight: 18 },
  aviso: { flexDirection: 'row', gap: 8, marginTop: 12, paddingHorizontal: 4 },
  avisoTxt: { flex: 1, fontSize: 12, color: C.sub, lineHeight: 17 },
});
