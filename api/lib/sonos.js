const { Sonos, DeviceDiscovery } = require('sonos')
const to = require('../utils/to')
const Musicxmatch = require('./musicxmatch');
const Algorithmia = require('./algorithmia');
require('dotenv').config();


module.exports = (socket) => {
  DeviceDiscovery((device) => {
    console.log('found device at ' + device.host)

    device.getName().then(name => {
      console.log(name)
    })

    let contentRating = 'PG'

    async function next () {
      await device.next()
    }

    async function getCurrentTrack () {
      const track = await device.currentTrack()
      console.log(`current track: ${track.title}`)
      const musicxmatch = new Musicxmatch(track);
      musicxmatch.getSongIdAndLyrics().then(async (response) => {
        const options = {
          algo: 'nlp/ProfanityDetection/1.0.0',
        }
        const algorithmia = new Algorithmia(process.env.ALGO_KEY, options);
        const profaneWords = await algorithmia.injest([response, [], false])
        if (Object.keys(profaneWords).length > 0 && contentRating !== 'R') {
          console.log(`Track with title: '${track.title}' has the following profane words: ${Object.keys(profaneWords)}`)
          console.log(`Skipping because rating is: ${contentRating}.`)
          await next()
        }
      })
    }

    socket.on('connection', (socket) => {
      const emit = (event, payload = {}) => {
        socket.broadcast.emit(event, { ...payload })
      }

      const getPlayMode = async () => {
        const [err, mode] = await to(device.getPlayMode())
        console.log(mode)
        emit('playMode', {mode})
      }

      socket.on('togglePlay', async () => {
        const [err, data] = await to(device.getCurrentState())
        data === 'playing' ? await device.stop() : await device.play()
      })

      socket.on('previous', async () => {
        await device.previous()
      })

      socket.on('next', async () => {
        await device.next()
      })

      socket.on('rating', async ({ rating }) => {
        console.log(`rating updated: ${rating}`)
        contentRating = rating
        getCurrentTrack()
      })

      device.on('PlayState', (mode) => {
        emit('playMode', {mode})
      })

      getCurrentTrack()
      setInterval(() => { getCurrentTrack() }, 3000)
    })
  })
}



