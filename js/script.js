/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN — edita estos valores para personalizar
══════════════════════════════════════════════════════════ */
const CONFIG = {
  nombre: "Mi amor",
  nombreRemitente: "Guillermo",
  saludo: "Para ti,",
  fechaEspecial: "21 de septiembre",
  musica: "audio/cancion.mp3",

  mensajeCarta: `Hoy quería regalarte algo diferente.
No solamente unas flores,
sino un pequeño momento para recordarte
lo especial que eres para mí.

Hay personas que llegan a tu vida
y sin darse cuenta la hacen más bonita.
Tú eres una de esas personas.

Gracias por existir,
por sonreír,
por ser exactamente como eres.

Hoy, y siempre,
estas flores son para ti.`,

  frasesJardin: [
    "Para alegrarte el día",
    "Porque te lo mereces",
    "Para recordarte lo especial que eres",
    "Un poquito de felicidad para ti",
    "Eres luz donde estás",
    "Gracias por existir",
    "Hoy y siempre, para ti",
    "Con todo el cariño del mundo"
  ]
};

/* ══════════════════════════════════════════════════════════
   UTILIDADES
══════════════════════════════════════════════════════════ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));
const lerp = (a, b, t) => a + (b - a) * t;
const PI2 = Math.PI * 2;

/* ══════════════════════════════════════════════════════════
   PANTALLA DE BIENVENIDA
══════════════════════════════════════════════════════════ */
function initWelcome() {
  const canvas = $('#welcome-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let bokeh = [], petals = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* Círculos de bokeh (luces desenfocadas) */
  function makeBokeh() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(20, 90),
      alpha: rand(0.02, 0.09),
      vx: rand(-0.12, 0.12), vy: rand(-0.18, -0.04),
      hue: rand(42, 58),
      phase: rand(0, PI2), speed: rand(0.004, 0.009)
    };
  }

  /* Partículas pequeñas de luz */
  function makeSpark() {
    return {
      x: rand(0, W), y: rand(H * 0.3, H),
      r: rand(0.8, 2.5),
      alpha: rand(0.4, 1),
      vx: rand(-0.2, 0.2), vy: rand(-0.8, -0.2),
      life: 1, decay: rand(0.004, 0.01),
      hue: rand(40, 58)
    };
  }

  function init() {
    bokeh  = Array.from({ length: 28 }, makeBokeh);
    petals = Array.from({ length: 60 }, makeSpark);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    /* Bokeh */
    bokeh.forEach(b => {
      const a = b.alpha * (0.6 + 0.4 * Math.sin(t * b.speed + b.phase));
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `hsla(${b.hue},90%,70%,${a})`);
      g.addColorStop(1, `hsla(${b.hue},90%,70%,0)`);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, PI2);
      ctx.fillStyle = g;
      ctx.fill();

      b.x += b.vx; b.y += b.vy;
      if (b.y + b.r < 0) Object.assign(b, makeBokeh(), { y: H + b.r });
    });

    /* Sparks */
    petals.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, PI2);
      ctx.fillStyle = `hsla(${p.hue},95%,75%,${p.alpha * p.life})`;
      ctx.fill();
      p.x += p.vx + Math.sin(t * 0.001 + p.y * 0.02) * 0.3;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0 || p.y < -10) Object.assign(p, makeSpark(), { y: H + 5 });
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw(0);
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });

  $('#btn-discover').addEventListener('click', () => {
    cancelAnimationFrame(animId);
    const screen = $('#welcome-screen');
    screen.classList.add('exit');
    screen.addEventListener('animationend', () => {
      screen.style.display = 'none';
      screen.setAttribute('aria-hidden', 'true');
      const main = $('#main-page');
      main.setAttribute('aria-hidden', 'false');
      main.classList.add('visible');
      initMainPage();
    }, { once: true });
  });
}

/* ══════════════════════════════════════════════════════════
   ARRANQUE PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
function initMainPage() {
  populateConfig();
  initNavbar();
  initHeroCanvas();
  initHeroSideFlowers();
  initReveal();
  initParallax();
  initGarden();
  initLetter();
  initSurprise();
  initFinalCanvas();
  initMusic();
  initTheme();
}

function populateConfig() {
  const d = $('#hero-date');
  if (d) d.textContent = CONFIG.fechaEspecial;
  const sal = $('#letter-salutation');
  if (sal) sal.textContent = CONFIG.saludo;
  const sig = $('#letter-signature');
  if (sig) sig.textContent = `Con cariño, ${CONFIG.nombreRemitente}`;
  const fin = $('#final-from');
  if (fin) fin.textContent = `Con cariño, ${CONFIG.nombreRemitente}`;
}

/* ══════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = $('#navbar'), toggle = $('#nav-toggle'), menu = $('#nav-menu');
  const progressBar = $('#scroll-progress');
  const sections = ['hero', 'garden', 'letter', 'surprise', 'final'];
  const navLinks = $$('.nav-link');

  function showView(id) {
    const view = $('#' + id);
    if (!view) return;

    $$('.page-view').forEach(section => section.classList.toggle('active', section === view));
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNav() {
    const scrolled = scrollY;
    const total = document.body.scrollHeight - window.innerHeight;

    /* Barra de progreso */
    if (progressBar) progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';

    /* Enlace activo según sección visible */
    nav.classList.toggle('scrolled', scrolled > 60);

    const current = $('.page-view.active')?.id || sections[0];
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(l => l.addEventListener('click', event => {
    event.preventDefault();
    showView(l.dataset.section);
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  $('#btn-scroll-letter')?.addEventListener('click', () => {
    showView('letter');
  });

  $('#btn-letter-surprise')?.addEventListener('click', () => {
    showView('surprise');
  });

  $('#btn-go-final')?.addEventListener('click', () => {
    showView('final');
  });

  $('.nav-brand')?.addEventListener('click', event => {
    event.preventDefault();
    showView('hero');
  });
}

/* ══════════════════════════════════════════════════════════
   HERO CANVAS — pétalos con física suave
══════════════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, petals = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makePetal() {
    return {
      x: rand(0, W), y: rand(-60, -10),
      w: rand(5, 12), h: rand(3, 7),
      rot: rand(0, PI2), rotV: rand(-0.025, 0.025),
      vx: rand(-0.4, 0.4), vy: rand(0.4, 1.2),
      alpha: rand(0.35, 0.75),
      hue: rand(40, 56), sat: rand(80, 95), lit: rand(60, 75),
      wobble: rand(0, PI2), wobbleSpeed: rand(0.02, 0.05)
    };
  }

  function init() {
    petals = Array.from({ length: 30 }, () => {
      const p = makePetal(); p.y = rand(0, H); return p;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lit}%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.w, p.h, 0, 0, PI2);
      ctx.fill();
      ctx.restore();

      p.wobble += p.wobbleSpeed;
      p.x  += p.vx + Math.sin(p.wobble) * 0.4;
      p.y  += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 20) Object.assign(p, makePetal());
    });
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  new ResizeObserver(resize).observe(canvas);
}

/* ══════════════════════════════════════════════════════════
   FLORES LATERALES HERO
══════════════════════════════════════════════════════════ */
function initHeroSideFlowers() {
  const emojis = ['🌻','🌼','🌻','🌼','🌻'];
  [['#hero-left', 1], ['#hero-right', -1]].forEach(([id]) => {
    const el = $(id);
    if (!el) return;
    emojis.forEach((e, i) => {
      const span = document.createElement('span');
      span.className = 'hero-side-flower';
      span.textContent = e;
      span.style.setProperty('--dur', `${rand(3.5, 5.5)}s`);
      span.style.setProperty('--delay', `${i * 0.4}s`);
      el.appendChild(span);
    });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      $$('.hero-side-flower', e.target).forEach((f, i) => {
        setTimeout(() => f.classList.add('visible'), i * 150);
      });
    });
  }, { threshold: 0.2 });

  ['#hero-left','#hero-right'].forEach(id => { const el = $(id); if (el) obs.observe(el); });
}

/* ══════════════════════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   PARALLAX SUAVE
══════════════════════════════════════════════════════════ */
function initParallax() {
  const layers = [
    { el: $('#hero-left'),  factor: 0.06 },
    { el: $('#hero-right'), factor: 0.04 },
  ].filter(l => l.el);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      layers.forEach(({ el, factor }) => {
        el.style.transform = `translateY(${y * factor}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   JARDÍN INTERACTIVO — flores SVG premium
══════════════════════════════════════════════════════════ */
function initGarden() {
  const grid = $('#garden-grid');
  if (!grid) return;

  const COUNT = 24;
  const flowers = [];

  /* SVG de flor con pétalos más naturales */
  function flowerSVG(hue, variant) {
    const c = `hsl(${hue},88%,62%)`;
    const c2 = `hsl(${hue + 6},80%,52%)`;
    const center = `hsl(${hue - 8},75%,42%)`;
    const highlight = `hsl(${hue + 12},95%,78%)`;

    if (variant === 0) {
      /* Girasol con 16 pétalos */
      const petals16 = Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * PI2;
        const cx = Math.cos(a) * 13, cy = Math.sin(a) * 13;
        return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="5" ry="3.5"
          transform="rotate(${(a * 180 / Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"
          fill="${i % 2 === 0 ? c : c2}" opacity="0.92"/>`;
      }).join('');
      return `<svg class="g-flower-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="translate(30,30)">${petals16}
          <circle r="9" fill="${center}"/>
          <circle r="5" fill="${highlight}" opacity="0.6"/>
          <circle r="2" fill="rgba(255,255,255,0.5)"/>
        </g></svg>`;
    } else {
      /* Margarita con 12 pétalos redondeados */
      const petals12 = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * PI2;
        const cx = Math.cos(a) * 11, cy = Math.sin(a) * 11;
        return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="4.5" ry="3"
          transform="rotate(${(a * 180 / Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"
          fill="${c}" opacity="0.88"/>`;
      }).join('');
      return `<svg class="g-flower-svg" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="translate(30,30)">${petals12}
          <circle r="8" fill="${center}"/>
          <circle r="4" fill="${highlight}" opacity="0.55"/>
        </g></svg>`;
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'garden-flower';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', 'Flor interactiva — toca para descubrir un mensaje');

    const hue = randInt(40, 58);
    const variant = i % 2;
    const swDur = rand(2.8, 4.5).toFixed(1) + 's';
    const swDel = rand(0, 2).toFixed(1) + 's';

    wrap.innerHTML = flowerSVG(hue, variant) + '<div class="flower-stem"></div>';
    wrap.querySelector('.g-flower-svg').style.setProperty('--sw-dur', swDur);
    wrap.querySelector('.g-flower-svg').style.setProperty('--sw-del', swDel);

    flowers.push(wrap);
    grid.appendChild(wrap);
  }

  /* Aparición en cascada al hacer scroll */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      flowers.forEach((f, i) => setTimeout(() => f.classList.add('bloom'), i * 55));
      obs.disconnect();
    }
  }, { threshold: 0.08 });
  obs.observe(grid);

  /* Interacción */
  const msgEl = $('#flower-message');
  let msgTimer;

  function showMsg(text) {
    clearTimeout(msgTimer);
    msgEl.innerHTML = `<span class="msg-bubble">${text}</span>`;
    msgTimer = setTimeout(() => {
      const b = msgEl.querySelector('.msg-bubble');
      if (b) { b.style.opacity = '0'; b.style.transform = 'translateY(-8px)'; b.style.transition = '0.4s ease'; }
      setTimeout(() => { msgEl.innerHTML = ''; }, 400);
    }, 3200);
  }

  function onFlowerClick(i) {
    const phrase = CONFIG.frasesJardin[i % CONFIG.frasesJardin.length];
    showMsg(phrase);
    const f = flowers[i];
    f.style.transition = 'transform 0.15s ease';
    f.style.transform = 'scale(1.35) translateY(-10px)';
    setTimeout(() => { f.style.transform = ''; }, 280);
    /* Pequeña partícula de luz */
    spawnFlowerSpark(f);
  }

  flowers.forEach((f, i) => {
    f.addEventListener('click', () => onFlowerClick(i));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') onFlowerClick(i); });
  });
}

/* Partícula al tocar flor */
function spawnFlowerSpark(el) {
  const rect = el.getBoundingClientRect();
  const spark = document.createElement('div');
  Object.assign(spark.style, {
    position: 'fixed',
    left: rect.left + rect.width / 2 + 'px',
    top:  rect.top  + rect.height / 2 + 'px',
    width: '6px', height: '6px',
    borderRadius: '50%',
    background: '#f5c842',
    pointerEvents: 'none',
    zIndex: '999',
    transform: 'translate(-50%,-50%) scale(1)',
    transition: 'transform 0.5s ease, opacity 0.5s ease',
    opacity: '1',
    boxShadow: '0 0 8px 4px rgba(245,200,66,0.5)'
  });
  document.body.appendChild(spark);
  requestAnimationFrame(() => {
    spark.style.transform = 'translate(-50%,-50%) scale(4)';
    spark.style.opacity = '0';
  });
  setTimeout(() => spark.remove(), 500);
}

/* ══════════════════════════════════════════════════════════
   CARTA — TYPEWRITER
══════════════════════════════════════════════════════════ */
function initLetter() {
  const el = $('#letter-text');
  if (!el) return;
  let done = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      obs.disconnect();
      typeWriter(el, CONFIG.mensajeCarta, 26);
    }
  }, { threshold: 0.25 });
  obs.observe(el);
}

function typeWriter(el, text, speed) {
  el.innerHTML = '<span class="cursor"></span>';
  let i = 0;

  (function type() {
    if (i >= text.length) {
      setTimeout(() => el.querySelector('.cursor')?.remove(), 1800);
      return;
    }
    const cursor = el.querySelector('.cursor');
    cursor.insertAdjacentText('beforebegin', text[i]);
    i++;
    setTimeout(type, text[i - 1] === '\n' ? speed * 6 : speed);
  })();
}

/* ══════════════════════════════════════════════════════════
   SORPRESA — canvas de partículas doradas
══════════════════════════════════════════════════════════ */
function initSurprise() {
  const section = $('#surprise');
  if (!section) return;
  let triggered = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      obs.disconnect();
      startSurpriseCanvas();
      setTimeout(runSurprise, 400);
    }
  }, { threshold: 0.35 });
  obs.observe(section);
}

function startSurpriseCanvas() {
  const canvas = $('#surprise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeP() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(0.5, 2.5),
      alpha: rand(0.1, 0.5),
      phase: rand(0, PI2),
      speed: rand(0.005, 0.012),
      vx: rand(-0.15, 0.15), vy: rand(-0.3, -0.05)
    };
  }

  resize();
  particles = Array.from({ length: 80 }, makeP);
  new ResizeObserver(resize).observe(canvas);

  (function draw(t = 0) {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      const a = p.alpha * (0.4 + 0.6 * Math.sin(t * p.speed + p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, PI2);
      ctx.fillStyle = `rgba(212,160,23,${a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) Object.assign(p, makeP(), { y: H + 5 });
    });
    requestAnimationFrame(draw);
  })();
}

function runSurprise() {
  const loading = $('#surprise-loading');
  const reveal  = $('#surprise-reveal');

  setTimeout(() => {
    loading.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    loading.style.opacity = '0';
    loading.style.transform = 'translateY(-20px)';

    setTimeout(() => {
      loading.style.display = 'none';
      reveal.style.display = 'block';
      launchSurpriseFlowers();
    }, 700);
  }, 3200);
}

function launchSurpriseFlowers() {
  const container = $('#surprise-flowers');
  if (!container) return;

  const svgs = [
    /* Girasol SVG inline pequeño */
    `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20,20)">
        ${Array.from({length:12},(_,i)=>{const a=(i/12)*PI2,cx=Math.cos(a)*10,cy=Math.sin(a)*10;
          return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="4" ry="2.5"
            transform="rotate(${(a*180/Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"
            fill="#f5c842" opacity="0.9"/>`;}).join('')}
        <circle r="6" fill="#c9960c"/><circle r="3" fill="#fde98a" opacity="0.6"/>
      </g></svg>`,
    `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20,20)">
        ${Array.from({length:8},(_,i)=>{const a=(i/8)*PI2,cx=Math.cos(a)*10,cy=Math.sin(a)*10;
          return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="5" ry="3"
            transform="rotate(${(a*180/Math.PI).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"
            fill="#fde98a" opacity="0.88"/>`;}).join('')}
        <circle r="5" fill="#d4a017"/><circle r="2.5" fill="#fff8d6" opacity="0.5"/>
      </g></svg>`
  ];

  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'surprise-flower-item';
      el.innerHTML = svgs[i % svgs.length];
      el.setAttribute('aria-hidden', 'true');
      const size = rand(24, 52);
      Object.assign(el.style, {
        left: `${rand(1, 96)}%`,
        width: size + 'px',
        height: size + 'px',
        animationDuration: `${rand(3.5, 7)}s`,
        animationDelay: `${rand(0, 0.3)}s`
      });
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 100);
  }
}

/* ══════════════════════════════════════════════════════════
   CANVAS FINAL — constelación dorada
══════════════════════════════════════════════════════════ */
function initFinalCanvas() {
  const canvas = $('#final-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], lines = [], active = false;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeStar() {
    return {
      x: rand(0, W), y: rand(0, H),
      r: rand(0.5, 2.2),
      alpha: rand(0.08, 0.5),
      phase: rand(0, PI2),
      speed: rand(0.004, 0.01)
    };
  }

  function buildLines(stars) {
    const result = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) result.push({ a: stars[i], b: stars[j], d });
      }
    }
    return result;
  }

  function draw(t = 0) {
    if (!active) return;
    ctx.clearRect(0, 0, W, H);

    /* Líneas de constelación */
    lines.forEach(({ a, b, d }) => {
      const alpha = (1 - d / 90) * 0.06;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(212,160,23,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    /* Estrellas */
    stars.forEach(s => {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, PI2);
      ctx.fillStyle = `rgba(212,160,23,${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !active) {
      active = true;
      resize();
      stars = Array.from({ length: 70 }, makeStar);
      lines = buildLines(stars);
      draw();
    }
  }, { threshold: 0.15 });
  obs.observe(canvas.parentElement);
  new ResizeObserver(() => { resize(); if (active) { stars = Array.from({length:70}, makeStar); lines = buildLines(stars); } }).observe(canvas);
}

/* ══════════════════════════════════════════════════════════
   MÚSICA
══════════════════════════════════════════════════════════ */
function initMusic() {
  const btn = $('#btn-music'), audio = $('#bg-music');
  if (!btn || !audio) return;
  audio.src = CONFIG.musica;

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        btn.classList.add('playing');
        btn.setAttribute('aria-label', 'Pausar música');
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.setAttribute('aria-label', 'Reproducir música');
      }
    } catch {
      btn.style.opacity = '0.35';
      btn.title = 'Audio no disponible';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   MODO NOCHE
══════════════════════════════════════════════════════════ */
function initTheme() {
  const btn = $('#btn-theme');
  if (!btn) return;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
  }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    btn.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo noche');
  });
}

/* ══════════════════════════════════════════════════════════
   ARRANQUE
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', initWelcome);
