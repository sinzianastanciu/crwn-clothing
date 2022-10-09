import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAS692nebSnQuch5y8SwiS9sYPgfNOlxl8",
    authDomain: "crown-clothing-db-19749.firebaseapp.com",
    projectId: "crown-clothing-db-19749",
    storageBucket: "crown-clothing-db-19749.appspot.com",
    messagingSenderId: "172661233986",
    appId: "1:172661233986:web:79c2b1201600aeb1b1d0db"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    //if user doesn't exist, create it
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, { //set the doc, for this object
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
        }
        catch (error){
            console.log('ERROR creating the user', error);
        }
    }

    return userDocRef;
};


export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
}