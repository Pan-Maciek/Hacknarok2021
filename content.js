
chrome.runtime.onMessage.addListener(message => {
  let obj = RangeUtils.toObject(document.getSelection().getRangeAt(0))
  let range = RangeUtils.toRange(obj)
  let mark = document.createElement('mark')
  const root = document.createElement('div')
  root.classList.add('random-guys-root')
  range.surroundContents(mark)
  mark.appendChild(root)
  mark.addEventListener('click', () => {
    root.classList.toggle('random-guys-visible')
  })
})