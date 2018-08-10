// import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var config = {
  apiKey: "AIzaSyAkygr8Sq8jzgcc6eaFNOsuwjUYHNP8Fpo",
  authDomain: "h-s-law.firebaseapp.com",
  databaseURL: "https://h-s-law.firebaseio.com",
  projectId: "h-s-law",
  storageBucket: "h-s-law.appspot.com",
  messagingSenderId: "354038864855"
};


const app = firebase.initializeApp(config)
// const base = Rebase.createClass(app.database())
const facebookProvider = new firebase.auth.FacebookAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const firestore = firebase.firestore()

firestore.settings({
  timestampsInSnapshots: true
});

export { app, facebookProvider, googleProvider, firestore }
