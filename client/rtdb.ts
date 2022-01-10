import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: "sQrF1qDEzFbyKPcc2ofLyNEO4TYxxoV2krWp38j4",
    databaseURL: "https://piedra-papel-o-tijera-apx-default-rtdb.firebaseio.com/",
    authDomain: "piedra-papel-o-tijera-apx.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
