
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});

const rooms = new Map([
]);

app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : { users: [], messages: [] }

    res.json(obj)

})

app.post('/rooms', (req, res) => {
    const { roomId, userName } = req.body
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }

    res.send()
})

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.to(roomId).emit('ROOM:SET_USERS', users)

    })

    socket.on('ROOM:ADD_NEW_MESSAGE', ({ roomId, userName, text }) => {
        const obj = { userName, text }
        rooms.get(roomId).get('messages').push(obj)
      
        io.in(roomId).emit('ROOM:NEW_MESSAGE', obj)
    
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()]
                socket.to(roomId).emit('ROOM:SET_USERS', users)
            }
        })
    })

})

server.listen(3000, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('server started')
});

