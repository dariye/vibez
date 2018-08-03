const micro = require('micro')
const fs = require('fs')
const path = require('path')
const handler = require('serve-handler');
const http = require('http');

const server = http.createServer(async (request, response) => {
  await handler(request, response, {
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false
  })
})

const io = require('socket.io')(server)
require('./lib/sonos')(io)

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
})

