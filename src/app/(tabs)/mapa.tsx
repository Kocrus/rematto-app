import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRemates } from '../../lib/useRemates';
import { Remate, fmtPrecio } from '../../lib/types';
import { C } from '../../lib/theme';
import Countdown from '../../components/Countdown';

export default function Mapa() {
  const { remates } = useRemates();
  const router = useRouter();
  const [seleccionado, setSeleccionado] = useState<Remate | null>(null);

  const conUbicacion = useMemo(
    () => remates.filter((r) => r.lat != null && r.lng != null),
    [remates]
  );
  const soloOnline = remates.length - conUbicacion.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.titulo}>Mapa de remates</Text>
        {soloOnline > 0 && (
          <Text style={s.sub}>{soloOnline} remates solo online no aparecen en el mapa</Text>
        )}
      </View>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -33.45,
          longitude: -70.66,
          latitudeDelta: 0.35,
          longitudeDelta: 0.35,
        }}
      >
        {conUbicacion.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat!, longitude: r.lng! }}
            pinColor={r.tipo === 'judicial' ? '#0B0B0B' : '#E11D48'}
            onPress={() => setSeleccionado(r)}
          />
        ))}
      </MapView>

      {seleccionado && (
        <View style={s.preview}>
          <Pressable style={s.previewCerrar} onPress={() => setSeleccionado(null)} hitSlop={10}>
            <Ionicons name="close" size={18} color={C.sub} />
          </Pressable>
          <View style={s.previewTop}>
            <Image source={{ uri: seleccionado.imagen }} style={s.previewImg} />
            <View style={{ flex: 1 }}>
              <Text style={s.previewTitulo}>{seleccionado.comuna}</Text>
              <Text style={s.previewLugar} numberOfLines={1}>{seleccionado.titulo}</Text>
              <Text style={s.previewPrecio}>
                {fmtPrecio(seleccionado.precioMinimo, seleccionado.moneda)}
              </Text>
              <Countdown fechaISO={seleccionado.fechaRemate} />
            </View>
          </View>
          <Pressable style={s.previewBtn} onPress={() => router.push(`/remate/${seleccionado.id}`)}>
            <Text style={s.previewBtnTxt}>Ver detalle del remate</Text>
            <Ionicons name="arrow-forward" size={18} color={C.white} />
          </Pressable>
        </View>
      )}

      <View style={s.leyenda}>
        <View style={s.leyendaItem}>
          <View style={[s.punto, { backgroundColor: '#0B0B0B' }]} />
          <Text style={s.leyendaTxt}>Judicial</Text>
        </View>
        <View style={s.leyendaItem}>
          <View style={[s.punto, { backgroundColor: '#E11D48' }]} />
          <Text style={s.leyendaTxt}>Martillero</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  titulo: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  sub: { fontSize: 12, color: C.sub, marginTop: 2 },
  preview: {
    position: 'absolute',
    bottom: 78,
    left: 16,
    right: 16,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  previewCerrar: { position: 'absolute', top: 8, right: 8, zIndex: 2, padding: 4 },
  previewTop: { flexDirection: 'row', gap: 12 },
  previewImg: { width: 78, height: 78, borderRadius: 10, backgroundColor: C.card },
  previewTitulo: { fontSize: 17, fontWeight: '800', color: C.text },
  previewLugar: { fontSize: 13, color: C.sub, marginTop: 1 },
  previewPrecio: { fontSize: 15, fontWeight: '800', color: C.text, marginTop: 4 },
  previewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.black,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 12,
  },
  previewBtnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
  leyenda: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: C.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    gap: 6,
  },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  punto: { width: 10, height: 10, borderRadius: 5 },
  leyendaTxt: { fontSize: 11, fontWeight: '600', color: C.text },
});
