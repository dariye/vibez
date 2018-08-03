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
    device.currentTrack().then(track => {
      console.log('Got current track %j', track)
    }).catch(err => { console.log('Error occurred %j', err) })

    socket.on('connection', (socket) => {
      const emit = (event, payload = {}) => {
        socket.broadcast.emit(event, { ...payload })
      }

      const getQueue = async () => {
        const [err, queue] = await to(device.getQueue())
        emit('queue', {queue})
      }

      const next = async () => {
        await device.next()
      }

      getQueue()

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

      device.on('CurrentTrack', track => {
        // console.log('Track changed to %s by %s', track.title, track.artist)
        const testData = require('./data')

        const dummy =  {
          "title": "No Problem (feat. Lil Wayne & 2 Chainz)",
          "artist": "Chance the Rapper",
          "album": "Coloring Book",
          "albumArtURI": "http://192.168.0.10:1400/getaa?s=1&u=x-sonos-spotify%3aspotify%253atrack%253a0v9Wz8o0BT8DU38R4ddjeH%3fsid%3d12%26flags%3d8224%26sn%3d1",
          "uri": "x-sonos-spotify:spotify%3atrack%3a0v9Wz8o0BT8DU38R4ddjeH?sid=12&flags=8224&sn=1"
        }
        const musicxmatch = new Musicxmatch();
        musicxmatch.getwithaxios().then(response => {
          const options = {
            algo: 'nlp/ProfanityDetection/1.0.0',
          }
          const algorithmia = new Algorithmia(process.env.ALGO_KEY, options);
          const songLyrics = response.lyrics
          algorithmia.injest([songLyrics, [], false]).then(response => {
            console.log('response', response)
            // run the algo if profane
            // next()
          })
          emit('currentTrack', { track })
      })

      device.on('NextTrack', track => {
        emit('nextTrack', { track })
        getQueue()
      })

      // device.on('Volume', volume => {
      //   // console.log('New Volume %d', volume)
      //   emit('volume', { volume })
      // })

      // device.on('Mute', isMuted => {
      //   // console.log('This speaker is %s.', isMuted ? 'muted' : 'unmuted')
      //   emit('mute', { isMuted })
      // })

      // device.on('PlayState', state => {
      //   // console.log('The state changed to %s.', state)
      //   emit('playState', { state })
      // })

      device.on('AVTransport', transport => {
        // console.log('AVTransport event %j', transport)
        emit('avTransport', { transport })
      })
    })
  })
}



