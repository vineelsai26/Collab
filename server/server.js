const port = process.env.PORT || 5000
const io = require('socket.io')(port, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    const id = socket.handshake.query.id
    socket.join(id)
    socket.on('send', ({ message }) => {
        socket.to(id).emit('receive', { message })
    })
    socket.on('join', () => {
        socket.to(id).emit('join')
    })
    socket.on('disconnect', () => {
        socket.to(id).emit('userLeft')
    })
})
