/**
 * A function generating unique GUIDs for newly added comments.
 * We rely on manual generation due to the comments being stored twice.
 * 
 * @returns {string} - the generated GUID
 */
function createGuid() {
  let S4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  let guid = `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;

  return guid.toLowerCase();
}

/**
 * The 'C' in CRUD for the comment store.
 */
function addComment(comment) {
  console.log("Inserting new comment to database");
  var id = createGuid();
  pageRef.child(id).set(comment)
  // firebase.database().ref(`/users/${comment.user}`).child(id).set(comment);
}

chrome.runtime.onMessage.addListener(message => {
  const range = document.getSelection().getRangeAt(0)

  addComment({
    url: encodeURIComponent(window.location.href),
    user: '',
    range: RangeUtils.toObject(range)
  })

  let mark = create_mark_with_popup(range)
  // document.getElementsByClassName('random-guys-container')[0].appendChild(create_message_node("sdsdsd"))
  // document.getElementsByClassName('random-guys-container')[0].appendChild(create_message_node("sdgsdffsdsdsd"))
})

function create_mark_with_popup(range){// TODO Maybe - create random ID for each mark, and then iterate over every "text" part in range > apply this ID as class, and attach to each part onclick handler

  let mark_node = document.createElement('mark')
  mark_node.classList.add('random-guys-mark')

  const root = document.createElement('div')
  root.classList.add('random-guys-root')
  root.innerHTML = '<div class="random-guys-container"></div><div class="random-guys-input"><input type="text"></div>'

  console.log(range) // TODO DELETE
  range.surroundContents(mark_node)

  mark_node.appendChild(root)
  mark_node.addEventListener('click', () => {
    root.classList.toggle('random-guys-visible')
  })
  root.addEventListener('click', () => {
    event.stopPropagation()
  })
  return mark_node
}

function create_message_node(message_content){
  const message_node = document.createElement('div')
  message_node.classList.add('random-guys-message')
  message_node.innerHTML = message_content
  return message_node
}

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
firebase.default.initializeApp(firebaseConfig)


const encode = string => string.replace(/\./g, '<').replace(/\//g, '>')
const decode = string => string.replace(/</g, '.').replace(/>/g, '/')

const pageURL = encode(`${location.hostname}${location.pathname}`)
const pageRef = firebase.default.database().ref('/pages').child(pageURL)

let a = {}
pageRef.on('value', snap => {
  const data = snap.val()
  console.log(data)

  for (let id in data) {
    if(a[id]) continue
    
    const mark = create_mark_with_popup(RangeUtils.toRange(data[id].range))

    a[id] = root
  }
})
