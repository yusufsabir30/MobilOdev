// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAPZNsLAYX8547TooeiLsn24ziaOnAV4e0",
    authDomain: "mobiluygulamaodev-66ccc.firebaseapp.com",
    projectId: "mobiluygulamaodev-66ccc",
    storageBucket: "mobiluygulamaodev-66ccc.firebasestorage.app",
    messagingSenderId: "378052539973",
    appId: "1:378052539973:web:c2b1ab38f34930af25552c"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
