const firebaseConfig = {
    apiKey: "AIzaSyBi89t5QO6YejicqBoE-JFBBWcaaEYygFA",
    authDomain: "tapzoearn.firebaseapp.com",
    projectId: "tapzoearn",
    storageBucket: "tapzoearn.firebasestorage.app",
    messagingSenderId: "29421959058",
    appId: "1:29421959058:web:56be0c351b82396b1d334b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
