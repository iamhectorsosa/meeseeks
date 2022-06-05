import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default async function database() {
    const firebaseConfig = {
        apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        authDomain: "meeseeksxekqt.firebaseapp.com",
        projectId: "meeseeksxekqt",
        storageBucket: "meeseeksxekqt.appspot.com",
        messagingSenderId: "29346555306",
        appId: "1:29346555306:web:bb02e66f6b5b2b79b577d3",
        measurementId: "G-SZ489LCJ3R",
    };
    
    const app = initializeApp(firebaseConfig);

    return getFirestore(app);

}
