/*
 * Server-side javascript most is knowladge from previous webdev class, and lots of youtube videos.
 */

const express = require('express');
const { url } = require('inspector');
const { urlToHttpOptions } = require('url')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
var port = process.env.PORT || 3000

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//username management
var usersArray = [
  {
      name : "Garbiele",
      password : 5555
  },
  {
      name :"Jackie",
      password : 0000
  }
]

const rooms = { }


app.get('/', (req, res) => {
  res.render('./index', { usersArray })
})

app.get('/home', (req, res) => {
  res.render('./home', { rooms })
})

app.get('/blog', (req, res) => {
  res.render('./blog')
})

app.get('/about', function(req, res){
  res.render('./about')
})

// new room
app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/room')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

// existing room
app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/home')
  }
  res.render('room', { roomName: req.params.room })
})

// 404 page redirect
app.get("*", function (req, res) {
  res.status(404).render('./404page')
})

server.listen(port, function () {
  console.log("== Server is listening on port", port)
})

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
    console.log(" Current rooms:",rooms)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
    })
  })

  socket.on('delete', () => {
    getUserRooms(socket).forEach(room => {
      delete rooms[room].users[socket.id]
    })
  })

  socket.on('user-logging-in', (name, password) => {
    if (!usersArray.every(user => user.name !== name)) {
      if(usersArray.find(name).password !== password){
        socket.redirect('/home')
        console.log('succesful log in of: ', name);
      }
    }
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}