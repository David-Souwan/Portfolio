/* Interactions légères, sans dépendance externe. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

window.addEventListener('load', () => $('.preloader').classList.add('done'));
$('#year').textContent = new Date().getFullYear();

const navbar = $('.navbar'); const topButton = $('.back-top');
window.addEventListener('scroll', () => { const isScrolled = window.scrollY > 30; navbar.classList.toggle('scrolled', isScrolled); topButton.classList.toggle('visible', window.scrollY > 550); }, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const toggle = $('.menu-toggle'); const nav = $('nav');
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); });
$$('nav a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.add('visible'); reveal.unobserve(entry.target); }), { threshold: .12 });
$$('.reveal').forEach(el => reveal.observe(el));

const animateStats = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; const element = entry.target; const end = Number(element.dataset.count); let start = 0; const timer = setInterval(() => { start += Math.max(1, Math.ceil(end / 35)); if (start >= end) { start = end; clearInterval(timer); } element.textContent = `${start}${end === 100 ? '%' : end === 4 ? '+' : '+'}`; }, 28); animateStats.unobserve(element); }), { threshold: .7 });
$$('[data-count]').forEach(el => animateStats.observe(el));

const skillObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; $('i', entry.target).style.width = $('i', entry.target).dataset.width; skillObserver.unobserve(entry.target); }), { threshold: .5 });
$$('.progress').forEach(el => skillObserver.observe(el));

$('.contact-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; const status = $('.form-status', form); if (!form.checkValidity()) { status.textContent = 'Merci de renseigner un nom, un email valide et votre message.'; form.reportValidity(); return; } const name = form.name.value.trim(); const subject = encodeURIComponent(`Projet data — ${name}`); const body = encodeURIComponent(`Bonjour David,\n\n${form.message.value.trim()}\n\nBien cordialement,\n${name}\n${form.email.value.trim()}`); status.textContent = 'Merci ! Votre message est prêt à être envoyé.'; $('.toast').classList.add('show'); setTimeout(() => $('.toast').classList.remove('show'), 4000); window.location.href = `mailto:davidsouwan9@gmail.com?subject=${subject}&body=${body}`; form.reset(); });

if (matchMedia('(pointer:fine)').matches) { const dot = $('.cursor-dot'); const ring = $('.cursor-ring'); window.addEventListener('mousemove', e => { dot.style.left = ring.style.left = `${e.clientX}px`; dot.style.top = ring.style.top = `${e.clientY}px`; }); $$('a, button, input, textarea, summary').forEach(el => el.addEventListener('mouseenter', () => ring.classList.add('active'))); $$('a, button, input, textarea, summary').forEach(el => el.addEventListener('mouseleave', () => ring.classList.remove('active'))); }

// Fond de particules minimal pour préserver les performances.
const canvas = $('#particles'); const ctx = canvas.getContext('2d'); let points = [];
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; const total = Math.min(55, Math.round(innerWidth / 28)); points = Array.from({ length: total }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18 })); }
function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#20c7df'; points.forEach((p, i) => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > canvas.width) p.vx *= -1; if (p.y < 0 || p.y > canvas.height) p.vy *= -1; ctx.globalAlpha = .28; ctx.beginPath(); ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2); ctx.fill(); for (let j = i + 1; j < points.length; j++) { const q = points[j]; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 110) { ctx.globalAlpha = .08 * (1 - d / 110); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = '#20c7df'; ctx.stroke(); } } }); requestAnimationFrame(draw); }
resizeCanvas(); draw(); window.addEventListener('resize', resizeCanvas);
