// src/modules/rsvp.js

import { getLang } from './lang.js'

// ── Replace with your deployed Google Apps Script URL ──────────────────────
// How to get this URL:
//  1. Open script.google.com → New project → paste the doPost() code below
//  2. Deploy → New deployment → Web App → Execute as: Me → Anyone
//  3. Copy the URL and paste it here
const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'

// Google Apps Script code (paste into your Apps Script project):
//
// function doPost(e) {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
//   const data  = JSON.parse(e.postData.contents)
//   sheet.appendRow([
//     data.timestamp,
//     data.name,
//     data.phone,
//     data.guests,
//     data.attendance,
//   ])
//   return ContentService
//     .createTextOutput(JSON.stringify({ ok: true }))
//     .setMimeType(ContentService.MimeType.JSON)
// }
// ──────────────────────────────────────────────────────────────────────────

const ATT_LABELS = {
  ru: { coming: 'Приду',  pair: 'С парой', no: 'Не смогу' },
  kz: { coming: 'Келемін', pair: 'Жұппен', no: 'Келе алмаймын' },
}

let selectedAtt = ''

export function initRsvp() {
  const form    = document.getElementById('rsvp-form')
  const okDiv   = document.getElementById('rsvp-ok')
  const subBtn  = document.getElementById('sub-btn')

  if (!form) return

  // Choice buttons
  document.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.choice').forEach(b => b.classList.remove('sel'))
      btn.classList.add('sel')
      selectedAtt = btn.dataset.val
      document.getElementById('fg-att').classList.remove('err')
    })
  })

  // Clear error on input
  const clearErr = (fieldId, fgId) => {
    const el = document.getElementById(fieldId)
    if (el) el.addEventListener('input', () => {
      document.getElementById(fgId)?.classList.remove('err')
    })
  }
  clearErr('f-name',  'fg-name')
  clearErr('f-phone', 'fg-phone')

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const name  = document.getElementById('f-name').value.trim()
    const phone = document.getElementById('f-phone').value.trim()
    const lang  = getLang()
    let valid   = true

    document.getElementById('fg-name').classList.toggle('err', !name)
    document.getElementById('fg-phone').classList.toggle('err', !phone)
    document.getElementById('fg-att').classList.toggle('err', !selectedAtt)

    if (!name || !phone || !selectedAtt) valid = false
    if (!valid) return

    subBtn.disabled = true
    subBtn.querySelector('span').textContent =
      lang === 'kz' ? 'Жіберілуде…' : 'Отправляем…'

    const payload = {
      name,
      phone,
      guests:     document.getElementById('f-guests').value,
      attendance: ATT_LABELS[lang][selectedAtt],
      timestamp:  new Date().toISOString(),
    }

    try {
      // ── Send to Google Sheets ──────────────────────────────────────
      // Uncomment after deploying your Apps Script:
      //
      // await fetch(SHEET_URL, {
      //   method:  'POST',
      //   mode:    'no-cors',
      //   headers: { 'Content-Type': 'application/json' },
      //   body:    JSON.stringify(payload),
      // })
      // ──────────────────────────────────────────────────────────────

      // Simulate network delay in dev
      await new Promise(r => setTimeout(r, 800))

      form.hidden  = true
      okDiv.hidden = false

      document.getElementById('ok-ttl').textContent = 'Рақмет!'
      document.getElementById('ok-msg').textContent =
        selectedAtt === 'no'
          ? (lang === 'kz'
              ? `${name}, жауабыңыз үшін рақмет 💌`
              : `${name}, спасибо за ответ 💌`)
          : (lang === 'kz'
              ? `${name}, 22 тамызда күтеміз! 🌸`
              : `${name}, ждём вас 22 августа! 🌸`)

    } catch {
      subBtn.disabled = false
      subBtn.querySelector('span').textContent =
        lang === 'kz' ? 'Қайта жіберу' : 'Попробовать снова'
    }
  })
}
