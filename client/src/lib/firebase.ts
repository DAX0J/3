import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove, update, push, onValue } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoBqVU1lvtuNZ2FlAZgdYCA4BaMlNy1pw",
  authDomain: "e2-com-10-2024-to-11-2024.firebaseapp.com",
  databaseURL: "https://e2-com-10-2024-to-11-2024-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "e2-com-10-2024-to-11-2024",
  storageBucket: "e2-com-10-2024-to-11-2024.firebasestorage.app",
  messagingSenderId: "859750456330",
  appId: "1:859750456330:web:cb21a5c394917b470713f3",
  measurementId: "G-KLPJPL70KN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Database operations
export const writeData = (path: string, data: any) => {
  return set(ref(database, path), data);
};

export const updateData = (path: string, data: any) => {
  return update(ref(database, path), data);
};

export const pushData = (path: string, data: any) => {
  const newRef = push(ref(database, path));
  set(newRef, data);
  return newRef.key;
};

export const readData = (path: string) => {
  return get(ref(database, path));
};

export const removeData = (path: string) => {
  return remove(ref(database, path));
};

export const watchData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(database, path);
  return onValue(dataRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Authentication
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export default { database, auth };