// src/main.js
// Entry point — imports and initialises all modules.

import './styles/main.css'

import { initLoader, initLoaderBtn } from './modules/loader.js'
import { initCursor    } from './modules/cursor.js'
import { initParticles } from './modules/particles.js'
import { initCountdown } from './modules/countdown.js'
import { initLang      } from './modules/lang.js'
import { initMusic     } from './modules/music.js'
import { initReveal    } from './modules/reveal.js'
import { initSlider    } from './modules/slider.js'
import { initWishes    } from './modules/wishes.js'
import { initRsvp      } from './modules/rsvp.js'

// Run everything as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLoader()
  initLoaderBtn()
  initCursor()
  initParticles()
  initCountdown()
  initLang('kz')
  initMusic()
  initReveal()
  initSlider()
  initWishes()
  initRsvp()
})
