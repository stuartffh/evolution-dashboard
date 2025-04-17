export default function initMainScripts() {
  const safeRun = (callback) => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        try {
          callback()
        } catch (e) {
          console.warn('Erro ao executar script customizado:', e)
        }
      })
    }
  }

  safeRun(() => {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        const targetId = link.getAttribute('href')
        const target = document.querySelector(targetId)
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      })

      link.addEventListener('click', function () {
        document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'))
        this.classList.add('active')
      })
    })

    // Rotating words
    const rotatingWords = document.querySelector('.rotating-words')
    if (rotatingWords) {
      const words = ["Solução", "Inovação", "Tecnologia", "Eficiência"]
      words.forEach(word => {
        const span = document.createElement('span')
        span.textContent = word
        rotatingWords.appendChild(span)
      })
    }

    // Card animations
    const cards = document.querySelectorAll('.card')
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      }, index * 200)
    })

    // Serviços: tabs
    const buttons = document.querySelectorAll('.service-button')
    const contents = document.querySelectorAll('.service-content')
    buttons.forEach(button => {
      button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('active'))
        contents.forEach(content => content.classList.remove('active'))

        this.classList.add('active')
        const target = this.getAttribute('data-target')
        const el = document.getElementById(target)
        if (el) el.classList.add('active')
      })
    })

    // FAQ toggle
    const faqQuestions = document.querySelectorAll('.faq-question')
    faqQuestions.forEach(question => {
      question.addEventListener('click', function () {
        faqQuestions.forEach(q => {
          if (q !== question) {
            q.classList.remove('active')
            q.nextElementSibling?.classList.remove('active')
          }
        })

        this.classList.toggle('active')
        const answer = this.nextElementSibling
        if (answer) answer.classList.toggle('active')
      })
    })

    // Menu hamburger
    const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
  })
}
