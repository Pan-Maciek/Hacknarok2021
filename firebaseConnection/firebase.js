// config object
var firebaseConfig = {
    apiKey: "AIzaSyBFuAXYGtjU9-abDvGA5eDTAkPB-fAoYv4",
    authDomain: "angularfirecourse-f1155.firebaseapp.com",
    databaseURL: "https://angularfirecourse-f1155.firebaseio.com",
    projectId: "angularfirecourse-f1155",
    storageBucket: "angularfirecourse-f1155.appspot.com",
    messagingSenderId: "97150647711",
    appId: "1:97150647711:web:1fd80ec04cad620b7b91aa",
    measurementId: "G-0FCXLZJ266"
  };

// initialize
firebase.initializeApp(firebaseConfig);


// functions

function insert() {

    console.log("Hemlo");
    
    var payload = {
        hello: "Yes"
    };

    firebase.database().ref("pages").push(payload);
    
}

