require('dotenv').config();
const MusixmatchSDK = require('musixmatch-node-sdk');
const MXMUtil = MusixmatchSDK.Util;
const MXMLogger = MusixmatchSDK.Logger;
const MXMAPI = MusixmatchSDK.API;
MXMLogger.setLevel(MXMLogger.LEVEL_INFO);

class GetSongLyrics {
  constructor() {
    MXMLogger.setLevel(MXMLogger.LEVEL_INFO);
    MXMAPI.init({ 
      apiKey: process.env.MUSIXMATCH_API_KEY,
      logger : MXMLogger, 
      debug : false, 
      persistentCache : true, 
      memCache : false, 
      cacheFolderPath : './cache/' 
    }).then((result) => {
      MXMLogger.info('done initializing')
    })
    .catch(error => {
      MXMLogger.error("API error %@", error);
    });
  }

  async getSongIdAndLyrics() {
    const songLyricsArray = [];
    const songLyrics = await this.queue.map((songObj) => {
      const input = {q_track: songObj.title, q_artist: songObj.artist, apikey: process.env.MUSIXMATCH_API_KEY};
      const trackId = this.getTrackId(input);
      return this.getSongLyrics(trackId);  
    })
    songLyricsArray.push(songLyricsArray);
    return
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
getSongLyrics.getSongIdAndLyrics()

module.exports = {
  getSongLyrics
}