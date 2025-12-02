import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './config.js';

export function signUp(email, password, role) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return fetch('/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firebase_uid: user.uid,
                    email: user.email,
                    role: role
                })
            });
        });
}

export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function doSignOut() {
    return signOut(auth);
}

export function onAuthStateChangedHelper(callback) {
    return onAuthStateChanged(auth, callback);
}

export function getIdToken() {
    return auth.currentUser.getIdToken();
}