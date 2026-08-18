import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import { auth } from './firebase';

// ─────────────────────────────────────────────────────────────────────────
// Configuración de RevenueCat
//
// 1. Crea una cuenta gratis en https://app.revenuecat.com y un proyecto
//    "Rematto".
// 2. En Project Settings → API Keys, copia la "Public app-specific API key"
//    para Apple App Store y pégala abajo.
// 3. En Entitlements, crea dos entitlements con estos identificadores
//    exactos: "cliente_pro" y "martillero_pro".
// 4. En Products, crea los productos de suscripción una vez que existan
//    en App Store Connect (ver checklist más abajo) y asígnalos a cada
//    entitlement.
// 5. En Offerings, crea dos offerings con estos identificadores exactos:
//    "rematto_pro_cliente" y "rematto_pro_martillero", cada uno con sus
//    paquetes mensual/anual.
// ─────────────────────────────────────────────────────────────────────────
const REVENUECAT_API_KEY_IOS = 'appl_bqFZOoGyMqduqIYyjbHuwVwpuHQ';

export const ENTITLEMENT_CLIENTE_PRO = 'cliente_pro';
export const ENTITLEMENT_MARTILLERO_PRO = 'martillero_pro';

export const OFFERING_CLIENTE = 'rematto_pro_cliente';
export const OFFERING_MARTILLERO = 'rematto_pro_martillero';

let configurado = false;

/** Llamar una sola vez, apenas arranca la app (ver app/_layout.tsx). */
export function inicializarPurchases() {
  if (configurado || Platform.OS !== 'ios') return;
  if (REVENUECAT_API_KEY_IOS.includes('TU_API_KEY')) {
    console.warn(
      '[Rematto] Falta configurar REVENUECAT_API_KEY_IOS en lib/purchases.ts — ' +
        'Rematto Pro no funcionará hasta que pegues tu API key real de RevenueCat.'
    );
    return;
  }
  Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS });
  configurado = true;

  const uid = auth.currentUser?.uid;
  if (uid) Purchases.logIn(uid).catch(() => {});
}

/**
 * Vincula/desvincula el usuario de RevenueCat cuando cambia la sesión de
 * Firebase, para que su suscripción se reconozca en cualquier dispositivo
 * donde inicie sesión con la misma cuenta. Se llama desde lib/useAuth.ts.
 */
export async function sincronizarUsuarioPurchases(uid: string | null) {
  if (!configurado) return;
  try {
    if (uid) {
      await Purchases.logIn(uid);
    } else {
      await Purchases.logOut();
    }
  } catch (e) {
    console.warn('[Rematto] No se pudo sincronizar el usuario con RevenueCat', e);
  }
}

function tieneEntitlement(info: CustomerInfo | null, id: string) {
  return !!info?.entitlements.active[id];
}

/**
 * Hook central de estado Pro. Reemplaza al antiguo flag estático
 * USUARIO_PRO de lib/config.ts. Se actualiza solo cuando cambia el estado
 * de la suscripción (compra, restauración, expiración).
 */
export function usePro() {
  const [info, setInfo] = useState<CustomerInfo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!configurado) {
      setCargando(false);
      return;
    }
    let activo = true;
    Purchases.getCustomerInfo()
      .then((i) => activo && setInfo(i))
      .finally(() => activo && setCargando(false));

    const listener = (nuevaInfo: CustomerInfo) => setInfo(nuevaInfo);
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      activo = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  return {
    cargando,
    clientePro: tieneEntitlement(info, ENTITLEMENT_CLIENTE_PRO),
    martilleroPro: tieneEntitlement(info, ENTITLEMENT_MARTILLERO_PRO),
    customerInfo: info,
  };
}

/** Trae el offering (mensual/anual) que se muestra en la pantalla de pago. */
export async function obtenerOffering(offeringId: string): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.all[offeringId] ?? offerings.current ?? null;
}

/** Botón "Restaurar compras" — obligatorio para que Apple apruebe la app. */
export async function restaurarCompras(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}
