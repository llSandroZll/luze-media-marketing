'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CRIPTANA 360 — Interactive Portal Prototype
   Bilingual i18n Engine · Floating Particles · Immersive 360° Cave Renderer
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── 1. Scroll-Triggered Fade-In Animations ───────────────────────────── */
(function initFadeAnimations() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(el);
      const delay = Math.min(idx * 120, 600);
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ─── 2. Hero Ambient Particle Canvas ───────────────────────────────────── */
(function initHeroParticles() {
  var canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 50;
  var colors = [
    'rgba(201, 169, 110, 0.45)', // gold
    'rgba(201, 169, 110, 0.25)',
    'rgba(245, 237, 224, 0.15)', // cream
    'rgba(255, 255, 255, 0.08)'
  ];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.3 + 0.05),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.006 + 0.002
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      var flicker = 0.75 + Math.sin(p.pulse) * 0.25;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha * flicker;
      ctx.fillStyle = p.color;
      ctx.fill();

      // wrap borders
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ─── 3. Header Scroll Shadow ───────────────────────────────────────────── */
(function initHeaderScroll() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ─── 4. Immersive 360° Cave Room Simulator ────────────────────────────── */
(function initCaveViewer() {
  var canvas = document.getElementById('cave-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var viewAngle = 0;
  var targetAngle = 0;
  var zoom = 1;
  var targetZoom = 1;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartAngle = 0;
  var autoRotate = true;
  var hasInteracted = false;
  var animFrame;

  var CAVE_WIDTH = 3600;

  function resize() {
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  // Draw rounded rect fallback
  function drawRoundedRect(cx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.lineTo(x + w - r, y);
    cx.quadraticCurveTo(x + w, y, x + w, y + r);
    cx.lineTo(x + w, y + h - r);
    cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    cx.lineTo(x + r, y + h);
    cx.quadraticCurveTo(x, y + h, x, y + h - r);
    cx.lineTo(x, y + r);
    cx.quadraticCurveTo(x, y, x + r, y);
    cx.closePath();
  }

  // Draw masonry stone brick walls
  function drawStoneWall(ox, w, h) {
    var gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#211714');
    gradient.addColorStop(0.3, '#332621');
    gradient.addColorStop(0.6, '#281E1A');
    gradient.addColorStop(1, '#140E0C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    var stoneH = 45;
    var seed = 54321;
    function pseudoRandom() {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed & 0x7fffffff) / 2147483647;
    }

    for (var row = 0; row < h; row += stoneH) {
      var stoneW = 70 + pseudoRandom() * 60;
      var offsetRow = (Math.floor(row / stoneH) % 2) * 35;

      for (var col = -stoneW; col < w + stoneW; col += stoneW) {
        var sx = col + offsetRow + ((ox * 0.4) % stoneW);
        var sy = row;
        var sw = stoneW - 3;
        var sh = stoneH - 3;

        var brightness = 0.10 + pseudoRandom() * 0.10;
        ctx.fillStyle = 'rgba(' +
          Math.floor(95 + pseudoRandom() * 35) + ',' +
          Math.floor(65 + pseudoRandom() * 25) + ',' +
          Math.floor(40 + pseudoRandom() * 20) + ',' +
          brightness + ')';
        ctx.fillRect(sx, sy, sw, sh);

        ctx.fillStyle = 'rgba(8,4,2,0.45)';
        ctx.fillRect(sx + sw, sy, 3, sh + 3);
        ctx.fillRect(sx, sy + sh, sw + 3, 3);
      }
      stoneW = 60 + pseudoRandom() * 70;
    }
  }

  function drawCeiling(w, h) {
    ctx.save();
    var archH = h * 0.32;

    var ceilGrad = ctx.createLinearGradient(0, 0, 0, archH);
    ceilGrad.addColorStop(0, 'rgba(12,8,6,0.95)');
    ceilGrad.addColorStop(0.6, 'rgba(25,16,12,0.6)');
    ceilGrad.addColorStop(1, 'rgba(40,25,18,0.0)');
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, w, archH);

    // Arch ribs
    var archCount = 4;
    var spacing = w / archCount;
    ctx.strokeStyle = 'rgba(50,32,22,0.45)';
    ctx.lineWidth = 5;
    for (var i = 0; i < archCount; i++) {
      var cx = spacing * i + spacing / 2;
      ctx.beginPath();
      ctx.arc(cx, archH * 0.95, spacing * 0.5, Math.PI, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBarrel(bx, by, scale) {
    var s = scale || 1;
    var bw = 70 * s;
    var bh = 48 * s;

    ctx.save();
    ctx.translate(bx, by);

    var bGrad = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
    bGrad.addColorStop(0, '#4E3019');
    bGrad.addColorStop(0.3, '#6A4325');
    bGrad.addColorStop(0.5, '#784C2C');
    bGrad.addColorStop(0.7, '#6A4325');
    bGrad.addColorStop(1, '#3A200E');
    ctx.fillStyle = bGrad;

    ctx.beginPath();
    ctx.ellipse(0, 0, bw / 2, bh / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // bands
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2 * s;
    var bandPositions = [-0.34, -0.11, 0.11, 0.34];
    for (var b = 0; b < bandPositions.length; b++) {
      var bandY = bandPositions[b] * bh;
      ctx.beginPath();
      ctx.ellipse(0, bandY, bw / 2 + 1, 3 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Bung hole
    ctx.fillStyle = '#1D0F08';
    ctx.beginPath();
    ctx.arc(0, 0, 5.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // wall torches
  function drawTorch(tx, ty, time) {
    ctx.save();
    ctx.translate(tx, ty);

    // bracket
    ctx.fillStyle = '#333333';
    ctx.fillRect(-3, 0, 6, 22);
    ctx.fillRect(-7, 19, 14, 4);

    // torch stick
    ctx.fillStyle = '#5A371B';
    ctx.fillRect(-4, -18, 8, 20);

    // flames physics
    var f1 = Math.sin(time * 6.5 + tx) * 2.5;
    var f2 = Math.cos(time * 8.5 + tx * 0.4) * 2;
    var f3 = Math.sin(time * 13 + tx * 0.2) * 1.5;

    var glow = ctx.createRadialGradient(f1, -30, 2, 0, -20, 48);
    glow.addColorStop(0, 'rgba(255,160,35,0.22)');
    glow.addColorStop(0.5, 'rgba(255,90,15,0.06)');
    glow.addColorStop(1, 'rgba(255,50,5,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-50, -75, 100, 90);

    ctx.fillStyle = 'rgba(255,175,45,0.88)';
    ctx.beginPath();
    ctx.moveTo(-5 + f2, -18);
    ctx.quadraticCurveTo(-9 + f1, -38, f3, -50 + f1);
    ctx.quadraticCurveTo(9 + f2, -38, 5 + f1, -18);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,220,95,0.95)';
    ctx.beginPath();
    ctx.moveTo(-3 + f3, -18);
    ctx.quadraticCurveTo(-5 + f2, -32, f1 * 0.4, -40 + f2);
    ctx.quadraticCurveTo(5 + f3, -32, 3 + f2, -18);
    ctx.fill();

    ctx.restore();
  }

  // dust motes
  var dustMotes = [];
  for (var d = 0; d < 25; d++) {
    dustMotes.push({
      x: Math.random() * 1200,
      y: Math.random() * 450,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.12 + 0.04,
      drift: Math.random() * 0.25 - 0.12,
      phase: Math.random() * Math.PI * 2
    });
  }

  var startTime = Date.now();

  function render() {
    var W = canvas.offsetWidth;
    var H = canvas.offsetHeight;
    var dpr = window.devicePixelRatio || 1;

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var time = (Date.now() - startTime) / 1000;

    if (autoRotate && !isDragging) {
      targetAngle += 0.10;
    }

    viewAngle += (targetAngle - viewAngle) * 0.07;
    zoom += (targetZoom - zoom) * 0.07;

    var offset = ((viewAngle % CAVE_WIDTH) + CAVE_WIDTH) % CAVE_WIDTH;

    ctx.clearRect(0, 0, W, H);

    ctx.save();
    // Zoom scale transformation
    var zScale = 0.75 + zoom * 0.25;
    ctx.translate(W / 2, H / 2);
    ctx.scale(zScale, zScale);
    ctx.translate(-W / 2, -H / 2);

    // Stone tiled walls
    drawStoneWall(offset, W + 100, H);

    // Vault arches
    drawCeiling(W, H);

    // Vault Floor
    var floorY = H * 0.78;
    var floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
    floorGrad.addColorStop(0, 'rgba(35,22,14,0.0)');
    floorGrad.addColorStop(0.3, 'rgba(25,15,10,0.65)');
    floorGrad.addColorStop(1, 'rgba(12,7,4,0.92)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, W, H - floorY);

    // Floor perspective grids
    ctx.strokeStyle = 'rgba(55,35,18,0.12)';
    ctx.lineWidth = 1;
    for (var fi = 0; fi < W; fi += 75) {
      var fx = fi - (offset * 0.25) % 75;
      ctx.beginPath();
      ctx.moveTo(fx, floorY + 10);
      ctx.lineTo(fx, H);
      ctx.stroke();
    }

    // Barrels (8 barrels)
    var row1Y = H * 0.63;
    var row2Y = H * 0.73;
    var spacing = CAVE_WIDTH / 4;

    for (var bi = 0; bi < 4; bi++) {
      var bx = (bi * spacing - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (bx > -70 && bx < W + 70) {
        drawBarrel(bx, row1Y, 1.0);
      }
    }

    for (var bi2 = 0; bi2 < 4; bi2++) {
      var bx2 = ((bi2 + 0.5) * spacing - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (bx2 > -70 && bx2 < W + 70) {
        drawBarrel(bx2, row2Y, 0.85);
      }
    }

    // Torches
    var tSpacing = CAVE_WIDTH / 2;
    for (var ti = 0; ti < 2; ti++) {
      var tx = (ti * tSpacing + tSpacing / 2 - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (tx > -50 && tx < W + 50) {
        drawTorch(tx, H * 0.3, time);
      }
    }

    // Dust motes
    ctx.globalAlpha = 0.55;
    for (var di = 0; di < dustMotes.length; di++) {
      var mote = dustMotes[di];
      mote.y -= mote.speed;
      mote.x += mote.drift + Math.sin(time * 0.4 + mote.phase) * 0.15;
      mote.phase += 0.008;

      if (mote.y < -10) { mote.y = H + 10; mote.x = Math.random() * W; }

      var alpha = 0.25 + Math.sin(time * 1.5 + mote.phase) * 0.18;
      ctx.fillStyle = 'rgba(201, 169, 110,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(
        (mote.x - offset * 0.08 + W * 2) % (W + 40) - 20,
        mote.y,
        mote.r,
        0, Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Vignette shadow
    var vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.72);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
    vigGrad.addColorStop(0.8, 'rgba(0,0,0,0.48)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

    animFrame = requestAnimationFrame(render);
  }

  function onFirstInteraction() {
    if (hasInteracted) return;
    hasInteracted = true;
    autoRotate = false;
    var overlay = document.querySelector('.cave-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  // Drag handlers
  canvas.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartAngle = targetAngle;
    onFirstInteraction();
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - dragStartX;
    targetAngle = dragStartAngle - dx * 1.3;
  });
  window.addEventListener('mouseup', function () {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  // Touch drag
  canvas.addEventListener('touchstart', function (e) {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartAngle = targetAngle;
    onFirstInteraction();
  }, { passive: true });
  canvas.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - dragStartX;
    targetAngle = dragStartAngle - dx * 1.3;
  }, { passive: true });
  canvas.addEventListener('touchend', function () { isDragging = false; });

  // Control buttons listeners
  var leftBtn = document.getElementById('cave-left');
  var rightBtn = document.getElementById('cave-right');
  var zoomInBtn = document.getElementById('cave-zoom-in');
  var zoomOutBtn = document.getElementById('cave-zoom-out');

  if (leftBtn) leftBtn.addEventListener('click', function () { targetAngle -= 100; onFirstInteraction(); });
  if (rightBtn) rightBtn.addEventListener('click', function () { targetAngle += 100; onFirstInteraction(); });
  if (zoomInBtn) zoomInBtn.addEventListener('click', function () { targetZoom = Math.min(targetZoom + 0.2, 2.5); onFirstInteraction(); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { targetZoom = Math.max(targetZoom - 0.2, 0.6); onFirstInteraction(); });

  canvas.style.cursor = 'grab';
  resize();
  render();
})();


/* ─── 5. Bilingual i18n System ─────────────────────────────────────────── */
(function initI18n() {
  var i18n = {
    es: {
      'nav.bodegas': 'Bodegas',
      'nav.cuevas': 'Casas Cueva',
      'nav.molinos': 'Los Molinos',
      'nav.tour': 'Tour Virtual 360°',
      
      'hero.overline': 'Experiencias Exclusivas · Campo de Criptana',
      'hero.title': 'Tierra de<br><em>Gigantes.</em>',
      'hero.subtitle': 'Adéntrate en la cuna de los molinos cervantinos. Te invitamos a explorar las cuevas ancestrales, catar vinos galardonados internacionalmente y descubrir la esencia más selecta de La Mancha.',
      'hero.cta1': 'Comenzar Exploración',
      'hero.cta2': 'Experiencia Virtual',
      'hero.scroll': 'Descubrir',
      
      'bento.overline': 'Guía de Destinos',
      'bento.title': 'Un viaje sensorial<br>a tu medida.',
      
      'badge.bodegas': 'Enoturismo',
      'card1.title': 'Bodegas de Cueva Ancestrales',
      'card1.desc': 'Visita salas de barricas subterráneas excavadas a mano en el siglo XVI, donde la temperatura constante cría tintos y blancos de renombre D.O. La Mancha.',
      
      'badge.cuevas': 'Alojamiento Premium',
      'card2.title': 'Hospedarse en una Cueva Histórica',
      'card2.desc': 'Duerme bajo la roca caliza en casas-cueva de lujo totalmente climatizadas, uniendo historia, silencio y confort moderno.',
      
      'badge.molinos': 'Patrimonio Histórico',
      'card3.title': 'Los Molinos del Quijote',
      'card3.desc': 'Recorre la Sierra de los Molinos y adéntrate en las maquinarias originales del siglo XVI que inspiraron a Miguel de Cervantes.',
      
      'card.explore': 'Explorar Experiencias &rarr;',
      
      'badge.tour': 'Interactive VR',
      'tour.title': 'La Criptana Oculta: Cueva 360°',
      'tour.desc': 'Arrastra en el visor de abajo para explorar la majestuosidad de una cava centenaria excavada bajo la Sierra.',
      'cave.drag': 'Arrastra para explorar la cueva subterránea',
      
      'footer.credit': 'Desarrollado de forma artesanal por <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': '¿Quieres un recorrido virtual o una web interactiva como esta para tu bodega o negocio rural? <a href="../index.html#contacto" class="audit-btn">Solicita una Auditoría Gratis</a>'
    },
    en: {
      'nav.bodegas': 'Wineries',
      'nav.cuevas': 'Cave Houses',
      'nav.molinos': 'Windmills',
      'nav.tour': '360° Virtual Tour',
      
      'hero.overline': 'Exclusive Experiences · Campo de Criptana',
      'hero.title': 'Land of<br><em>Giants.</em>',
      'hero.subtitle': 'Step into the cradle of Cervantes\' historic windmills. We invite you to explore ancient limestone caves, taste internationally awarded wines, and discover the most select essence of La Mancha.',
      'hero.cta1': 'Begin Exploration',
      'hero.cta2': 'Virtual Experience',
      'hero.scroll': 'Discover',
      
      'bento.overline': 'Destinations Guide',
      'bento.title': 'A sensory journey<br>tailored to you.',
      
      'badge.bodegas': 'Wine Tourism',
      'card1.title': 'Ancient Underground Wineries',
      'card1.desc': 'Visit subterranean barrel cellars hand-carved in the 16th century, where constant temperatures mature world-class D.O. La Mancha reds and whites.',
      
      'badge.cuevas': 'Premium Lodging',
      'card2.title': 'Stay in a Historic Cave House',
      'card2.desc': 'Sleep beneath the limestone rock in luxury climate-controlled cave houses, marrying rich history, absolute silence, and modern comfort.',
      
      'badge.molinos': 'Historic Heritage',
      'card3.title': 'The Windmills of Quixote',
      'card3.desc': 'Walk across the Windmill Ridge and step inside original 16th-century structures that inspired Miguel de Cervantes.',
      
      'card.explore': 'Explore Experiences &rarr;',
      
      'badge.tour': 'Interactive VR',
      'tour.title': 'Hidden Criptana: 360° Cave',
      'tour.desc': 'Drag the viewer below to explore the grandeur of a century-old cellar hand-carved beneath the Ridge.',
      'cave.drag': 'Drag to explore the subterranean cave',
      
      'footer.credit': 'Handcrafted with passion by <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': 'Want a virtual tour or an interactive website like this for your winery or rural venue? <a href="../index.html#contacto" class="audit-btn">Request a Free Audit</a>'
    }
  };

  var currentLang = 'es';

  function applyTranslations(lang) {
    currentLang = lang;
    var dict = i18n[lang];
    if (!dict) return;

    document.querySelectorAll('[data-key]').forEach(function (el) {
      var key = el.getAttribute('data-key');
      if (!dict[key]) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.innerHTML = dict[key];
      }
    });

    var btnEs = document.getElementById('btn-es');
    var btnEn = document.getElementById('btn-en');
    if (btnEs) btnEs.classList.toggle('active', lang === 'es');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    document.documentElement.setAttribute('lang', lang);
  }

  var btnEs = document.getElementById('btn-es');
  var btnEn = document.getElementById('btn-en');

  if (btnEs) btnEs.addEventListener('click', function () { applyTranslations('es'); });
  if (btnEn) btnEn.addEventListener('click', function () { applyTranslations('en'); });

  applyTranslations('es');
})();


/* ─── 6. Mobile Menu Toggle ─────────────────────────────────────────────── */
(function initMobileMenu() {
  var btn = document.getElementById('mobile-menu-btn');
  var nav = document.querySelector('.site-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    nav.classList.toggle('active');
    btn.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('active');
      btn.classList.remove('open');
    });
  });
})();
