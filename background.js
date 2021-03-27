chrome.contextMenus.create({
  title: "Title",
  contexts: ["selection"],
  onclick: (e) => {
    console.log("test");
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { a: 1 })
    })
  },
})