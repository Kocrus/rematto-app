import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRemates } from '../../lib/useRemates';
import RemateCard from '../../components/RemateCard';
import { C, F } from '../../lib/theme';

const CATEGORIAS = ['Todas', 'Propiedades', 'Vehículos', 'Maquinaria', 'Tecnología', 'Mobiliario', 'Otros'];
const TIPOS = ['Todos', 'Judicial', 'Martillero'] as const;

export default function Explorar() {
  const { remates } = useRemates();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>('Todos');

  const filtrados = useMemo(() => {
    return remates.filter((r) => {
      const okBusqueda =
        !busqueda ||
        r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.comuna.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.region.toLowerCase().includes(busqueda.toLowerCase());
      const okCategoria = categoria === 'Todas' || r.categoria === categoria;
      const okTipo =
        tipo === 'Todos' ||
        (tipo === 'Judicial' ? r.tipo === 'judicial' : r.tipo === 'extrajudicial');
      return okBusqueda && okCategoria && okTipo;
    });
  }, [remates, busqueda, categoria, tipo]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={F.title}>Explorar</Text>
        <TextInput
          style={s.input}
          placeholder="Buscar por título, comuna o región…"
          placeholderTextColor="#9A9A9A"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {CATEGORIAS.map((c) => (
            <Pressable
              key={c}
              style={[s.chip, categoria === c && s.chipActivo]}
              onPress={() => setCategoria(c)}
            >
              <Text style={[s.chipTxt, categoria === c && s.chipTxtActivo]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={s.tipoRow}>
          {TIPOS.map((t) => (
            <Pressable
              key={t}
              style={[s.tipoBtn, tipo === t && s.tipoBtnActivo]}
              onPress={() => setTipo(t)}
            >
              <Text style={[s.tipoTxt, tipo === t && s.tipoTxtActivo]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(r) => r.id}
        contentContainerStyle={s.lista}
        renderItem={({ item }) => <RemateCard remate={item} />}
        ListEmptyComponent={
          <Text style={s.vacio}>No hay remates que coincidan con tu búsqueda.</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  input: {
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.text,
    marginTop: 14,
  },
  chips: { gap: 8, paddingVertical: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  chipActivo: { backgroundColor: C.black, borderColor: C.black },
  chipTxt: { fontSize: 13, color: C.text, fontWeight: '600' },
  chipTxtActivo: { color: C.white },
  tipoRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tipoBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    backgroundColor: C.white,
  },
  tipoBtnActivo: { backgroundColor: C.black, borderColor: C.black },
  tipoTxt: { fontSize: 13, fontWeight: '600', color: C.text },
  tipoTxtActivo: { color: C.white },
  lista: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  vacio: { textAlign: 'center', color: C.sub, marginTop: 40, fontSize: 14 },
});
