// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw8obXXgiWHLWub--AeFJVwDPTGQmyB24",
  authDomain: "cumpleapp-18ab6.firebaseapp.com",
  projectId: "cumpleapp-18ab6",
  storageBucket: "cumpleapp-18ab6.appspot.com",
  messagingSenderId: "747746427102",
  appId: "1:747746427102:web:de20b4af1610a8614f424f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
