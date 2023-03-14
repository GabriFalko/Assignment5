/*
 * Client-side javascript for rooms page
 */
// constant definition of DOM elemnts in ejs files
const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

var userName = ''
var userPassword = ''

if (messageForm != null) {
  const name = userName
  appendMessage('You joined')
  socket.emit('join-room', roomName, name)
  socket.emit('new-user', roomName, name)
  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

// socket.io requests and responses: 
socket.on('user-found', name =>{
  socket.emit('new-user', room, name)
})
socket.on('user-not-found', name => {
  toggleErrorModal()
  console.log(name+" wasn't found in database.")
})
socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})
socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})
socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

// function to send message container to client DOM
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}


/*
 * Client-side javascript for log-in page
 */

// constant definition of DOM elemnts in ejs files
const logInModal = document.getElementById('log-in-modal')
const logInErrorModal = document.getElementById('log-in-error-modal')
// buttons
const logInButton = document.getElementById('log-in-button')
const registerButton = document.getElementById('register-button')
const cancelButton = document.getElementById('cancel-log-in-button')
const cancelErrorButton = document.getElementById('cancel-error-button')
const submitButton = document.getElementById('submit-button')
var rememberMe = document.getElementById('remember')

let nameInput = document.getElementById('name-input')
let keyInput = document.getElementById('key-input')

// this variable ensures checked box is ticked or not
var checked = 1


// functions to toggle modal for login and errors
function toggleLogInModal()
{
  logInModal.classList.toggle("hide");
  if(checked%2 == 0) {
  } else {  
  nameInput.value = ""
  keyInput.value = "" 
  }
}
function toggleErrorModal()
{
  logInErrorModal.classList.toggle("hide");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == logInModal) {
    toggleLogInModal()
  }
}

//  event listeners for each button
rememberMe.addEventListener('click', function() {
  rememberMe.classList.toggle("checked")
  checked += 1
})

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

submitButton.addEventListener('submit', () => {
  userName = nameInput.value
  userPassword = keyInput.value
  toggleLogInModal()
  socket.emit('user-logging-in', userName, userPassword)
})

