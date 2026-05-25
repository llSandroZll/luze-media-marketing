'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CRIPTANA 360 — Launchable Local Directory & Trip Planner
   Bilingual i18n Engine · Live Category Filters · WhatsApp Itinerary Builder
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
      const delay = Math.min(idx * 100, 600);
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
  var PARTICLE_COUNT = 45;
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
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.25 + 0.05),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.005 + 0.002
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


/* ─── 3. Header Scroll Effect ───────────────────────────────────────────── */
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


/* ─── 4. Live Category Filters ──────────────────────────────────────────── */
(function initDirectoryFilters() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var directoryCards = document.querySelectorAll('.directory-card');
  if (!filterButtons.length || !directoryCards.length) return;

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Toggle active class
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      // Filter cards
      directoryCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
})();


/* ─── 5. Travel Itinerary Planner ───────────────────────────────────────── */
(function initItineraryPlanner() {
  var form = document.getElementById('planner-form');
  if (!form) return;

  // Set default date to tomorrow
  var dateInput = document.getElementById('planner-date');
  if (dateInput) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var yyyy = tomorrow.getFullYear();
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = yyyy + '-' + mm + '-' + dd;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fd = new FormData(form);
    var winery = fd.get('winery') || '';
    var restaurant = fd.get('restaurant') || '';
    var date = fd.get('date') || '';
    var groupSize = fd.get('group') || '';

    // Convert date format to readable DD/MM/YYYY
    var formattedDate = date;
    if (date) {
      var parts = date.split('-');
      if (parts.length === 3) {
        formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];
      }
    }

    // Build WhatsApp message
    var greeting = '¡Hola! Estoy planificando una escapada a Campo de Criptana para el día ' + formattedDate + ' para un grupo de ' + groupSize + ' personas.\n\n';
    var body = 'Mi itinerario sugerido:\n📍 1. Bodega: ' + winery + '\n🍽️ 2. Almuerzo: ' + restaurant + '\n✨ 3. Visita: Sierra de los Molinos y monumentos históricos.\n\n¿Podéis ayudarme con reservas o disponibilidad?';
    
    var waLink = 'https://wa.me/34600000000?text=' + encodeURIComponent(greeting + body);

    // Show custom elegant success overlay
    showSuccessOverlay(
      '¡Itinerario Generado!',
      'Hemos preparado tu plan personalizado para tu escapada en Campo de Criptana. Haz clic en el botón de abajo para enviarlo a WhatsApp y confirmar los detalles.',
      waLink
    );
  });
})();


/* ─── Success Overlay Helper ────────────────────────────────────────────── */
function showSuccessOverlay(title, message, waLink) {
  var existing = document.querySelector('.form-success-overlay');
  if (existing) existing.remove();

  // CSS injected if not already present
  if (!document.getElementById('overlay-css')) {
    const css = `
      .form-success-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(12, 10, 9, 0.92);
        backdrop-filter: blur(10px);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      .form-success-overlay.show {
        opacity: 1;
        pointer-events: auto;
      }
      .form-success-inner {
        text-align: center;
        color: #F5EDE0;
        max-width: 480px;
        padding: 3rem;
        border-radius: 6px;
        background: #1E1714;
        border: 1px solid rgba(201, 169, 110, 0.15);
        animation: successPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes successPop {
        0%   { opacity: 0; transform: scale(0.85) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      .success-icon {
        font-size: 3.5rem;
        color: #C9A96E;
        margin-bottom: 1rem;
        display: block;
      }
      .form-success-inner h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        color: #C9A96E;
        margin-bottom: 0.75rem;
      }
      .form-success-inner p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #A89E90;
        margin-bottom: 1.8rem;
      }
      .form-success-btn {
        display: inline-block;
        padding: 0.8rem 2rem;
        background: #C9A96E;
        color: #0C0A09;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        text-decoration: none;
        clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .form-success-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(201,169,110,0.3);
      }
    `;
    const style = document.createElement('style');
    style.id = 'overlay-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  var overlay = document.createElement('div');
  overlay.className = 'form-success-overlay';
  overlay.innerHTML =
    '<div class="form-success-inner">' +
      '<span class="success-icon">✦</span>' +
      '<h3>' + title + '</h3>' +
      '<p>' + message + '</p>' +
      '<a href="' + waLink + '" target="_blank" rel="noopener" class="form-success-btn" style="margin-right:10px;">Enviar a WhatsApp</a>' +
      '<button class="form-success-btn" style="background:#281F1B; color:#F5EDE0;">Cerrar</button>' +
    '</div>';

  document.body.appendChild(overlay);

  requestAnimationFrame(function () {
    overlay.classList.add('show');
  });

  var closeBtns = overlay.querySelectorAll('button');
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 500);
    });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 500);
    }
  });
}


/* ─── 6. Bilingual i18n Dictionary ─────────────────────────────────────── */
(function initI18n() {
  var i18n = {
    es: {
      'nav.directorio': 'Guía Local',
      'nav.planificador': 'Planificador de Viaje',
      'nav.explorar': 'Ver Directorio',
      
      'hero.overline': 'Directorio &amp; Guía de Experiencias · Campo de Criptana',
      'hero.title': 'Tierra de<br><em>Gigantes.</em>',
      'hero.subtitle': 'Explora la guía de Campo de Criptana. Encuentra de forma rápida y sencilla los horarios oficiales, direcciones en mapa y números de contacto de las bodegas, restaurantes y monumentos históricos más importantes.',
      'hero.cta1': 'Ver Directorio',
      'hero.cta2': 'Planificar Ruta',
      'hero.scroll': 'Descubrir',
      
      'directory.overline': 'Directorio Local',
      'directory.title': 'Lugares Imprescindibles',
      
      'filter.all': 'Todos',
      'filter.bodegas': 'Bodegas',
      'filter.restaurantes': 'Restaurantes',
      'filter.monumentos': 'Monumentos',
      
      'tag.monumento': 'Monumento',
      'tag.restaurante': 'Restaurante',
      'tag.bodega': 'Bodega',
      
      'spot1.name': 'Sierra de los Molinos',
      'spot1.desc': 'Los icónicos molinos de viento del siglo XVI que inspiraron las hazañas de Don Quijote. Tres de ellos (Burleta, Infante y Sardinero) conservan su maquinaria original.',
      'spot1.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana',
      'spot1.hours': 'Lunes a Domingo: 10:00 - 14:00 &amp; 16:00 - 19:00',
      
      'spot2.name': 'Restaurante Cueva La Martina',
      'spot2.desc': 'Una experiencia gastronómica inigualable. Cocina tradicional manchega servida dentro de una auténtica cueva del siglo XVI adaptada al confort moderno.',
      'spot2.address': 'Calle Rocinante, 13, 13610 Campo de Criptana',
      'spot2.hours': 'Martes a Domingo: 13:30 - 16:00 &amp; 20:30 - 00:00 | Lun: 13:30 - 16:00',
      
      'spot3.name': 'Restaurante Las Musas',
      'spot3.desc': 'Ubicado a los pies de la Sierra de los Molinos. Combina recetas manchegas con toques de autor, una cuidada bodega y una terraza espectacular con vistas al atardecer.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana',
      'spot3.hours': 'Lunes a Domingo: 13:30 - 16:30 &amp; 20:30 - 23:30',
      
      'spot4.name': 'Bodegas Castiblanque',
      'spot4.desc': 'Bodega familiar del siglo XIX ubicada en el casco urbano. Ofrece visitas guiadas a sus cuevas históricas y naves de crianza, con catas comentadas de sus vinos premium.',
      'spot4.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana',
      'spot4.hours': 'Lunes a Viernes: 09:00 - 19:00 | Sáb y Dom: 09:00 - 20:00 (Cita Previa)',
      
      'spot5.name': 'Bodegas Símbolo',
      'spot5.desc': 'Cooperativa local galardonada nacional e internacionalmente por sus vinos Airén y Tempranillo. Sus modernas instalaciones ofrecen talleres y visitas guiadas con reserva previa.',
      'spot5.address': 'Calle Concepción, 135, 13610 Campo de Criptana',
      'spot5.hours': 'Lunes a Viernes: 09:00 - 14:00 &amp; 16:00 - 19:00 | Sábado: 10:30 - 14:00',
      
      'btn.map': 'Ver en Google Maps &rarr;',
      
      'planner.overline': 'Organiza tu Ruta',
      'planner.title': 'Calcula tu Día en Criptana',
      'planner.desc': 'Selecciona las visitas y comidas que deseas programar en tu ruta, y generaremos un itinerario completo que podrás enviar directamente a tu WhatsApp para tenerlo a mano durante tu viaje.',
      'planner.group.bodegas': '1. Elige una Bodega',
      'planner.group.restaurantes': '2. Elige un Restaurante',
      'planner.form.date': 'Fecha del Viaje',
      'planner.form.group': 'Tamaño del Grupo',
      'planner.form.group.small': '2 – 4 personas',
      'planner.form.group.medium': '5 – 8 personas',
      'planner.form.group.large': '9 – 15 personas',
      'planner.form.submit': 'Generar Itinerario &amp; Enviar a WhatsApp',
      
      'footer.credit': 'Desarrollado de forma artesanal por <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': '¿Quieres digitalizar tu bodega o conseguir más clientes con una web interactiva? <a href="../index.html#contacto" class="audit-btn">Solicita una Auditoría Gratis</a>'
    },
    en: {
      'nav.directorio': 'Local Guide',
      'nav.planificador': 'Trip Planner',
      'nav.explorar': 'View Directory',
      
      'hero.overline': 'Experiences Guide &amp; Directory · Campo de Criptana',
      'hero.title': 'Land of<br><em>Giants.</em>',
      'hero.subtitle': 'Explore the ultimate Campo de Criptana directory. Easily find official opening hours, map locations, and contact numbers for the town\'s leading wineries, restaurants, and historical monuments.',
      'hero.cta1': 'View Directory',
      'hero.cta2': 'Plan Route',
      'hero.scroll': 'Discover',
      
      'directory.overline': 'Local Directory',
      'directory.title': 'Must-Visit Places',
      
      'filter.all': 'All',
      'filter.bodegas': 'Wineries',
      'filter.restaurantes': 'Restaurants',
      'filter.monumentos': 'Sights',
      
      'tag.monumento': 'Monument',
      'tag.restaurante': 'Restaurant',
      'tag.bodega': 'Winery',
      
      'spot1.name': 'Windmill Ridge (Sierra de los Molinos)',
      'spot1.desc': 'The iconic 16th-century windmills that inspired Don Quixote\'s legendary giants. Three of them (Burleta, Infante, and Sardinero) preserve their original historic machinery.',
      'spot1.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana',
      'spot1.hours': 'Monday to Sunday: 10:00 - 14:00 &amp; 16:00 - 19:00',
      
      'spot2.name': 'Cueva La Martina Restaurant',
      'spot2.desc': 'An incomparable culinary experience. Traditional La Mancha specialties served inside an authentic, hand-carved 16th-century cave house suited with modern comforts.',
      'spot2.address': 'Calle Rocinante, 13, 13610 Campo de Criptana',
      'spot2.hours': 'Tuesday to Sunday: 13:30 - 16:00 &amp; 20:30 - 00:00 | Mon: 13:30 - 16:00',
      
      'spot3.name': 'Las Musas Restaurant',
      'spot3.desc': 'Nestled directly at the foot of the windmill ridge. Blends local manchego gastronomy with modern fine-dining touches, a curated local wine cellar, and an sunset terrace.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana',
      'spot3.hours': 'Monday to Sunday: 13:30 - 16:30 &amp; 20:30 - 23:30',
      
      'spot4.name': 'Castiblanque Wineries',
      'spot4.desc': 'A prestigious 19th-century family winery located in the city center. Offers guided walks across historic cellars and barrel aging halls, with comentated private wine tastings.',
      'spot4.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana',
      'spot4.hours': 'Monday to Friday: 09:00 - 19:00 | Sat and Sun: 09:00 - 20:00 (Prior Booking)',
      
      'spot5.name': 'Simbolo Wineries',
      'spot5.desc': 'A prominent local cooperative awarded internationally for its signature Airén and Tempranillo wines. Their state-of-the-art facilities host guided tours and tasting workshops.',
      'spot5.address': 'Calle Concepción, 135, 13610 Campo de Criptana',
      'spot5.hours': 'Monday to Friday: 09:00 - 14:00 &amp; 16:00 - 19:00 | Saturday: 10:30 - 14:00',
      
      'btn.map': 'View on Google Maps &rarr;',
      
      'planner.overline': 'Plan Your Route',
      'planner.title': 'Calculate Your Day in Criptana',
      'planner.desc': 'Select the wineries and meals you wish to schedule for your route, and we will calculate a complete itinerary that you can send directly to your WhatsApp to keep handy during your trip.',
      'planner.group.bodegas': '1. Choose a Winery',
      'planner.group.restaurantes': '2. Choose a Restaurant',
      'planner.form.date': 'Trip Date',
      'planner.form.group': 'Group Size',
      'planner.form.group.small': '2 – 4 people',
      'planner.form.group.medium': '5 – 8 people',
      'planner.form.group.large': '9 – 15 people',
      'planner.form.submit': 'Generate Itinerary &amp; Send to WhatsApp',
      
      'footer.credit': 'Handcrafted with passion by <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': 'Want to digitalize your winery or get more customers with an interactive website? <a href="../index.html#contacto" class="audit-btn">Request a Free Audit</a>'
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


/* ─── 7. Mobile Menu Toggle ─────────────────────────────────────────────── */
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
