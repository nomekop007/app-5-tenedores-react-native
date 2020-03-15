import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCc7ZhzCCuXjn49ah1-DbT8mFttbtHQpQg",
  authDomain: "tenedores-d25ff.firebaseapp.com",
  databaseURL: "https://tenedores-d25ff.firebaseio.com",
  projectId: "tenedores-d25ff",
  storageBucket: "tenedores-d25ff.appspot.com",
  messagingSenderId: "481249547197",
  appId: "1:481249547197:web:a232153a9ae5e4f2cf78d4"
};

export const firebaseapp = firebase.initializeApp(firebaseConfig);
