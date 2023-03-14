/*
 * Client-side javascript for log-in page
 */

const socket = io('http://localhost:3000')
const logInModal = document.getElementById('log-in-modal')
const logInButton = document.getElementById('log-in-button')
const registerInButton = document.getElementById('register-button')
const cancelButton = document.getElementById('cancel-button')
const cancelErrorButton = document.getElementById('cancel-error-button')


function toggleLogInModal()
{
  document.getElementById("log-in-modal").classList.toggle("show");
}

function toggleErrorModal()
{
  document.getElementById("log-in-error-modal").classList.toggle("show");
}

logInButton.addEventListener('click', function() {
  toggleLogInModal()
})

cancelButton.addEventListener('click', function() {
  toggleLogInModal()
})

cancelErrorButton.addEventListener('click', function() {
  toggleErrorModal
})


logInButton.addEventListener('click', () => {
  const nameInput = document.getElementById('name-input')
  const keyInput = document.getElementById('key-input')

  socket.emit('user-logging-in', nameInput, keyInput)
  toggleLogInModal()
  
  socket.on('log-in-unsuccesful', () => {
    toggleErrorModal()
  })
})