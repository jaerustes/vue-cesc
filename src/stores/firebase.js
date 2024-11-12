// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase, usa tus propias credenciales
const firebaseConfig = {
    apiKey: import.meta.env.apiKey,
    authDomain: import.meta.apiKey.authDomain,
    databaseURL: "https://hist-esc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hist-esc",
    storageBucket: "hist-esc.appspot.com",
    messagingSenderId: "530962055028",
    appId: import.meta.env.appId
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db };
