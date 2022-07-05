// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCO4w9EIrIb3Pm08TLfxa8IWm012w_CcUE",
    authDomain: "lhl-lambda.firebaseapp.com",
    databaseURL: "https://lhl-lambda-default-rtdb.firebaseio.com",
    projectId: "lhl-lambda",
    storageBucket: "lhl-lambda.appspot.com",
    messagingSenderId: "204727751836",
    appId: "1:204727751836:web:d2529c5a26a351c6b7c959",
    measurementId: "G-EYHMPBMND6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);