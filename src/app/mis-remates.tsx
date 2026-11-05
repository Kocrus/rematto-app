import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db, auth, FIREBASE_SIN_CONFIGURAR } from '../lib/firebase';
import { usePro } from '../lib/purchases';
import { useUsuario } from '../lib/useUsuario';
import { Remate, fmtPrecio } from '../lib/types';
import { C, F } from '../lib/theme';

// Estadísticas de vistas y favoritos por publicación: beneficio de Rematto
// Pro Martillero. Sin consulta con orderBy (solo where creadoPor == uid) para
// no depender de un índice compuesto de Firestore.
export default function MisRemates() {
  const router = useRouter();
  const { martilleroPro } = usePro();
  const { cargando: cargandoRol } = useUsuario();
  const [remates, setRemates] = useState<Remate[] | null>(null);

  useEffect(() => {
    if (FIREBASE_SIN_CONFIGURAR || !martilleroPro || !auth.currentUser) return;
    const q = query(collection(db, 'remates'), where('creadoPor', '==', auth.currentUser.uid));
    getDocs(q)
      .then((snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Remate, 'id'>) }));
        lista.sort((a, b) => new Date(b.fechaRemate).getTime() - new Date(a.fechaRemate).getTime());
        setRemates(lista);
      })
      .catch(() => setRemates([]));
  }, [martilleroPro]);

  if (cargandoRol) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={C.text} />
      </View>
    );
  }

  if (!martilleroPro) {
    return (
      <View style={s.centro}>
        <View style={s.card}>
          <Ionicons name="stats-chart-outline" size={26} color={C.text} />
          <Text style={s.tituloCard}>Estadísticas requiere Rematto Pro Martillero</Text>
          <Text style={s.subCard}>
            Suscríbete para ver cuántas vistas y favoritos recibe cada uno de tus remates.
          </Text>
          <Pressable style={s.btn} onPress={() => router.push('/pro?tipo=martillero')}>
            <Text style={s.btnTxt}>Ver Rematto Pro Martillero</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (remates == null) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={C.text} />
      </View>
    );
  }

  return (
    <View style={s.safe}>
      <FlatList
        data={remates}
        keyExtractor={(r) => r.id}
        contentContainerStyle={s.scroll}
        ListHeaderComponent={<Text style={[F.title, { marginBottom: 4 }]}>Mis remates</Text>}
        ListEmptyComponent={
          <Text style={[F.sub, { marginTop: 20 }]}>Todavía no has publicado ningún remate.</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={s.fila} onPress={() => router.push(`/remate/${item.id}`)}>
            <View style={{ flex: 1 }}>
              <Text style={s.filaTitulo} numberOfLines={1}>{item.titulo}</Text>
              <Text style={s.filaSub}>{item.comuna} · {fmtPrecio(item.precioMinimo, item.moneda)}</Text>
            </View>
            <View style={s.stat}>
              <Ionicons name="eye-outline" size={16} color={C.sub} />
              <Text style={s.statTxt}>{item.vistas ?? 0}</Text>
            </View>
            <View style={s.stat}>
              <Ionicons name="heart-outline" size={16} color={C.sub} />
              <Text style={s.statTxt}>{item.favoritosCount ?? 0}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, paddingHorizontal: 24 },
  card: {
    alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 16,
    padding: 24, backgroundColor: C.card,
  },
  tituloCard: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 12, textAlign: 'center' },
  subCard: { fontSize: 14, color: C.sub, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  btn: { backgroundColor: C.black, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, marginTop: 18 },
  btnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  fila: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  filaTitulo: { fontSize: 15, fontWeight: '700', color: C.text },
  filaSub: { fontSize: 13, color: C.sub, marginTop: 2 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTxt: { fontSize: 13, fontWeight: '600', color: C.sub },
});
