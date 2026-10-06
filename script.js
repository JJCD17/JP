// Abre y cierra el sobre sorpresa.
// Al abrir, las flores se muestran y su animación empieza desde cero.
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const button = document.getElementById('envelope-btn');

  if (envelope && button) {
    function setOpen(open) {
      envelope.classList.toggle('is-open', open);
      button.textContent = open ? 'Cerrar el sobre' : 'Abrir el sobre';
      button.setAttribute('aria-expanded', String(open));
    }

    button.addEventListener('click', () => {
      setOpen(!envelope.classList.contains('is-open'));
    });

    envelope.addEventListener('click', () => {
      setOpen(!envelope.classList.contains('is-open'));
    });
  }

  document.querySelectorAll('.chapter-photo img[data-photo]').forEach((image) => {
    image.addEventListener('load', () => {
      image.closest('.chapter-photo').classList.add('has-photo');
    }, { once: true });
    image.src = image.dataset.photo;
  });

  const daysTogether = document.getElementById('days-together');
  const hoursTogether = document.getElementById('hours-together');
  const minutesTogether = document.getElementById('minutes-together');
  const secondsTogether = document.getElementById('seconds-together');

  if (daysTogether && hoursTogether && minutesTogether && secondsTogether) {
    const start = new Date(2026, 4, 1, 6, 30, 0); //año, mes, día, hora, minuto, segundo
    const second = 1000;

    function updateTogetherTime() {
      const elapsed = Math.max(0, Date.now() - start.getTime());
      const totalSeconds = Math.floor(elapsed / second);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      daysTogether.textContent = days.toLocaleString('es-MX');
      hoursTogether.textContent = String(hours).padStart(2, '0');
      minutesTogether.textContent = String(minutes).padStart(2, '0');
      secondsTogether.textContent = String(seconds).padStart(2, '0');
    }

    updateTogetherTime();
    window.setInterval(updateTogetherTime, second);
  }

  const crest = document.querySelector('.crest');
  if (!crest || !crest.animate) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = [];
  let isVisible = true;

  function addAnimation(element, frames, options) {
    if (!element) return;
    const animation = element.animate(frames, { ...options, fill: 'both' });
    animations.push(animation);
  }

  crest.querySelectorAll('.crest-wing').forEach((wing, index) => {
    addAnimation(wing, [
      { transform: 'rotate(-0.7deg)' },
      { transform: 'rotate(0.9deg)' },
      { transform: 'rotate(-0.7deg)' }
    ], {
      duration: 5200 + index * 320,
      delay: 450 + index * 280,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  });

  addAnimation(crest.querySelector('.crest-rune'), [
    { opacity: 0.68, transform: 'scale(.96)' },
    { opacity: 1, transform: 'scale(1.04)' },
    { opacity: 0.68, transform: 'scale(.96)' }
  ], { duration: 4200, iterations: Infinity, easing: 'ease-in-out' });

  crest.querySelectorAll('.crest-particle').forEach((particle, index) => {
    addAnimation(particle, [
      { opacity: 0.25, transform: 'translateY(2px) scale(.8)' },
      { opacity: 0.82, transform: 'translateY(-4px) scale(1.08)' },
      { opacity: 0.25, transform: 'translateY(2px) scale(.8)' }
    ], {
      duration: 3600 + index * 500,
      delay: 700 + index * 650,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  });

  function syncAnimations() {
    animations.forEach((animation) => {
      if (reducedMotion.matches) {
        animation.cancel();
      } else if (isVisible && document.visibilityState === 'visible') {
        animation.play();
      } else {
        animation.pause();
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncAnimations();
    });
    observer.observe(crest);
  }

  reducedMotion.addEventListener('change', syncAnimations);
  document.addEventListener('visibilitychange', syncAnimations);
  syncAnimations();

  let pointerFrame = 0;
  crest.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const bounds = crest.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      crest.style.setProperty('--crest-tilt-x', `${x * 5}deg`);
      crest.style.setProperty('--crest-tilt-y', `${y * -4}deg`);
    });
  });

  crest.addEventListener('pointerleave', () => {
    cancelAnimationFrame(pointerFrame);
    crest.style.setProperty('--crest-tilt-x', '0deg');
    crest.style.setProperty('--crest-tilt-y', '0deg');
  });
});
