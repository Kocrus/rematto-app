import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  // @ts-ignore — export existe en firebase para React Native
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración real del proyecto Rematto (rematto-3e9a6)
const firebaseConfig = {
  apiKey: 'AIzaSyCMRIr6OlDmpJsnZ_1n1hBV_u3Po6_SZq4',
  authDomain: 'rematto-3e9a6.firebaseapp.com',
  projectId: 'rematto-3e9a6',
  storageBucket: 'rematto-3e9a6.firebasestorage.app',
  messagingSenderId: '125414628804',
  appId: '1:125414628804:web:ade62c5a5e3e0436311891',
  measurementId: 'G-J13HXDQSWR',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// La app ya está conectada a Firebase real
export const FIREBASE_SIN_CONFIGURAR = false;
