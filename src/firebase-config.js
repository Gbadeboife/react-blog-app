import { initializeApp } from "firebase/app";
import { getFirestore} from '@firebase/firestore'
import {getAuth} from "firebase/auth"

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "react-blog-app-a557c.firebaseapp.com",
  projectId: "react-blog-app-a557c",
  storageBucket: "react-blog-app-a557c.appspot.com",
  messagingSenderId: "367501978979",
  appId: "1:367501978979:web:bf51169ea598716b98b756"
};


const app = initializeApp(firebaseConfig);
export const auth= getAuth(app)
export const db= getFirestore(app)