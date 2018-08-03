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
const to = require('../utils/to')
// const socket = require('socket.io-client')('http://localhost:54609')

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

      device.getQueue().then(queue => {
        emit('currentQueue', { queue })
      }).catch(err => {
        console.log('Error fetch queue %j', err)
      })

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
        // console.log('The next track will be %s by %s', track.title, track.artist)
        emit('nextTrack', { track })
      })

      device.on('Volume', volume => {
        // console.log('New Volume %d', volume)
        emit('volume', { volume })
      })

      device.on('Mute', isMuted => {
        // console.log('This speaker is %s.', isMuted ? 'muted' : 'unmuted')
        emit('mute', { isMuted })
      })

      device.on('PlayState', state => {
        // console.log('The state changed to %s.', state)
        emit('playState', { state })
      })

      device.on('AVTransport', transport => {
        // console.log('AVTransport event %j', transport)
        emit('avTransport', { transport })
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


