// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
// // Add Firebase products that you want to use
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import { getDatabase, ref, push, remove, onChildAdded, onChildRemoved } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs

const firebaseConfig = {
apiKey: "AIzaSyA6reWuHWx7VXP-hNDVcnDI0dm0H0AAaVI",
authDomain: "taller-facilito-hd-f0e3f.firebaseapp.com",
projectId: "taller-facilito-hd-f0e3f",
storageBucket: "taller-facilito-hd-f0e3f.appspot.com",
messagingSenderId: "941209593935",
appId: "1:941209593935:web:5d835e0dfe946ee156a23a",
measurementId: "G-ZVBS57JJ1B"
};

// Initialize Firebase
//Declaración de variables
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase(app);
let user = null;
let conectadoKey =null;
let rooms = null;

let usuariosConectados = null;

//Botón de inicio de sesión
let loginBtn = document.getElementById('start-login');
let signOutBtn = document.getElementById('start-signOut');

loginBtn.addEventListener('click',  googleLogin);

//Se ejecuta al cerrar pestaña
signOutBtn.addEventListener("click", signOut);
window.addEventListener('unload', signOut);
window.onbeforeunload = signOut;

//Función para hacer login con Google
async function googleLogin(){
    var provider = new GoogleAuthProvider();
    console.log(provider)
    provider.addScope('profile');
    provider.addScope('email');
    try {
        const result = await signInWithPopup(auth, provider);
  
        // The signed-in user info.
        user = result.user;
        console.log(user);
        $('#login').fadeOut();
        $('#start-signOut').fadeIn();
        initApp();
    }
    catch(e){
        console.log(e);
    }
   
}


//Iniciar la app
function initApp(){
    usuariosConectados = ref(database, "/connected");
    rooms = ref(database, "/rooms");
    login(user.uid, user.displayName || user.email);

    //Eventos: al aparecer o desaparecer en la BD
    onChildAdded(usuariosConectados, addUser);
    onChildRemoved(usuariosConectados, removeUser);
    //Eventos para la creación de una sala
    onChildAdded(rooms, newRoom);

}

function login(uid, name){
    let conectado = push(usuariosConectados, {
        uid: uid,
        name: name
    });
    conectadoKey = conectado.key;
}

function signOut(){
    let deleteRef = ref(database, "/connected/"+conectadoKey);
    remove(deleteRef);
    location.reload();
}

function addUser(data){
    //Evitar al propio yo
    
    if(data.val().uid == user.uid) return;
    let friend_id = data.val().uid;
    let $li = $('<li>').addClass('collection-item')
                        .html(data.val().name)
                        .attr("id", friend_id)
                        .appendTo('#users')

    //Crear salas
    $li.on('click', function() {
        let room = push(rooms, {
            creator: user.uid,
            friend: friend_id
        })
         //Creación de chat
        new Chat(room.key, user, "chats", database);
    }); 
    
}

function removeUser(data){
    $('#'+data.val().uid).slideUp('fast', function(){
        $(this).remove();
    });
}

//Crear una nueva sala si alguien más la abre. Sincroniza
function newRoom(data){
    //Si yo soy el amigo, alguien creó la sala conmigo
    if(data.val().friend == user.uid){
        new Chat(data.key, user, "chats", database);
    }
}

