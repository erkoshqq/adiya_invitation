// src/modules/music.js

export function initMusic() {
  const audio   = document.getElementById('bg-audio')
  const btn     = document.getElementById('music-btn')
  const icPlay  = document.getElementById('ic-play')
  const icPause = document.getElementById('ic-pause')

  if (!audio || !btn) return

  let playing = false
  let started = false

  function setPlaying(state) {
    playing = state
    icPlay.hidden  =  state
    icPause.hidden = !state
    btn.classList.toggle('playing', state)
  }

  async function start() {
    try {
      audio.volume = 0.4
      await audio.play()
      started = true
      setPlaying(true)
    } catch {
      // Browser blocked autoplay — user will click manually
    }
  }

  btn.addEventListener('click', () => {
    if (!started) {
      start()
    } else if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  })

  // Try to autoplay on first user gesture anywhere on the page
  function onFirstGesture() {
    if (!started) start()
    document.removeEventListener('click',     onFirstGesture)
    document.removeEventListener('touchstart', onFirstGesture)
    document.removeEventListener('keydown',   onFirstGesture)
  }

  document.addEventListener('click',     onFirstGesture)
  document.addEventListener('touchstart', onFirstGesture)
  document.addEventListener('keydown',   onFirstGesture)
}
