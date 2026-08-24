import {
  EmailAuthProvider, deleteUser, reauthenticateWithCredential,
} from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Elimina la cuenta del usuario (Guideline 5.1.1v de Apple: toda app que
 * permite crear una cuenta debe permitir eliminarla desde dentro de la
 * misma app, sin depender de un sitio web o de contactar a soporte).
 *
 * Borra primero el perfil en Firestore (colección `usuarios`) y luego la
 * cuenta de Firebase Auth. Si Firebase exige un inicio de sesión reciente
 * (`auth/requires-recent-login`, común si la sesión lleva rato abierta),
 * se debe volver a llamar pasando `password` para reautenticar antes de
 * reintentar el borrado — ver el flujo en Perfil.
 */
export async function eliminarCuenta(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  if (password && user.email) {
    const credencial = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credencial);
  }

  try {
    await deleteDoc(doc(db, 'usuarios', user.uid));
  } catch {
    // Si falla el borrado del perfil no bloqueamos la eliminación de la
    // cuenta: lo importante para el usuario es poder cerrar su cuenta.
  }

  await deleteUser(user);
}
