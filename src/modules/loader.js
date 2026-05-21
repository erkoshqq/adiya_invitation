// src/modules/loader.js

export function initLoader() {
  const loader = document.getElementById('loader')
  if (!loader) return

  setTimeout(() => {
    const btn = loader.querySelector('.loader-btn')
    if (btn) btn.classList.add('visible')
  }, 1600)
}

export function initLoaderBtn() {
  const loader   = document.getElementById('loader')
  const btn      = document.getElementById('loader-btn')
  const audio    = document.getElementById('bg-audio')
  if (!loader || !btn) return

  const startAll = () => {
    // Сбрасываем скролл наверх
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    loader.classList.add('hidden')

    if (audio) {
      audio.volume = 0.4
      audio.play().catch(() => {})
    }

    const icPlay   = document.getElementById('ic-play')
    const icPause  = document.getElementById('ic-pause')
    const musicBtn = document.getElementById('music-btn')
    if (icPlay)   icPlay.hidden  = true
    if (icPause)  icPause.hidden = false
    if (musicBtn) musicBtn.classList.add('playing')

    setTimeout(runScroll, 600)
  }

  btn.addEventListener('click',    startAll)
  btn.addEventListener('touchend', (e) => { e.preventDefault(); startAll() })
}

function runScroll() {
  let rafId
  let lastTime = null
  let stopped  = false
  const SPEED  = 60

  const stop = () => {
    stopped = true
    cancelAnimationFrame(rafId)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('mousedown',  stop)
  }

  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('mousedown',  stop)

  function step(timestamp) {
    if (stopped) return

    if (!lastTime) {
      lastTime = timestamp
      rafId = requestAnimationFrame(step)
      return
    }

    // Ограничиваем delta сверху — не больше одного кадра при 30fps
    const delta = Math.min(timestamp - lastTime, 32)
    lastTime = timestamp

    window.scrollBy(0, SPEED * delta / 1000)

    const atBottom =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 2

    if (atBottom) return

    rafId = requestAnimationFrame(step)
  }

  rafId = requestAnimationFrame(step)
}