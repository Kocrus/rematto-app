import { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { C, F } from '../lib/theme';
import {
  usePro, obtenerOffering, restaurarCompras, OFFERING_CLIENTE, OFFERING_MARTILLERO,
} from '../lib/purchases';

type Tipo = 'cliente' | 'martillero';

const CONTENIDO: Record<Tipo, {
  titulo: string; subtitulo: string; beneficios: string[]; offeringId: string;
}> = {
  cliente: {
    titulo: 'Rematto Pro',
    subtitulo: 'Toma mejores decisiones en cada remate',
    offeringId: OFFERING_CLIENTE,
    beneficios: [
      'Valor comercial estimado vs. precio mínimo',
      'Riesgo de ocupación de cada propiedad',
      'Resumen de bases en lenguaje simple',
      'Alertas ilimitadas por comuna, categoría y precio',
      'Consulta con un experto (martillero o abogado)',
    ],
  },
  martillero: {
    titulo: 'Rematto Pro Martillero',
    subtitulo: 'Haz crecer tu casa de remates',
    offeringId: OFFERING_MARTILLERO,
    beneficios: [
      'Publicaciones ilimitadas',
      'Destaca tus remates en el catálogo',
      'Galería de fotos por publicación',
      'Insignia de martillero verificado',
      'Estadísticas de vistas y favoritos por remate',
    ],
  },
};

export default function Pro() {
  const { tipo: tipoParam } = useLocalSearchParams<{ tipo?: string }>();
  const tipo: Tipo = tipoParam === 'martillero' ? 'martillero' : 'cliente';
  const router = useRouter();
  const { clientePro, martilleroPro } = usePro();
  const yaEsPro = tipo === 'cliente' ? clientePro : martilleroPro;

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [cargando, setCargando] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const info = CONTENIDO[tipo];

  useEffect(() => {
    let activo = true;
    obtenerOffering(info.offeringId)
      .then((o) => {
        if (!activo) return;
        setOffering(o);
        if (o && o.availablePackages.length > 0) {
          const anual = o.availablePackages.find((p) => p.packageType === 'ANNUAL');
          setSeleccionado((anual ?? o.availablePackages[0]).identifier);
        }
      })
      .catch(() => {})
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [info.offeringId]);

  const comprar = async (pkg: PurchasesPackage) => {
    try {
      setComprando(true);
      await Purchases.purchasePackage(pkg);
      Alert.alert('¡Listo!', `Ya eres ${info.titulo}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      if (!e?.userCancelled) {
        Alert.alert('No se pudo completar la compra', 'Intenta nuevamente.');
      }
    } finally {
      setComprando(false);
    }
  };

  const restaurar = async () => {
    try {
      setComprando(true);
      await restaurarCompras();
      Alert.alert('Compras restauradas', 'Revisamos tu cuenta de App Store.');
    } catch {
      Alert.alert('No se pudo restaurar', 'Intenta nuevamente más tarde.');
    } finally {
      setComprando(false);
    }
  };

  const paquetes = offering?.availablePackages ?? [];
  const mensual = paquetes.find((p) => p.packageType === 'MONTHLY');
  const anual = paquetes.find((p) => p.packageType === 'ANNUAL');
  let ahorroPct: number | null = null;
  if (mensual && anual && mensual.product.price > 0) {
    const equivalenteMensualAnual = anual.product.price / 12;
    ahorroPct = Math.round((1 - equivalenteMensualAnual / mensual.product.price) * 100);
  }

  const pkgSeleccionado = paquetes.find((p) => p.identifier === seleccionado) ?? paquetes[0];

  const etiquetaPeriodo = (pkg: PurchasesPackage) => {
    switch (pkg.packageType) {
      case 'ANNUAL': return 'Anual';
      case 'MONTHLY': return 'Mensual';
      case 'WEEKLY': return 'Semanal';
      case 'TWO_MONTH': return 'Bimestral';
      case 'THREE_MONTH': return 'Trimestral';
      case 'SIX_MONTH': return 'Semestral';
      case 'LIFETIME': return 'De por vida';
      default: return pkg.product.title || pkg.identifier;
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Pressable style={s.cerrar} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={22} color={C.sub} />
        </Pressable>

        <View style={s.hero}>
          <View style={s.iconoWrap}>
            <Ionicons name="sparkles" size={30} color={C.white} />
          </View>
          <Text style={s.titulo}>{info.titulo}</Text>
          <Text style={s.subtitulo}>{info.subtitulo}</Text>
        </View>

        {yaEsPro ? (
          <View style={s.yaProCard}>
            <Ionicons name="checkmark-circle" size={22} color={C.ok} />
            <Text style={s.yaProTxt}>Ya tienes {info.titulo} activo.</Text>
          </View>
        ) : (
          <>
            <View style={s.beneficiosCard}>
              {info.beneficios.map((b, i) => (
                <View
                  key={i}
                  style={[s.fila, i === info.beneficios.length - 1 && { marginBottom: 0 }]}
                >
                  <View style={s.checkWrap}>
                    <Ionicons name="checkmark" size={14} color={C.white} />
                  </View>
                  <Text style={s.filaTxt}>{b}</Text>
                </View>
              ))}
            </View>

            {cargando ? (
              <ActivityIndicator style={{ marginTop: 32 }} color={C.text} />
            ) : paquetes.length > 0 ? (
              <>
                <View style={s.planes}>
                  {paquetes.map((pkg) => {
                    const activo = pkg.identifier === seleccionado;
                    const esAnual = pkg.packageType === 'ANNUAL';
                    return (
                      <Pressable
                        key={pkg.identifier}
                        style={[s.planCard, activo && s.planCardActivo]}
                        onPress={() => setSeleccionado(pkg.identifier)}
                        disabled={comprando}
                      >
                        {esAnual && ahorroPct && ahorroPct > 0 ? (
                          <View style={s.badge}>
                            <Text style={s.badgeTxt}>AHORRA {ahorroPct}%</Text>
                          </View>
                        ) : null}
                        <View style={s.planFila}>
                          <View style={s.radioWrap}>
                            <View style={[s.radio, activo && s.radioActivo]}>
                              {activo ? <View style={s.radioPunto} /> : null}
                            </View>
                            <View>
                              <Text style={[s.planTitulo, activo && s.planTituloActivo]}>
                                Plan {etiquetaPeriodo(pkg)}
                              </Text>
                              {esAnual && mensual ? (
                                <Text style={[s.planNota, activo && s.planNotaActiva]}>
                                  Equivale a menos por mes
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          <Text style={[s.planPrecio, activo && s.planPrecioActivo]}>
                            {pkg.product.priceString}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  style={[s.btnComprar, comprando && { opacity: 0.6 }]}
                  onPress={() => pkgSeleccionado && comprar(pkgSeleccionado)}
                  disabled={comprando || !pkgSeleccionado}
                >
                  {comprando ? (
                    <ActivityIndicator color={C.white} />
                  ) : (
                    <Text style={s.btnComprarTxt}>Continuar</Text>
                  )}
                </Pressable>
                <Text style={s.disclaimer}>
                  Cancela cuando quieras desde los ajustes de tu cuenta de App Store.
                </Text>
              </>
            ) : (
              <Text style={[F.sub, { marginTop: 24, textAlign: 'center' }]}>
                Aún no hay planes disponibles. Vuelve a intentarlo más tarde.
              </Text>
            )}
          </>
        )}

        <Pressable style={s.btnRestaurar} onPress={restaurar} disabled={comprando}>
          <Text style={s.btnRestaurarTxt}>Restaurar compras</Text>
        </Pressable>

        <View style={s.legalRow}>
          <Pressable onPress={() => Linking.openURL('https://rematto-3e9a6.web.app')}>
            <Text style={s.legalTxt}>Política de Privacidad</Text>
          </Pressable>
          <Text style={s.legalDot}>·</Text>
          <Pressable
            onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}
          >
            <Text style={s.legalTxt}>Términos de Uso (EULA)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48 },
  cerrar: {
    alignSelf: 'flex-end', width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.card, alignItems: 'center', justifyContent: 'center',
  },
  hero: { alignItems: 'center', marginTop: 8, marginBottom: 28 },
  iconoWrap: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: C.black,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.black, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  titulo: {
    fontSize: 28, fontWeight: '800', color: C.text, marginTop: 16,
    letterSpacing: -0.6, textAlign: 'center',
  },
  subtitulo: { fontSize: 15, color: C.sub, marginTop: 6, textAlign: 'center' },
  beneficiosCard: {
    backgroundColor: C.card, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: C.border,
  },
  fila: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 14 },
  checkWrap: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: C.ok,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  filaTxt: { flex: 1, fontSize: 15, color: C.text, lineHeight: 21, fontWeight: '500' },
  planes: { marginTop: 24, gap: 12 },
  planCard: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: 16, padding: 16,
    backgroundColor: C.bg, position: 'relative',
  },
  planCardActivo: {
    borderColor: C.black, backgroundColor: C.black,
    shadowColor: C.black, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badge: {
    position: 'absolute', top: -11, right: 16, backgroundColor: C.ok,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeTxt: { fontSize: 11, fontWeight: '800', color: C.white, letterSpacing: 0.3 },
  planFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radioWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActivo: { borderColor: C.white },
  radioPunto: { width: 11, height: 11, borderRadius: 6, backgroundColor: C.white },
  planTitulo: { fontSize: 15, fontWeight: '700', color: C.text },
  planTituloActivo: { color: C.white },
  planNota: { fontSize: 12, color: C.sub, marginTop: 2 },
  planNotaActiva: { color: '#B8B8B8' },
  planPrecio: { fontSize: 16, fontWeight: '800', color: C.text },
  planPrecioActivo: { color: C.white },
  btnComprar: {
    marginTop: 20, backgroundColor: C.black, borderRadius: 16, paddingVertical: 17,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.black, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  btnComprarTxt: { fontSize: 16, fontWeight: '800', color: C.white, letterSpacing: 0.2 },
  disclaimer: { fontSize: 12, color: C.sub, textAlign: 'center', marginTop: 12, lineHeight: 17 },
  btnRestaurar: { alignItems: 'center', marginTop: 24, paddingVertical: 10 },
  btnRestaurarTxt: { fontSize: 14, fontWeight: '600', color: C.sub },
  legalRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginTop: 4, marginBottom: 4,
  },
  legalTxt: { fontSize: 12, color: C.sub, textDecorationLine: 'underline' },
  legalDot: { fontSize: 12, color: C.sub },
  yaProCard: {
    flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 18, marginTop: 4,
  },
  yaProTxt: { fontSize: 15, fontWeight: '600', color: C.text, flex: 1 },
});
