require('dotenv').config();
const MusixmatchSDK = require('musixmatch-node-sdk');
const MXMUtil = MusixmatchSDK.Util;
const MXMLogger = MusixmatchSDK.Logger;
const MXMAPI = MusixmatchSDK.API;
MXMLogger.setLevel(MXMLogger.LEVEL_INFO);
const request = require('request')
const axios = require('axios')

const testData = require('./data')
class GetSongLyrics {
  constructor() {
    this.queue = testData // to be changed to data coming from sonos
  }
  async getwithaxios() {
    const songLyricsArray = this.queue.map(async songObj => {
      const response = await axios.get('https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', {
        params: {
          q_track: songObj.title, 
          q_artist: songObj.artist, 
          apikey: process.env.MUSIXMATCH_API_KEY
        }
      })
      const body = response.data;
      const lyrics = body.message.body.lyrics.lyrics_body
      const obj = { ...songObj, lyrics}
      return obj;
    })
    const results = await Promise.all(songLyricsArray);
    return results;
  }

  async getSongIdAndLyrics() {
    const songLyricsArray = [];
    let songLyrics = {}
    const songObj = this.queue;
    const input = {q_track: songObj.title, q_artist: songObj.artist, apikey: process.env.MUSIXMATCH_API_KEY};
    await request.get({
      url: 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', 
      qs: input, 
      jsonP: true},
      (error, response) => {
      const body = JSON.parse(response.body)
      const lyrics = body.message.body.lyrics.lyrics_body
      console.log('lyrics', lyrics)
      return lyrics;
    });
  }

  async getMatcherTrack(input) {
    request.get({
      url: 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get', 
      qs:input, 
      jsonP:true},
      (error, response) => {
      return response.body.lyrics_body;
    });
  }

  getTrackId(songObj) {
    MXMAPI.GetAPISearchTrack(songObj, function(results) {
      MXMLogger.info('results:', results)
    })
  }

  getSongLyrics(trackId) {
    console.log('getSongLyrics')
    const params = {
      track_id: trackId // 15445219
    }
    MXMAPI.GetAPILyricsP(params,
      function(result) {
        MXMLogger.info('result:', result)
        if(result.track) { // track found
          const track = result.track;
        }
      },
      function(error) {
        passed(false);
    });
  }

}

const getSongLyrics = new GetSongLyrics()
getSongLyrics.getwithaxios().then(response => {
  console.log(response);
})

module.exports = {
  getSongLyrics
}