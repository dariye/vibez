const micro = require('micro')
const fs = require('fs')
const path = require('path')

const document = path.join(__dirname, 'index.html')
const html = fs.readFileSync(document)

const server = micro(async (req, res) => {
  console.log('Serving index.html')
  res.end(html)
})

const io = require('socket.io')(server)
require('./lib/sonos')(io)

server.listen(5000, () => console.log('Listening on localhost:4000'))

// const { parse } = require('url')
// const socket = withNamespace('/socket.io')
// const server = micro(cors(router(
//   get('/', (req, res) => {
//     send(res, 200, 'API')
//   }),
  // get('/state', (req, res) => {
  //   console.log('state')
  // }),
  // get('/queue', (req, res) => {
  //   console.log('current queue')
  // }),
  // get('/track', (req, res) => {
  //   console.log('current track')
  // }),
  // get('/volume', (req, res) => {
  //   console.log('current track')
  // }),
  // put('/next', (req, res) => {
  //   console.log('current')
  // }),
  // put('/previous', (req, res) => {
  //   console.log('previous')
  // }),
  // put('/play', (req, res) => {
  //   console.log('play')
  // }),
  // put('/stop', (req, res) => {
  //   console.log('stop')
  // }),
  // put('/mute', (req, res) => {
  //   console.log('mute')
  // }),
  // put('/unmute', (req, res) => {
  //   console.log('unmute')
  // }),
  // io(
  //   get('/', (req, res) => {
  //     const { pathname } = parse(req.url)
  //     console.log(pathname)
  //   })
  // )
// )))

// const io = require('socket.io-client')('http://localhost:62425')
// require('./lib/sonos')(io)
// server.listen(4000, () => console.log('Listening on localhost:4000'))


