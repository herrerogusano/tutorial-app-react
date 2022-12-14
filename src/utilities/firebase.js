import { useState, useEffect } from 'react';
import { 
    getAuth,
    GoogleAuthProvider, 
    onIdTokenChanged, 
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';




export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};


export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut  };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOcMfzwiPC5JKFjLGrdQaIjKsRsOYa1IY",
    authDomain: "nysl-app-ubiqum.firebaseapp.com",
    databaseURL: "https://nysl-app-ubiqum-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nysl-app-ubiqum",
    storageBucket: "nysl-app-ubiqum.appspot.com",
    messagingSenderId: "69215018956",
    appId: "1:69215018956:web:de5296376d6ccf036e8769",
    measurementId: "G-6Q56SRLVH6"
  };

  export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

  export const setData = (path, value) => (
    set(ref(database, path), value)
  );

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);