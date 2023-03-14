/*
 * Client-side javascript for rooms page
 */

const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}
// make it look prettier***
socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

// make it look prettier***
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

// make it look prettier***
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}


/*
 * Client-side javascript for log-in page
 */

const logInModal = document.getElementById('log-in-modal')
const logInErrorModal = document.getElementById('log-in-error-modal')
const logInButton = document.getElementById('log-in-button')
const registerButton = document.getElementById('register-button')
const cancelButton = document.getElementById('cancel-log-in-button')
const cancelErrorButton = document.getElementById('cancel-error-button')
const submitButton = document.getElementById('submit-button')

var nameInput = document.getElementById('name-input')
var keyInput = document.getElementById('key-input')


function toggleLogInModal()
{
  logInModal.classList.toggle("hide");
  nameInput.value=""
  keyInput.value=""
}

function toggleErrorModal()
{
  logInErrorModal.classList.toggle("hide");
}

logInButton.addEventListener('click', function() {
  toggleLogInModal()
})

registerButton.addEventListener('click', function() {
  toggleLogInModal()
})

cancelButton.addEventListener('click', function() {
  toggleLogInModal()
})

cancelErrorButton.addEventListener('click', function() {
  toggleErrorModal()
})

nameInput.addEventListener('submit', () => {
  toggleErrorModal()
})

submitButton.addEventListener('submit', (nameInput, keyInput) => {
  socket.emit('user-logging-in', nameInput, keyInput)
  toggleLogInModal()
  
  socket.on('log-in-unsuccesful', () => {
    toggleErrorModal()
  })
})