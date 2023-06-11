import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage,ref } from "firebase/storage";
import { getFirestore, collection, getDocs, } from 'firebase/firestore';
const firebaseConfig = { 
    apiKey: "AIzaSyAt-B8aTnJBRDOemOfxGxw2y9vyVExusbY",
    authDomain: "attandance-aa2d1.firebaseapp.com",
    projectId: "attandance-aa2d1",
    storageBucket: "attandance-aa2d1.appspot.com",
    messagingSenderId: "38979472407",
    appId: "1:38979472407:web:602527133a9cf02ef22052",
    measurementId: "G-F32Z8FEFR2"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// // Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
const storage = getStorage(app);
export const storageRef= (name="img.png")=>  ref(storage, name);
