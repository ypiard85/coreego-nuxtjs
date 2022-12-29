// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpuxuwhUGwVjuQZwZwkekjE2hDqRNqhas",
  authDomain: "coreego-35f6d.firebaseapp.com",
  projectId: "coreego-35f6d",
  storageBucket: "coreego-35f6d.appspot.com",
  messagingSenderId: "103070451813",
  appId: "1:103070451813:web:70e2cde72ca106cd0ede8c",
  measurementId: "G-TVMSF7H7NP",
};
//https://firebase.google.com/docs/auth/web/manage-users#web-version-9_4
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage();

const updateProfileUser = (displayName, photoURL) => {
  updateProfile(auth.currentUser, {
    displayName,
    photoURL,
  })
    .then(() => console.log("profil update"))
    .catch((error) => console.log(error));
};

const logOut = () =>
  signOut(auth)
    .then(() => {
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
    });

export { auth, db, storage, logOut, updateProfileUser };
