// src/modules/reveal.js

export function initReveal() {
  const elements = document.querySelectorAll('.reveal')
  if (!elements.length) return

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // Unobserve after reveal — no need to watch anymore
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )

  elements.forEach(el => observer.observe(el))
}
