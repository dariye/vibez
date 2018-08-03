const micro = require('micro')
const { send, json } = require('micro')
const cors = require('micro-cors')({ origin: 'http://localhost:54609' })
const { router, get, post }  = require('microrouter')

const server = micro(cors(router(
  get('/', (req, res) => {
    return send(res, 200, 'API Home')
  })
)))

// const io = require('socket.io')(server)
// require('./lib/sonos')(io)

server.listen(4000, () => console.log('Listening on localhost:4000'))


