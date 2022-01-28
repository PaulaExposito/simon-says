// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, get, ref, child } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWfBIWiJuNDSxfTbQZ2fAyLNBq_MkLD6k",
    authDomain: "simon-says-c00c1.firebaseapp.com",
    databaseURL: "https://simon-says-c00c1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "simon-says-c00c1",
    storageBucket: "simon-says-c00c1.appspot.com",
    messagingSenderId: "156895157485",
    appId: "1:156895157485:web:0cf1f607c5efe6a18b00e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

function postRanking(username, rounds, level) {
    const date = new Date();
    set(ref(database, `rankings/${username}/${date.getTime()}`), {
        user: username,
        level: level,
        points: rounds,
    })
        .then(() => getRankings);
}

async function getRankings() {
    const dbRef = ref(database);
    const res = await get(child(dbRef, 'rankings'))
    return res.val();
}


module.exports = {
    postRanking,
    getRankings
}
