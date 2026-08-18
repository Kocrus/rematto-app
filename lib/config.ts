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

// Estado de suscripción Pro del usuario (fase 2 se conecta a Mercado Pago).
// Cambia a true para previsualizar cómo se ve la ficha con el análisis Pro desbloqueado.
export const USUARIO_PRO = false;
