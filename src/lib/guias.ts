// Guías educativas de Rematto — gratis, a diferencia de la competencia
export interface Seccion {
  subtitulo: string;
  texto: string;
}

export interface Guia {
  slug: string;
  titulo: string;
  resumen: string;
  icono: string;      // nombre Ionicons
  minutos: number;    // tiempo de lectura
  secciones: Seccion[];
}

export const GUIAS: Guia[] = [
  {
    slug: 'que-es-un-remate',
    titulo: '¿Qué es un remate y quiénes participan?',
    resumen: 'Lo básico: tipos de remate, quién los organiza y por qué hay oportunidades.',
    icono: 'school-outline',
    minutos: 4,
    secciones: [
      {
        subtitulo: 'Qué es un remate',
        texto:
          'Un remate (o subasta pública) es una venta donde el bien se adjudica a quien ofrece el precio más alto. En Chile existen dos grandes mundos: los remates judiciales, ordenados por un tribunal (por ejemplo, cuando una propiedad se vende para pagar una deuda), y los remates extrajudiciales, realizados por martilleros públicos o casas de remates por encargo de empresas, bancos o particulares.',
      },
      {
        subtitulo: 'Quiénes los organizan',
        texto:
          'Los remates judiciales los conduce el propio tribunal (el juez actúa como ministro de fe). Los extrajudiciales los ejecuta un martillero público, que es una persona o empresa inscrita en el Registro Nacional de Martilleros del Ministerio de Economía, regulada por la Ley 18.118. Siempre puedes verificar que un martillero esté vigente en ese registro.',
      },
      {
        subtitulo: 'Por qué hay oportunidades',
        texto:
          'Los mínimos de los remates suelen fijarse bajo el valor comercial (en remates judiciales de propiedades, típicamente sobre la base del avalúo fiscal). A cambio, el proceso exige preparación: garantías, plazos cortos de pago y bienes que se venden "en el estado en que se encuentran". La ventaja es para quien llega informado — y para eso existe Rematto.',
      },
      {
        subtitulo: 'El rol de Rematto',
        texto:
          'Rematto reúne y ordena la información de remates publicados por tribunales, martilleros y empresas, y te dirige siempre a la fuente oficial. Rematto no ejecuta remates ni recibe pagos ni ofertas: la participación es directamente con el organizador.',
      },
    ],
  },
  {
    slug: 'remate-judicial-paso-a-paso',
    titulo: 'Remates judiciales paso a paso',
    resumen: 'Garantía, vale vista, la audiencia de remate y qué pasa si ganas.',
    icono: 'business-outline',
    minutos: 6,
    secciones: [
      {
        subtitulo: '1. Encuentra y estudia el remate',
        texto:
          'Los remates judiciales se publican en avisos y en la Oficina Judicial Virtual del Poder Judicial. La publicación indica el tribunal, la causa (rol), el bien, el mínimo y la fecha. En Rematto te mostramos esta información ordenada y con enlace a la publicación oficial.',
      },
      {
        subtitulo: '2. Revisa la causa y el bien',
        texto:
          'Antes de ofertar, revisa el expediente de la causa (es público en la Oficina Judicial Virtual) y las "bases de remate". Para propiedades: certificado de dominio vigente, hipotecas y gravámenes, y certificado de avalúo fiscal del Conservador de Bienes Raíces y el SII. Considera también si la propiedad está ocupada, porque la entrega puede requerir un proceso adicional.',
      },
      {
        subtitulo: '3. Prepara la garantía',
        texto:
          'Para participar debes presentar una garantía de seriedad, generalmente un vale vista bancario por el 10% del mínimo (las bases pueden fijar otro monto), a la orden del tribunal. Sin garantía no puedes ofertar. Si no ganas, se te devuelve; si ganas y no pagas el saldo, la pierdes.',
      },
      {
        subtitulo: '4. La audiencia de remate',
        texto:
          'El remate se realiza en una audiencia del tribunal, hoy muchas veces por videoconferencia (Zoom) según el protocolo del Poder Judicial. Debes inscribirte con anticipación siguiendo las instrucciones de la publicación. Las posturas parten desde el mínimo y gana la más alta.',
      },
      {
        subtitulo: '5. Si te adjudicas el bien',
        texto:
          'Deberás pagar el saldo del precio en el plazo que fijen las bases (suele ser breve, por ejemplo 3 a 10 días). Luego se extiende el acta y la escritura de adjudicación, que en el caso de propiedades se inscribe en el Conservador de Bienes Raíces. Considera gastos adicionales: escritura, inscripción e impuestos.',
      },
      {
        subtitulo: 'Consejo Rematto',
        texto:
          'Guarda el remate con el corazón en la ficha: lo agregamos a tu agenda y te avisamos 1 hora antes. Y verifica siempre fecha y condiciones en la fuente oficial el día previo — los remates judiciales se suspenden con frecuencia.',
      },
    ],
  },
  {
    slug: 'remate-de-martillero',
    titulo: 'Remates de martilleros y casas de remates',
    resumen: 'Inscripción, comisión del martillero, exhibición y retiro de los bienes.',
    icono: 'hammer-outline',
    minutos: 5,
    secciones: [
      {
        subtitulo: 'Cómo funcionan',
        texto:
          'Empresas, bancos y particulares encargan a martilleros la venta de vehículos, maquinaria, mobiliario, tecnología y propiedades. Cada casa de remates tiene su propia plataforma o sala, sus bases y su calendario. Rematto reúne esos remates y te lleva al sitio del organizador para participar.',
      },
      {
        subtitulo: 'Inscripción y garantías',
        texto:
          'Normalmente debes registrarte en el sitio del martillero con tu RUT y, según el caso, dejar una garantía (transferencia o vale vista) para poder ofertar. Cada organizador fija sus propios requisitos — revísalos antes del día del remate.',
      },
      {
        subtitulo: 'La comisión del martillero',
        texto:
          'Al precio de adjudicación se suma la comisión del martillero (habitualmente entre un 5% y un 12% más IVA, según la casa de remates y el tipo de bien). Inclúyela siempre en tu cálculo: un "buen precio" puede dejar de serlo si olvidas la comisión.',
      },
      {
        subtitulo: 'Exhibición: ve a ver el bien',
        texto:
          'Los bienes se rematan en el estado en que se encuentran, sin garantía posterior. Las casas de remates publican días de exhibición previos — para vehículos y maquinaria, ir a la exhibición (o mandar a un mecánico de confianza) es la diferencia entre una oportunidad y un problema.',
      },
      {
        subtitulo: 'Pago y retiro',
        texto:
          'Los plazos son cortos: el pago suele exigirse dentro de 24 a 48 horas y el retiro del bien pocos días después, en el lugar indicado (en Rematto lo ves en el mapa). Si no retiras a tiempo pueden cobrarte bodegaje o incluso dejar sin efecto la adjudicación.',
      },
    ],
  },
  {
    slug: 'evaluar-propiedad',
    titulo: 'Cómo evaluar una propiedad antes de rematar',
    resumen: 'Certificados, deudas, ocupantes y el cálculo del precio máximo a ofertar.',
    icono: 'home-outline',
    minutos: 6,
    secciones: [
      {
        subtitulo: 'Los certificados clave',
        texto:
          'Antes de ofertar por una propiedad pide en el Conservador de Bienes Raíces: certificado de dominio vigente (quién es el dueño), certificado de hipotecas y gravámenes (deudas y prohibiciones) y litigios. En el SII, el certificado de avalúo fiscal. Con las bases del remate, esto te dice exactamente qué estás comprando.',
      },
      {
        subtitulo: 'Deudas asociadas',
        texto:
          'Averigua contribuciones impagas (SII/TGR) y, en departamentos, deudas de gastos comunes — en general las contribuciones siguen al inmueble, así que pueden pasar a ser tu problema. Suma estos montos a tu costo real.',
      },
      {
        subtitulo: 'Ocupantes',
        texto:
          'Una propiedad rematada puede estar ocupada por el deudor u otras personas. La entrega material puede requerir gestiones o un lanzamiento judicial, que toma tiempo y costos. Este es el principal riesgo de los remates judiciales de propiedades: infórmate antes, no después.',
      },
      {
        subtitulo: 'Tu número máximo',
        texto:
          'Calcula: precio máximo = valor comercial estimado − (deudas + costos de escritura e inscripción + eventual desocupación + reparaciones) − tu margen de ganancia o ahorro esperado. Escribe ese número antes del remate y no lo pases: la disciplina es lo que separa una buena compra de una mala.',
      },
    ],
  },
  {
    slug: 'errores-comunes',
    titulo: 'Riesgos y errores comunes del principiante',
    resumen: 'Los 7 errores que más se repiten y cómo evitarlos.',
    icono: 'warning-outline',
    minutos: 4,
    secciones: [
      {
        subtitulo: '1. Ofertar sin ver las bases',
        texto:
          'Las bases del remate mandan: garantía, plazos, comisión, estado del bien. Leerlas completas es lo mínimo. Si algo no calza con lo publicado, pregunta al organizador antes.',
      },
      {
        subtitulo: '2. Olvidar la comisión y los gastos',
        texto:
          'Precio de martillo + comisión + IVA + escritura/inscripción (propiedades) + traslado (bienes). El precio final puede ser 10-15% más alto que tu postura.',
      },
      {
        subtitulo: '3. No ir a la exhibición',
        texto:
          'Los bienes se venden en el estado en que se encuentran y sin garantía. Lo que no revisaste antes del remate, nadie te lo va a compensar después.',
      },
      {
        subtitulo: '4. Dejarse llevar en la puja',
        texto:
          'Define tu máximo con cabeza fría y respétalo. La adrenalina del remate es real — los profesionales ganan porque no se enamoran de ningún lote.',
      },
      {
        subtitulo: '5. Llegar sin la garantía lista',
        texto:
          'El vale vista se pide al banco con anticipación. Sin garantía válida y a la orden correcta, no participas, por muy preparado que llegues.',
      },
      {
        subtitulo: '6. No verificar al organizador',
        texto:
          'Verifica que el martillero esté vigente en el Registro Nacional de Martilleros y que el remate judicial exista en la Oficina Judicial Virtual. Desconfía de "remates" que pidan transferencias a cuentas personales — las estafas existen.',
      },
      {
        subtitulo: '7. No considerar los plazos de pago',
        texto:
          'Si ganas, el saldo se paga en días, no semanas. Ten el financiamiento resuelto ANTES de ofertar: perder la garantía por no pagar a tiempo es el error más caro de todos.',
      },
    ],
  },
  {
    slug: 'glosario',
    titulo: 'Glosario del rematador',
    resumen: 'Los términos que verás en toda publicación, explicados simple.',
    icono: 'book-outline',
    minutos: 3,
    secciones: [
      { subtitulo: 'Postura / Puja', texto: 'Cada oferta que hace un participante durante el remate.' },
      { subtitulo: 'Mínimo', texto: 'Precio desde el cual parte el remate. En judiciales suele fijarse en base al avalúo fiscal o a lo que determinen las bases.' },
      { subtitulo: 'Adjudicación', texto: 'El momento en que el bien se asigna al mejor postor ("¡adjudicado!").' },
      { subtitulo: 'Vale vista', texto: 'Documento bancario que certifica fondos disponibles. Es la forma habitual de garantía en remates judiciales.' },
      { subtitulo: 'Garantía de seriedad', texto: 'Monto que depositas para poder participar (típicamente 10% del mínimo). Se devuelve si no ganas.' },
      { subtitulo: 'Bases del remate', texto: 'El "reglamento" de cada remate: requisitos, plazos, comisiones y condiciones. Siempre mandan.' },
      { subtitulo: 'Martillero público', texto: 'Persona o empresa inscrita en el Registro Nacional de Martilleros (Ley 18.118), autorizada para vender en pública subasta.' },
      { subtitulo: 'CBR (Conservador de Bienes Raíces)', texto: 'Donde se inscriben las propiedades y se piden los certificados de dominio, hipotecas y gravámenes.' },
      { subtitulo: 'Avalúo fiscal', texto: 'Valor que asigna el SII a una propiedad para fines de impuestos. Suele ser menor al valor comercial.' },
      { subtitulo: 'Acta de remate', texto: 'Documento que deja constancia de la adjudicación. En propiedades antecede a la escritura definitiva.' },
      { subtitulo: 'Bodegaje', texto: 'Cobro por almacenar un bien adjudicado que no retiraste dentro del plazo.' },
      { subtitulo: 'En el estado en que se encuentra', texto: 'Fórmula que significa: sin garantía, sin devoluciones. Lo que ves (o no fuiste a ver) es lo que compras.' },
    ],
  },
];
