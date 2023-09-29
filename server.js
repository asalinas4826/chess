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

let socket_pairs = [[]]

io.on('connection', (socket) => { // io controls all the sockets, 1 socket is just 1 connection
    console.log('a user connected')
    let pairFound = lookForPair(socket, socket_pairs)
    if (pairFound.length === 2) {
        pairFound[0].join("Room_" + pairFound[0].id)
        pairFound[1].join("Room_" + pairFound[0].id)
        console.log('\nyay\n')
        gamePipe("Room_" + pairFound[0].id, pairFound)
    } else {
        console.log('\nnay\n')
    }

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(3000, () => {
    console.log('server listening at http://localhost:3000')
})

function gamePipe(roomNum, pair) {
    pair.forEach(socket => {
        socket.emit('game start', pair.findIndex(elem => elem.id === socket.id), roomNum)
        socket.on('player move', (roomId, to, from, turn) => {
            io.to(roomId).emit('opponent move', to, from, turn)
        })
    })
}


function lookForPair(socket, socket_pairs) {
    let open_pair = socket_pairs.find((pair) => pair.length < 2)

    if (open_pair.length >= 2) {
        socket_pairs.push([socket])
        return socket_pairs.at(socket_pairs.length - 1)
    }
    open_pair.push(socket)
    if (open_pair.length === 2) {
        socket_pairs.push([])
        return open_pair
    }
    return 0
}

// users connect, server puts users into pairs