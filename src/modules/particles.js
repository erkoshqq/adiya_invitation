// src/modules/particles.js

const COLORS = [
  'rgba(110, 135, 156, 0.30)',
  'rgba(212, 168, 152, 0.28)',
  'rgba(200, 170, 130, 0.22)',
]

function makeParticle(canvasW, canvasH, randomY = false) {
  return {
    x:   Math.random() * canvasW,
    y:   randomY ? Math.random() * canvasH : canvasH + 10,
    r:   1 + Math.random() * 2.5,
    vx:  (Math.random() - 0.5) * 0.25,
    vy:  -(0.12 + Math.random() * 0.28),
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
    o:   0.25 + Math.random() * 0.45,
  }
}

export function initParticles() {
  const canvas = document.getElementById('particles-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const COUNT = 24

  function resize() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Seed particles spread across the screen on load
  const particles = Array.from({ length: COUNT }, () =>
    makeParticle(canvas.width, canvas.height, true)
  )

  ;(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.vx + Math.sin(p.y * 0.007) * 0.18
      p.y += p.vy

      // Recycle off-screen particles
      if (p.y < -10) {
        Object.assign(p, makeParticle(canvas.width, canvas.height, false))
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.col
      ctx.globalAlpha = p.o
      ctx.fill()
      ctx.globalAlpha = 1
    })

    requestAnimationFrame(draw)
  })()
}
