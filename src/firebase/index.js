import firebase from 'firebase/app'
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBHv8djeAzbHE1aK_UhyNXyO0kqgFrk7Q",
  authDomain: "damirsbook.firebaseapp.com",
  projectId: "damirsbook",
  storageBucket: "damirsbook.appspot.com",
  messagingSenderId: "1066074219895",
  appId: "1:1066074219895:web:23ed22458e69f4652c6d72",
  measurementId: "G-LFKKW4946P"
};

firebase.initializeApp(firebaseConfig);
  export default firebase;