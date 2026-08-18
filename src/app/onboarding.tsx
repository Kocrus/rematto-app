import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { C } from '../lib/theme';

// Mazo de remate en línea fina (estilo sobrio, consistente con la marca)
function IconoMazo({ color }: { color: string }) {
  return (
    <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
      {[
        'm14 13-7.5 7.5a2.12 2.12 0 0 1-3-3L11 10',
        'm16 16 6-6',
        'm8 8 6-6',
        'm9 7 8 8',
        'm21 11-8-8',
      ].map((d) => (
        <Path key={d} d={d} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </Svg>
  );
}

export const ONBOARDING_KEY = 'rematto_onboarding_visto';

const SLIDES = [
  {
    icono: 'mazo' as const,
    negro: true,
    titulo: 'Todos los remates en un solo lugar',
    texto: 'Martilleros y Judiciales',
    dato: '🏠 Propiedades · 🚗 Vehículos · 🏗️ Maquinaria',
  },
  {
    icono: 'map-outline' as const,
    negro: false,
    titulo: 'Míralos en el mapa, llega sin perderte',
    texto:
      'Somos la única app que georreferencia los remates. Descubre qué se remata cerca tuyo y toca "Cómo llegar".',
    dato: '🔔 Corazón = agenda automática + aviso 1 hora antes',
  },
  {
    icono: 'school-outline' as const,
    negro: false,
    titulo: 'Aprende a rematar como profesional',
    texto:
      '6 guías gratis: garantías, vale vista, comisiones, errores del principiante y más. Un postor informado remata mejor.',
    dato: '✓ Explora todo sin crear cuenta — regístrate solo cuando quieras el detalle',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const ultimo = idx === SLIDES.length - 1;
  const s0 = SLIDES[idx];

  const terminar = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.marca}>REMATTO</Text>

      <View style={s.centro}>
        <View style={[s.visual, s0.negro && s.visualNegro]}>
          {s0.icono === 'mazo' ? (
            <IconoMazo color={s0.negro ? C.white : C.text} />
          ) : (
            <Ionicons name={s0.icono} size={54} color={s0.negro ? C.white : C.text} />
          )}
        </View>
        <Text style={s.titulo}>{s0.titulo}</Text>
        <Text style={s.texto}>{s0.texto}</Text>
        <View style={s.dato}>
          <Text style={s.datoTxt}>{s0.dato}</Text>
        </View>
      </View>

      <View style={s.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[s.dot, i === idx && s.dotOn]} />
        ))}
      </View>

      <View style={s.nav}>
        <Pressable onPress={terminar} hitSlop={10}>
          <Text style={s.saltar}>Saltar</Text>
        </Pressable>
        <Pressable style={s.btn} onPress={() => (ultimo ? terminar() : setIdx(idx + 1))}>
          <Text style={s.btnTxt}>{ultimo ? 'Comenzar' : 'Siguiente'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 28 },
  marca: { fontSize: 16, fontWeight: '900', letterSpacing: -0.5, color: C.text, marginTop: 10 },
  centro: { flex: 1, justifyContent: 'center' },
  visual: {
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 36,
  },
  visualNegro: { backgroundColor: C.black, borderColor: C.black },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: C.text,
    textAlign: 'center',
    lineHeight: 33,
  },
  texto: { fontSize: 15, color: C.sub, textAlign: 'center', lineHeight: 23, marginTop: 12 },
  dato: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 13,
    marginTop: 22,
  },
  datoTxt: { fontSize: 13, fontWeight: '600', color: C.text, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 26 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#DDDDDD' },
  dotOn: { width: 26, backgroundColor: C.black },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  saltar: { fontSize: 15, fontWeight: '600', color: C.sub, padding: 14 },
  btn: {
    backgroundColor: C.black,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 34,
  },
  btnTxt: { color: C.white, fontSize: 16, fontWeight: '700' },
});
