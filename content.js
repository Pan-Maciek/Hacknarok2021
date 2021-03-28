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


/**
 * Marks and enables links within given text.
 * @param {*} text - the text to search for links
 * @returns - the same text, but with <a> tags
 */
function markLinks(text) {
  return text.replace(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g, (link) => {
    return `<a href="${link}">${link}</a>`
  })
}


const createCommentNode = ({ user, text, upvote, downvote }, commentRef) => {
  const node = div({
    className: 'random-guys-message',
    innerHTML: `
    <div class="random-guys-message-circle" style="background: hsl(${stringHue(user)},40%,50%)">${user.charAt(0).toUpperCase()}</div>
    <div class="random-guys-username">${user}</div>
    <div class="random-guys-content">${markLinks(text)}</div>
    <div class="random-guys-downvotes">-${downvote}</div>
    <div class="random-guys-upvotes">+${upvote}</div>
  `
  })
  const downvoteNode = node.querySelector(".random-guys-downvotes")
  downvoteNode.addEventListener("click", (e) => {
    commentRef.set({user, text, downvote: downvote+1, upvote})

  })
  const upvoteNode = node.querySelector(".random-guys-upvotes")
  upvoteNode.addEventListener("click", (e) => {
    commentRef.set({user, text, downvote, upvote:upvote+1})

  })
  commentRef.on('child_changed', (snap ) => {
    console.log(snap.val(), snap.key);
    if(snap.key == "upvote") {
      upvote = snap.val()
      upvoteNode.innerHTML=`+${upvote}`
    } else {
      downvote = snap.val()
      downvoteNode.innerHTML=`-${downvote}`
    }
  })
  return node;
}



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

  const x = {};

  const commentsRef = pageRef.child(id).child('comment')
  commentsRef.on('child_added', snap => {
    const node = createCommentNode(snap.val(), commentsRef.child(snap.key))
    container.append(node)
    x[snap.key] = node
    container.scrollBy(0, 10000)
  })
  


  function upload() {
    if (input.value) {
      pageRef.child(id).child('comment').push({ user, text: input.value,     upvote: 0,
        downvote: 0 })
      input.value = ""
    }
  }

  input.addEventListener('keypress', e => {
    if (e.key === "Enter") upload()
  })
  button.addEventListener('click', upload)

  range.surroundContents(markNode)
  markNode.append(root)
  return markNode
}
