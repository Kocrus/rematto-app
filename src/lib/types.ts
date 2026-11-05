export type TipoRemate = 'judicial' | 'extrajudicial';
export type Modalidad = 'online' | 'presencial' | 'mixto';

export type Categoria =
  | 'Propiedades'
  | 'Vehículos'
  | 'Maquinaria'
  | 'Tecnología'
  | 'Mobiliario'
  | 'Otros';

export interface Remate {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  tipo: TipoRemate;
  modalidad: Modalidad;
  region: string;
  comuna: string;
  direccion?: string;      // dirección del remate o del bien (para el mapa)
  lat?: number;            // coordenadas para el mapa
  lng?: number;
  precioMinimo: number;
  moneda: 'CLP' | 'UF';
  garantia?: string;       // ej: "10% en vale vista"
  fechaRemate: string;     // ISO
  imagen: string;
  martillero: string;      // martillero, casa de remates o tribunal
  fuente: 'rematto' | 'pjud' | 'externo';
  urlFuente?: string;      // link a la publicación oficial
  destacado?: boolean;
  creadoPor?: string;

  // --- Detalle enriquecido (se llena al leer las bases; opcional) ---
  precioEsAvaluo?: boolean;   // true si el mínimo viene del avalúo fiscal
  inmueble?: string;          // descripción del bien / inmueble (visible gratis)
  inscripcion?: string;       // fojas, número, CBR
  comoParticipar?: string[];  // pasos: garantía, escrito, correo, requisitos, modalidad
  correoTribunal?: string;    // correo de postulación/coordinación
  siTeAdjudicas?: string[];   // plazos de pago y escrituración
  caratulado?: string;        // ej: "Scotiabank Chile / Araya"

  // --- Solo Rematto Pro (requiere suscripción) ---
  valorComercialEstimado?: string; // ej: "$95–110M"
  riesgoOcupacion?: string;        // ej: "Posible ocupación por el deudor"
  basesResumen?: string[];         // resumen de bases en viñetas

  // --- Estadísticas (Rematto Pro Martillero) ---
  vistas?: number;              // se incrementa cada vez que alguien abre la ficha
  favoritosCount?: number;      // cuántos usuarios lo tienen en favoritos ahora mismo
  martilleroVerificado?: boolean; // copia del estado de verificación del organizador al momento de publicar
}

export const fmtPrecio = (monto: number, moneda: 'CLP' | 'UF') =>
  moneda === 'UF'
    ? `UF ${monto.toLocaleString('es-CL')}`
    : `$${monto.toLocaleString('es-CL')}`;

export const fmtFecha = (iso: string) => {
  const f = new Date(iso);
  return f.toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long',
  }) + ' · ' + f.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};
