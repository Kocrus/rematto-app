// Rematto — Tema minimalista blanco/negro
export const C = {
  bg: '#FFFFFF',
  text: '#0B0B0B',
  sub: '#6B6B6B',
  card: '#F6F6F6',
  border: '#E6E6E6',
  black: '#0B0B0B',
  white: '#FFFFFF',
  live: '#E11D48', // punto rojo "EN VIVO"
  ok: '#16A34A',   // verificado / éxito
};

export const F = {
  title: { fontSize: 24, fontWeight: '800' as const, color: C.text, letterSpacing: -0.5 },
  h2: { fontSize: 17, fontWeight: '700' as const, color: C.text },
  body: { fontSize: 15, color: C.text },
  sub: { fontSize: 13, color: C.sub },
};
