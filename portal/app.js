'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CRIPTANA 360 — Real, Launchable Local Travel Directory & Portal
   Whitewashed & Indigo Aesthetic · Real Business Sourced Data · Sunset & Clickable Articles
   ═══════════════════════════════════════════════════════════════════════════ */

(function CriptanaDirectoryApp() {

  /* ─── 1. Scroll-Triggered Fade-In Animations ───────────────────────────── */
  function initFadeAnimations() {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
      });
    }, {
      threshold: 0.05,
      rootMargin: '-20px 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ─── 2. Header Scroll Shadow Effect ───────────────────────────────────── */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ─── 3. Dynamic Category Tabs Filtering ───────────────────────────────── */
  function initCategoryTabs() {
    const tabs = document.querySelectorAll('.explorer-tab');
    const cards = document.querySelectorAll('.explorer-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const selectedCategory = tab.getAttribute('data-category');

        cards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');
          if (cardCategory === selectedCategory) {
            card.classList.add('active-category');
          } else {
            card.classList.remove('active-category');
          }
        });
      });
    });
  }

  /* ─── 4. Detailed Profile Slide-Out Drawer Engine ─────────────────────── */
  const spotsData = {
    spot1: {
      id: 'spot1',
      category: 'monumento',
      img: 'images/attraction_windmills.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Sierra+de+los+Molinos+Campo+de+Criptana'
    },
    spot2: {
      id: 'spot2',
      category: 'monumento',
      img: 'images/attraction_cave.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Cerro+de+la+Paz+Campo+de+Criptana'
    },
    spot3: {
      id: 'spot3',
      category: 'restaurante',
      img: 'images/real_las_musas.jpg',
      phone: '+34926589191',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Las+Musas+Campo+de+Criptana'
    },
    spot4: {
      id: 'spot4',
      category: 'restaurante',
      img: 'images/real_cueva_martina.jpg',
      phone: '+34926561476',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Cueva+La+Martina+Campo+de+Criptana'
    },
    spot7: {
      id: 'spot7',
      category: 'restaurante',
      img: 'images/real_lapulpe.jpg',
      phone: '+34640680146',
      mapUrl: 'https://maps.google.com/?q=Calle+Republica+Argentina+9+Campo+de+Criptana'
    },
    spot8: {
      id: 'spot8',
      category: 'restaurante',
      img: 'images/real_piccolo.jpg',
      phone: '+34926562048',
      mapUrl: 'https://maps.google.com/?q=Calle+Serna+25+Campo+de+Criptana'
    },
    spot9: {
      id: 'spot9',
      category: 'restaurante',
      img: 'images/real_ricote.jpg',
      phone: '+34623973528',
      mapUrl: 'https://maps.google.com/?q=Calle+Rocinante+15+Campo+de+Criptana'
    },
    spot5: {
      id: 'spot5',
      category: 'bodega',
      img: 'images/winery_castiblanque.jpg',
      phone: '+34926589147',
      mapUrl: 'https://maps.google.com/?q=Bodegas+Castiblanque+Campo+de+Criptana'
    },
    spot6: {
      id: 'spot6',
      category: 'bodega',
      img: 'images/winery_carmen.jpg',
      phone: '+34926561257',
      mapUrl: 'https://maps.google.com/?q=Vinicola+del+Carmen+Campo+de+Criptana'
    },
    spot10: {
      id: 'spot10',
      category: 'bodega',
      img: 'images/winery_vidaldelsaz.jpg',
      phone: '+34926560826',
      mapUrl: 'https://maps.google.com/?q=Calle+Maestro+Manzanares+57+Campo+de+Criptana'
    }
  };

  /* Reportages & Immersive Articles Data Configuration */
  const articlesData = {
    art1: {
      id: 'art1',
      img: 'images/attraction_windmills.png',
      categoryKey: 'art.history',
      readtimeKey: 'art.readtime5',
      linkSpot: 'spot1',
      linkSpotTextKey: 'art.link.spot1'
    },
    art2: {
      id: 'art2',
      img: 'images/attraction_cave.png',
      categoryKey: 'art.tourism',
      readtimeKey: 'art.readtime4',
      linkSpot: 'spot2',
      linkSpotTextKey: 'art.link.spot2'
    },
    art3: {
      id: 'art3',
      img: 'images/winery_castiblanque.jpg',
      categoryKey: 'art.winery',
      readtimeKey: 'art.readtime6',
      linkSpot: 'spot4', // links to cave dining / underground caves
      linkSpotTextKey: 'art.link.spot4'
    }
  };

  let activeLang = 'es';

  function initDetailDrawer() {
    const drawer = document.getElementById('detail-drawer');
    const closeBtn = document.getElementById('btn-close-drawer');
    const contentContainer = document.getElementById('drawer-content');
    if (!drawer || !closeBtn || !contentContainer) return;

    // Create dynamic backdrop element if it doesn't exist
    let backdrop = document.querySelector('.drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'drawer-backdrop';
      document.body.appendChild(backdrop);
    }

    function openDrawer(spotId) {
      const spot = spotsData[spotId];
      if (!spot) return;

      const titleKey = `${spotId}.name`;
      const descKey = `${spotId}.fulldesc`;
      const addrKey = `${spotId}.address`;
      const hrsKey = `${spotId}.hours`;
      
      const dict = translations[activeLang];
      
      const spotTitle = dict[titleKey] || '';
      const spotDesc = dict[descKey] || '';
      const spotAddr = dict[addrKey] || '';
      const spotHours = dict[hrsKey] || '';
      const phoneLabel = dict['drawer.phone'] || 'Teléfono';
      const hoursLabel = dict['drawer.hours'] || 'Horario';
      const addressLabel = dict['drawer.address'] || 'Dirección';
      const callBtnLabel = dict['drawer.btn.call'] || 'Llamar Directo';
      const mapBtnLabel = dict['drawer.btn.map'] || 'Cómo Llegar (Google Maps)';
      const bookingLabel = dict['drawer.booking'] || 'Reserva';
      const bookingVal = dict[`${spotId}.booking`] || 'No requerida';
      const priceLabel = dict['drawer.price'] || 'Precio';
      const priceVal = dict[`${spotId}.price`] || 'Libre';

      const html = `
        <img src="${spot.img}" alt="${spotTitle}" class="drawer-hero-img">
        <div class="drawer-profile-body">
          <h2 class="drawer-spot-title">${spotTitle}</h2>
          
          <div class="drawer-spot-full-desc">${spotDesc}</div>
          
          <div class="drawer-info-grid">
            <div class="drawer-info-item">
              <span style="font-size:1.1rem">📍</span>
              <div>
                <div class="drawer-info-label">${addressLabel}</div>
                <div class="drawer-info-val">${spotAddr}</div>
              </div>
            </div>
            <div class="drawer-info-item">
              <span style="font-size:1.1rem">⏰</span>
              <div>
                <div class="drawer-info-label">${hoursLabel}</div>
                <div class="drawer-info-val">${spotHours}</div>
              </div>
            </div>
            <div class="drawer-info-item">
              <span style="font-size:1.1rem">🏷️</span>
              <div>
                <div class="drawer-info-label">${priceLabel} / ${bookingLabel}</div>
                <div class="drawer-info-val">${priceVal} · <strong style="color:var(--anil-blue)">${bookingVal}</strong></div>
              </div>
            </div>
          </div>
          
          <div class="drawer-actions">
            <a href="tel:${spot.phone}" class="drawer-btn-primary">📞 ${callBtnLabel}</a>
            <a href="${spot.mapUrl}" target="_blank" rel="noopener" class="drawer-btn-outline">🗺️ ${mapBtnLabel}</a>
          </div>
        </div>
      `;

      contentContainer.innerHTML = html;
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function openArticleDrawer(articleId) {
      const art = articlesData[articleId];
      if (!art) return;

      const titleKey = `${articleId}.title`;
      const descKey = `${articleId}.fulldesc`;
      const dict = translations[activeLang];
      
      const catVal = dict[art.categoryKey] || 'Reportaje';
      const timeVal = dict[art.readtimeKey] || 'Lectura';
      const artTitle = dict[titleKey] || '';
      const artDesc = dict[descKey] || '';
      
      const backLabel = dict['art.btn.back'] || 'Volver / Close';
      const linkLabel = dict[art.linkSpotTextKey] || 'Explorar Lugar Relacionado';

      const html = `
        <img src="${art.img}" alt="${artTitle}" class="drawer-hero-img">
        <div class="drawer-profile-body">
          <span class="card-category-badge badge-monumento" style="margin-bottom:1rem; display:inline-block">${catVal} · ${timeVal}</span>
          <h2 class="drawer-spot-title" style="margin-top:0.5rem">${artTitle}</h2>
          
          <div class="drawer-spot-full-desc" style="font-size:0.95rem; line-height:1.8">${artDesc}</div>
          
          <div class="drawer-actions" style="margin-top:2.5rem; gap:0.9rem">
            <button class="drawer-article-link-btn" data-target-spot="${art.linkSpot}">🔍 ${linkLabel}</button>
            <button class="drawer-btn-outline" id="btn-close-article-drawer">${backLabel}</button>
          </div>
        </div>
      `;

      contentContainer.innerHTML = html;
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Bind close button within drawer
      const innerClose = contentContainer.querySelector('#btn-close-article-drawer');
      if (innerClose) {
        innerClose.addEventListener('click', closeDrawer);
      }

      // Bind link back to related listing
      const spotLinkBtn = contentContainer.querySelector('.drawer-article-link-btn');
      if (spotLinkBtn) {
        spotLinkBtn.addEventListener('click', function() {
          const targetSpot = spotLinkBtn.getAttribute('data-target-spot');
          closeDrawer();
          setTimeout(function() {
            openDrawer(targetSpot);
          }, 380); // Smooth micro-transition from article to spot listing!
        });
      }
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scroll
    }

    // Bind event delegation to handle all card and article click actions cleanly
    document.addEventListener('click', function(e) {
      // 1. Article Card Click
      const articleCard = e.target.closest('.clickable-article-card');
      if (articleCard) {
        const articleId = articleCard.getAttribute('data-article');
        openArticleDrawer(articleId);
        return;
      }

      // 2. Directory More Details Click
      const spotBtn = e.target.closest('.btn-more-details');
      if (spotBtn) {
        const spotId = spotBtn.getAttribute('data-spot');
        openDrawer(spotId);
      }
    });

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Escape key closes drawer
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    // Make content refreshes accessible on the fly for bilingual switching
    window.refreshDrawerContent = function() {
      if (drawer.classList.contains('open')) {
        const currentTitleEl = contentContainer.querySelector('.drawer-spot-title');
        if (currentTitleEl) {
          const currentText = currentTitleEl.innerText;
          
          // Check if it matches a Directory Spot
          for (const spotId in spotsData) {
            if (translations.es[`${spotId}.name`] === currentText || translations.en[`${spotId}.name`] === currentText) {
              openDrawer(spotId);
              return;
            }
          }
          
          // Check if it matches a Reportage Article
          for (const articleId in articlesData) {
            if (translations.es[`${articleId}.title`] === currentText || translations.en[`${articleId}.title`] === currentText) {
              openArticleDrawer(articleId);
              return;
            }
          }
        }
      }
    };
  }

  /* ─── 5. Dynamic Sunset Countdown Logic ────────────────────────────────── */
  function initSunsetCountdown() {
    const timerText = document.getElementById('sunset-timer');
    if (!timerText) return;

    function updateSunsetTimer() {
      const now = new Date();
      
      // Sunset time is approximately 21:20 in late May
      const sunset = new Date();
      sunset.setHours(21);
      sunset.setMinutes(20);
      sunset.setSeconds(0);

      const isSpanish = (activeLang === 'es');
      const timeDiff = sunset.getTime() - now.getTime();

      if (timeDiff > 0) {
        // Sunset is still ahead
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        let display = '';
        if (isSpanish) {
          display = `Atardecer hoy a las 21:20 · Quedan ${hours}h y ${mins} min. ¡Sube a los Molinos!`;
        } else {
          display = `Sunset tonight at 9:20 PM · ${hours}h ${mins}m left. Perfect view from Windmill ridge!`;
        }
        timerText.innerText = display;
      } else {
        // Sunset has passed
        let display = '';
        if (isSpanish) {
          display = 'Atardecer hoy fue a las 21:20 · ¡El mejor crepúsculo de La Mancha!';
        } else {
          display = 'Sunset occurred at 9:20 PM · Golden hour at the giants!';
        }
        timerText.innerText = display;
      }
    }

    updateSunsetTimer();
    setInterval(updateSunsetTimer, 30000); // Update every 30 seconds
  }

  /* ─── 6. Custom "Sunset Mode" & Stars Twinkle Effect ──────────────────── */
  function initSunsetToggle() {
    const toggleBtn = document.getElementById('sunset-toggle-btn');
    const starrySky = document.getElementById('starry-sky');
    if (!toggleBtn) return;

    // Twinkling stars generator
    function generateStars() {
      if (!starrySky) return;
      starrySky.innerHTML = ''; // Clear previous stars
      const starCount = 45;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 85}%`;
        star.style.animationDelay = `${Math.random() * 3.5}s`;
        starrySky.appendChild(star);
      }
    }

    // Set Sunset Mode state
    function setSunsetMode(isActive) {
      if (isActive) {
        document.body.classList.add('sunset-mode');
        toggleBtn.innerText = '☀️';
        toggleBtn.setAttribute('title', 'Sunrise / Daylight Mode');
        localStorage.setItem('criptana-sunset-mode', 'active');
        generateStars();
      } else {
        document.body.classList.remove('sunset-mode');
        toggleBtn.innerText = '🌅';
        toggleBtn.setAttribute('title', 'Sunset / After Dark Mode');
        localStorage.setItem('criptana-sunset-mode', 'inactive');
        if (starrySky) starrySky.innerHTML = '';
      }
    }

    toggleBtn.addEventListener('click', function () {
      const isSunset = document.body.classList.contains('sunset-mode');
      setSunsetMode(!isSunset);
    });

    // Check cached selection on reload
    const cachedPreference = localStorage.getItem('criptana-sunset-mode');
    if (cachedPreference === 'active') {
      setSunsetMode(true);
    } else {
      setSunsetMode(false);
    }
  }

  /* ─── 7. B2B Publicity Inquiry Modal Logic ────────────────────────────── */
  function initPublicityModal() {
    const modal = document.getElementById('publicity-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('btn-close-modal');
    const form = document.getElementById('publicity-form');
    const successMsg = document.getElementById('modal-success-msg');
    const submitBtn = document.getElementById('modal-submit-btn');

    if (!modal || !closeBtn || !form || !successMsg || !submitBtn) return;

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock scrolling
      form.classList.remove('hidden');
      successMsg.classList.remove('visible');
      form.reset();
      submitBtn.innerText = translations[activeLang]['modal.submit'] || 'Enviar Solicitud';
      submitBtn.disabled = false;
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scrolling
    }

    // Bind event delegation to open buttons (both light and dark modes)
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('open-publicity-btn')) {
        openModal();
      }
    });

    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape closes modal
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Form submission validation & simulated B2B funnel sending
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submittingText = activeLang === 'es' ? 'Enviando...' : 'Sending...';
      submitBtn.innerText = submittingText;
      submitBtn.disabled = true;

      // Simulate network request to B2B email inbox
      setTimeout(function() {
        form.classList.add('hidden');
        successMsg.classList.add('visible');

        // Automatically close modal after 4.5 seconds
        setTimeout(closeModal, 4500);
      }, 1500);
    });
  }

  /* ─── 8. Bilingual i18n Localization Dictionary ───────────────────────── */
  const translations = {
    es: {
      'nav.directorio': 'Guía Local',
      'nav.articulos': 'Reportajes',
      'nav.explorar': 'Explorar',
      
      'hero.overline': 'Guía de Viaje Oficial & Directorio Local · Campo de Criptana',
      'hero.title': 'Tierra de<br><em>Gigantes.</em>',
      'hero.subtitle': 'Descubre la esencia de Campo de Criptana. Una guía completa y actualizada con los horarios oficiales, localizaciones exactas en Google Maps y contactos directos de las mejores bodegas, restaurantes y monumentos históricos.',
      'hero.cta1': 'Ver Directorio',
      'hero.cta2': 'Leer Reportajes',
      'hero.scroll': 'Descubrir',
      
      'widget.weather': 'Campo de Criptana · Despejado · 24°C',
      
      'directory.overline': 'Directorio Exclusivo',
      'directory.title': 'Lugares Imprescindibles',
      
      'tab.monumentos': '📍 Monumentos y Lugares',
      'tab.restaurantes': '🍽️ Gastronomía manchega',
      'tab.bodegas': '🍷 Bodegas de Prestigio',
      
      'tag.monumento': 'Monumento',
      'tag.restaurante': 'Restaurante',
      'tag.bodega': 'Bodega',
      
      'btn.more': 'Saber Más &rarr;',
      
      'ad.label': 'PUBLICIDAD COOPERATIVA',
      'ad.title1': '¿Visitas las Cuevas?',
      'ad.desc1': 'Disfruta de una copa de Tempranillo gratuita con tu reserva en restaurantes locales colaboradores de Criptana 360.',
      'ad.title2': 'Alojamientos con Encanto',
      'ad.desc2': 'Duerme bajo la luz de las estrellas manchegas en una casa rural cueva restaurada con todo el lujo moderno.',
      'ad.cta': 'Tu Publicidad Aquí',

      // B2B Publicity Modal Form
      'modal.title': 'Anúnciate en Criptana 360',
      'modal.subtitle': 'Atrae tráfico natural y clientes locales. Envíanos los detalles de tu negocio y te ayudaremos a destacar.',
      'modal.label.biz': 'Nombre de la Empresa',
      'modal.label.name': 'Persona de Contacto',
      'modal.label.phone': 'Teléfono de Contacto',
      'modal.label.email': 'Correo Electrónico',
      'modal.label.msg': 'Mensaje / Detalles del Anuncio',
      'modal.submit': 'Enviar Solicitud',
      'modal.success.title': '¡Solicitud Recibida!',
      'modal.success.desc': 'Tu solicitud ha sido enviada a <strong>luzemediamarketing@google.com</strong>. Nos pondremos en contacto contigo en menos de 24 horas.',
      
      // Spot 1: Windmills
      'spot1.name': 'Sierra de los Molinos',
      'spot1.excerpt': 'Los históricos gigantes de viento del siglo XVI. El icónico conjunto monumental que inspiró las aventuras de Don Quijote de la Mancha.',
      'spot1.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot1.hours': 'Lunes a Domingo: 10:00 - 14:00 & 16:00 - 19:00',
      'spot1.booking': 'Libre / Gratuito',
      'spot1.price': 'Acceso Libre',
      'spot1.fulldesc': '<p>La Sierra de los Molinos constituye la estampa más representativa de Campo de Criptana y la silueta universal de la literatura española. Aquí se alza el imponente conjunto de gigantes de viento descritos por Miguel de Cervantes en el capítulo VIII del Quijote.</p><p>De los diez molinos que coronan la colina hoy en día, tres de ellos (<strong>Burleta, Infanto y Sardinero</strong>) conservan intacta la estructura y la impresionante maquinaria interna de madera del siglo XVI, siendo piezas únicas a nivel internacional. Varias veces al año se realiza una molienda tradicional en directo, abriendo las compuertas y haciendo rodar la inmensa piedra circular con la fuerza del viento.</p>',

      // Spot 2: Pastora Marcela
      'spot2.name': 'Casa-Cueva de la Pastora Marcela',
      'spot2.excerpt': 'Auténtica casa excavada en la piedra caliza en el Cerro de la Paz. Un testimonio vivo del modo de vida histórico de la comarca.',
      'spot2.address': 'Cerro de la Paz, s/n (Junto a Iglesia de la Paz), 13610 Campo de Criptana',
      'spot2.hours': 'Lunes a Domingo: 11:00 - 14:00 | Martes a Sábado: 16:30 - 19:00',
      'spot2.booking': 'Guía Turístico / Cita',
      'spot2.price': 'Entrada: 1.50€',
      'spot2.fulldesc': '<p>Ubicada en el pintoresco Cerro de la Paz, la Casa-Cueva de la Pastora Marcela ofrece una inmersión directa en la arquitectura tradicional excavada en la roca. Durante siglos, las familias de Criptana excavaron sus hogares directamente en el subsuelo calizo del cerro, aprovechando las excelentes propiedades térmicas del interior (temperatura constante de 18°C).</p><p>Esta casa-cueva ha sido perfectamente rehabilitada y amueblada con enseres domésticos históricos, aperos de labranza y herramientas de la época. Permite conocer cómo vivían los pastores y trabajadores tradicionales, la distribución de la cocina, las cuadras y el frescor único de los dormitorios subterráneos.</p>',

      // Spot 3: Las Musas
      'spot3.name': 'Restaurante Las Musas',
      'spot3.excerpt': 'Gastronomía manchega de vanguardia a los pies de los molinos. Una de las mejores terrazas panorámicas al atardecer en la zona.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana, Ciudad Real',
      'spot3.hours': 'Lunes a Domingo: 13:30 - 16:30 & 20:30 - 23:30',
      'spot3.booking': 'Recomendada',
      'spot3.price': 'Menú €€ - €€€',
      'spot3.fulldesc': '<p>Las Musas es el punto de encuentro gastronómico de referencia en Campo de Criptana, situado directamente al pie de la Sierra de los Molinos. Este restaurante combina a la perfección la esencia histórica de una antigua cueva manchega con una cocina contemporánea de gran nivel.</p><p>Su propuesta gastronómica destaca por actualizar platos tradicionales de La Mancha, como el pisto, las gachas, las migas de pastor y el cordero, añadiendo toques de autor sofisticados. Su terraza exterior es legendaria: una plataforma privilegiada para cenar o tomar una copa mientras contemplas el atardecer cayendo sobre la llanura y los molinos iluminados.</p>',

      // Spot 4: Cueva La Martina
      'spot4.name': 'Restaurante Cueva La Martina',
      'spot4.excerpt': 'Cena íntima dentro de una majestuosa cueva natural del siglo XVI. Platos de asado tradicional castellano y gran bodega de vinos locales.',
      'spot4.address': 'Calle Rocinante, 13, 13610 Campo de Criptana, Ciudad Real',
      'spot4.hours': 'Martes a Domingo: 13:30 - 16:00 & 20:30 - 00:00 | Lunes: 13:30 - 16:00',
      'spot4.booking': 'Imprescindible',
      'spot4.price': 'Carta €€ - €€€',
      'spot4.fulldesc': '<p>Comer en la Cueva La Martina es viajar en el tiempo a través de los sentidos. El restaurante se ubica por completo en el interior de una inmensa cueva excavada en la piedra caliza que data del siglo XVI, utilizada en su origen para la conservación y fermentación de cosechas.</p><p>El laberinto interior de galerías de piedra blanca con arcos y recovecos ofrece un ambiente de una intimidad y frescura inigualables. Su cocina es un homenaje a las raíces culinarias locales: carnes a la brasa, asados tradicionales, platos de caza de temporada y excelentes guisos manchegos. Todo ello armonizado con una amplia bodega enfocada en los vinos selectos de la denominación D.O. La Mancha.</p>',

      // Spot 7: La Pulpe
      'spot7.name': 'La Pulpe',
      'spot7.excerpt': 'Una pulpería y marisquería moderna con tapas exquisitas y un ambiente local vibrante. Delicias del mar en pleno corazón de La Mancha.',
      'spot7.address': 'Calle República Argentina, 9, 13610 Campo de Criptana, Ciudad Real',
      'spot7.hours': 'Martes a Domingo: 12:30 - 16:00 & 20:00 - 23:30 | Lunes: Cerrado',
      'spot7.booking': 'Recomendada los fines de semana',
      'spot7.price': 'Menú €€',
      'spot7.fulldesc': '<p>La Pulpe revoluciona la escena gastronómica local ofreciendo pescados frescos, exquisito pulpo a la gallega y mariscos de alta calidad en pleno centro de la comarca. Este local combina el aire tradicional de una taberna marinera con toques de diseño moderno.</p><p>Su carta destaca por su pulpo a la brasa, espectaculares tostas de mariscos y una selección estacional de tapas marineras creativas. Es el lugar perfecto para un picoteo gourmet informal en el casco urbano con amigos y familiares, acompañado de una excelente selección de vinos blancos locales D.O. La Mancha.</p>',

      // Spot 8: Piccolo
      'spot8.name': 'Pizzería Piccolo',
      'spot8.excerpt': 'Pizzas artesanales al horno de piedra y auténticos platos italianos en un ambiente acogedor y familiar.',
      'spot8.address': 'Calle Serna, 25, 13610 Campo de Criptana, Ciudad Real',
      'spot8.hours': 'Miércoles a Lunes: 19:30 - 23:30 | Martes: Cerrado',
      'spot8.booking': 'Abierta (Fácil acceso)',
      'spot8.price': 'Carta € - €€',
      'spot8.fulldesc': '<p>La Pizzería Piccolo ofrece un rincón italiano lleno de sabor y hospitalidad en el centro de Campo de Criptana. Regentado con mimo familiar, el local se especializa en pizzas de masa fina y crujiente, horneadas a la piedra con ingredientes de primera calidad.</p><p>Además de sus famosas pizzas tradicionales y gourmet, destaca por sus generosos platos de pasta fresca, lasañas caseras y postres tradicionales como el tiramisú. Su ambiente relajado, familiar y acogedor la convierte en la opción predilecta de los locales para cenas distendidas.</p>',

      // Spot 9: El Ricote
      'spot9.name': 'Restaurante El Ricote',
      'spot9.excerpt': 'Comida tradicional manchega con raciones generosas y vistas inmejorables de la Sierra de los Molinos. Ricas raciones al lado de los molinos.',
      'spot9.address': 'Calle Rocinante, 15, 13610 Campo de Criptana, Ciudad Real',
      'spot9.hours': 'Lunes a Domingo: 11:30 - 17:00 & 20:00 - 23:30 | Miércoles: Cerrado por descanso',
      'spot9.booking': 'Recomendada (Terrazas cotizadas)',
      'spot9.price': 'Carta € - €€',
      'spot9.fulldesc': '<p>El Restaurante El Ricote es un auténtico balcón gastronómico manchego situado estratégicamente en la loma del Cerro, justo en el entorno monumental de la Sierra de los Molinos. Con una cocina profundamente enraizada en las tradiciones de la comarca, es ideal para recuperar fuerzas durante tu visita cultural.</p><p>Su carta está repleta de platos tradicionales cocinados de forma casera: asadillos manchegos, calderetas de cordero, duelos y quebrantos, y generosas raciones de embutidos ibéricos y quesos manchegos curados. Su joya es su terraza exterior, donde podrás saborear cocina tradicional a escasos metros de los molinos centenarios bajo una brisa única.</p>',

      // Spot 5: Castiblanque
      'spot5.name': 'Bodegas Castiblanque',
      'spot5.excerpt': 'Boutique familiar fundada en una bodega del siglo XIX. Ofrece selectas catas guiadas y paseos entre barricas de roble e historia.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real',
      'spot5.hours': 'Lun a Vie: 09:00 - 14:00 & 15:00 - 19:00 | Sáb y Dom: 09:00 - 20:00',
      'spot5.booking': 'Cita Previa',
      'spot5.price': 'Experiencias desde €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque es un templo del vino de carácter familiar, ubicado en pleno casco urbano del municipio en un edificio señorial restaurado del siglo XIX. La bodega aúna las técnicas agrícolas tradicionales de la comarca con tecnología enológica vanguardista.</p><p>Sus experiencias de enoturismo son célebres, e incluyen visitas guiadas a través de su nave histórica de barricas de roble y explicaciones detalladas del ciclo biológico de la vid. La visita culmina con una cata guiada por expertos sumilleres de sus marcas premium (como Baldor y Castiblanque), marinados con productos de la tierra como quesos y aceites selectos.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Vinícola del Carmen',
      'spot6.excerpt': 'La cooperativa en activo más antigua de España (1897). Visita sus modernas instalaciones con degustaciones premiadas D.O. La Mancha.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana',
      'spot6.hours': 'Lunes a Viernes: 09:00 - 13:30 & 15:30 - 19:00 | Sábados: 10:00 - 14:00',
      'spot6.booking': 'Cita Previa (Grupo)',
      'spot6.price': 'Visita / Tienda',
      'spot6.fulldesc': '<p>Fundada en el año 1897, Vinícola del Carmen ostenta el orgullo de ser la cooperativa vinícola en activo de forma ininterrumpida más antigua de toda España. Es la verdadera alma agrícola de Campo de Criptana, aunando los esfuerzos de cientos de agricultores locales.</p><p>Sus enormes instalaciones representan el equilibrio perfecto entre la escala industrial moderna y la devoción tradicional. Destaca en la elaboración de vinos monovarietales a partir de la uva Airén (la cepa por excelencia de la llanura) y el Tempranillo. Sus visitas grupales detallan la escala masiva de la molienda del mosto y naves de embotellado, finalizando con catas comentadas y venta directa de vinos de excelente relación calidad-precio.</p>',

      // Spot 10: Vidal del Saz
      'spot10.name': 'Bodegas Vidal del Saz',
      'spot10.excerpt': 'Tradición y modernidad desde 1930. Vinos elegantes y expresivos criados en barrica bajo la esencia de la comarca.',
      'spot10.address': 'Calle Maestro Manzanares, 57, 13610 Campo de Criptana, Ciudad Real',
      'spot10.hours': 'Lunes a Viernes: 08:30 - 13:30 & 15:30 - 19:00 | Sábados: 09:00 - 13:00',
      'spot10.booking': 'Cita Previa',
      'spot10.price': 'Catas & Enoturismo',
      'spot10.fulldesc': '<p>Bodegas Vidal del Saz atesora casi un siglo de excelencia vinícola en la comarca de Pozo Hondo de Campo de Criptana. Fundada en 1930, la bodega ha sabido transmitir de generación en generación la devoción por el cuidado extremo de la vid y la innovación de las variedades manchegas.</p><p>La bodega destaca por sus vinos tintos expresivos criados en barricas de roble francés y americano (como su emblemática marca Vidal del Saz y sus vinos premium de autor). Sus visitas de enoturismo permiten descubrir naves de fermentación vanguardistas combinadas con catas detalladas del terroir local manchego.</p>',

      // Drawer UI Label translations
      'drawer.phone': 'Teléfono de Contacto',
      'drawer.hours': 'Horario Comercial',
      'drawer.address': 'Ubicación y Dirección',
      'drawer.booking': 'Tipo de Acceso',
      'drawer.price': 'Rango de Precios',
      'drawer.btn.call': 'Llamar al Establecimiento',
      'drawer.btn.map': 'Ver Ruta en Google Maps &rarr;',
      
      // Articles Section Translations
      'articles.overline': 'Reportajes &amp; Entorno',
      'articles.title': 'Descubre Criptana en Profundidad',
      'art.history': 'HISTORIA',
      'art.tourism': 'TURISMO',
      'art.winery': 'ENOTURISMO',
      'art.readtime4': '4 MIN LECTURA',
      'art.readtime5': '5 MIN LECTURA',
      'art.readtime6': '6 MIN LECTURA',
      'art.btn.back': 'Volver al Portal &rarr;',
      
      // Specific Reportage Articles full texts
      'art.link.spot1': 'Ver Sierra de los Molinos en la Guía',
      'art1.title': 'La Batalla contra los Gigantes: Burleta, Infanto y Sardinero',
      'art1.fulldesc': '<p>Corría el año 1605 cuando Miguel de Cervantes Saavedra inmortalizó en el capítulo VIII del Don Quijote de la Mancha una de las batallas más cómicas y universales de la literatura universal. Frente a los ojos alucinados del hidalgo manchego, treinta o cuarenta "desaforados gigantes" se erguían desafiantes. Aquellos gigantes no eran otros que los molinos de viento de Campo de Criptana.</p><p><strong>Una proeza del siglo XVI:</strong> En una meseta donde el agua para los molinos hidráulicos escaseaba, la introducción de la tecnología del molino de viento de origen centroeuropeo revolucionó la agricultura manchega. De los más de treinta molinos que llegaron a coronar el Cerro de la Paz, hoy conservamos diez majestuosas siluetas.</p><p>Tres de ellos—<strong>Burleta, Infanto y Sardinero</strong>—son verdaderos museos vivos: conservan intacta la maquinaria original de madera de encina y pino del siglo XVI. Cada uno de sus engranajes, la inmensa viga móvil (palo de gobierno) y las muelas circulares de piedra caliza siguen listos para girar con la sola fuerza del viento en las moliendas tradicionales periódicas.</p>',
      
      'art.link.spot2': 'Ver Casa-Cueva Pastora Marcela en la Guía',
      'art2.title': 'Paseo Añil: La Ruta por las Calles Blancas del Albaicín Manchego',
      'art2.fulldesc': '<p>Campo de Criptana esconde una joya urbana de raíces mudéjares y moriscas en sus cuestas más elevadas: el histórico barrio del Albaicín. Este laberinto de callejuelas estrechas, recovecos silenciosos y escalinatas encaladas te transporta a un modo de vida tradicional y pausado.</p><p><strong>El porqué del Añil y la Cal:</strong> Al pasear, lo primero que cautiva la vista es el bellísimo contraste cromático. Las fachadas están pintadas de una cal blanca deslumbrante, interrumpida únicamente en sus bases por una franja ancha de color azul cobalto intenso (el zócalo añil). Lejos de ser un capricho estético, esta pintura tradicional manchega tenía una utilidad crucial: la cal blanca repele los intensos rayos del sol veraniego, manteniendo el interior fresco, mientras que la tonalidad azul del zócalo añil ayudaba a ahuyentar a los mosquitos y reflejaba la luz solar.</p><p><strong>La Ruta Recomendada:</strong> Inicia el paseo en la Plaza Mayor y sube lentamente por la sinuosa Calle Fuente del Caño. Al final de la ascensión, coronando el Cerro de la Paz, el barrio se abre a un mirador natural impresionante sobre los campos de trigo y cepas de La Mancha, el lugar perfecto para ver caer el sol sobre el cerro.</p>',
      
      'art.link.spot4': 'Ver Restaurante Cueva La Martina en la Guía',
      'art3.title': 'Crianza bajo Tierra: El Secreto del Vino en las Cuevas Históricas',
      'art3.fulldesc': '<p>La Mancha es la mayor llanura vinícola del planeta, pero en Campo de Criptana, el mayor secreto del vino no se encuentra bajo el sol abrasador, sino enterrado a doce metros de profundidad. Bajo el laberinto de calles del casco histórico y el cerro yacen decenas de cuevas excavadas a mano en la roca caliza dura.</p><p><strong>El Climatizador de la Historia:</strong> Durante los siglos XVI al XIX, las familias vinícolas de Criptana descubrieron que la piedra blanca caliza era el aislante térmico perfecto. Con paciencia infinita y cincel en mano, excavaron bodegas subterráneas profundas. En estas galerías, el vino reposaba en inmensas tinajas de barro a una temperatura constante de 18°C y con un nivel de humedad perfecto del 75% durante todo el año, a salvo de los inviernos gélidos y los veranos abrasadores de la estepa manchega.</p><p>Hoy en día, pasear por el interior de estas cuevas históricas reconvertidas en restaurantes o salas de barricas, como la majestuosa <strong>Cueva La Martina</strong>, te permite respirar el olor añejo del roble y el barro, y entender por qué bajo tierra nace el verdadero carácter D.O. La Mancha.</p>',

      'footer.credit': 'Desarrollado de forma artesanal por <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': '¿Quieres digitalizar tu bodega o conseguir más clientes con una web interactiva? <a href="../index.html#contacto" class="audit-btn">Solicita una Auditoría Gratis</a>'
    },
    en: {
      'nav.directorio': 'Local Guide',
      'nav.articulos': 'Articles',
      'nav.explorar': 'Explore',
      
      'hero.overline': 'Official Travel Guide & Local Directory · Campo de Criptana',
      'hero.title': 'Land of<br><em>Giants.</em>',
      'hero.subtitle': 'Discover the soul of Campo de Criptana. A comprehensive, real-time updated directory featuring official opening hours, precise Google Maps locations, and direct contact details for the town\'s finest sights, dining, and historical wineries.',
      'hero.cta1': 'Explore Directory',
      'hero.cta2': 'Read Sights Guides',
      'hero.scroll': 'Discover',
      
      'widget.weather': 'Campo de Criptana · Clear · 24°C',
      
      'directory.overline': 'Exclusive Directory',
      'directory.title': 'Must-Visit Places',
      
      'tab.monumentos': '📍 Sights & Culture',
      'tab.restaurantes': '🍽️ Dining & Gastronomy',
      'tab.bodegas': '🍷 Prestigious Wineries',
      
      'tag.monumento': 'Sight',
      'tag.restaurante': 'Restaurant',
      'tag.bodega': 'Winery',
      
      'btn.more': 'Learn More &rarr;',
      
      'ad.label': 'COOPERATIVE SPONSORSHIP',
      'ad.title1': 'Visiting the Caves?',
      'ad.desc1': 'Enjoy a complimentary glass of vintage Tempranillo with your booking at participating Criptana 360 local dining venues.',
      'ad.title2': 'Charming Cave Lodges',
      'ad.desc2': 'Sleep beneath the stars of La Mancha in a beautifully restored traditional cave house outfitted with absolute modern luxury.',
      'ad.cta': 'Your Ad Here',

      // B2B Publicity Modal Form
      'modal.title': 'Advertise on Criptana 360',
      'modal.subtitle': 'Attract organic traffic and local clients. Send us your business details and we\'ll help you stand out.',
      'modal.label.biz': 'Business Name',
      'modal.label.name': 'Contact Person',
      'modal.label.phone': 'Contact Telephone',
      'modal.label.email': 'Email Address',
      'modal.label.msg': 'Message / Advertisement Details',
      'modal.submit': 'Send Inquiry',
      'modal.success.title': 'Inquiry Received!',
      'modal.success.desc': 'Your request has been forwarded to <strong>luzemediamarketing@google.com</strong>. We will get in touch with you in less than 24 hours.',
      
      // Spot 1: Windmills
      'spot1.name': 'Sierra de los Molinos (Windmills)',
      'spot1.excerpt': 'The legendary 16th-century windmills. The iconic historical landmark that inspired Don Quixote\'s battle against the giants.',
      'spot1.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot1.hours': 'Monday to Sunday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot1.booking': 'Free Entry / Open Access',
      'spot1.price': 'Free Access',
      'spot1.fulldesc': '<p>The Sierra de los Molinos ridge represents the most definitive image of Campo de Criptana and the universal silhouette of Spanish classical literature. Here stands the majestic group of wooden-bladed windmills described by Miguel de Cervantes in Chapter VIII of Don Quixote.</p><p>Of the ten windmills standing on the ridge today, three (<strong>Burleta, Infanto, and Sardinero</strong>) preserve their original 16th-century structures and impressive wooden internal machinery entirely intact, standing as unique historic relics worldwide. Several times a year, a traditional grain milling is performed live, turning the sails to grind wheat using wind power.</p>',

      // Spot 2: Pastora Marcela
      'spot2.name': 'Pastora Marcela Cave House',
      'spot2.excerpt': 'An authentic historical home hand-carved directly into the limestone cliffs of Cerro de la Paz. A living testament to regional cave living.',
      'spot2.address': 'Cerro de la Paz, s/n (Next to Church of la Paz), 13610 Campo de Criptana',
      'spot2.hours': 'Monday to Sunday: 11:00 AM - 2:00 PM | Tuesday to Saturday: 4:30 PM - 7:00 PM',
      'spot2.booking': 'Guided Access / Ticket',
      'spot2.price': 'Entrance: 1.50€',
      'spot2.fulldesc': '<p>Located on the scenic Cerro de la Paz hill, the Casa-Cueva de la Pastora Marcela offers a direct window into the historic troglodyte cave architecture of La Mancha. For centuries, Criptana\'s working families dug their homes directly into the soft white limestone subsoil, utilizing its perfect thermal insulation (maintaining a constant 18°C temperature year-round).</p><p>This cave house has been beautifully restored and decorated with original antique furnishings, agricultural implements, and household tools. Visitors can explore the historical living quarters, the subterranean stable, and experience the unique cool atmosphere of underground bedrooms.</p>',

      // Spot 3: Las Musas
      'spot3.name': 'Las Musas Restaurant',
      'spot3.excerpt': 'Avant-garde Manchego gastronomy served at the foot of the historic windmills. Home to one of the region\'s best sunset dining terraces.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana, Ciudad Real',
      'spot3.hours': 'Monday to Sunday: 1:30 PM - 4:30 PM & 8:30 PM - 11:30 PM',
      'spot3.booking': 'Highly Recommended',
      'spot3.price': 'Menu €€ - €€€',
      'spot3.fulldesc': '<p>Las Musas stands as the premier culinary meeting place in Campo de Criptana, nestled directly at the foot of the historic windmill hill. The restaurant masterfully integrates the rustic white limestone of an ancient cave with high-end, contemporary dining rooms.</p><p>Its gastronomy focuses on updating classic La Mancha dishes—such as pisto, gachas, migas, and roasted lamb—by adding refined modern culinary touches. Their outdoor terrace is legendary, offering a front-row seat to dine or enjoy a glass of wine as the sunset paints the plains below the illuminated giants.</p>',

      // Spot 4: Cueva La Martina
      'spot4.name': 'Cueva La Martina Restaurant',
      'spot4.excerpt': 'Intimate dining within a majestic, hand-excavated 16th-century cave. Acclaimed for traditional slow-roasted meats and local cellared wines.',
      'spot4.address': 'Calle Rocinante, 13, 13610 Campo de Criptana, Ciudad Real',
      'spot4.hours': 'Tuesday to Sunday: 1:30 PM - 4:00 PM & 8:30 PM - Midnight | Mon: 1:30 PM - 4:00 PM',
      'spot4.booking': 'Prior Booking Vital',
      'spot4.price': 'A la Carte €€ - €€€',
      'spot4.fulldesc': '<p>Dining at Cueva La Martina is an evocative journey back in time. The entire restaurant is set inside a vast cave carved out of the limestone in the 16th century, originally used to store and age local grain harvests.</p><p>The labyrinthine interior galleries—composed of white stone walls, arches, and cozy alcoves—provide an incomparably intimate and cool atmosphere. The kitchen celebrates historic local recipes: oak-coal roasted meats, castilian stews, and seasonal game dishes. The meal is accompanied by a superb wine cellar focused on D.O. La Mancha premium labels.</p>',

      // Spot 7: La Pulpe
      'spot7.name': 'La Pulpe Seafood Taberna',
      'spot7.excerpt': 'A modern seafood restaurant and tapas bar with an exceptional local vibe. Ocean specialties served in the heart of dry La Mancha.',
      'spot7.address': 'Calle República Argentina, 9, 13610 Campo de Criptana, Ciudad Real',
      'spot7.hours': 'Tuesday to Sunday: 12:30 PM - 4:00 PM & 8:00 PM - 11:30 PM | Mon: Closed',
      'spot7.booking': 'Highly Recommended on Weekends',
      'spot7.price': 'Menu €€',
      'spot7.fulldesc': '<p>La Pulpe has revolutionized the local dining scene by importing fresh oceanic catches, exquisite Galician octopus ("pulpo a la gallega"), and premium shellfish. The tavern perfectly blends maritime elements with contemporary inland design.</p><p>Their menu highlights include wood-grilled octopus, spectacular seafood toast spreads, and a shifting creative seasonal tapas chalkboard. It is a highly popular social hub for an informal gourmet bite and a glass of refreshing white wine from La Mancha DO.</p>',

      // Spot 8: Piccolo
      'spot8.name': 'Piccolo Pizzería',
      'spot8.excerpt': 'Stone-oven artisanal pizzas and authentic Italian classics in a cozy, welcoming family setting.',
      'spot8.address': 'Calle Serna, 25, 13610 Campo de Criptana, Ciudad Real',
      'spot8.hours': 'Wednesday to Monday: 7:30 PM - 11:30 PM | Tue: Closed',
      'spot8.booking': 'Walk-In Friendly',
      'spot8.price': 'A la Carte € - €€',
      'spot8.fulldesc': '<p>Pizzería Piccolo offers a delightful corner of Italian culinary art and warm hospitality right in Criptana\'s core. Hand-managed as a loving family business, they excel in thin, ultra-crispy sourdough pizzas baked over stone shelves with authentic imported ingredients.</p><p>Beyond traditional and gourmet pizzas, guests enjoy generous pasta plates, home-baked lasagna, and classic sweet treats like homemade tiramisu. The relaxed, cozy atmosphere makes it the primary local choice for group and family dinners.</p>',

      // Spot 9: El Ricote
      'spot9.name': 'El Ricote Restaurant',
      'spot9.excerpt': 'Traditional Manchego cuisine featuring generous portions and premium panoramic terraces near the windmills.',
      'spot9.address': 'Calle Rocinante, 15, 13610 Campo de Criptana, Ciudad Real',
      'spot9.hours': 'Monday to Sunday: 11:30 AM - 5:00 PM & 8:00 PM - 11:30 PM | Wed: Closed',
      'spot9.booking': 'Prior Reservation Recommended',
      'spot9.price': 'A la Carte € - €€',
      'spot9.fulldesc': '<p>El Ricote Restaurant functions as a premium culinary balcony, strategically situated on the upper ridge right next to the historic Campo de Criptana windmill park. Specializing in highly authentic local recipes, it is the best place to recharge during a sightseeing tour.</p><p>The menu focuses on generous, home-cooked regional favorites: slow-simmered lamb caldereta, duelos y quebrantos (scrambled eggs with pork belly), and hand-sliced Iberian meats and aged Manchego cheeses. Their outdoor terrace is legendary, allowing you to dine within a stone\'s throw of the centuries-old windmills under a gorgeous breeze.</p>',

      // Spot 5: Castiblanque
      'spot5.name': 'Castiblanque Wineries',
      'spot5.excerpt': 'A family-owned boutique winery founded inside a restored 19th-century manor. Features private tastings and historic barrel aging halls.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real',
      'spot5.hours': 'Mon to Fri: 9:00 AM - 2:00 PM & 3:00 PM - 7:00 PM | Sat & Sun: 9:00 AM - 8:00 PM',
      'spot5.booking': 'Prior Booking Required',
      'spot5.price': 'Tastings from €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque is a family-run cathedral of wine, located in the heart of the town center within a magnificently restored 19th-century noble mansion. The cellar combines time-tested traditional farming values with cutting-edge winemaking technology.</p><p>Their wine tourism packages are highly regarded, featuring expert-guided walks through their historic barrel cellars and detailed accounts of the grapevine growth cycle. The tour finishes with a commentary-led tasting of their signature brands (such as Baldor and Castiblanque), paired with local artisanal cheeses and oils.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Vinícola del Carmen',
      'spot6.excerpt': 'The oldest active cooperative winery in Spain (1897). Tour their state-of-the-art facilities with D.O. La Mancha tastings.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana',
      'spot6.hours': 'Monday to Friday: 9:00 AM - 1:30 PM & 3:30 PM - 7:00 PM | Saturdays: 10:00 AM - 2:00 PM',
      'spot6.booking': 'Prior Group Booking',
      'spot6.price': 'Tours / Shop',
      'spot6.fulldesc': '<p>Established in 1897, Vinícola del Carmen holds the proud distinction of being the oldest continuously operating cooperative winery in Spain. It is the agricultural heartbeat of Campo de Criptana, uniting the heritage of hundreds of local family vineyards.</p><p>Their massive state-of-the-art production halls represent the perfect balance between massive scale and artisanal devotion. They excel in crafting single-varietal wines from the indigenous white Airén grape and traditional Tempranillo. Guided group tours detail the massive crushing vats and bottling lines, ending with professional tastings.</p>',

      // Spot 10: Vidal del Saz
      'spot10.name': 'Vidal del Saz Wineries',
      'spot10.excerpt': 'Tradition and innovation since 1930. Elegant and expressive oak-aged wines embodying the spirit of the local soils.',
      'spot10.address': 'Calle Maestro Manzanares, 57, 13610 Campo de Criptana, Ciudad Real',
      'spot10.hours': 'Monday to Friday: 8:30 AM - 1:30 PM & 3:30 PM - 7:00 PM | Saturdays: 9:00 AM - 1:00 PM',
      'spot10.booking': 'Prior Booking Vital',
      'spot10.price': 'Wine Tastings',
      'spot10.fulldesc': '<p>Bodegas Vidal del Saz has nurtured almost a century of winemaking excellence in the legendary Pozo Hondo district of Campo de Criptana. Established in 1930, the winery has successfully handed down from generation to generation a profound dedication to absolute vine care and local variety innovation.</p><p>They are famous for their deeply expressive red wines aged in select French and American oak casks (such as their flagship Vidal del Saz label and signature premium series). Guided visits tour their state-of-the-art fermentation halls, followed by highly professional commented tastings of their complex wines.</p>',

      // Drawer UI Label translations
      'drawer.phone': 'Contact Telephone',
      'drawer.hours': 'Business Hours',
      'drawer.address': 'Location & Address',
      'drawer.booking': 'Access Type',
      'drawer.price': 'Price Range',
      'drawer.btn.call': 'Call Establishment Now',
      'drawer.btn.map': 'View Route on Google Maps &rarr;',
      
      // Articles Section Translations
      'articles.overline': 'Features &amp; Culture',
      'articles.title': 'Explore Criptana in Depth',
      'art.history': 'HISTORY',
      'art.tourism': 'TOURISM',
      'art.winery': 'ENOTURISMO',
      'art.readtime4': '4 MIN READ',
      'art.readtime5': '5 MIN READ',
      'art.readtime6': '6 MIN READ',
      'art.btn.back': 'Back to Portal &rarr;',
      
      // Specific Reportage Articles full texts
      'art.link.spot1': 'View Sierra de los Molinos in Guide',
      'art1.title': 'The Battle Against Giants: Burleta, Infanto and Sardinero',
      'art1.fulldesc': '<p>It was the year 1605 when Miguel de Cervantes Saavedra immortalized in Chapter VIII of Don Quixote one of the most comical and universal battles in world literature. Before the deluded eyes of the noble knight, thirty or forty "monstrous giants" stood defiantly. Those giants were none other than the wooden windmills of Campo de Criptana.</p><p><strong>A 16th-Century Engineering Marvel:</strong> In a dry plateau where water for traditional watermills was extremely scarce, the introduction of windmill technology of central European origin revolutionized Manchego farming. Out of the thirty-plus windmills that once crowned the Cerro, today ten majestic silhouettes remain standing.</p><p>Three of these—<strong>Burleta, Infanto, and Sardinero</strong>—are true living museums, retaining their original 16th-century structural timbers and wooden gears completely intact. Every cogwheel, the massive steering rudder beam (palo de gobierno), and the heavy limestone grinding wheels stand fully ready to rotate under pure wind power during public traditional millings.</p>',
      
      'art.link.spot2': 'View Pastora Marcela Cave House in Guide',
      'art2.title': 'The Indigo Walk: Strolling the White Streets of Criptana\'s Albaicín',
      'art2.fulldesc': '<p>Campo de Criptana hides a beautiful urban jewel of Mudéjar and Moorish roots on its highest slopes: the historic Albaicín neighborhood. This labyrinth of narrow alleys, silent corners, and whitewashed staircases transports visitors back to an ancient, peaceful way of living.</p><p><strong>The Story Behind White & Cobalt Blue:</strong> As you wander, the first thing that captures the eye is the beautiful color contrast. The building facades are painted in a dazzling white lime plaster (cal), bordered at the ground by a thick stripe of intense cobalt blue paint (the zócalo añil). Far from a simple visual whim, this traditional Manchego trim served a vital purpose: the pure white lime reflected the fierce summer sun to keep house interiors cool, while the unique indigo hue repelled insects and softened the glare of the hot ground.</p><p><strong>The Story/Walking Route:</strong> Start your stroll at the Plaza Mayor and walk slowly up the winding Calle Fuente del Caño. At the peak of the climb, reaching the Cerro de la Paz chapel, the quarter opens into a stunning natural viewpoint overlooking the vast wheat fields and vineyards of La Mancha, offering the perfect spot to watch the sun slip below the horizon.</p>',
      
      'art.link.spot4': 'View Cueva La Martina Cave in Guide',
      'art3.title': 'Underground Aging: The Subterranean Secret of Wine Caves',
      'art3.fulldesc': '<p>La Mancha is the largest continuous vineyard plain on Earth, but in Campo de Criptana, the greatest secret of winemaking is found not under the blazing sun, but buried forty feet beneath the ground. Beneath the historic streets and the rocky ridge lie dozens of caves carved entirely by hand out of the hard limestone subsoil.</p><p><strong>History\'s Natural Climate Control:</strong> During the 16th to 19th centuries, winemaking families discovered that the porous white limestone was the ultimate thermal insulator. With infinite patience and cold chisels, they carved deep underground cellars. In these galleries, aging wine rested inside massive clay jars (tinajas) at an absolute constant temperature of 18°C (64°F) and a perfect 75% humidity year-round, completely isolated from freezing winters and scorching summers.</p><p>Today, stepping inside these historic cave systems repurposed as modern cellars or intimate restaurants—such as the majestic <strong>Cueva La Martina</strong>—allows you to breathe in the deep aged oak aroma and understand why La Mancha\'s finest character is born beneath the stone.</p>',

      'footer.credit': 'Handcrafted with passion by <a href="../index.html" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': 'Want to digitalize your winery or get more customers with an interactive website? <a href="../index.html#contacto" class="audit-btn">Request a Free Audit</a>'
    }
  };

  function applyLanguage(lang) {
    activeLang = lang;
    const dict = translations[lang];
    if (!dict) return;

    document.querySelectorAll('[data-key]').forEach(function (el) {
      const key = el.getAttribute('data-key');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    if (btnEs) btnEs.classList.toggle('active', lang === 'es');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    document.documentElement.setAttribute('lang', lang);

    // Refresh dynamic sunset text based on language
    const sunsetTimerText = document.getElementById('sunset-timer');
    if (sunsetTimerText) {
      // Re-run countdown calculation immediately
      window.dispatchEvent(new Event('resize')); 
    }

    // Refresh drawer content if open to update labels instantly
    if (window.refreshDrawerContent) {
      window.refreshDrawerContent();
    }
  }

  function initLanguageSelector() {
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    if (btnEs) {
      btnEs.addEventListener('click', function () { applyLanguage('es'); });
    }
    if (btnEn) {
      btnEn.addEventListener('click', function () { applyLanguage('en'); });
    }

    applyLanguage('es'); // Default is Spanish
  }

  /* ─── 9. Mobile Menu Drawer ────────────────────────────────────────────── */
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.site-nav');
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
  }

  /* ─── App Initialization on DOM Ready ──────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initFadeAnimations();
    initHeaderScroll();
    initCategoryTabs();
    initDetailDrawer();
    initSunsetCountdown();
    initSunsetToggle();
    initPublicityModal();
    initLanguageSelector();
    initMobileMenu();
  });

})();
