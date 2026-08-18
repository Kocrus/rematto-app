import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Remate, fmtPrecio } from '../lib/types';
import { C } from '../lib/theme';
import Countdown from './Countdown';

export default function RemateCard({ remate, ancho }: { remate: Remate; ancho?: number }) {
  const router = useRouter();

  return (
    <Pressable
      style={[s.card, ancho ? { width: ancho } : null]}
      onPress={() => router.push(`/remate/${remate.id}`)}
    >
      <Image source={{ uri: remate.imagen }} style={s.img} />
      <View style={s.badges}>
        <View style={[s.badge, remate.tipo === 'judicial' ? s.badgeJudicial : s.badgeMart]}>
          <Text style={[s.badgeTxt, remate.tipo === 'judicial' && { color: C.white }]}>
            {remate.tipo === 'judicial' ? 'JUDICIAL' : 'MARTILLERO'}
          </Text>
        </View>
        <View style={s.badgeModalidad}>
          <Ionicons
            name={remate.modalidad === 'online' ? 'globe-outline' : 'location-outline'}
            size={11}
            color={C.text}
          />
          <Text style={s.badgeTxt}>
            {remate.modalidad === 'online' ? 'ONLINE' : remate.modalidad === 'mixto' ? 'MIXTO' : 'PRESENCIAL'}
          </Text>
        </View>
      </View>
      <View style={s.body}>
        <Text style={s.titulo}>{remate.comuna}</Text>
        <Text style={s.lugar} numberOfLines={2}>{remate.titulo}</Text>
        <View style={s.footer}>
          <View>
            <Text style={s.precioLabel}>Mínimo</Text>
            <Text style={s.precio}>{fmtPrecio(remate.precioMinimo, remate.moneda)}</Text>
          </View>
          <Countdown fechaISO={remate.fechaRemate} />
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  img: { width: '100%', height: 150, backgroundColor: C.card },
  badges: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: C.white,
  },
  badgeJudicial: { backgroundColor: C.black },
  badgeMart: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  badgeModalidad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  badgeTxt: { fontSize: 10, fontWeight: '800', color: C.text, letterSpacing: 0.5 },
  body: { padding: 12 },
  titulo: { fontSize: 15, fontWeight: '700', color: C.text },
  lugar: { fontSize: 12, color: C.sub, marginTop: 2 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  precioLabel: { fontSize: 11, color: C.sub },
  precio: { fontSize: 16, fontWeight: '800', color: C.text },
});
