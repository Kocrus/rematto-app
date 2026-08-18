// Configuración de acceso de Rematto
//
// MODO_ACCESO controla cuándo se exige iniciar sesión:
//   'abierto' → nunca (solo para publicar)
//   'ficha'   → para abrir la ficha completa de un remate (RECOMENDADO:
//               el usuario ve el catálogo, se interesa, y se registra
//               en el momento de máximo interés)
//   'total'   → para usar cualquier parte de la app (estilo RemateFacil;
//               máxima captura de registros, máxima fricción — ojo con
//               la guideline 5.1.1 de Apple)
export const MODO_ACCESO: 'abierto' | 'ficha' | 'total' = 'ficha';

// El estado de suscripción Rematto Pro (Cliente y Martillero) ya no es un
// flag estático: se obtiene en vivo desde RevenueCat con el hook `usePro()`
// definido en lib/purchases.ts. Úsalo así:
//
//   import { usePro } from '../lib/purchases';
//   const { clientePro, martilleroPro } = usePro();
