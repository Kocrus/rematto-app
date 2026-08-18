import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth, FIREBASE_SIN_CONFIGURAR } from '../lib/firebase';
import { C } from '../lib/theme';

// Formulario de acceso con correo y contraseña (mismas cuentas servirán
// para la futura web de Rematto, vía Firebase Auth).
export default function LoginForm({ titulo }: { titulo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    if (FIREBASE_SIN_CONFIGURAR) {
      Alert.alert('Modo demo', 'Configura Firebase en lib/firebase.ts para crear cuentas.');
      return;
    }
    if (!email || !pass) {
      Alert.alert('Faltan datos', 'Ingresa correo y contraseña.');
      return;
    }
    try {
      setCargando(true);
      if (modo === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), pass);
        // Cuenta nueva: le preguntamos una sola vez si es cliente u organizador.
        router.replace('/elegir-rol');
      }
    } catch (e: any) {
      const msg =
        e?.code === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos.'
        : e?.code === 'auth/email-already-in-use' ? 'Ese correo ya tiene cuenta. Inicia sesión.'
        : e?.code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres.'
        : 'No se pudo completar. Revisa tus datos e intenta de nuevo.';
      Alert.alert('Error', msg);
    } finally {
      setCargando(false);
    }
  };

  const recuperar = async () => {
    if (FIREBASE_SIN_CONFIGURAR || !email) {
      Alert.alert('Recuperar contraseña', 'Escribe tu correo arriba y vuelve a tocar aquí.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Listo', 'Te enviamos un correo para restablecer tu contraseña.');
    } catch {
      Alert.alert('Error', 'No pudimos enviar el correo. Verifica la dirección.');
    }
  };

  return (
    <View>
      {titulo && <Text style={s.titulo}>{titulo}</Text>}

      <TextInput
        style={s.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#9A9A9A"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={s.input}
        placeholder="Contraseña"
        placeholderTextColor="#9A9A9A"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <Pressable style={[s.btn, cargando && { opacity: 0.5 }]} onPress={entrar} disabled={cargando}>
        <Text style={s.btnTxt}>
          {cargando ? 'Un momento…' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setModo(modo === 'login' ? 'registro' : 'login')}>
        <Text style={s.cambio}>
          {modo === 'login' ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
        </Text>
      </Pressable>

      {modo === 'login' && (
        <Pressable onPress={recuperar}>
          <Text style={s.olvido}>¿Olvidaste tu contraseña?</Text>
        </Pressable>
      )}

      <Pressable onPress={() => router.push('/legal/terminos')}>
        <Text style={s.legal}>Al crear una cuenta aceptas los Términos y Condiciones</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.5, marginBottom: 20 },
  input: {
    backgroundColor: C.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: C.text,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: C.black,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: { color: C.white, fontSize: 16, fontWeight: '700' },
  cambio: { textAlign: 'center', marginTop: 20, color: C.text, fontSize: 14, fontWeight: '600' },
  olvido: { textAlign: 'center', marginTop: 14, color: C.sub, fontSize: 13 },
  legal: {
    textAlign: 'center',
    marginTop: 22,
    fontSize: 12,
    color: C.sub,
    textDecorationLine: 'underline',
  },
});
