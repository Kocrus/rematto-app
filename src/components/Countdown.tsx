import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { C } from '../lib/theme';

export default function Countdown({ fechaISO, grande }: { fechaISO: string; grande?: boolean }) {
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = new Date(fechaISO).getTime() - ahora;

  if (diff <= 0) {
    return (
      <View style={s.liveRow}>
        <View style={s.dot} />
        <Text style={[s.live, grande && s.liveGrande]}>EN VIVO</Text>
      </View>
    );
  }

  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const seg = Math.floor((diff % 60_000) / 1000);

  const texto =
    d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m ${seg}s` : `${m}m ${seg}s`;

  return <Text style={[s.count, grande && s.countGrande]}>⏱ {texto}</Text>;
}

const s = StyleSheet.create({
  count: { fontSize: 13, fontWeight: '600', color: C.text },
  countGrande: { fontSize: 20, fontWeight: '800' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.live },
  live: { fontSize: 13, fontWeight: '800', color: C.live, letterSpacing: 1 },
  liveGrande: { fontSize: 18 },
});
