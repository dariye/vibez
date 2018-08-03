const { Sonos, DeviceDiscovery } = require('sonos')
const to = require('../utils/to')
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

      getQueue()

      socket.on('togglePlay', async () => {
        const [err, data] = await to(device.getCurrentState())
        data === 'playing' ? await device.stop() : await device.play()
      })

      socket.on('previous', async () => {
        await device.previous()
      })

      socket.on('next', async () => {
        await device.previous()
      })

      device.on('CurrentTrack', track => {
        // console.log('Track changed to %s by %s', track.title, track.artist)
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



