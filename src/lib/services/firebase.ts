import { initializeApp } from "firebase/app";
import { firebaseConfig } from "$root/config";

function init() {
	initializeApp(firebaseConfig);
}

export const firebase = {
	init,
};
