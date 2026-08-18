import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GUIAS } from '../../lib/guias';
import { C, F } from '../../lib/theme';

export default function GuiaDetalle() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const idx = GUIAS.findIndex((g) => g.slug === slug);
  const guia = GUIAS[idx];

  if (!guia) {
    return (
      <View style={s.centro}>
        <Text style={F.sub}>Guía no encontrada.</Text>
      </View>
    );
  }

  const siguiente = GUIAS[idx + 1];

  return (
    <ScrollView style={s.safe} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.iconoWrap}>
        <Ionicons name={guia.icono as any} size={26} color={C.text} />
      </View>
      <Text style={s.meta}>Guía {idx + 1} de {GUIAS.length} · {guia.minutos} min</Text>
      <Text style={s.titulo}>{guia.titulo}</Text>

      {guia.secciones.map((sec) => (
        <View key={sec.subtitulo} style={{ marginTop: 22 }}>
          <Text style={s.subtitulo}>{sec.subtitulo}</Text>
          <Text style={s.texto}>{sec.texto}</Text>
        </View>
      ))}

      {siguiente && (
        <Pressable
          style={s.btnSiguiente}
          onPress={() => router.replace(`/aprender/${siguiente.slug}`)}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.btnSiguienteLabel}>Siguiente guía</Text>
            <Text style={s.btnSiguienteTitulo}>{siguiente.titulo}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={C.white} />
        </Pressable>
      )}

      <Text style={s.disclaimer}>
        Contenido informativo general, no constituye asesoría legal ni financiera. Verifica siempre
        las bases y condiciones de cada remate en su fuente oficial.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 60 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  iconoWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { fontSize: 12, color: C.sub, fontWeight: '600', marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.4 },
  titulo: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 6 },
  subtitulo: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6 },
  texto: { fontSize: 15, color: C.text, lineHeight: 23 },
  btnSiguiente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.black,
    borderRadius: 14,
    padding: 16,
    marginTop: 32,
  },
  btnSiguienteLabel: { fontSize: 11, color: '#BBBBBB', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  btnSiguienteTitulo: { fontSize: 15, fontWeight: '700', color: C.white, marginTop: 2 },
  disclaimer: { fontSize: 12, color: C.sub, lineHeight: 18, marginTop: 28 },
});
