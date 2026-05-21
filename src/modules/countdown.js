// src/modules/countdown.js

const WEDDING_DATE = new Date('2026-08-22T13:00:00')

function pad(n) {
  return String(n).padStart(2, '0')
}

export function initCountdown() {
  const els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  }

  if (!els.d) return

  function tick() {
    const diff = WEDDING_DATE - new Date()

    if (diff <= 0) {
      Object.values(els).forEach(el => { el.textContent = '00' })
      return
    }

    els.d.textContent = pad(Math.floor(diff / 86_400_000))
    els.h.textContent = pad(Math.floor(diff % 86_400_000 / 3_600_000))
    els.m.textContent = pad(Math.floor(diff % 3_600_000  /    60_000))
    els.s.textContent = pad(Math.floor(diff %    60_000  /     1_000))
  }

  tick()
  setInterval(tick, 1000)
}
