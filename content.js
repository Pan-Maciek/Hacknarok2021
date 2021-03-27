
document.addEventListener('selectionchange', e => {
  let obj = RangeUtils.toObject(document.getSelection().getRangeAt(0))
  let range = RangeUtils.toRange(obj)
  console.log(range)
})