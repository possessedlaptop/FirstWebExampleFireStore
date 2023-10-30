import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWHupZJHmWNHFW-cXHibTJ5d-lefLoHE8",
  authDomain: "fir-example-c57b5.firebaseapp.com",
  projectId: "fir-example-c57b5",
  storageBucket: "fir-example-c57b5.appspot.com",
  messagingSenderId: "98662320063",
  appId: "1:98662320063:web:66970d3c781f74281c430a",
  measurementId: "G-S739G5654E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore, analytics };
