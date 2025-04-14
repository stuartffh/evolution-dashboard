document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const rotatingWords = document.querySelector('.rotating-words');
    const words = ["Solução", "Inovação", "Tecnologia", "Eficiência"]; 
  

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      rotatingWords.appendChild(span);
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.service-button');
    const contents = document.querySelectorAll('.service-content');

    buttons.forEach(button => {
        button.addEventListener('click', function() {

            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            
            this.classList.add('active');
            const target = this.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
          faqQuestions.forEach(q => {
              if (q !== question) {
                  q.classList.remove('active');
                  q.nextElementSibling.classList.remove('active');
              }
          });

          this.classList.toggle('active');
          const answer = this.nextElementSibling;
          answer.classList.toggle('active');
      });
  });
});


const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.createElement('div'); 
navOverlay.classList.add('nav-overlay');
document.body.appendChild(navOverlay);

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  const icon = hamburger.querySelector('i');
  icon.classList.toggle('bi-list');
  icon.classList.toggle('bi-x');
});

navOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navLinks.classList.remove('active');
  navOverlay.classList.remove('active');
  const icon = hamburger.querySelector('i');
  icon.classList.remove('bi-x');
  icon.classList.add('bi-list');
}