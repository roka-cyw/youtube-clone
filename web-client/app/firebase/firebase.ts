// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { GoogleAuthProvider } from 'firebase/auth/web-extension'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBFFex-SJhvOVjA0NYvNCPfXkDqVQKiDvs',
  authDomain: 'yt-cln-3d9b7.firebaseapp.com',
  projectId: 'yt-cln-3d9b7',
  appId: '1:55372846829:web:04b53f3b580ba42d31dee4'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

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
