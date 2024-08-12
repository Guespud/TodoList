import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, updateDoc, doc ,setDoc,arrayUnion,getDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUeE8ZDCWUQTkr_hBxacZaxqNCXjo6YJ4",
  authDomain: "todolist-ada53.firebaseapp.com",
  projectId: "todolist-ada53",
  storageBucket: "todolist-ada53.appspot.com",
  messagingSenderId: "641405580408",
  appId: "1:641405580408:web:620f1545ff6e689489e98d",
  measurementId: "G-NXNDLRNL7M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot, updateDoc, doc,setDoc,arrayUnion,getDoc };
