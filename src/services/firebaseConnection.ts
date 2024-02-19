import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBQuXPKnTd_AlOsR2fSQ6e60Pqmo4cBJtE",
  authDomain: "reactlinks-ebb9d.firebaseapp.com",
  projectId: "reactlinks-ebb9d",
  storageBucket: "reactlinks-ebb9d.appspot.com",
  messagingSenderId: "150384426493",
  appId: "1:150384426493:web:a03c332ca054e394f9ed94"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export { auth, db };