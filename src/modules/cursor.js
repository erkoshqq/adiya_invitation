// src/modules/cursor.js

export function initCursor() {
  const cur  = document.getElementById('cur')
  const ring = document.getElementById('cur-r')

  if (!cur || !ring) return

  // Hide on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cur.style.display  = 'none'
    ring.style.display = 'none'
    document.body.style.cursor = 'auto'
    return
  }

  let mx = -200, my = -200
  let rx = -200, ry = -200

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
  })

  ;(function animate() {
    cur.style.left = mx + 'px'
    cur.style.top  = my + 'px'

    rx += (mx - rx) * 0.16
    ry += (my - ry) * 0.16
    ring.style.left = rx + 'px'
    ring.style.top  = ry + 'px'

    requestAnimationFrame(animate)
  })()

  // Scale on interactive elements
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.transform  = 'translate(-50%, -50%) scale(0.5)'
      ring.style.transform = 'translate(-50%, -50%) scale(1.6)'
    })
    el.addEventListener('mouseleave', () => {
      cur.style.transform  = 'translate(-50%, -50%) scale(1)'
      ring.style.transform = 'translate(-50%, -50%) scale(1)'
    })
  })
}
