// firebase configs and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBFuAXYGtjU9-abDvGA5eDTAkPB-fAoYv4",
  authDomain: "angularfirecourse-f1155.firebaseapp.com",
  databaseURL: "https://angularfirecourse-f1155.firebaseio.com",
  projectId: "angularfirecourse-f1155",
  storageBucket: "angularfirecourse-f1155.appspot.com",
  messagingSenderId: "97150647711",
  appId: "1:97150647711:web:1fd80ec04cad620b7b91aa",
  measurementId: "G-0FCXLZJ266"
}
const user = 'mati'
firebase.default.initializeApp(firebaseConfig)

const pageURL = encode(`${location.hostname}${location.pathname}`)
const pageRef = firebase.default.database().ref('/pages').child(pageURL)

pageRef.on('child_added', snap => {
  const data = snap.val()
  createHighlightWithPopup(RangeUtils.toRange(data.range), snap.key)
})

/**
 * The 'C' in CRUD for the comment store.
 */
const addHighlight = comment => pageRef.push(comment)

const uploadComment = (highlightId, text) =>
  pageRef.child(highlightId).child('comment').push({ user, text })

function createCommentNode(messageContent, userName) {
  const messageNode = document.createElement('div')
  messageNode.classList.add('random-guys-message')
  messageNode.innerHTML = "<div class='random-guys-message-circle'>" + userName.charAt(0).toUpperCase() + "</div><div class='random-guys-username'>" + userName + "</div><div class='random-guys-content'>" + messageContent + "</div>"
  return messageNode
}


/**
 * Listening for the creation of new comments
 */
chrome.runtime.onMessage.addListener(() => {
  const range = document.getSelection().getRangeAt(0)

  addHighlight({
    url: encodeURIComponent(window.location.href),
    range: RangeUtils.toObject(range), 
    user
  })
})

/**
 * Mark the selected text span as a comment and open the text input popup
 */
function createHighlightWithPopup(range, id) {// TODO - create random ID for each mark, and then iterate over every "text" part in range > apply this ID as class, and attach to each part onclick handler

  let markNode = document.createElement('mark')
  markNode.classList.add('random-guys-mark')

  const root = document.createElement('div')
  root.classList.add('random-guys-root')
  root.innerHTML = `<div class="random-guys-container">
                    </div><div class="random-guys-input">
                    <input type="text">
                    <button>Dodaj</button>
                    </div>`

  const container = root.querySelector('.random-guys-container')
  pageRef.child(id).child('comment').on('child_added', snap => {
    const node = createCommentNode(snap.val().text, snap.val().user)
    container.append(node)
    container.scrollBy(0,10000)
  })
  range.surroundContents(markNode)

  markNode.appendChild(root)
  markNode.addEventListener('click', () => {
    root.classList.toggle('random-guys-visible')
  })
  root.addEventListener('click', event => {
    event.stopPropagation()
  }, false)

  const input = root.querySelector('input')
  input.addEventListener('keypress', e => {
    if (e.key === "Enter") {
      uploadComment(id, input.value)
      input.value = ""
    }
  })

  const uploadButton = root.querySelector('button')
  uploadButton.addEventListener('click', function () {
    uploadComment(id, input.value)
    input.value = ""
  })

  return markNode
}



