// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvIvg16oTiDI9HuLYODwy1JGQ9AaRCde4",
  authDomain: "nomina-asesores-aegis.firebaseapp.com",
  projectId: "nomina-asesores-aegis",
  storageBucket: "nomina-asesores-aegis.appspot.com",
  messagingSenderId: "589952876472",
  appId: "1:589952876472:web:68cfbe38e11eb3f2bbd94d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export default db;
export { auth };