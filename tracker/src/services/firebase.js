import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from 'uuid'

const firebaseConfig = {
    apiKey: "AIzaSyAggaKMuIWrds24wlqozvI1CxUxbQi3bJI",
    authDomain: "alejae-jwt.firebaseapp.com",
    projectId: "alejae-jwt",
    storageBucket: "alejae-jwt.appspot.com",
    messagingSenderId: "1024706159270",
    appId: "1:1024706159270:web:cf7fbbf72a850b2e8e4a67"
}
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

export async function uploadFile(file) {
    const storageRef = ref(storage, v4())
    await uploadBytes(storageRef, file)
    const fileURL = await getDownloadURL(storageRef)
    const message = 'Image has been uploaded'
    return {fileURL, message}
}