// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwhxudOVBPB6n0spQmBpc27kf-HTsyOWg",
  authDomain: "rilla-voice.firebaseapp.com",
  projectId: "rilla-voice",
  storageBucket: "rilla-voice.appspot.com",
  messagingSenderId: "216263138777",
  appId: "1:216263138777:web:c07993f4b60ede895b8dc8",
  measurementId: "G-YGTQR1YLKE"
};

// Analytics initialization should only happen in browser environments
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
  }).catch((error) => {
    console.error('Error initializing Firebase Analytics:', error);
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };