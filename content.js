
chrome.runtime.onMessage.addListener(message => {
  let obj = RangeUtils.toObject(document.getSelection().getRangeAt(0))
  let range = RangeUtils.toRange(obj)

  let mark = create_mark_with_popup(range)
  document.getElementsByClassName('random-guys-container')[0].appendChild(create_message_node("sdsdsd"))
  document.getElementsByClassName('random-guys-container')[0].appendChild(create_message_node("sdgsdffsdsdsd"))
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