/*
 * Sonos controller
 * https://github.com/bencevans/node-sonos/blob/master/docs/sonos.md
 * Methods
 * - next()
 * - selectTack()
 * - seek()
 * - pause()
 * - paly()
 * - stop()
 * - 
 */

const { Sonos, DeviceDiscovery } = require('sonos')
const socket = require('socket.io-client')('http://localhost:54609')

module.exports = (server) => {
  DeviceDiscovery((device) => {
    console.log('found device at ' + device.host)
    device.play()
      .then(() => console.log('now playing'))

    device.getVolume()
      .then((volume) => console.log(`current volume = ${volume}`))

    device.setMuted(false)
        .then(`${device.host} now muted`)

    device.getQueue().then(result => {
      console.log('Current queue: %s', JSON.stringify(result, null, 2))
    }).catch(err => {
      console.log('Error fetch queue %j', err)
    })

    device.currentTrack().then(track => {
      console.log('Got current track %j', track)
    }).catch(err => { console.log('Error occurred %j', err) })

    socket.on('connection', (socket) => {

      const emit = (event, payload = {}) => {
        socket.broadcast.emit(event, { ...payload })
      }

      device.on('CurrentTrack', track => {
        console.log('Track changed to %s by %s', track.title, track.artist)
        emit('currentTrack', { track })
      })

      device.on('NextTrack', track => {
        console.log('The next track will be %s by %s', track.title, track.artist)
        emit('nextTrack', { track })
      })

      device.on('Volume', volume => {
        console.log('New Volume %d', volume)
      })

      device.on('Mute', isMuted => {
        console.log('This speaker is %s.', isMuted ? 'muted' : 'unmuted')
      })

      device.on('PlayState', state => {
        console.log('The state changed to %s.', state)
      })

      device.on('AVTransport', transport => {
        console.log('AVTransport event %j', transport)
      })
    })
  })
}



// class SonosModule {
//   constructor(device) {
//     this._device = device
//     this._events = [
//       'CurrentTrack',
//       'NextTrack',
//       'Volume',
//       'Mute',
//       'PlayState',
//       'AVTransport',
//       'PlayState',
//       'PlaybackStopped',
//       'RenderingControl'
//     ]
//
//     // this._events.forEach((event) =>
//     //   this._device.on(`${event}`, (e) => this.emitEvent(e)))
//   }
//
//   set device(device) {
//     if (!device.host && !device.port)
//       throw new Error(`Device must have 'host' and 'port'`)
//     this._device = device
//   }
//
//   get device() {
//     return this._device
//   }
//
//   async play() {
//     const [err, data] = await to(this._device.play())
//     if (err) throw new Error(err)
//     return data
//   }
//
//   async getVolume() {
//     const [err, data] = await to(this._device.getVolume())
//     if (err) throw new Error(err)
//     return data
//   }
//
//   async setVolume(volume) {
//     const [err, data] = await to(this._device.setVolume(volume))
//     if (err) throw new Error(err)
//     return data
//   }
//
//   async setMuted(muted) {
//     const [err, data] = await to(this._device.setMuted(muted))
//     if (err) throw new Error(err)
//     return data
//   }
//
//   async getQueue() {
//     const [err, data] = await to(this._device.getQueue())
//     if (err) throw new Error(err)
//     return data
//   }
//
//   async getCurrentTrack() {
//     const [err, data] = await to(this._device.getCurrentTrack())
//     if (err) throw new Error(err)
//     return data
//   }
//
//   emitEvent (e) {
//     console.log(e)
//   }
// }
//


