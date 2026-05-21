// src/modules/slider.js
// Auto-advancing image slider with swipe, arrows, dots, progress bar.
//
// To add more photos:
//   1. Put the files in public/assets/  (e.g. adiya-2.jpg, adiya-3.jpg)
//   2. Add a <div class="slide"><img src="/assets/adiya-2.jpg" /></div>
//      inside #slider-track in index.html

const AUTOPLAY_MS = 4000   // ms per slide
const ANIM_MS     = 720    // must match CSS transition duration

export function initSlider() {
  const track    = document.getElementById('slider-track')
  const dotsWrap = document.getElementById('slider-dots')
  const prevBtn  = document.getElementById('slider-prev')
  const nextBtn  = document.getElementById('slider-next')
  const bar      = document.getElementById('slider-progress-bar')

  if (!track) return

  const slides = Array.from(track.querySelectorAll('.slide'))
  const total  = slides.length
  if (total < 2) {
    // Hide controls when only one photo
    prevBtn?.remove()
    nextBtn?.remove()
    dotsWrap?.remove()
    return
  }

  let current   = 0
  let autoTimer = null
  let progTimer = null
  let isAnimating = false

  // ── Build dots ──────────────────────────────────────────────────────
  slides.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className   = 'slider-dot' + (i === 0 ? ' active' : '')
    dot.setAttribute('aria-label', `Слайд ${i + 1}`)
    dot.addEventListener('click', () => goTo(i))
    dotsWrap.appendChild(dot)
  })

  function getDots() {
    return Array.from(dotsWrap.querySelectorAll('.slider-dot'))
  }

  // ── Core: go to slide ───────────────────────────────────────────────
  function goTo(index, immediate = false) {
    if (isAnimating && !immediate) return
    isAnimating = true

    current = ((index % total) + total) % total   // wrap around

    // Move track
    track.style.transition = immediate
      ? 'none'
      : `transform ${ANIM_MS}ms cubic-bezier(.77,0,.18,1)`
    track.style.transform = `translateX(-${current * 100}%)`

    // Update dots
    getDots().forEach((d, i) => d.classList.toggle('active', i === current))

    setTimeout(() => { isAnimating = false }, immediate ? 0 : ANIM_MS)

    // Restart progress bar
    startProgress()
  }

  function next() { goTo(current + 1) }
  function prev() { goTo(current - 1) }

  // ── Progress bar ────────────────────────────────────────────────────
  function startProgress() {
    clearTimeout(progTimer)

    // Reset bar instantly, then animate
    bar.style.transition = 'none'
    bar.style.width      = '0%'

    // Force reflow so the reset is painted before we start the animation
    bar.getBoundingClientRect()

    bar.style.transition = `width ${AUTOPLAY_MS}ms linear`
    bar.style.width      = '100%'
  }

  // ── Autoplay ─────────────────────────────────────────────────────────
  function startAutoplay() {
    stopAutoplay()
    autoTimer = setInterval(next, AUTOPLAY_MS)
    startProgress()
  }
  function stopAutoplay() {
    clearInterval(autoTimer)
    clearTimeout(progTimer)
    bar.style.transition = 'none'
    bar.style.width      = '0%'
  }

  // ── Arrow buttons ───────────────────────────────────────────────────
  prevBtn?.addEventListener('click', () => { stopAutoplay(); prev(); startAutoplay() })
  nextBtn?.addEventListener('click', () => { stopAutoplay(); next(); startAutoplay() })

  // ── Touch / swipe ───────────────────────────────────────────────────
  let touchStartX = 0
  let touchStartY = 0
  let isDragging  = false

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    isDragging  = true
  }, { passive: true })

  track.addEventListener('touchmove', e => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - touchStartX
    const dy = e.touches[0].clientY - touchStartY
    // Cancel if scrolling vertically
    if (Math.abs(dy) > Math.abs(dx)) { isDragging = false }
  }, { passive: true })

  track.addEventListener('touchend', e => {
    if (!isDragging) return
    isDragging = false
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) < 40) return   // Too short — ignore
    stopAutoplay()
    dx < 0 ? next() : prev()
    startAutoplay()
  })

  // ── Mouse drag (desktop) ────────────────────────────────────────────
  let mouseStartX = 0
  let mouseDown   = false

  track.addEventListener('mousedown', e => {
    mouseStartX = e.clientX
    mouseDown   = true
    track.style.cursor = 'grabbing'
  })
  window.addEventListener('mousemove', e => {
    if (!mouseDown) return
    // Optional: live drag preview here
  })
  window.addEventListener('mouseup', e => {
    if (!mouseDown) return
    mouseDown = false
    track.style.cursor = ''
    const dx = e.clientX - mouseStartX
    if (Math.abs(dx) < 40) return
    stopAutoplay()
    dx < 0 ? next() : prev()
    startAutoplay()
  })

  // ── Pause on hover ──────────────────────────────────────────────────
  const wrap = track.closest('.slider-wrap')
  wrap?.addEventListener('mouseenter', stopAutoplay)
  wrap?.addEventListener('mouseleave', startAutoplay)

  // ── Pause when tab is hidden ────────────────────────────────────────
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay()
  })

  // ── Keyboard (when slider is focused) ──────────────────────────────
  wrap?.setAttribute('tabindex', '0')
  wrap?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { stopAutoplay(); prev(); startAutoplay() }
    if (e.key === 'ArrowRight') { stopAutoplay(); next(); startAutoplay() }
  })

  // ── Init ─────────────────────────────────────────────────────────────
  goTo(0, true)
  startAutoplay()
}
