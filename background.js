chrome.contextMenus.create({
  title: "Add comment",
  contexts: ["selection"],
  onclick: (e) => {
    chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, "context-menu")
    })
  },
})