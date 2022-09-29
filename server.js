const express = require('express'),
      app = express(),
      server = require('http').createServer(app);
      io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('views'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        io.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId)
        })
    })

    socket.on('console', stuff => console.log(stuff))
})

server.listen(5000)