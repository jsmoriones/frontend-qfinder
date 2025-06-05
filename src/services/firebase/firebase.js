import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBRoeImJGraYq0EoX0zSQxVCeKxjyvT4Kk",
    authDomain: "qfinder-comunity.firebaseapp.com",
    databaseURL: "https://qfinder-comunity-default-rtdb.firebaseio.com",
    projectId: "qfinder-comunity",
    storageBucket: "qfinder-comunity.firebasestorage.app",
    messagingSenderId: "943234700783",
    appId: "1:943234700783:web:87af63e29285675e28521a",
    measurementId: "G-DJ012PD4HS"
};

const firebaseApp = initializeApp(firebaseConfig);

if (firebaseApp) {
  console.log('Firebase App inicializada correctamente:', firebaseApp);
} else {
  console.error('Error al inicializar Firebase App.');
}

const storage = getStorage(firebaseApp);
export { firebaseApp, storage };