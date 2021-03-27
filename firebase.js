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
var app = firebase.initializeApp(firebaseConfig);

console.log(firebase)
// functions
// pages -> url, comments[]
// comment: id, url, user, range


function createGuid(){  
    let S4 = () => Math.floor((1+Math.random())*0x10000).toString(16).substring(1); 
    let guid = `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;

    return guid.toLowerCase();
}

function create(comment) {
    console.log("Inserting new comment to database");
    var id = createGuid(); 
    firebase.database().ref(`/pages/${comment.url}`).child(id).set(comment);
    firebase.database().ref(`/users/${comment.user}`).child(id).set(comment);
}

function createCommnetsListener() { // TODO add pageURL as a parameted
    var pageURL = "onet_pl"; // TODO delete this shit when recatored 
    // TODO: Write a method that change . for _
    console.log("Reading from firebase pages")
    var pageCommentsRef = firebase.database().ref(`/pages/${pageURL}`);
    pageCommentsRef.on('value', (snapshot) => {
        const data  = snapshot.val();
        updateComments(data);
    });
    console.log("Page commnts: ", pageCommentsRef);
    
    
    function updateComments(newComment) {
        //TODO: make frontend to rerender 
        console.log("New comment arrived:", newComment);
        document.getElementById("comment-list");
    }    
}



// update
function update(comment) {
    firebase.database().ref(`/pages/${comment.url}/${comment.id}`).update(comment);
    firebase.database().ref(`/pages/${comment.user}/${comment.id}`).update(comment);
}


// delete
function deleteComment(comment) {
    console.log("Removing comment from database");
    
    firebase.database().ref(`/pages/${comment.url}/${comment.id}`)
        .remove()
        .then(function() {
            console.log("Removed comment successfully");
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message);
        });

    firebase.database().ref(`/pages/${comment.user}/${comment.id}`)
        .remove()
        .then(function() {
            console.log("Removed comment successfully");
        })
        .catch(function(error) {
            console.log("Remove failed: " + error.message);
        });
}



