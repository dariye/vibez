class musicPlayer {
  constructor() {
    this.play = this.play.bind(this);
    this.playBtn = document.getElementById('play');
    this.playBtn.addEventListener('click', this.play);
    this.controlPanel = document.getElementById('control-panel');
    this.infoBar = document.getElementById('info');
  }

  play() {
    let controlPanelObj = this.controlPanel,
    infoBarObj = this.infoBar
    Array.from(controlPanelObj.classList).find(function(element){
          return element !== "active" ? controlPanelObj.classList.add('active') : 		controlPanelObj.classList.remove('active');
      });

    Array.from(infoBarObj.classList).find(function(element){
          return element !== "active" ? infoBarObj.classList.add('active') : 		infoBarObj.classList.remove('active');
      });
  }
}

(function () {
  const newMusicplayer = new musicPlayer();
  const socket = io()
  const nextBtn = document.getElementById('next')
  nextBtn.addEventListener('click', () => {
    socket.emit('next')
  })
  const prevBtn = document.getElementById('prev')
  prevBtn.addEventListener('click', () => {
    socket.emit('prev')
  })
  const playBtn = document.getElementById('play')
  playBtn.addEventListener('click', () => {
    socket.emit('togglePlay')
  })
  const select = document.getElementById('preferences')
  select.addEventListener('change', () => {
    const rating = select.value
    if (rating !== 'PG' || rating !== 'R') return
    emit('rating', { rating })
  })
  socket.on('prev', ({ track }) => {})
  socket.on('next', ({ track }) => {})
  socket.on('togglePlay', ({ track }) => {})
  socket.on('rating', ({ rating }) => {
    select.value = rating
  })
  socket.on('playMode', ({ mode }) => {
    console.log(mode)
  })
})()

