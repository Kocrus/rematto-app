// Términos y Condiciones de Rematto (ES/EN)
// ⚠️ Borrador para revisión: haz que un abogado lo revise antes de publicar la app.
// Reemplaza [TITULAR] por tu nombre completo o la razón social (ej. Rematto SpA).

export const FECHA_VIGENCIA = '1 de agosto de 2026';
export const EFFECTIVE_DATE = 'August 1, 2026';

export interface ClausulaTC {
  titulo: string;
  texto: string;
}

export const TERMINOS_ES: ClausulaTC[] = [
  {
    titulo: '1. Aceptación de los Términos',
    texto:
      'Al descargar, instalar, registrarte o utilizar la aplicación móvil Rematto ("la Aplicación", "el Servicio"), declaras haber leído, entendido y aceptado estos Términos y Condiciones. Si no estás de acuerdo con ellos, no utilices la Aplicación.\n\nLa Aplicación es operada por [TITULAR], domiciliado en Santiago, Chile ("el Titular"). Estos Términos constituyen un acuerdo legal entre tú ("el Usuario") y el Titular.\n\nDebes ser mayor de 18 años para usar la Aplicación. Al usarla declaras cumplir este requisito.',
  },
  {
    titulo: '2. Qué es Rematto (y qué NO es)',
    texto:
      'Rematto es una plataforma informativa que recopila, organiza y muestra información públicamente disponible sobre remates y subastas realizados por terceros en Chile: tribunales de justicia, martilleros públicos, casas de remates, organismos públicos y empresas.\n\nRematto NO es un martillero público, NO organiza ni ejecuta remates ni subastas, NO recibe posturas ni ofertas, NO recibe pagos ni garantías asociadas a remates y NO actúa como intermediario ni mandatario de los organizadores. Toda participación en un remate se realiza directamente entre el Usuario y el organizador correspondiente, bajo las bases y condiciones de este último.\n\nLa información publicada en Rematto tiene fines exclusivamente informativos y no constituye asesoría legal, financiera ni de inversión.',
  },
  {
    titulo: '3. Cuentas y registro',
    texto:
      'Para acceder al detalle de los remates y a funciones como la agenda o la publicación de remates, debes crear una cuenta gratuita con tu correo electrónico y una contraseña. La misma cuenta podrá utilizarse en el sitio web de Rematto.\n\nEres responsable de la veracidad de los datos entregados y de mantener la confidencialidad de tus credenciales. El Titular puede suspender o eliminar cuentas que infrinjan estos Términos.',
  },
  {
    titulo: '4. Información de terceros y exactitud',
    texto:
      'La información de los remates proviene de fuentes públicas y de publicaciones realizadas por organizadores. Fechas, precios mínimos, garantías, condiciones y demás antecedentes pueden cambiar, suspenderse o contener errores ajenos a Rematto.\n\nEl Usuario debe verificar siempre la información en la fuente oficial del organizador antes de tomar cualquier decisión o realizar cualquier gestión (por ejemplo, obtener un vale vista o inscribirse en un remate). Rematto no garantiza la exactitud, completitud ni vigencia de la información publicada.',
  },
  {
    titulo: '5. Publicaciones de organizadores',
    texto:
      'Los martilleros, casas de remates y empresas que publican en Rematto son exclusivos responsables del contenido de sus publicaciones, incluida su veracidad, licitud y vigencia, así como de contar con las autorizaciones e inscripciones exigidas por la ley chilena (en particular, la Ley 18.118 sobre martilleros públicos cuando corresponda).\n\nEl Titular se reserva el derecho de rechazar, editar o eliminar publicaciones que estime falsas, ilícitas, engañosas o contrarias a estos Términos, sin expresión de causa.',
  },
  {
    titulo: '6. Recordatorios y notificaciones',
    texto:
      'La función de agenda y recordatorios es una ayuda de mejor esfuerzo. La entrega de notificaciones depende de tu dispositivo, tu configuración y servicios de terceros, por lo que no se garantiza su recepción ni oportunidad. Es responsabilidad del Usuario verificar por sí mismo las fechas y horas de los remates de su interés.',
  },
  {
    titulo: '7. Uso permitido',
    texto:
      'Te comprometes a usar la Aplicación conforme a la ley y a estos Términos. Queda prohibido: (a) usar la Aplicación para fines ilícitos o fraudulentos; (b) publicar información falsa o suplantar a organizadores; (c) extraer masivamente datos de la Aplicación (scraping) o revender su contenido; (d) intentar vulnerar la seguridad del Servicio; y (e) usar la Aplicación de un modo que afecte su funcionamiento o a otros usuarios.',
  },
  {
    titulo: '8. Propiedad intelectual',
    texto:
      'La marca Rematto, el diseño de la Aplicación, sus textos originales (incluidas las guías educativas), logotipos y código son de propiedad del Titular o de sus licenciantes, y están protegidos por la legislación de propiedad intelectual e industrial. No adquieres ningún derecho sobre ellos por el uso de la Aplicación.\n\nLa información pública de remates pertenece a sus respectivas fuentes.',
  },
  {
    titulo: '9. Datos personales',
    texto:
      'Rematto recolecta los datos mínimos necesarios para operar: correo electrónico y credenciales de acceso (si creas cuenta), tus remates guardados y preferencias, e información técnica básica del dispositivo. No vendemos tus datos personales a terceros.\n\nEl tratamiento de datos se rige por la legislación chilena de protección de datos personales (Ley 19.628 y Ley 21.719 una vez plenamente vigente). Puedes ejercer tus derechos de acceso, rectificación, cancelación, oposición y portabilidad escribiendo al correo de contacto indicado al final de estos Términos. Puedes eliminar tu cuenta y solicitar la eliminación de tus datos en cualquier momento.',
  },
  {
    titulo: '10. Limitación de responsabilidad',
    texto:
      'La decisión de participar en un remate, y toda gestión, pago, garantía u obligación derivada de ella, es exclusiva del Usuario y del organizador correspondiente. En la máxima medida permitida por la ley, el Titular no responde por: (a) errores, cambios o suspensiones en remates publicados; (b) pérdidas o perjuicios derivados de participar o no participar en un remate; (c) actos u omisiones de organizadores o terceros; (d) indisponibilidad temporal del Servicio; ni (e) la no recepción de notificaciones o recordatorios.\n\nLa Aplicación se proporciona "tal cual" y "según disponibilidad".',
  },
  {
    titulo: '11. Modificaciones',
    texto:
      'El Titular puede modificar la Aplicación, sus funciones y estos Términos. Los cambios relevantes serán informados dentro de la Aplicación y regirán desde su publicación, indicando la nueva fecha de vigencia. El uso continuado del Servicio tras un cambio implica su aceptación.',
  },
  {
    titulo: '12. Ley aplicable y jurisdicción',
    texto:
      'Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia derivada de ellos será sometida a los tribunales ordinarios de justicia de Santiago de Chile.\n\nContacto: contacto@rematto.cl',
  },
];

export const TERMINOS_EN: ClausulaTC[] = [
  {
    titulo: '1. Acceptance of the Terms',
    texto:
      'By downloading, installing, registering for, or using the Rematto mobile application ("the App", "the Service"), you declare that you have read, understood, and accepted these Terms and Conditions. If you do not agree with them, do not use the App.\n\nThe App is operated by [OWNER], domiciled in Santiago, Chile ("the Owner"). These Terms are a legal agreement between you ("the User") and the Owner.\n\nYou must be at least 18 years old to use the App. By using it, you represent that you meet this requirement.',
  },
  {
    titulo: '2. What Rematto is (and what it is NOT)',
    texto:
      'Rematto is an informational platform that collects, organizes, and displays publicly available information about auctions conducted by third parties in Chile: courts of law, licensed public auctioneers ("martilleros"), auction houses, public agencies, and companies.\n\nRematto is NOT a public auctioneer, does NOT organize or conduct auctions, does NOT receive bids or offers, does NOT receive payments or deposits related to auctions, and does NOT act as an intermediary or agent of the organizers. Any participation in an auction takes place directly between the User and the corresponding organizer, under that organizer\'s rules and conditions.\n\nThe information published on Rematto is for informational purposes only and does not constitute legal, financial, or investment advice.',
  },
  {
    titulo: '3. Accounts and registration',
    texto:
      'To access auction details and features such as the schedule or publishing auctions, you must create a free account with your email address and a password. The same account may be used on the Rematto website.\n\nYou are responsible for the accuracy of the information you provide and for keeping your credentials confidential. The Owner may suspend or delete accounts that breach these Terms.',
  },
  {
    titulo: '4. Third-party information and accuracy',
    texto:
      'Auction information comes from public sources and from listings published by organizers. Dates, minimum prices, deposits, conditions, and other details may change, be suspended, or contain errors beyond Rematto\'s control.\n\nThe User must always verify the information at the organizer\'s official source before making any decision or taking any step (for example, obtaining a bank draft or registering for an auction). Rematto does not guarantee the accuracy, completeness, or currency of the information published.',
  },
  {
    titulo: '5. Organizer listings',
    texto:
      'Auctioneers, auction houses, and companies that publish on Rematto are solely responsible for the content of their listings, including their truthfulness, lawfulness, and validity, and for holding the authorizations and registrations required by Chilean law (in particular, Law 18,118 on public auctioneers where applicable).\n\nThe Owner reserves the right to reject, edit, or remove listings it deems false, unlawful, misleading, or contrary to these Terms, without stating cause.',
  },
  {
    titulo: '6. Reminders and notifications',
    texto:
      'The schedule and reminder features are provided on a best-effort basis. Notification delivery depends on your device, your settings, and third-party services, so receipt and timeliness are not guaranteed. It is the User\'s responsibility to independently verify the dates and times of auctions of interest.',
  },
  {
    titulo: '7. Permitted use',
    texto:
      'You agree to use the App in accordance with the law and these Terms. The following are prohibited: (a) using the App for unlawful or fraudulent purposes; (b) publishing false information or impersonating organizers; (c) bulk-extracting data from the App (scraping) or reselling its content; (d) attempting to breach the security of the Service; and (e) using the App in a way that disrupts its operation or other users.',
  },
  {
    titulo: '8. Intellectual property',
    texto:
      'The Rematto brand, the App\'s design, its original texts (including the educational guides), logos, and code are the property of the Owner or its licensors and are protected by intellectual and industrial property law. Your use of the App grants you no rights over them.\n\nPublic auction information belongs to its respective sources.',
  },
  {
    titulo: '9. Personal data',
    texto:
      'Rematto collects the minimum data needed to operate: email and login credentials (if you create an account), your saved auctions and preferences, and basic technical device information. We do not sell your personal data to third parties.\n\nData processing is governed by Chilean data protection law (Law 19,628 and Law 21,719 once fully in force). You may exercise your rights of access, rectification, deletion, objection, and portability by writing to the contact email at the end of these Terms. You may delete your account and request deletion of your data at any time.',
  },
  {
    titulo: '10. Limitation of liability',
    texto:
      'The decision to participate in an auction, and any step, payment, deposit, or obligation arising from it, rests solely with the User and the corresponding organizer. To the maximum extent permitted by law, the Owner is not liable for: (a) errors, changes, or suspensions in published auctions; (b) losses or damages arising from participating or not participating in an auction; (c) acts or omissions of organizers or third parties; (d) temporary unavailability of the Service; or (e) non-delivery of notifications or reminders.\n\nThe App is provided "as is" and "as available".',
  },
  {
    titulo: '11. Changes',
    texto:
      'The Owner may modify the App, its features, and these Terms. Material changes will be announced within the App and take effect upon publication, indicating the new effective date. Continued use of the Service after a change constitutes acceptance.',
  },
  {
    titulo: '12. Governing law and jurisdiction',
    texto:
      'These Terms are governed by the laws of the Republic of Chile. Any dispute arising from them shall be submitted to the ordinary courts of Santiago, Chile.\n\nContact: contacto@rematto.cl',
  },
];
