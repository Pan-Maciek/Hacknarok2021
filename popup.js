
document.getElementById("sign-in-btn").addEventListener('click', () => {
    const input = document.getElementById('name-input')
    const name = input.value
    input.value = ""
    document.getElementById('done-message').style.display = "inline"
    chrome.runtime.sendMessage({ type: 'set-user', payload: name })
});