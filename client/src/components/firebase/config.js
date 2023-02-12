import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyBjYAKpnJUrEI_4wj1VqAvfFoIsuXZfGvs",
    authDomain: "blog-41f7c.firebaseapp.com",
    projectId: "blog-41f7c",
    storageBucket: "blog-41f7c.appspot.com",
    messagingSenderId: "638048394017",
    appId: "1:638048394017:web:d7043a80f1d806136ffc60",
    measurementId: "G-CYF4LHR9EJ",
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = firebase.auth();
const db = firebase.firestore();

export { db, auth };
export default firebase;
