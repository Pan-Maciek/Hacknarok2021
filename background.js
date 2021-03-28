chrome.contextMenus.create({
  title: "Add comment",
  contexts: ["selection"],
  onclick: (e) => {
    chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: "context-menu" })
    })
  },
})

let user = "Guest"

chrome.runtime.onMessage.addListener(({ type, payload }, sender) => {
  if (type === "set-user") user = payload
  else if (type === "get-user") {
    chrome.tabs.sendMessage(sender.tab.id, { 
      type: 'set-user', 
      payload: user 
    })
  }
})