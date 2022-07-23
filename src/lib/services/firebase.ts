import { initializeApp } from "firebase/app";

const config = {
	apiKey: "AIzaSyBPjAQOlj1p8sN6BpsqYhlMtm7Zd7ZJzXo",
	authDomain: "bnmofin.firebaseapp.com",
	projectId: "bnmofin",
	storageBucket: "bnmofin.appspot.com",
	messagingSenderId: "550809281490",
	appId: "1:550809281490:web:33253bb478701c26d89e0b",
	measurementId: "G-VD0QKQC4HC",
};

function init() {
	initializeApp(config);
}

export const firebase = {
	init,
};
