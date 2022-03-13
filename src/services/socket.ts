const io = require('socket.io-client')

const URL = 'http://localhost:3100'
const socket = io(URL)

socket.on('connect', () => {
  console.info('Socket connected')
})

socket.on('disconnect', () => {
  console.info('Socket disconnected')
})

socket.on('connect_error', (err: any) => {
  console.error('Connection error\n', err)
})

export default socket