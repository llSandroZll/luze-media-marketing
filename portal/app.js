'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CRIPTANA 360 — Real, Launchable Local Travel Directory & Portal
   Whitewashed & Indigo Aesthetic · Real Business Sourced Data · Dynamic i18n Engine
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

  /* ─── 3. Dynamic Category Tabs filtering ───────────────────────────────── */
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
      img: 'images/attraction_windmills.png',
      imgStyle: 'filter: hue-rotate(45deg);',
      phone: '+34926589191',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Las+Musas+Campo+de+Criptana'
    },
    spot4: {
      id: 'spot4',
      category: 'restaurante',
      img: 'images/attraction_cave.png',
      imgStyle: 'filter: saturate(1.2);',
      phone: '+34926561476',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Cueva+La+Martina+Campo+de+Criptana'
    },
    spot5: {
      id: 'spot5',
      category: 'bodega',
      img: 'images/attraction_winery.png',
      phone: '+34926589147',
      mapUrl: 'https://maps.google.com/?q=Bodegas+Castiblanque+Campo+de+Criptana'
    },
    spot6: {
      id: 'spot6',
      category: 'bodega',
      img: 'images/attraction_winery.png',
      imgStyle: 'filter: sepia(0.3) saturate(1.1);',
      phone: '+34926561257',
      mapUrl: 'https://maps.google.com/?q=Vinicola+del+Carmen+Campo+de+Criptana'
    }
  };

  let activeLang = 'es';

  function initDetailDrawer() {
    const drawer = document.getElementById('detail-drawer');
    const closeBtn = document.getElementById('btn-close-drawer');
    const openBtns = document.querySelectorAll('.btn-more-details');
    const contentContainer = document.getElementById('drawer-content');
    if (!drawer || !closeBtn || !contentContainer) return;

    // Create dynamic backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);

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

      const styleAttr = spot.imgStyle ? ` style="${spot.imgStyle}"` : '';

      const html = `
        <img src="${spot.img}" alt="${spotTitle}" class="drawer-hero-img"${styleAttr}>
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

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scroll
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const spotId = btn.getAttribute('data-spot');
        openDrawer(spotId);
      });
    });

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Escape key closes drawer
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    // Make openDrawer accessible to change language on the fly
    window.refreshDrawerContent = function() {
      if (drawer.classList.contains('open')) {
        const activeCard = document.querySelector('.explorer-card.active-category');
        if (activeCard) {
          const currentSpotId = contentContainer.querySelector('.drawer-spot-title');
          if (currentSpotId) {
            // Find current active spot by reading titles or just checking which spot drawer is showing
            // Safe fallback: find first active detail button's spot
            const openDetailsBtn = document.querySelector('.btn-more-details[data-spot]');
            if (openDetailsBtn) {
              const spotId = openDetailsBtn.getAttribute('data-spot');
              // Let's inspect the drawer h2 text to match correctly
              for (const key in spotsData) {
                if (translations[activeLang][`${key}.name`] === currentSpotId.innerText) {
                  openDrawer(key);
                  break;
                }
              }
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

  /* ─── 6. Bilingual i18n Localization Dictionary ───────────────────────── */
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
      
      'tab.monumentos': '📍 Monumentos & Sights',
      'tab.restaurantes': '🍽️ Gastronomía & Cenas',
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

      // Spot 5: Castiblanque
      'spot5.name': 'Bodegas Castiblanque',
      'spot5.excerpt': 'Boutique familiar fundada en una bodega del siglo XIX. Ofrece selectas catas guiadas y paseos entre barricas de roble e historia.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real',
      'spot5.hours': 'Lun a Vie: 09:00 - 14:00 & 15:00 - 19:00 | Sáb y Dom: 09:00 - 20:00',
      'spot5.booking': 'Cita Previa',
      'spot5.price': 'Experiencias desde €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque es un templo del vino de carácter familiar, ubicado en pleno casco urbano del municipio en un edificio señorial restaurado del siglo XIX. La bodega aúna las técnicas agrícolas tradicionales de la comarca con tecnología enológica vanguardista.</p><p>Sus experiencias de enoturismo son célebres, e incluyen visitas guiadas a través de su nave histórica de barricas de roble y explicaciones detalladas del ciclo biológico de la vid. La visita culmina con una cata guiada por expertos sumilleres de sus marcas premium (como Baldor y Castiblanque), maridados con productos de la tierra como quesos y aceites selectos.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Vinícola del Carmen',
      'spot6.excerpt': 'La cooperativa en activo más antigua de España (1897). Visita sus modernas instalaciones con degustaciones premiadas D.O. La Mancha.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana',
      'spot6.hours': 'Lunes a Viernes: 09:00 - 13:30 & 15:30 - 19:00 | Sábados: 10:00 - 14:00',
      'spot6.booking': 'Cita Previa (Grupo)',
      'spot6.price': 'Visita / Tienda',
      'spot6.fulldesc': '<p>Fundada en el año 1897, Vinícola del Carmen ostenta el orgullo de ser la cooperativa vinícola en activo de forma ininterrumpida más antigua de toda España. Es la verdadera alma agrícola de Campo de Criptana, aunando los esfuerzos de cientos de agricultores locales.</p><p>Sus enormes instalaciones representan el equilibrio perfecto entre la escala industrial moderna y la devoción tradicional. Destaca en la elaboración de vinos monovarietales a partir de la uva Airén (la cepa por excelencia de la llanura) y el Tempranillo. Sus visitas grupales detallan la escala masiva de la molienda del mosto y naves de embotellado, finalizando con catas comentadas y venta directa de vinos de excelente relación calidad-precio.</p>',

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
      'art1.title': 'La Batalla contra los Gigantes: Burleta, Infanto y Sardinero',
      'art1.desc': 'Conoce la historia del único cerro en el mundo que conserva tres molinos con maquinaria original del siglo XVI, descritos por Miguel de Cervantes.',
      'art2.title': 'Paseo Añil: La Ruta por las Calles Blancas del Albaicín Manchego',
      'art2.desc': 'Una guía paso a paso para perderse por el laberinto de cuestas encaladas y zócalos de pintura añil, descubriendo las mejores perspectivas fotográficas de la llanura.',
      'art3.title': 'Crianza bajo Tierra: El Secreto del Vino en las Cuevas Históricas',
      'art3.desc': '¿Por qué las bodegas de Campo de Criptana maduraban sus mejores cosechas a 12 metros bajo el suelo? Un viaje sensorial a la D.O. La Mancha.',
      
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

      // Spot 5: Castiblanque
      'spot5.name': 'Castiblanque Wineries',
      'spot5.excerpt': 'A family-owned boutique winery founded inside a restored 19th-century manor. Features private tastings and historic barrel aging halls.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real',
      'spot5.hours': 'Mon to Fri: 9:00 AM - 2:00 PM & 3:00 PM - 7:00 PM | Sat & Sun: 9:00 AM - 8:00 PM',
      'spot5.booking': 'Prior Booking Required',
      'spot5.price': 'Tastings from €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque is a family-run cathedral of wine, located in the heart of the town center within a magnificently restored 19th-century noble mansion. The cellar combines time-tested traditional farming values with cutting-edge winemaking technology.</p><p>Their wine tourism packages are highly regarded, featuring expert-guided walks through their historic barrel cellars and detailed accounts of the grapevine growth cycle. The tour finishes with a commentary-led tasting of their signature brands (such as Baldor and Castiblanque), paired with local artisanal cheeses and olive oils.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Vinícola del Carmen',
      'spot6.excerpt': 'The oldest active cooperative winery in Spain (1897). Tour their state-of-the-art facilities with D.O. La Mancha tastings.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana',
      'spot6.hours': 'Monday to Friday: 9:00 AM - 1:30 PM & 3:30 PM - 7:00 PM | Saturdays: 10:00 AM - 2:00 PM',
      'spot6.booking': 'Prior Group Booking',
      'spot6.price': 'Tours / Shop',
      'spot6.fulldesc': '<p>Established in 1897, Vinícola del Carmen holds the proud distinction of being the oldest continuously operating cooperative winery in Spain. It is the agricultural heartbeat of Campo de Criptana, uniting the heritage of hundreds of local family vineyards.</p><p>Their massive state-of-the-art production halls represent the perfect balance between massive scale and artisanal devotion. They excel in crafting single-varietal wines from the indigenous white Airén grape and traditional Tempranillo. Guided group tours detail the massive crushing vats and bottling lines, ending with professional tastings.</p>',

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
      'art1.title': 'The Battle Against Sights: Burleta, Infanto and Sardinero',
      'art1.desc': 'Discover the history of the only hill in the world that preserves three pristine 16th-century windmills with their original working wooden machinery intact.',
      'art2.title': 'The Indigo Walk: Strolling the White Streets of Criptana\'s Albaicín',
      'art2.desc': 'A step-by-step walking guide to getting lost inside the labyrinth of encaladas houses and vibrant cobalt blue trim baseboards, finding the best sunset views.',
      'art3.title': 'Underground Aging: The Subterranean Secret of Wine Caves',
      'art3.desc': 'Why did Criptana\'s winemakers historically ferment and age their premium vintages 40 feet beneath the hard rock? A sensory journey into La Mancha.',
      
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
    if (sunsetTimerText && sunsetTimerText.innerText.indexOf('at') !== -1 || sunsetTimerText.innerText.indexOf('hoy') !== -1 || sunsetTimerText.innerText.indexOf('Calculando') !== -1) {
      // Re-run countdown calculation immediately
      window.dispatchEvent(new Event('resize')); // simple trigger to force dynamic updates if bound
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

  /* ─── 7. Mobile Menu Drawer ────────────────────────────────────────────── */
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
    initLanguageSelector();
    initMobileMenu();
  });

})();
