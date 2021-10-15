// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import firebaseConfig  from './firebase.config';


//initialize firebase
const initializeAuthentication = () => {
    initializeApp(firebaseConfig);
}

export default initializeAuthentication;