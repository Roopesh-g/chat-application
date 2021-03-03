const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const { addUser, removeUser, getUsers, getUsersInRoom } = require('./users.js')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('have a new connection!')

    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room)
        const {error, user} = addUser({ id:socket.id, name, room })
        if(error){
            return callback(error)
        }

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the ${user.room} room`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined.`})
        socket.join(user.room)

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

    })

    socket.on('sendMessage', (message, callback) => {
        // console.log(user)
        const user = getUsers(socket.id)
        io.to(user.room).emit('message', { user: user.name, text: message })
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left the chat.`})
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }        
    })
})


app.use(router)

server.listen(PORT, () => console.log(`Server is running on ${PORT}`))