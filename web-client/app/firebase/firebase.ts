// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { GoogleAuthProvider } from 'firebase/auth/web-extension'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBpHjmmg61i7MROj9yHTkjYt6I1cPoaVwg',
  authDomain: 'clone-ytb-4e0b1.firebaseapp.com',
  projectId: 'clone-ytb-4e0b1',
  appId: '1:974896787904:web:93eeb9f154c2c475039825'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export const functions = getFunctions()

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider())
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut()
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
