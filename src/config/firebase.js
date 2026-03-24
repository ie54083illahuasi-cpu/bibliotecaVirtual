import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBLfJM_QsTaSk76qUqQzuNQ3WIlKtsT-mo",
  authDomain: "ie-54083-illahuasi.firebaseapp.com",
  databaseURL: "https://ie-54083-illahuasi-default-rtdb.firebaseio.com",
  projectId: "ie-54083-illahuasi",
  storageBucket: "ie-54083-illahuasi.firebasestorage.app",
  messagingSenderId: "199662671236",
  appId: "1:199662671236:web:edb8a531c31697075239d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
