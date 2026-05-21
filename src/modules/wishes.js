// src/modules/wishes.js
// Wishes are stored in-memory for now.
// To persist: replace the `wishes` array with a fetch() to your backend / Google Sheets.

import { getLang } from './lang.js'

const SEED_WISHES = [
  { name: 'Айгерім',   text: 'Адия, сен ең жақсы! Бақытты бол, ару қыз 🌸' },
  { name: 'Дмитрий',   text: 'Поздравляем! Пусть новая жизнь будет полна радости и любви 💐' },
]

let wishes = [...SEED_WISHES]

function createCard({ name, text }) {
  const card = document.createElement('div')
  card.className = 'wish-card'
  card.innerHTML = `
    <p class="wish-card-name">${escHtml(name)}</p>
    <p class="wish-card-text">${escHtml(text)}</p>
  `
  return card
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderFeed(feed) {
  feed.innerHTML = ''
  ;[...wishes].reverse().forEach(w => feed.appendChild(createCard(w)))
}

export function initWishes() {
  const feed       = document.getElementById('wishes-feed')
  const nameInput  = document.getElementById('wish-name')
  const textInput  = document.getElementById('wish-text')
  const submitBtn  = document.getElementById('wish-submit')

  if (!feed || !nameInput || !textInput || !submitBtn) return

  renderFeed(feed)

  submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim()
    const text = textInput.value.trim()
    const lang = getLang()

    if (!name || !text) {
      nameInput.style.borderColor = !name ? 'var(--rose)' : ''
      textInput.style.borderColor = !text ? 'var(--rose)' : ''
      return
    }

    nameInput.style.borderColor = ''
    textInput.style.borderColor = ''

    const wish = { name, text }
    wishes.push(wish)

    // ── Wire to backend here ──────────────────────────────────────────
    // Example: Google Apps Script
    //
    // await fetch('YOUR_APPS_SCRIPT_URL', {
    //   method: 'POST',
    //   mode:   'no-cors',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...wish, timestamp: new Date().toISOString() }),
    // })
    // ─────────────────────────────────────────────────────────────────

    renderFeed(feed)

    nameInput.value = ''
    textInput.value = ''

    // Scroll to the new wish
    feed.firstChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    // Brief button feedback
    const span = submitBtn.querySelector('span')
    const original = span.textContent
    span.textContent = lang === 'kz' ? '✓ Жіберілді!' : '✓ Отправлено!'
    submitBtn.disabled = true
    setTimeout(() => {
      span.textContent   = original
      submitBtn.disabled = false
    }, 2000)
  })

  // Clear red border on type
  nameInput.addEventListener('input', () => { nameInput.style.borderColor = '' })
  textInput.addEventListener('input', () => { textInput.style.borderColor = '' })
}
