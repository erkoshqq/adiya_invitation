// src/modules/rsvp.js

import { getLang } from './lang.js'

const SHEET_URL = import.meta.env.VITE_SHEET_URL

const ATT_LABELS = {
  ru: { coming: 'Приду',    pair: 'С парой',  no: 'Не смогу'        },
  kz: { coming: 'Келемін', pair: 'Жұппен',   no: 'Келе алмаймын'  },
}

let selectedAtt = ''

async function fetchRsvpCount() {
  try {
    const res  = await fetch(`${SHEET_URL}?sheet=rsvp`)
    const data = await res.json()
    // Считаем только тех кто придёт
    return data.filter(r =>
      r.attendance && !r.attendance.match(/алмаймын|Не смогу/i)
    ).length
  } catch {
    return null
  }
}

function animateCount(el, target) {
  const start    = 0
  const duration = 1200
  const startTime = performance.now()

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1)
    // Ease out
    const value = Math.round(start + (target - start) * (1 - Math.pow(1 - progress, 3)))
    el.textContent = value
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function initCounter() {
  const numEl = document.getElementById('rsvp-count')
  if (!numEl) return

  fetchRsvpCount().then(count => {
    if (count === null) return
    animateCount(numEl, count)
  })
}

export function initRsvp() {
  const form   = document.getElementById('rsvp-form')
  const okDiv  = document.getElementById('rsvp-ok')
  const subBtn = document.getElementById('sub-btn')
  if (!form) return

  // Выбор варианта
  document.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.choice').forEach(b => b.classList.remove('sel'))
      btn.classList.add('sel')
      selectedAtt = btn.dataset.val
      document.getElementById('fg-att').classList.remove('err')
    })
  })

  document.getElementById('f-name')?.addEventListener('input', () => {
    document.getElementById('fg-name').classList.remove('err')
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const name = document.getElementById('f-name').value.trim()
    const lang = getLang()
    let valid  = true

    document.getElementById('fg-name').classList.toggle('err', !name)
    document.getElementById('fg-att').classList.toggle('err', !selectedAtt)
    if (!name || !selectedAtt) valid = false
    if (!valid) return

    subBtn.disabled = true
    subBtn.querySelector('span').textContent =
      lang === 'kz' ? 'Жіберілуде…' : 'Отправляем…'

    const payload = {
      sheet:      'rsvp',
      name,
      attendance: ATT_LABELS[lang][selectedAtt],
      timestamp:  new Date().toISOString(),
    }

    try {
      await fetch(SHEET_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })

      form.hidden  = true
      okDiv.hidden = false

      // После form.hidden = true, okDiv.hidden = false
      const numEl = document.getElementById('rsvp-count')
      if (numEl && selectedAtt !== 'no') {
        const current = parseInt(numEl.textContent) || 0
        const next    = current + 1
        animateCount(numEl, next)
        // Лёгкий bounce
        numEl.classList.add('bump')
        setTimeout(() => numEl.classList.remove('bump'), 400)
      }

      document.getElementById('ok-ttl').textContent = 'Рақмет!'
      document.getElementById('ok-msg').textContent =
        selectedAtt === 'no'
          ? (lang === 'kz' ? `${name}, жауабыңыз үшін рақмет 💌` : `${name}, спасибо за ответ 💌`)
          : (lang === 'kz' ? `${name}, 22 тамызда күтеміз! 🌸`   : `${name}, ждём вас 22 августа! 🌸`)

    } catch {
      subBtn.disabled = false
      subBtn.querySelector('span').textContent =
        lang === 'kz' ? 'Қайта жіберу' : 'Попробовать снова'
    }
  })
  initCounter()
}