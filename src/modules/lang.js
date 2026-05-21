// src/modules/lang.js

let currentLang = 'kz'

const FOOTER = {
  ru: {
    phrase: 'Будем счастливы разделить этот день вместе с вами.',
    sub:    '',
  },
  kz: {
    phrase: 'Қуанышымыздың куәсі болыңыздар!',
    sub:    '',
  },
}

export function getLang() {
  return currentLang
}

export function setLang(lang) {
  currentLang = lang

  // Toggle active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang)
  })

  // Swap text nodes for [data-ru] / [data-kz]
  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    const val = el.dataset[lang]
    if (!val) return

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.dataset[`${lang}Placeholder`] || val
    } else if (el.tagName === 'OPTION') {
      el.textContent = val
    } else {
      // Allow inline HTML (e.g. <em> tags inside headings)
      el.innerHTML = val
    }
  })

  // Swap placeholder attributes stored as data-ru-placeholder / data-kz-placeholder
  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
    el.placeholder = el.dataset[`${lang}Placeholder`]
  })

  // Invitation paragraphs
  const itextRu = document.getElementById('itext-ru')
  const itextKz = document.getElementById('itext-kz')
  if (itextRu) itextRu.hidden = (lang !== 'ru')
  if (itextKz) itextKz.hidden = (lang !== 'kz')

  // Footer phrases
  const fp1 = document.getElementById('fp1')
  const fp2 = document.getElementById('fp2')
  if (fp1) fp1.textContent = FOOTER[lang].phrase
  if (fp2) fp2.textContent = FOOTER[lang].sub
}

export function initLang(defaultLang = 'kz') {
  currentLang = defaultLang
  setLang(defaultLang)  // применяем сразу при старте

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  })
}
