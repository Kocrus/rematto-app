import { useState } from 'react';
import { Text, ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { TERMINOS_ES, TERMINOS_EN, FECHA_VIGENCIA, EFFECTIVE_DATE } from '../../lib/legal';
import { C } from '../../lib/theme';

export default function Terminos() {
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const clausulas = idioma === 'es' ? TERMINOS_ES : TERMINOS_EN;

  return (
    <ScrollView style={s.safe} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Text style={s.marca}>REMATTO</Text>
      <Text style={s.titulo}>
        {idioma === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
      </Text>
      <Text style={s.vigencia}>
        {idioma === 'es' ? `Fecha de vigencia: ${FECHA_VIGENCIA}` : `Effective date: ${EFFECTIVE_DATE}`}
      </Text>

      <View style={s.idiomaRow}>
        {(['es', 'en'] as const).map((l) => (
          <Pressable
            key={l}
            style={[s.idiomaBtn, idioma === l && s.idiomaBtnOn]}
            onPress={() => setIdioma(l)}
          >
            <Text style={[s.idiomaTxt, idioma === l && s.idiomaTxtOn]}>
              {l === 'es' ? 'Español' : 'English'}
            </Text>
          </Pressable>
        ))}
      </View>

      {clausulas.map((c) => (
        <View key={c.titulo} style={{ marginTop: 24 }}>
          <Text style={s.clausulaTitulo}>{c.titulo}</Text>
          <Text style={s.clausulaTexto}>{c.texto}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 },
  marca: { fontSize: 16, fontWeight: '900', letterSpacing: -0.5, color: C.text },
  titulo: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginTop: 8 },
  vigencia: { fontSize: 13, color: C.sub, marginTop: 4 },
  idiomaRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  idiomaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  idiomaBtnOn: { backgroundColor: C.black, borderColor: C.black },
  idiomaTxt: { fontSize: 13, fontWeight: '600', color: C.text },
  idiomaTxtOn: { color: C.white },
  clausulaTitulo: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6 },
  clausulaTexto: { fontSize: 14, color: C.text, lineHeight: 22 },
});
