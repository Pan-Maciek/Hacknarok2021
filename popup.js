
document.getElementById("sign-in-btn").addEventListener('click', () => {
    const name = document.getElementById('name-input').value
    chrome.runtime.sendMessage({ type: 'set-user', payload: name })
});