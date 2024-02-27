// import firebase from "firebase";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: "https://piedra-papel-o-tijera-apx-default-rtdb.firebaseio.com/",
    authDomain: "piedra-papel-o-tijera-apx.firebaseapp.com",
});

const rtdb = getDatabase();

export { rtdb, ref, onValue };
