import { initializeApp, } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDHc7bnvor-Jq8ci_lS_zWZg4PjGE8LJmw",
  authDomain: "proyectomovil-4b36b.firebaseapp.com",
  databaseURL: "https://proyectomovil-4b36b-default-rtdb.firebaseio.com",
  projectId: "proyectomovil-4b36b",
  storageBucket: "proyectomovil-4b36b.appspot.com",
  messagingSenderId: "944835113141",
  appId: "1:944835113141:web:999df64e892a22b69d0efc"
};

const app = initializeApp(firebaseConfig);

// Inicializamos los servicios de FB para poder exportalos y usarlos
const db = getFirestore(app);
const auth = getAuth(app);
const authOther = getAuth(app);

export { auth, db, authOther };
