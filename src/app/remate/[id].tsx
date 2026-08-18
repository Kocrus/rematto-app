import { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, Pressable, StyleSheet, Linking, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { db, FIREBASE_SIN_CONFIGURAR } from '../../lib/firebase';
import { MOCK_REMATES } from '../../lib/mock';
import { Remate, fmtPrecio, fmtFecha } from '../../lib/types';
import { usePro } from '../../lib/purchases';
import { C, F } from '../../lib/theme';
import Countdown from '../../components/Countdown';
import LoginGate from '../../components/LoginGate';
import { esFavorito, toggleFavorito, agregarACalendarioTelefono } from '../../lib/favoritos';

// El detalle completo requiere cuenta según MODO_ACCESO (lib/config.ts)
export default function FichaRemateProtegida() {
  return (
    <LoginGate contexto="ficha">
      <FichaRemate />
    </LoginGate>
  );
}

function FichaRemate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { clientePro } = usePro();
  const [remate, setRemate] = useState<Remate | null>(
    MOCK_REMATES.find((r) => r.id === id) ?? null
  );
  const [fav, setFav] = useState(false);

  const esMock = id?.startsWith('m');

  useEffect(() => {
    if (id) esFavorito(id).then(setFav);
  }, [id]);

  useEffect(() => {
    if (FIREBASE_SIN_CONFIGURAR || esMock || !id) return;
    const unsub = onSnapshot(doc(db, 'remates', id), (snap) => {
      if (snap.exists()) setRemate({ id: snap.id, ...(snap.data() as Omit<Remate, 'id'>) });
    });
    return unsub;
  }, [id]);

  if (!remate) {
    return (
      <View style={s.centro}>
        <Text style={F.sub}>Remate no encontrado.</Text>
      </View>
    );
  }

  const esJudicial = remate.tipo === 'judicial';
  const tieneMapa = remate.lat != null && remate.lng != null;
  const tienePro =
    remate.valorComercialEstimado || remate.riesgoOcupacion || (remate.basesResumen?.length ?? 0) > 0;

  const marcarFavorito = async () => {
    const ahora = await toggleFavorito(remate);
    setFav(ahora);
    if (ahora) {
      const enCalendario = await agregarACalendarioTelefono(remate);
      Alert.alert(
        'Agendado',
        enCalendario
          ? 'Lo agregamos a tu agenda Rematto y al Calendario de tu teléfono. Te avisaremos 1 hora antes.'
          : 'Lo agregamos a tu agenda Rematto y te avisaremos 1 hora antes. Lo verás en la pestaña Agenda.'
      );
    }
  };

  const comoLlegar = () => {
    if (!tieneMapa) return;
    Linking.openURL(`http://maps.apple.com/?daddr=${remate.lat},${remate.lng}`);
  };

  return (
    <ScrollView style={s.safe} contentContainerStyle={{ paddingBottom: 60 }}>
      <Image source={{ uri: remate.imagen }} style={s.img} />

      <View style={s.body}>
        <View style={s.badgeRow}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={[s.badge, esJudicial && s.badgeJudicial]}>
              <Text style={[s.badgeTxt, esJudicial && { color: C.white }]}>
                {esJudicial ? 'JUDICIAL' : 'MARTILLERO'}
              </Text>
            </View>
            <View style={s.badge}>
              <Text style={s.badgeTxt}>
                {remate.modalidad === 'online' ? 'ONLINE' : remate.modalidad === 'mixto' ? 'MIXTO' : 'PRESENCIAL'}
              </Text>
            </View>
          </View>
          <Pressable onPress={marcarFavorito} hitSlop={10}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? C.live : C.text} />
          </Pressable>
        </View>

        <Text style={s.titulo}>{remate.titulo}</Text>
        <Text style={s.lugar}>
          <Ionicons name="location-outline" size={14} color={C.sub} /> {remate.comuna}, Región {remate.region}
        </Text>

        {/* Precio + fecha */}
        <View style={s.precioCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.infoLabel}>
              {remate.precioEsAvaluo ? 'Precio mínimo (avalúo fiscal)' : 'Precio mínimo'}
            </Text>
            <Text style={s.precio}>{fmtPrecio(remate.precioMinimo, remate.moneda)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.infoLabel}>Remate</Text>
            <Text style={s.fechaCorta}>{fmtFecha(remate.fechaRemate).split(' · ')[0]}</Text>
            <Countdown fechaISO={remate.fechaRemate} />
          </View>
        </View>

        {/* Mapa */}
        {tieneMapa && (
          <>
            <View style={s.mapaWrap}>
              <MapView
                style={s.mapa}
                initialRegion={{
                  latitude: remate.lat!, longitude: remate.lng!,
                  latitudeDelta: 0.02, longitudeDelta: 0.02,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={{ latitude: remate.lat!, longitude: remate.lng! }} />
              </MapView>
            </View>
            <Pressable style={s.btnSec} onPress={comoLlegar}>
              <Ionicons name="navigate-outline" size={18} color={C.text} />
              <Text style={s.btnSecTxt}>Cómo llegar</Text>
            </Pressable>
          </>
        )}

        {/* El inmueble / el bien */}
        {(remate.inmueble || remate.inscripcion) && (
          <>
            <Text style={s.seccion}>El bien</Text>
            {remate.inmueble && <Text style={s.parrafo}>{remate.inmueble}</Text>}
            {remate.inscripcion && (
              <Text style={[s.parrafo, { color: C.sub, marginTop: 6 }]}>{remate.inscripcion}</Text>
            )}
          </>
        )}

        {/* Cómo participar */}
        {(remate.comoParticipar?.length || remate.garantia || remate.correoTribunal) && (
          <>
            <Text style={s.seccion}>Cómo participar</Text>
            {remate.garantia && !remate.comoParticipar && (
              <Fila icono="shield-checkmark-outline" texto={`Garantía: ${remate.garantia}`} />
            )}
            {remate.comoParticipar?.map((p, i) => (
              <Fila key={i} icono="checkmark-circle-outline" texto={p} />
            ))}
            {remate.correoTribunal && (
              <Fila icono="mail-outline" texto={`Correo del tribunal: ${remate.correoTribunal}`} />
            )}
          </>
        )}

        {/* Si te adjudicas */}
        {remate.siTeAdjudicas?.length ? (
          <>
            <Text style={s.seccion}>Si te adjudicas</Text>
            {remate.siTeAdjudicas.map((p, i) => (
              <Fila key={i} icono="time-outline" texto={p} />
            ))}
          </>
        ) : null}

        {/* Descripción general */}
        <Text style={s.seccion}>Descripción</Text>
        <Text style={s.parrafo}>{remate.descripcion}</Text>

        {/* Organiza */}
        <View style={s.martilleroCard}>
          <Ionicons name={esJudicial ? 'business-outline' : 'person-circle-outline'} size={22} color={C.text} />
          <View style={{ flex: 1 }}>
            <Text style={s.infoLabel}>Organiza</Text>
            <Text style={s.martilleroTxt}>{remate.martillero}</Text>
            {remate.caratulado && <Text style={s.caratulado}>Causa: {remate.caratulado}</Text>}
          </View>
        </View>

        {/* Botones */}
        <Pressable style={s.btnFav} onPress={marcarFavorito}>
          <Ionicons name={fav ? 'checkmark-circle' : 'calendar-outline'} size={20} color={fav ? '#4ADE80' : C.white} />
          <Text style={s.btnFavTxt}>{fav ? 'Agendado — te avisaremos' : 'Agendar este remate'}</Text>
        </Pressable>
        {remate.urlFuente && (
          <Pressable style={s.btnSec} onPress={() => Linking.openURL(remate.urlFuente!)}>
            <Ionicons name="open-outline" size={18} color={C.text} />
            <Text style={s.btnSecTxt}>
              {remate.fuente === 'pjud' ? 'Ver publicación oficial (PJUD)' : 'Ver remate en el sitio del organizador'}
            </Text>
          </Pressable>
        )}

        {/* Bloque Pro */}
        {tienePro && (
          clientePro
            ? <BloquePro remate={remate} />
            : <BloqueProBloqueado onPress={() => router.push('/pro?tipo=cliente')} />
        )}

        <Text style={s.disclaimer}>
          Información obtenida de fuentes públicas del Poder Judicial. Rematto informa y organiza; el
          remate lo ejecuta el tribunal o martillero indicado. Verifica siempre las bases oficiales
          antes de participar.
        </Text>
      </View>
    </ScrollView>
  );
}

function Fila({ icono, texto }: { icono: any; texto: string }) {
  return (
    <View style={s.fila}>
      <Ionicons name={icono} size={17} color={C.sub} style={{ marginTop: 1 }} />
      <Text style={s.filaTxt}>{texto}</Text>
    </View>
  );
}

// Tarjeta de gancho a Pro (usuario sin suscripción)
function BloqueProBloqueado({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={s.proLock} onPress={onPress}>
      <Ionicons name="lock-closed-outline" size={22} color={C.text} />
      <Text style={s.proLockTitulo}>¿Conviene pujar por este remate?</Text>
      <Text style={s.proLockSub}>
        Valor comercial estimado, riesgo de ocupación y consulta con un experto
      </Text>
      <View style={s.proBtn}>
        <Text style={s.proBtnTxt}>Ver Rematto Pro</Text>
      </View>
    </Pressable>
  );
}

// Contenido Pro desbloqueado (usuario suscrito)
function BloquePro({ remate }: { remate: Remate }) {
  return (
    <View style={s.proCard}>
      <View style={s.proHeader}>
        <Ionicons name="sparkles-outline" size={18} color={C.text} />
        <Text style={s.proHeaderTxt}>Análisis Rematto Pro</Text>
      </View>
      {remate.valorComercialEstimado && (
        <Fila icono="trending-up-outline"
          texto={`Valor comercial estimado ${remate.valorComercialEstimado} vs mínimo ${fmtPrecio(remate.precioMinimo, remate.moneda)}.`} />
      )}
      {remate.riesgoOcupacion && (
        <Fila icono="alert-circle-outline" texto={`Riesgo: ${remate.riesgoOcupacion}`} />
      )}
      {remate.basesResumen?.map((b, i) => (
        <Fila key={i} icono="document-text-outline" texto={b} />
      ))}
      <Pressable
        style={s.btnFav}
        onPress={() => Alert.alert('Consulta experta', 'Próximamente: chat con abogado o martillero sobre esta causa.')}
      >
        <Ionicons name="chatbubbles-outline" size={20} color={C.white} />
        <Text style={s.btnFavTxt}>Pregúntale a un experto</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  img: { width: '100%', height: 240, backgroundColor: C.card },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.white,
  },
  badgeJudicial: { backgroundColor: C.black, borderColor: C.black },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: C.text, letterSpacing: 0.5 },
  titulo: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 14, letterSpacing: -0.3 },
  lugar: { fontSize: 14, color: C.sub, marginTop: 4 },
  precioCard: {
    flexDirection: 'row', backgroundColor: C.card, borderRadius: 14,
    borderWidth: 1, borderColor: C.border, padding: 16, marginTop: 18,
  },
  infoLabel: { fontSize: 12, color: C.sub },
  precio: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 2 },
  fechaCorta: { fontSize: 14, fontWeight: '700', color: C.text, marginTop: 2 },
  mapaWrap: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.border, marginTop: 12 },
  mapa: { width: '100%', height: 150 },
  seccion: { fontSize: 16, fontWeight: '700', color: C.text, marginTop: 24, marginBottom: 8 },
  parrafo: { fontSize: 15, color: C.text, lineHeight: 22 },
  fila: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  filaTxt: { flex: 1, fontSize: 14, color: C.text, lineHeight: 20 },
  martilleroCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card,
    borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 14, marginTop: 20,
  },
  martilleroTxt: { fontSize: 14, fontWeight: '700', color: C.text },
  caratulado: { fontSize: 12, color: C.sub, marginTop: 2 },
  btnFav: {
    backgroundColor: C.black, borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    marginTop: 16, flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  btnFavTxt: { color: C.white, fontSize: 15, fontWeight: '700' },
  btnSec: {
    flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingVertical: 14, marginTop: 10,
  },
  btnSecTxt: { fontSize: 14, fontWeight: '600', color: C.text },
  proLock: {
    alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 14,
    padding: 18, marginTop: 24, backgroundColor: C.card,
  },
  proLockTitulo: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 6, textAlign: 'center' },
  proLockSub: { fontSize: 13, color: C.sub, marginTop: 4, textAlign: 'center', lineHeight: 18 },
  proBtn: { backgroundColor: C.black, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, marginTop: 14 },
  proBtnTxt: { color: C.white, fontSize: 14, fontWeight: '700' },
  proCard: { borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16, marginTop: 24 },
  proHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  proHeaderTxt: { fontSize: 15, fontWeight: '800', color: C.text },
  disclaimer: { fontSize: 12, color: C.sub, lineHeight: 18, marginTop: 26 },
});
