import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRemates } from '../../lib/useRemates';
import { getFavoritos } from '../../lib/favoritos';
import RemateCard from '../../components/RemateCard';
import { C, F } from '../../lib/theme';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function Agenda() {
  const { remates } = useRemates();
  const [favIds, setFavIds] = useState<string[]>([]);
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [diaSel, setDiaSel] = useState<number | null>(null);

  // Recargar favoritos cada vez que se entra a la pestaña
  useFocusEffect(
    useCallback(() => {
      getFavoritos().then(setFavIds);
    }, [])
  );

  // A diferencia de RemateFacil: la agenda se llena SOLA con tus favoritos
  const misRemates = useMemo(
    () => remates.filter((r) => favIds.includes(r.id)),
    [remates, favIds]
  );

  const diasConEvento = useMemo(() => {
    const set = new Set<number>();
    misRemates.forEach((r) => {
      const f = new Date(r.fechaRemate);
      if (f.getMonth() === mes && f.getFullYear() === anio) set.add(f.getDate());
    });
    return set;
  }, [misRemates, mes, anio]);

  const rematesDelDia = useMemo(() => {
    if (diaSel == null) return misRemates;
    return misRemates.filter((r) => {
      const f = new Date(r.fechaRemate);
      return f.getDate() === diaSel && f.getMonth() === mes && f.getFullYear() === anio;
    });
  }, [misRemates, diaSel, mes, anio]);

  // Construcción del calendario (semana parte en lunes)
  const primerDia = new Date(anio, mes, 1);
  const offset = (primerDia.getDay() + 6) % 7;
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const cambiarMes = (delta: number) => {
    let m = mes + delta;
    let a = anio;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m); setAnio(a); setDiaSel(null);
  };

  const esHoy = (d: number) =>
    d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={F.title}>Mi agenda</Text>
        <Text style={s.sub}>Tus remates guardados, con recordatorio automático.</Text>

        <View style={s.calendario}>
          <View style={s.calHeader}>
            <Pressable onPress={() => cambiarMes(-1)} hitSlop={10}>
              <Ionicons name="chevron-back" size={22} color={C.text} />
            </Pressable>
            <Text style={s.calMes}>{MESES[mes]} {anio}</Text>
            <Pressable onPress={() => cambiarMes(1)} hitSlop={10}>
              <Ionicons name="chevron-forward" size={22} color={C.text} />
            </Pressable>
          </View>

          <View style={s.calGrid}>
            {DIAS.map((d) => (
              <Text key={d} style={s.calDiaNombre}>{d}</Text>
            ))}
            {celdas.map((d, i) => (
              <Pressable
                key={i}
                style={[
                  s.calCelda,
                  d != null && esHoy(d) && s.calHoy,
                  d != null && diaSel === d && s.calSel,
                ]}
                disabled={d == null}
                onPress={() => setDiaSel(diaSel === d ? null : d)}
              >
                {d != null && (
                  <>
                    <Text
                      style={[
                        s.calNum,
                        esHoy(d) && { fontWeight: '800' },
                        diaSel === d && { color: C.white },
                      ]}
                    >
                      {d}
                    </Text>
                    {diasConEvento.has(d) && (
                      <View style={[s.calPunto, diaSel === d && { backgroundColor: C.white }]} />
                    )}
                  </>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={[F.h2, { marginTop: 24, marginBottom: 12 }]}>
          {diaSel != null ? `Remates del ${diaSel} de ${MESES[mes].toLowerCase()}` : 'Todos mis remates'}
        </Text>

        {rematesDelDia.length === 0 ? (
          <View style={s.vacio}>
            <Ionicons name="calendar-outline" size={36} color="#C9C9C9" />
            <Text style={s.vacioTitulo}>
              {misRemates.length === 0 ? 'Tu agenda está vacía' : 'Sin remates este día'}
            </Text>
            {misRemates.length === 0 && (
              <Text style={s.vacioTxt}>
                Entra a un remate y toca "Agendar": se agrega aquí y al calendario de tu teléfono, con aviso 1 hora antes.
              </Text>
            )}
          </View>
        ) : (
          rematesDelDia.map((r) => <RemateCard key={r.id} remate={r} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  sub: { ...F.sub, marginTop: 4, marginBottom: 16 },
  calendario: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calMes: { fontSize: 16, fontWeight: '700', color: C.text },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDiaNombre: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: C.sub,
    marginBottom: 6,
  },
  calCelda: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  calHoy: { borderWidth: 1, borderColor: C.text },
  calSel: { backgroundColor: C.black },
  calNum: { fontSize: 14, color: C.text },
  calPunto: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.live,
    position: 'absolute',
    bottom: 6,
  },
  vacio: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  vacioTitulo: { fontSize: 15, fontWeight: '700', color: C.text },
  vacioTxt: { fontSize: 13, color: C.sub, textAlign: 'center', paddingHorizontal: 30, lineHeight: 19 },
});
