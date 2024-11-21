import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDY8Yu8bEU2KlppxQpHbPqIXgBespJLaVA",
  authDomain: "employees-app-153d4.firebaseapp.com",
  projectId: "employees-app-153d4",
  storageBucket: "employees-app-153d4.appspot.com",  // Adjusted storage bucket
  messagingSenderId: "721885556268",
  appId: "1:721885556268:web:30d4236b793c3b6b96ab89",
  measurementId: "G-NMHM9NYQ5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore and Storage instances for frontend usage
const db = getFirestore(app);        // Firestore database instance
const storage = getStorage(app);     // Firebase Storage instance

// Exporting the initialized services
export { db, storage };
