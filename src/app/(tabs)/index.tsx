import { useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRemates } from '../../lib/useRemates';
import RemateCard from '../../components/RemateCard';
import AnuncioBanner from '../../components/AnuncioBanner';
import { C, F } from '../../lib/theme';
import { ONBOARDING_KEY } from '../onboarding';

export default function Home() {
  const { remates, esDemo } = useRemates();
  const router = useRouter();

  // Primera vez: mostrar el onboarding de bienvenida
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((visto) => {
      if (!visto) router.replace('/onboarding');
    });
  }, []);

  const enVivo = remates.filter(
    (r) =>
      new Date(r.fechaRemate).getTime() <= Date.now() &&
      new Date(r.fechaRemate).getTime() > Date.now() - 6 * 3600_000
  );
  const destacados = remates.filter(
    (r) => r.destacado && new Date(r.fechaRemate).getTime() > Date.now()
  );
  const proximos = remates
    .filter((r) => new Date(r.fechaRemate).getTime() > Date.now())
    .sort((a, b) => a.fechaRemate.localeCompare(b.fechaRemate));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.logo}>REMATTO</Text>
        <Text style={s.claim}>Todos los remates de Chile, en un solo lugar.</Text>

        <AnuncioBanner />

        {esDemo && (
          <View style={s.demo}>
            <Text style={s.demoTxt}>Modo demostración — datos de ejemplo</Text>
          </View>
        )}

        <Pressable style={s.aprender} onPress={() => router.push('/aprender')}>
          <View style={s.aprenderIcono}>
            <Ionicons name="school-outline" size={22} color={C.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.aprenderTitulo}>Aprende a rematar</Text>
            <Text style={s.aprenderSub}>6 guías gratis: judiciales, martilleros, riesgos y más</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.white} />
        </Pressable>

        {enVivo.length > 0 && (
          <>
            <View style={s.headerRow}>
              <View style={s.liveDot} />
              <Text style={F.h2}>En vivo ahora</Text>
            </View>
            <FlatList
              horizontal
              data={enVivo}
              keyExtractor={(r) => r.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => <RemateCard remate={item} ancho={280} />}
            />
          </>
        )}

        {destacados.length > 0 && (
          <>
            <Text style={[F.h2, s.seccion]}>Destacados</Text>
            <FlatList
              horizontal
              data={destacados}
              keyExtractor={(r) => r.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => <RemateCard remate={item} ancho={280} />}
            />
          </>
        )}

        <Text style={[F.h2, s.seccion]}>Próximos remates</Text>
        {proximos.map((r) => (
          <RemateCard key={r.id} remate={r} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  logo: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    color: C.text,
    marginTop: 8,
  },
  claim: { ...F.sub, marginTop: 2, marginBottom: 16 },
  demo: {
    backgroundColor: C.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  demoTxt: { fontSize: 12, color: C.sub, textAlign: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.live },
  seccion: { marginTop: 24, marginBottom: 12 },
  aprender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.black,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  aprenderIcono: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aprenderTitulo: { fontSize: 15, fontWeight: '800', color: C.white },
  aprenderSub: { fontSize: 12, color: '#BBBBBB', marginTop: 2 },
});
