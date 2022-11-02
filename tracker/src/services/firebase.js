import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAggaKMuIWrds24wlqozvI1CxUxbQi3bJI",
    authDomain: "alejae-jwt.firebaseapp.com",
    projectId: "alejae-jwt",
    storageBucket: "gs://alejae-jwt.appspot.com",
    messagingSenderId: "1024706159270",
    appId: "1:1024706159270:web:cf7fbbf72a850b2e8e4a67"
}

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db, storage };