const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(join(__dirname, 'client')));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './client/index.html'))
})

io.on('connection', (socket) => { // io controls all the sockets, 1 socket is just 1 connection
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(3000, () => {
    console.log('server listening at http://localhost:3000')
})