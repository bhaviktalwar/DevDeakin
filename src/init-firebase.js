// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCA-l70wL7aO6h1FT0r1CeiL3P_Jy-7fHc",
	authDomain: "sit31391c.firebaseapp.com",
	projectId: "sit31391c",
	storageBucket: "sit31391c.firebasestorage.app",
	messagingSenderId: "860726672039",
	appId: "1:860726672039:web:8c6cf58b2c42d8bdb7f982",
	measurementId: "G-42YPRM54GB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);