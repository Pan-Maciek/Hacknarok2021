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
let user = ''
firebase.default.initializeApp(firebaseConfig)

const pageURL = encode(`${location.hostname}${location.pathname}`)
const pageRef = firebase.default.database().ref('/pages').child(pageURL)

pageRef.on('child_added', snap => {
  const data = snap.val()
  createHighlightWithPopup(RangeUtils.toRange(data.range), snap.key)
})

function contextMenuClicked() {
  const range = document.getSelection().getRangeAt(0)

  pageRef.push({ // add highligh to store
    url: encodeURIComponent(window.location.href),
    range: RangeUtils.toObject(range),
    user
  })
}
chrome.runtime.sendMessage({ type: 'get-user' })
chrome.runtime.onMessage.addListener(({ payload, type }) => {
  if (type === 'set-user') user = payload
  else if (type === 'context-menu') contextMenuClicked()
})

const createCommentNode = ({ user, text }) => div({
  className: 'random-guys-message',
  innerHTML: `
    <div class="random-guys-message-circle" style="background: hsl(${stringHue(user)},40%,50%)">${user.charAt(0).toUpperCase()}</div>
    <div class="random-guys-username">${user}</div>
    <div class="random-guys-content">${text}</div>
    <div class="random-guys-downvotes">-0</div>
    <div class="random-guys-upvotes">+0</div>
  `
})

/**
 * Mark the selected text span as a comment and open the text input popup
 */
function createHighlightWithPopup(range, id) {

  const root = div({
    className: 'random-guys-root',
    innerHTML: `
      <div class="random-guys-container"></div>
      <div class="random-guys-input">
        <input type="text" placeholder="Powiedz nam co o tym myślisz ...">
        <button>Dodaj</button>
      </div>
    `,
    onclick: e => e.stopPropagation()
  })

  const markNode = mark({
    className: 'random-guys-mark',
    onclick: e => root.classList.toggle('random-guys-visible')
  })

  const container = root.querySelector('.random-guys-container')
  const input = root.querySelector('input')
  const button = root.querySelector('button')
  const downvotesNode = root.querySelector('.random-guys-downvotes')
  const upvotesNode = root.querySelector('.random-guys-upvotes')

  pageRef.child(id).child('comment').on('child_added', snap => {
    const node = createCommentNode(snap.val())
    container.append(node)
    container.scrollBy(0, 10000)
  })

  function upload() {
    if (input.value) {
      pageRef.child(id).child('comment').push({ user, text: input.value })
      input.value = ""
    }
  }

  input.addEventListener('keypress', e => {
    if (e.key === "Enter") upload()
  })
  button.addEventListener('click', upload)
  downvotesNode.addEventListener('click', (event) =>{

  })
  upvotesNode.addEventListener('click', (event) =>{

  })

  range.surroundContents(markNode)
  markNode.append(root)
  return markNode
}
