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

  crest.querySelectorAll('.dragon-wing').forEach((wing, index) => {
    addAnimation(wing, [
      { transform: 'rotate(-3deg)' },
      { transform: 'rotate(5deg)' },
      { transform: 'rotate(-3deg)' }
    ], {
      duration: 2600 + index * 180,
      delay: index * 220,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  });

  addAnimation(crest.querySelector('.crest-heart'), [
    { transform: 'scale(1)' },
    { transform: 'scale(1.14)' },
    { transform: 'scale(1)' }
  ], { duration: 1700, iterations: Infinity, easing: 'ease-in-out' });

  crest.querySelectorAll('.crest-star').forEach((star, index) => {
    addAnimation(star, [
      { opacity: 0.45, transform: 'scale(.7)' },
      { opacity: 1, transform: 'scale(1.45)' },
      { opacity: 0.45, transform: 'scale(.7)' }
    ], {
      duration: 1500 + index * 260,
      delay: index * 360,
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
