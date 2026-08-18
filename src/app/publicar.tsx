import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db, auth, FIREBASE_SIN_CONFIGURAR } from '../lib/firebase';
import { usePro } from '../lib/purchases';
import { useUsuario } from '../lib/useUsuario';
import { C, F } from '../lib/theme';
import { Categoria, TipoRemate, Modalidad } from '../lib/types';

const CATEGORIAS: Categoria[] = ['Propiedades', 'Vehículos', 'Maquinaria', 'Tecnología', 'Mobiliario', 'Otros'];

export default function Publicar() {
  const router = useRouter();
  const { martilleroPro } = usePro();
  const { cargando: cargandoRol, esOrganizador, elegirRol } = useUsuario();
  const [activando, setActivando] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Propiedades');
  const [tipo, setTipo] = useState<TipoRemate>('extrajudicial');
  const [modalidad, setModalidad] = useState<Modalidad>('online');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [direccion, setDireccion] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState<'CLP' | 'UF'>('CLP');
  const [garantia, setGarantia] = useState('');
  const [fecha, setFecha] = useState(''); // formato: 2026-08-01 15:00
  const [martillero, setMartillero] = useState('');
  const [urlFuente, setUrlFuente] = useState('');
  const [destacar, setDestacar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const activarOrganizador = async () => {
    try {
      setActivando(true);
      await elegirRol('organizador');
    } catch {
      Alert.alert('Error', 'No se pudo activar tu perfil de organizador. Intenta nuevamente.');
    } finally {
      setActivando(false);
    }
  };

  const publicar = async () => {
    if (!titulo || !region || !comuna || !precio || !fecha || !martillero || !urlFuente) {
      Alert.alert(
        'Faltan datos',
        'Completa los campos obligatorios (*). El link a tu remate es obligatorio: ahí dirigiremos a los interesados.'
      );
      return;
    }
    if (FIREBASE_SIN_CONFIGURAR) {
      Alert.alert('Modo demo', 'Configura Firebase en lib/firebase.ts para publicar remates reales.');
      return;
    }
    if (!auth.currentUser) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión en Perfil para publicar.');
      return;
    }
    const fechaISO = new Date(fecha.replace(' ', 'T') + ':00').toISOString();
    if (isNaN(new Date(fechaISO).getTime())) {
      Alert.alert('Fecha inválida', 'Usa el formato: 2026-08-01 15:00');
      return;
    }
    try {
      setEnviando(true);
      await addDoc(collection(db, 'remates'), {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        tipo,
        modalidad,
        region: region.trim(),
        comuna: comuna.trim(),
        direccion: direccion.trim() || null,
        precioMinimo: Number(precio),
        moneda,
        garantia: garantia.trim() || null,
        fechaRemate: fechaISO,
        imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        martillero: martillero.trim(),
        fuente: 'externo',
        urlFuente: urlFuente.trim(),
        // Solo un martillero con Rematto Pro Martillero puede destacar su publicación.
        destacado: martilleroPro && destacar,
        creadoPor: auth.currentUser.uid,
      });
      Alert.alert('Publicado', 'Tu remate quedó publicado en Rematto.');
      setTitulo(''); setDescripcion(''); setRegion(''); setComuna(''); setDireccion('');
      setPrecio(''); setGarantia(''); setFecha(''); setMartillero(''); setUrlFuente('');
      setDestacar(false);
    } catch {
      Alert.alert('Error', 'No se pudo publicar. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Mientras no sabemos el rol, no mostramos nada para evitar parpadeo.
  if (cargandoRol) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={C.text} />
      </View>
    );
  }

  // Publicar es para martilleros, casas de remates y empresas. A un cliente
  // que llega aquí le ofrecemos activar ese perfil en un toque (no es una
  // barrera dura: cualquiera puede pasarse a organizador cuando quiera).
  if (!esOrganizador) {
    return (
      <View style={s.centro}>
        <View style={s.activarCard}>
          <Ionicons name="hammer-outline" size={26} color={C.text} />
          <Text style={s.activarTitulo}>Publicar es para organizadores</Text>
          <Text style={s.activarSub}>
            Activa tu perfil de martillero, casa de remates o empresa para publicar tus remates en Rematto.
          </Text>
          <Pressable style={s.activarBtn} onPress={activarOrganizador} disabled={activando}>
            <Text style={s.activarBtnTxt}>
              {activando ? 'Un momento…' : 'Soy martillero u organizador'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={F.title}>Publicar remate</Text>
        <Text style={s.nota}>
          Para martilleros registrados, casas de remates y empresas. Rematto publica y da
          visibilidad; el remate lo ejecutas tú en tu plataforma o lugar.
        </Text>

        {!martilleroPro && (
          <Pressable style={s.proBanner} onPress={() => router.push('/pro?tipo=martillero')}>
            <Ionicons name="hammer-outline" size={20} color={C.text} />
            <View style={{ flex: 1 }}>
              <Text style={s.proBannerTitulo}>Rematto Pro Martillero</Text>
              <Text style={s.proBannerSub}>Destaca tus remates, fotos ilimitadas y estadísticas de vistas.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.sub} />
          </Pressable>
        )}

        <Campo label="Título *" value={titulo} onChange={setTitulo} placeholder="Ej: Camioneta Toyota Hilux 2021" />
        <Campo label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Detalle del bien, estado, exhibición…" multiline />

        <Text style={s.label}>Categoría</Text>
        <View style={s.chipsWrap}>
          {CATEGORIAS.map((c) => (
            <Pressable key={c} style={[s.chip, categoria === c && s.chipOn]} onPress={() => setCategoria(c)}>
              <Text style={[s.chipTxt, categoria === c && s.chipTxtOn]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Tipo</Text>
        <View style={s.row}>
          {(['extrajudicial', 'judicial'] as TipoRemate[]).map((t) => (
            <Pressable key={t} style={[s.tipoBtn, tipo === t && s.chipOn]} onPress={() => setTipo(t)}>
              <Text style={[s.chipTxt, tipo === t && s.chipTxtOn]}>
                {t === 'extrajudicial' ? 'Martillero' : 'Judicial'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Modalidad</Text>
        <View style={s.row}>
          {(['online', 'presencial', 'mixto'] as Modalidad[]).map((m) => (
            <Pressable key={m} style={[s.tipoBtn, modalidad === m && s.chipOn]} onPress={() => setModalidad(m)}>
              <Text style={[s.chipTxt, modalidad === m && s.chipTxtOn]}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Campo label="Región *" value={region} onChange={setRegion} placeholder="Metropolitana" />
          </View>
          <View style={{ flex: 1 }}>
            <Campo label="Comuna *" value={comuna} onChange={setComuna} placeholder="Santiago" />
          </View>
        </View>

        {modalidad !== 'online' && (
          <Campo label="Dirección (aparecerá en el mapa)" value={direccion} onChange={setDireccion} placeholder="Av. Ejemplo 1234, Comuna" />
        )}

        <View style={s.row}>
          <View style={{ flex: 2 }}>
            <Campo label="Precio mínimo *" value={precio} onChange={setPrecio} placeholder="15000000" teclado="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Moneda</Text>
            <View style={s.row}>
              {(['CLP', 'UF'] as const).map((m) => (
                <Pressable key={m} style={[s.tipoBtn, moneda === m && s.chipOn]} onPress={() => setMoneda(m)}>
                  <Text style={[s.chipTxt, moneda === m && s.chipTxtOn]}>{m}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Campo label="Garantía para participar" value={garantia} onChange={setGarantia} placeholder="Ej: 10% del mínimo en vale vista" />
        <Campo label="Fecha y hora *" value={fecha} onChange={setFecha} placeholder="2026-08-01 15:00" />
        <Campo label="Martillero / Entidad *" value={martillero} onChange={setMartillero} placeholder="Ej: Martillero P. González — Reg. N° 1.234" />
        <Campo label="Link a tu remate *" value={urlFuente} onChange={setUrlFuente} placeholder="https://…" sinMayusculas />

        <Pressable
          style={[s.destacarRow, !martilleroPro && { opacity: 0.5 }]}
          onPress={() => (martilleroPro ? setDestacar((v) => !v) : router.push('/pro?tipo=martillero'))}
        >
          <Ionicons name={destacar && martilleroPro ? 'checkbox' : 'square-outline'} size={22} color={C.text} />
          <View style={{ flex: 1 }}>
            <Text style={s.destacarTxt}>Destacar esta publicación</Text>
            {!martilleroPro && <Text style={s.destacarSub}>Requiere Rematto Pro Martillero</Text>}
          </View>
        </Pressable>

        <Pressable style={[s.btn, enviando && { opacity: 0.5 }]} onPress={publicar} disabled={enviando}>
          <Text style={s.btnTxt}>{enviando ? 'Publicando…' : 'Publicar remate'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  label, value, onChange, placeholder, multiline, teclado, sinMayusculas,
}: {
  label: string; value: string; onChange: (t: string) => void;
  placeholder?: string; multiline?: boolean; teclado?: 'numeric' | 'default';
  sinMayusculas?: boolean;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, multiline && { height: 90, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9A9A9A"
        multiline={multiline}
        keyboardType={teclado === 'numeric' ? 'numeric' : 'default'}
        autoCapitalize={sinMayusculas ? 'none' : 'sentences'}
      />
    </View>
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, paddingHorizontal: 24 },
  activarCard: {
    alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 16,
    padding: 24, backgroundColor: C.card,
  },
  activarTitulo: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 12, textAlign: 'center' },
  activarSub: { fontSize: 14, color: C.sub, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  activarBtn: { backgroundColor: C.black, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, marginTop: 18 },
  activarBtnTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 60 },
  nota: { ...F.sub, marginTop: 4, marginBottom: 20 },
  proBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 20,
  },
  proBannerTitulo: { fontSize: 14, fontWeight: '700', color: C.text },
  proBannerSub: { fontSize: 12, color: C.sub, marginTop: 2 },
  label: { fontSize: 13, fontWeight: '600', color: C.text, marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.text,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  chipOn: { backgroundColor: C.black, borderColor: C.black },
  chipTxt: { fontSize: 13, fontWeight: '600', color: C.text },
  chipTxtOn: { color: C.white },
  row: { flexDirection: 'row', gap: 8 },
  tipoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    backgroundColor: C.white,
  },
  destacarRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14,
  },
  destacarTxt: { fontSize: 14, fontWeight: '700', color: C.text },
  destacarSub: { fontSize: 12, color: C.sub, marginTop: 2 },
  btn: {
    backgroundColor: C.black,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  btnTxt: { color: C.white, fontSize: 16, fontWeight: '700' },
});
