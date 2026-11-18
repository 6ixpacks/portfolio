// Mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Highlight the nav link for the section in view
const links = [...menu.querySelectorAll('a')];
const watcher = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => watcher.observe(s));

// Typing effect for the hero role line
const words = ['clean web interfaces', 'responsive layouts', 'full-stack projects', 'mobile-friendly pages'];
const typed = document.getElementById('typed');
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  else if (c > 0) c--;
  else { deleting = false; w = (w + 1) % words.length; }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// Gallery lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
  });
});
const closeLb = () => { lb.hidden = true; };
document.getElementById('close').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// Contact form validation (opens the visitor's email app, since there is no backend)
const form = document.getElementById('form');
const status = document.getElementById('status');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  msg: v => v.trim().length >= 10 || 'Write at least 10 characters.'
};
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  Object.keys(rules).forEach(id => {
    const field = form.elements[id];
    const result = rules[id](field.value);
    const err = form.querySelector(`[data-for="${id}"]`);
    field.classList.toggle('bad', result !== true);
    err.textContent = result === true ? '' : result;
    if (result !== true) ok = false;
  });
  if (!ok) { status.textContent = ''; return; }
  const subject = encodeURIComponent('Message from ' + form.elements.name.value);
  const body = encodeURIComponent(form.elements.msg.value + '\n\nFrom: ' + form.elements.email.value);
  window.location.href = `mailto:davidukanwoke@gmail.com?subject=${subject}&body=${body}`;
  status.textContent = 'Opening your email app. Thank you!';
  form.reset();
});

// Scroll reveal: fade items in as they enter the screen
const revealTargets = document.querySelectorAll('h2, .about > *, .card, .timeline li, .gallery img, .contact > *');
revealTargets.forEach(el => {
  el.classList.add('reveal');
  const index = [...el.parentElement.children].indexOf(el);
  el.style.setProperty('--d', (index * 0.1) + 's');
});
const revealer = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target);
      // once shown, drop the helper classes so hover effects work normally
      setTimeout(() => e.target.classList.remove('reveal', 'in'), 1200);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealer.observe(el));
