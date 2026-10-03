// Abre y cierra el sobre sorpresa.
// Al abrir, las flores se muestran y su animación empieza desde cero.
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const button = document.getElementById('envelope-btn');

  function setOpen(open) {
    envelope.classList.toggle('is-open', open);
    button.textContent = open ? 'Cerrar el sobre' : 'Abrir el sobre';
    button.setAttribute('aria-expanded', String(open));
  }

  button.addEventListener('click', () => {
    setOpen(!envelope.classList.contains('is-open'));
  });

  // También se puede abrir tocando el sobre directamente
  envelope.addEventListener('click', () => {
    setOpen(!envelope.classList.contains('is-open'));
  });
});
