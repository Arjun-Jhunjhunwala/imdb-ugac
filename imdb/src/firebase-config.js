import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgAkIFAAI2OVMMO93fYNeYy90bc4lGKt8",
  authDomain: "imdb-48173.firebaseapp.com",
  projectId: "imdb-48173",
  storageBucket: "imdb-48173.appspot.com",
  messagingSenderId: "46926198928",
  appId: "1:46926198928:web:12549db10bacc00b0f8015"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 