const socket = io()
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})
// we use addEventListener for everytime the submit button is pressed
messageForm.addEventListener('submit', e => {
  //makes sure our page doesn't reload and clear
  e.preventDefault()
  const message = messageInput.value
  // we call the appendMessage function to create a new 'div' and add to the messageContainer
  appendMessage(`You: ${message}`)
  // we emit send-chat-message to server so our message can be seen
  socket.emit('send-chat-message', message)
  //chatbox is cleared
  messageInput.value = ''
})
//simple function to create new div message inputs
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}
