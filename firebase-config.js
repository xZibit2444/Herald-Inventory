// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaHStUMByAxlXu8FKF6KHbP_sb7rm5PdQ",
    authDomain: "herald-ims.firebaseapp.com",
    projectId: "herald-ims",
    storageBucket: "herald-ims.firebasestorage.app",
    messagingSenderId: "87186969786",
    appId: "1:87186969786:web:d6e4b435f2759e8c355e83",
    measurementId: "G-623FSP8G8L"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Collections
const inventoryCollection = db.collection('inventory');
const usersCollection = db.collection('users');

console.log('Firebase initialized successfully');
