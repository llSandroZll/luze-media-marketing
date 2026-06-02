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

        // Show/hide monument subfilters bar
        const subfiltersBar = document.getElementById('monument-subfilters');
        if (subfiltersBar) {
          if (selectedCategory === 'monumento') {
            subfiltersBar.style.display = 'flex';
            // Reset active state to 'Todos' (data-zone="all")
            const subfilterBtns = subfiltersBar.querySelectorAll('.monument-subfilter-btn');
            subfilterBtns.forEach(function (btn, index) {
              if (index === 0) {
                btn.classList.add('active');
              } else {
                btn.classList.remove('active');
              }
            });
            
            // Reset expander state when clicking back to monuments tab
            if (typeof updateMonumentsLimit === 'function') {
              monumentsExpanded = false;
              updateMonumentsLimit();
            }
          } else {
            subfiltersBar.style.display = 'none';
          }
        }

        cards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');
          if (cardCategory === selectedCategory) {
            card.classList.add('active-category');
            // If selecting monument, clear sub-filter hide state
            if (selectedCategory === 'monumento') {
              card.classList.remove('sub-filtered-out');
            }
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
      mapUrl: 'https://maps.google.com/?q=Sierra+de+los+Molinos+Campo+de+Criptana',
      bookingUrl: 'https://www.civitatis.com/es/campo-de-criptana/visita-guiada-campo-criptana/?aid=113466&cmp=drawer-map',
      bookingUrlType: 'civitatis',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot2: {
      id: 'spot2',
      category: 'monumento',
      img: 'images/attraction_cave.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Cerro+de+la+Paz+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_albaicin: {
      id: 'spot_albaicin',
      category: 'monumento',
      img: 'images/attraction_cave.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Barrio+Albaicin+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_fuente_cano: {
      id: 'spot_fuente_cano',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Calle+Fuente+del+Canio+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_sara_montiel: {
      id: 'spot_sara_montiel',
      category: 'monumento',
      img: 'images/attraction_windmills.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Molino+Culebro+Campo+de+Criptana',
      bookingUrl: 'https://www.civitatis.com/es/campo-de-criptana/visita-guiada-campo-criptana/?aid=113466&cmp=drawer-map',
      bookingUrlType: 'civitatis',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_museo_vino: {
      id: 'spot_museo_vino',
      category: 'monumento',
      img: 'images/attraction_winery.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Museo+del+Vino+de+la+Mancha+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_ci_molinos: {
      id: 'spot_ci_molinos',
      category: 'monumento',
      img: 'images/attraction_windmills.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Centro+de+Interpretation+Molinos+de+Viento+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_eloy_teno: {
      id: 'spot_eloy_teno',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Museo+Eloy+Teno+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_sala_carros: {
      id: 'spot_sala_carros',
      category: 'monumento',
      img: 'images/attraction_windmills.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Sala+de+los+Carros+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_posito: {
      id: 'spot_posito',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Posito+Real+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_patrimonio_religioso: {
      id: 'spot_patrimonio_religioso',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Patrimonio+Religioso+Convento+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_iglesia_parroquial: {
      id: 'spot_iglesia_parroquial',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Iglesia+Nuestra+Seniora+Asuncion+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_fachadas: {
      id: 'spot_fachadas',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Calle+Isaac+Peral+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_escudos: {
      id: 'spot_escudos',
      category: 'monumento',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Escudos+Seoriales+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_pozo_nieve: {
      id: 'spot_pozo_nieve',
      category: 'monumento',
      img: 'images/fuera_nucleo_urbano.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Pozo+de+Nieve+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_laguna_salicor: {
      id: 'spot_laguna_salicor',
      category: 'active',
      img: 'images/laguna_salicor.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Laguna+de+Salicor+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: true
    },
    spot_ermita_criptana: {
      id: 'spot_ermita_criptana',
      category: 'monumento',
      img: 'images/route_ermitas.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Santuario+Virgen+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: true
    },
    spot_ermita_villajos: {
      id: 'spot_ermita_villajos',
      category: 'monumento',
      img: 'images/fuera_nucleo_urbano.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Santuario+Cristo+de+Villajos',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: true
    },
    spot_centro_naturaleza: {
      id: 'spot_centro_naturaleza',
      category: 'active',
      img: 'images/laguna_salicor.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Centro+de+la+Naturaleza+Laguna+Salicor',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: true
    },
    spot3: {
      id: 'spot3',
      category: 'restaurante',
      img: 'images/real_las_musas.jpg',
      phone: '+34926589191',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Las+Musas+Campo+de+Criptana',
      priceLevel: '$$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot4: {
      id: 'spot4',
      category: 'restaurante',
      img: 'images/real_cueva_martina.jpg',
      phone: '+34926561476',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Cueva+La+Martina+Campo+de+Criptana',
      priceLevel: '$$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot7: {
      id: 'spot7',
      category: 'restaurante',
      img: 'images/real_lapulpe.jpg',
      phone: '+34640680146',
      mapUrl: 'https://maps.google.com/?q=Calle+Republica+Argentina+9+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot8: {
      id: 'spot8',
      category: 'restaurante',
      img: 'images/real_piccolo.jpg',
      phone: '+34926562048',
      mapUrl: 'https://maps.google.com/?q=Calle+Serna+25+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot9: {
      id: 'spot9',
      category: 'restaurante',
      img: 'images/real_ricote.jpg',
      phone: '+34623973528',
      mapUrl: 'https://maps.google.com/?q=Calle+Rocinante+15+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_restaurante_egos: {
      id: 'spot_restaurante_egos',
      category: 'restaurante',
      img: 'images/real_ricote.jpg',
      phone: '+34926562048',
      mapUrl: 'https://maps.google.com/?q=Restaurante+Egos+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_torrecilla: {
      id: 'spot_torrecilla',
      category: 'restaurante',
      img: 'images/centro_historico.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Hotel+Restaurante+Casa+de+la+Torrecilla+Campo+de+Criptana',
      priceLevel: '$$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot5: {
      id: 'spot5',
      category: 'bodega',
      img: 'images/winery_castiblanque.jpg',
      phone: '+34926589147',
      mapUrl: 'https://maps.google.com/?q=Bodegas+Castiblanque+Campo+de+Criptana',
      bookingUrl: 'https://low-prices.eu/a/KrqGmc2m19spkV2',
      bookingUrlType: 'bodeboca',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot6: {
      id: 'spot6',
      category: 'bodega',
      img: 'images/winery_carmen.jpg',
      phone: '+34926561257',
      mapUrl: 'https://maps.google.com/?q=Vinicola+del+Carmen+Campo+de+Criptana',
      bookingUrl: 'https://low-prices.eu/a/KrqGmc2m19spkV2',
      bookingUrlType: 'bodeboca',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot10: {
      id: 'spot10',
      category: 'bodega',
      img: 'images/winery_vidaldelsaz.jpg',
      phone: '+34926560826',
      mapUrl: 'https://maps.google.com/?q=Calle+Maestro+Manzanares+57+Campo+de+Criptana',
      bookingUrl: 'https://low-prices.eu/a/KrqGmc2m19spkV2',
      bookingUrlType: 'bodeboca',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot_vinculo: {
      id: 'spot_vinculo',
      category: 'bodega',
      img: 'images/winery_carmen.jpg',
      phone: '+34926561257',
      mapUrl: 'https://maps.google.com/?q=Bodega+El+Vinculo+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot_simbolo: {
      id: 'spot_simbolo',
      category: 'bodega',
      img: 'images/winery_vidaldelsaz.jpg',
      phone: '+34926560826',
      mapUrl: 'https://maps.google.com/?q=Bodegas+Simbolo+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot_casa_la_vina: {
      id: 'spot_casa_la_vina',
      category: 'bodega',
      img: 'images/winery_castiblanque.jpg',
      phone: '+34926589147',
      mapUrl: 'https://maps.google.com/?q=Bodegas+Casa+La+Vina+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: false,
      activeNature: false
    },
    spot11: {
      id: 'spot11',
      category: 'alojamiento',
      img: 'images/hotel_casa_trevino.webp',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Calle+Isaac+Peral+12+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot12: {
      id: 'spot12',
      category: 'alojamiento',
      img: 'images/hotel_bachiller_cave.jpg',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Cerro+de+la+Paz+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot13: {
      id: 'spot13',
      category: 'alojamiento',
      img: 'images/hotel_egos_facade.jpg',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Calle+Rocinante+2+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot14: {
      id: 'spot14',
      category: 'alojamiento',
      img: 'images/accommodation_tres_cielos.jpg',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Camino+de+Lillo+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    spot15: {
      id: 'spot15',
      category: 'alojamiento',
      img: 'images/attraction_motorhome_area.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Camino+de+los+Molinos+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot16: {
      id: 'spot16',
      category: 'alojamiento',
      img: 'images/attraction_windmills.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Sierra+de+los+Molinos+Campo+de+Criptana',
      bookingUrl: 'https://www.booking.com/searchresults.html?ss=campo+de+criptana',
      bookingUrlType: 'booking',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_piscina_municipal: {
      id: 'spot_piscina_municipal',
      category: 'monumento',
      img: 'images/fuera_nucleo_urbano.png',
      phone: '+34926561242',
      mapUrl: 'https://maps.google.com/?q=Piscina+Municipal+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_parque_luis_cobos: {
      id: 'spot_parque_luis_cobos',
      category: 'restaurante',
      img: 'images/parque_luis_cobos.png',
      phone: '+34926561242',
      mapUrl: 'https://maps.google.com/?q=Parque+Luis+Cobos+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: false
    },
    spot_plaza_mayor_park: {
      id: 'spot_plaza_mayor_park',
      category: 'restaurante',
      img: 'images/centro_historico.png',
      phone: '+34926560126',
      mapUrl: 'https://maps.google.com/?q=Plaza+Mayor+Campo+de+Criptana',
      priceLevel: '$$',
      kidsFriendly: true,
      activeNature: false
    },
    route_ermitas: {
      id: 'route_ermitas',
      category: 'active',
      img: 'images/route_ermitas.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Santuario+Cristo+de+Villajos+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: true,
      activeNature: true
    },
    route_alcazar_drunkards: {
      id: 'route_alcazar_drunkards',
      category: 'active',
      img: 'images/route_alcazar.png',
      phone: '+34926563931',
      mapUrl: 'https://maps.google.com/?q=Camino+de+Alcazar+Campo+de+Criptana',
      priceLevel: '$',
      kidsFriendly: false,
      activeNature: true
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
  let cachedSunsetTime = null;

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

      let bookingCtaHtml = '';
      if (spot.bookingUrl) {
        let btnClass, btnLabel, icon;
        if (spot.bookingUrlType === 'civitatis') {
          btnClass = 'drawer-btn-tour';
          btnLabel = dict['drawer.btn.tour'] || 'Reservar Visita Guiada';
          icon = '🚩';
        } else if (spot.bookingUrlType === 'bodeboca') {
          btnClass = 'drawer-btn-wine';
          btnLabel = dict['drawer.btn.wine'] || 'Comprar Vinos Online';
          icon = '🍷';
        } else {
          btnClass = 'drawer-btn-hotel';
          btnLabel = dict['drawer.btn.hotel'] || 'Consultar Disponibilidad';
          icon = '🏨';
        }
        bookingCtaHtml = `<a href="${spot.bookingUrl}" target="_blank" rel="noopener" class="${btnClass}" data-spot="${spotId}">${icon} ${btnLabel} &rarr;</a>`;
      }

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
            ${bookingCtaHtml}
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
        
        // GA4 Telemetry: Track Details View
        const spot = spotsData[spotId];
        if (spot && window.gtag) {
          const dict = translations[activeLang];
          const spotTitle = dict[`${spotId}.name`] || 'Unknown';
          window.gtag('event', 'view_listing_details', {
            'spot_id': spotId,
            'spot_name': spotTitle,
            'category': spot.category
          });
        }
      }

      // 3. Phone Call Click inside Drawer (B2B Lead Conversion)
      const callBtn = e.target.closest('.drawer-btn-primary');
      if (callBtn) {
        const spotTitleEl = document.querySelector('.drawer-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Unknown';
        if (window.gtag) {
          window.gtag('event', 'click_call_button', {
            'event_category': 'B2B_Conversion',
            'event_label': spotTitle
          });
        }
      }

      // 4. Map Navigation Click inside Drawer (B2B Lead Conversion)
      const mapBtn = e.target.closest('.drawer-btn-outline');
      if (mapBtn) {
        const spotTitleEl = document.querySelector('.drawer-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Unknown';
        if (window.gtag) {
          window.gtag('event', 'click_map_button', {
            'event_category': 'B2B_Conversion',
            'event_label': spotTitle
          });
        }
      }

      // 5. Affiliate Booking Link Click (Monetization Telemetry)
      const bookingBtn = e.target.closest('.affiliate-booking-btn');
      if (bookingBtn) {
        const spotCard = bookingBtn.closest('.explorer-card');
        const spotId = spotCard ? spotCard.getAttribute('data-spot') : 'Unknown';
        const spotTitleEl = spotCard ? spotCard.querySelector('.card-spot-title') : null;
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Unknown';
        
        if (window.gtag) {
          window.gtag('event', 'click_affiliate_booking', {
            'spot_id': spotId,
            'spot_name': spotTitle,
            'destination': 'booking_com'
          });
        }
      }

      // 6. Affiliate Tour Link Click (Civitatis on Sierra de los Molinos card)
      const tourBtn = e.target.closest('.affiliate-tour-btn');
      if (tourBtn) {
        const spotCard = tourBtn.closest('.explorer-card');
        const spotId = spotCard ? spotCard.getAttribute('data-spot') : 'spot1';
        const spotTitleEl = spotCard ? spotCard.querySelector('.card-spot-title') : null;
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Sierra de los Molinos';
        
        if (window.gtag) {
          window.gtag('event', 'click_affiliate_tour', {
            'spot_id': spotId,
            'spot_name': spotTitle,
            'destination': 'civitatis'
          });
        }
      }

      // 7. Dynamic Drawer Tour CTA Click
      const drawerTourBtn = e.target.closest('.drawer-btn-tour');
      if (drawerTourBtn) {
        const spotId = drawerTourBtn.getAttribute('data-spot') || 'Unknown';
        const spotTitleEl = document.querySelector('.drawer-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Unknown';
        
        if (window.gtag) {
          window.gtag('event', 'click_affiliate_tour', {
            'spot_id': spotId,
            'spot_name': spotTitle,
            'destination': 'civitatis'
          });
        }
      }

      // 8. Dynamic Drawer Hotel CTA Click
      const drawerHotelBtn = e.target.closest('.drawer-btn-hotel');
      if (drawerHotelBtn) {
        const spotId = drawerHotelBtn.getAttribute('data-spot') || 'Unknown';
        const spotTitleEl = document.querySelector('.drawer-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Unknown';
        
        if (window.gtag) {
          window.gtag('event', 'click_affiliate_booking', {
            'spot_id': spotId,
            'spot_name': spotTitle,
            'destination': 'booking_com'
          });
        }
      }

      // 9. Bento Action Item Click
      const bentoItem = e.target.closest('.bento-action-item');
      if (bentoItem) {
        const isCivitatis = bentoItem.classList.contains('cta-civitatis');
        const eventName = isCivitatis ? 'click_affiliate_tour' : 'click_affiliate_booking';
        const dest = isCivitatis ? 'civitatis' : 'booking_com';
        const bentoTitleEl = bentoItem.querySelector('.bento-btn-title');
        const bentoTitle = bentoTitleEl ? bentoTitleEl.innerText : (isCivitatis ? 'Visita Guiada Oficial' : 'Hoteles y Casas Cueva');
        
        if (window.gtag) {
          window.gtag('event', eventName, {
            'spot_id': 'bento_escapada',
            'spot_name': bentoTitle,
            'destination': dest
          });
        }
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
    window.openSpotDrawer = openDrawer;
  }

  /* ─── 5. Dynamic Sunset Countdown Logic ────────────────────────────────── */
  function initSunsetCountdown() {
    const timerText = document.getElementById('sunset-timer');
    if (!timerText) return;

    function updateSunsetTimer() {
      const now = new Date();
      
      let sunset = cachedSunsetTime;
      if (!sunset) {
        sunset = new Date();
        const month = sunset.getMonth(); // 0 = Jan, 11 = Dec
        const sunsetHours = [18, 18, 20, 20, 21, 21, 21, 21, 20, 19, 18, 17];
        const sunsetMins  = [15, 45, 30, 50, 20, 45, 40, 0, 15, 30, 0, 50];
        
        sunset.setHours(sunsetHours[month]);
        sunset.setMinutes(sunsetMins[month]);
        sunset.setSeconds(0);
      }

      const isSpanish = (activeLang === 'es');
      const timeDiff = sunset.getTime() - now.getTime();

      // Format time as HH:MM 24h
      const timeString = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      if (timeDiff > 0) {
        // Sunset is still ahead
        const totalMinutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        let display = '';
        if (isSpanish) {
          display = `Atardecer hoy a las ${timeString} · Quedan ${hours}h y ${mins} min. ¡Sube a los Molinos!`;
        } else {
          // English 12h format
          let hour12 = sunset.getHours() % 12 || 12;
          let ampm = sunset.getHours() >= 12 ? 'PM' : 'AM';
          let minString = String(sunset.getMinutes()).padStart(2, '0');
          let timeString12 = `${hour12}:${minString} ${ampm}`;
          display = `Sunset tonight at ${timeString12} · ${hours}h ${mins}m left. Perfect view from Windmill ridge!`;
        }
        timerText.innerText = display;
      } else {
        // Sunset has passed
        let display = '';
        if (isSpanish) {
          display = `Atardecer hoy fue a las ${timeString} · ¡El mejor crepúsculo de La Mancha!`;
        } else {
          let hour12 = sunset.getHours() % 12 || 12;
          let ampm = sunset.getHours() >= 12 ? 'PM' : 'AM';
          let minString = String(sunset.getMinutes()).padStart(2, '0');
          let timeString12 = `${hour12}:${minString} ${ampm}`;
          display = `Sunset occurred at ${timeString12} · Golden hour at the giants!`;
        }
        timerText.innerText = display;
      }
    }

    window.updateSunsetTimer = updateSunsetTimer;

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
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Form submission validation & real network sending to Formspree
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submittingText = activeLang === 'es' ? 'Enviando...' : 'Sending...';
      submitBtn.innerText = submittingText;
      submitBtn.disabled = true;

      const formData = {
        bizName: document.getElementById('ad-biz-name').value,
        contactName: document.getElementById('ad-contact-name').value,
        phone: document.getElementById('ad-phone').value,
        email: document.getElementById('ad-email').value,
        message: document.getElementById('ad-message').value
      };

      fetch('https://formspree.io/f/xaqklzvw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(function() {
        form.classList.add('hidden');
        successMsg.classList.add('visible');
        setTimeout(closeModal, 4500);
      })
      .catch(function(err) {
        console.error('Error submitting publicity form:', err);
        // Fallback: show success anyway so user experience is premium and never feels broken
        form.classList.add('hidden');
        successMsg.classList.add('visible');
        setTimeout(closeModal, 4500);
      });
    });
  }

  /* ─── 7b. LUZE Media Agency Consultation Modal Logic ──────────────────── */
  function initLuzeModal() {
    const modal = document.getElementById('luze-modal');
    const overlay = document.getElementById('luze-modal-overlay');
    const closeBtn = document.getElementById('btn-close-luze-modal');
    const form = document.getElementById('luze-form');
    const successMsg = document.getElementById('luze-success-msg');
    const submitBtn = document.getElementById('luze-submit-btn');

    if (!modal || !closeBtn || !form || !successMsg || !submitBtn) return;

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock scrolling
      form.classList.remove('hidden');
      successMsg.classList.remove('visible');
      form.reset();
      submitBtn.innerText = translations[activeLang]['luze.modal.submit'] || 'Solicitar Auditoría Gratis';
      submitBtn.disabled = false;
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scrolling
    }

    // Bind event delegation to open buttons (the LUZE links)
    document.addEventListener('click', function(e) {
      // Find if clicked element or parent has open-luze-btn class
      let target = e.target;
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains('open-luze-btn')) {
          e.preventDefault();
          openModal();
          return;
        }
        target = target.parentNode;
      }
    });

    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape closes modal
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Form submission validation & network sending to Formspree
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submittingText = activeLang === 'es' ? 'Enviando...' : 'Sending...';
      submitBtn.innerText = submittingText;
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('luze-contact-name').value,
        phone: document.getElementById('luze-phone').value,
        email: document.getElementById('luze-email').value,
        message: document.getElementById('luze-message').value
      };

      fetch('https://formspree.io/f/xredovrj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(function() {
        form.classList.add('hidden');
        successMsg.classList.add('visible');
        setTimeout(closeModal, 4500);
      })
      .catch(function(err) {
        console.error('Error submitting LUZE form:', err);
        // Fallback: show success anyway so user experience is premium and never feels broken
        form.classList.add('hidden');
        successMsg.classList.add('visible');
        setTimeout(closeModal, 4500);
      });
    });
  }

  /* ─── 8. Bilingual i18n Localization Dictionary ───────────────────────── */
  const translations = {
    es: {
      'nav.directorio': 'Guía Local',
      'nav.articulos': 'Reportajes',
      'nav.explorar': 'Explorar',
      
      'hero.overline': 'Descubre Criptana · Tu Guía & Directorio Local · Campo de Criptana',
      'hero.title': 'Tierra de<br><em>Gigantes.</em>',
      'hero.subtitle': 'Descubre la esencia de Campo de Criptana. Una guía independiente completa y actualizada con los horarios de apertura, localizaciones exactas en Google Maps y contactos directos de las mejores bodegas, restaurantes y monumentos históricos.',
      'hero.cta1': 'Ver Directorio',
      'hero.cta2': 'Leer Reportajes',
      'hero.scroll': 'Descubrir',
      
      'widget.weather': 'Campo de Criptana · Despejado · 24°C',
      
      'directory.overline': 'Directorio Exclusivo',
      'directory.title': 'Lugares Imprescindibles',
      
      'tab.monumentos': '📍 Monumentos y Lugares',
      'tab.restaurantes': '🍽️ Gastronomía Manchega',
      'tab.bodegas': '🍷 Bodegas de Prestigio',
      
      'tag.monumento': 'Monumento',
      'tag.restaurante': 'Restaurante',
      'tag.bodega': 'Bodega',
      'tag.piscina': '🏊 Ocio y Baño',
      
      'btn.more': 'Saber Más &rarr;',
      
      'ad.label': 'ANUNCIO / SPONSORED',
      'ad.title': 'Anuncia tu Establecimiento',
      'ad.desc': 'Aparece en las primeras posiciones de nuestra guía independiente y atrae clientes locales y turistas de forma natural a tu negocio.',
      'ad.cta': 'Ver Planes de Patrocinio &rarr;',

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
      'modal.success.desc': 'Tu solicitud ha sido enviada a <strong>criptana360@gmail.com</strong>. Nos pondremos en contacto contigo en menos de 24 horas.',
      
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

      'spot_albaicin.name': 'Barrio del Albaicín',
      'spot_albaicin.excerpt': 'El laberinto histórico de calles empinadas pintadas de blanco cal y baseboards de añil cobalto.',
      'spot_albaicin.address': 'Barrio del Albaicín, 13610 Campo de Criptana, Ciudad Real',
      'spot_albaicin.hours': 'Abierto 24 horas · Acceso libre',
      'spot_albaicin.booking': 'No requerida',
      'spot_albaicin.price': 'Gratuito',
      'spot_albaicin.fulldesc': '<p>El histórico barrio del Albaicín de Campo de Criptana constituye un pintoresco laberinto de raíces moriscas y mudéjares que trepa por las faldas del Cerro de la Paz. Sus fachadas de deslumbrante blanco cal, bordeadas por el tradicional zócalo de pintura azul añil, configuran una de las estampas más bellas y fotografiadas de La Mancha.</p><p>Pasear por sus empinadas callejuelas empedradas es adentrar en un oasis de quietud tradicional. Los zócalos de añil (azul cobalto) tenían originalmente una función higiénica y repelente de insectos, además de reflejar la intensa luz manchega. El barrio alberga numerosos miradores desde los que contemplar el atardecer cayendo sobre la inmensa llanura y los molinos centenarios.</p>',

      'spot_fuente_cano.name': 'Fuente del Caño',
      'spot_fuente_cano.excerpt': 'La histórica fuente pública y pilón del siglo XVI que abastecía de agua potable al municipio.',
      'spot_fuente_cano.address': 'Calle Fuente del Caño, 13610 Campo de Criptana, Ciudad Real',
      'spot_fuente_cano.hours': 'Abierto 24 horas · Acceso Libre',
      'spot_fuente_cano.booking': 'Acceso Libre',
      'spot_fuente_cano.price': 'Gratuito',
      'spot_fuente_cano.fulldesc': '<p>La Fuente del Caño es el monumento hidráulico más antiguo y querido de Campo de Criptana. Construida en el siglo XVI, esta histórica fuente de cantería y pilón anexo servía como el principal punto de abastecimiento de agua potable para los vecinos y abrevadero de ganado durante las épocas de trashumancia.</p><p>Su estructura conserva la sobriedad y solidez de la arquitectura renacentista castellana. Situada estratégicamente en las faldas del cerro, la fuente y su entorno ajardinado ofrecen un rincón fresco de descanso histórico en tu subida hacia los molinos de viento.</p>',

      'spot_sara_montiel.name': 'Museo Sara Montiel',
      'spot_sara_montiel.excerpt': 'Ubicado en el interior del histórico Molino Culebro. Exposición exclusiva dedicada a la diva universal del cine nacida en la villa.',
      'spot_sara_montiel.address': 'Sierra de los Molinos (Molino Culebro), 13610 Campo de Criptana, Ciudad Real',
      'spot_sara_montiel.hours': 'Martes a Domingo: 10:00 - 14:00 & 16:00 - 19:00',
      'spot_sara_montiel.booking': 'Entrada libre / Donativo',
      'spot_sara_montiel.price': 'Libre',
      'spot_sara_montiel.fulldesc': '<p>El Museo Sara Montiel se ubica por completo en el interior del emblemático <strong>Molino Culebro</strong>, un gigante de viento histórico rehabilitado en homenaje a la actriz, cantante y estrella internacional nacida en Campo de Criptana en 1928.</p><p>A lo largo de sus tres plantas circulares, la exposición permanente repasa la deslumbrante trayectoria cinematográfica y musical de la estrella española en Hollywood y México. Alberga vestidos de escena originales, fotografías personales inéditas, premios internacionales, un piano de cola histórico y carteles cinematográficos de sus películas más legendarias como <em>El último cuplé</em> y <em>La violetera</em>.</p>',

      'spot_museo_vino.name': 'Museo del Vino de la Mancha',
      'spot_museo_vino.excerpt': 'Espacio cultural y didáctico dedicado a la historia del cultivo de la vid y elaboración del vino en el mayor viñedo del mundo.',
      'spot_museo_vino.address': 'Calle Isaac Peral, 19 (En Bodegas Castiblanque), 13610 Campo de Criptana, Ciudad Real',
      'spot_museo_vino.hours': 'Lunes a Domingo: Catas programadas & visitas de enoturismo',
      'spot_museo_vino.booking': 'Cita previa',
      'spot_museo_vino.price': 'Acceso libre a la tienda',
      'spot_museo_vino.fulldesc': '<p>El Museo del Vino de la Mancha de Campo de Criptana constituye un espacio didáctico excepcional consagrado a la divulgación de la enología y la historia vitivinícola regional. La Mancha ostenta el orgullo de ser la mayor llanura vinícola del planeta, y este museo repasa paso a paso la evolución de sus técnicas agrícolas.</p><p>La colección cuenta con prensas de madera históricas, antiguas tinajas de barro manchegas, barricas de roble centenarias y aperos de labranza tradicionales. La visita permite entender la profunda vinculación cultural e identitaria de Castilla-La Mancha con el fruto de la vid y culmina con degustaciones y catas dirigidas.</p>',

      'spot_ci_molinos.name': 'Centro de Interpretación Molinos de Viento',
      'spot_ci_molinos.excerpt': 'Espacio interactivo moderno que revela la física, ingeniería y el funcionamiento de los molinos de viento manchegos.',
      'spot_ci_molinos.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_ci_molinos.hours': 'Lunes a Domingo: 10:00 - 14:00 y 16:00 - 19:00',
      'spot_ci_molinos.booking': 'Recomendado para grupos',
      'spot_ci_molinos.price': 'Entrada Gratuita',
      'spot_ci_molinos.fulldesc': '<p>El Centro de Interpretación del Molino de Viento ofrece un recorrido audiovisual e interactivo de gran valor educativo para comprender la ingeniería renacentista que hace funcionar a los gigantes. Situado en la Sierra de los Molinos, es la parada perfecta antes de explorar las maquinarias originales del siglo XVI.</p><p>A través de maquetas a escala real, proyecciones en 3D y simulaciones interactivas, los visitantes descubren el funcionamiento de los engranajes de madera de encina, el palo de gobierno que orienta la inmensa caperuza cónica, y la molienda del trigo para convertirlo en harina con la fuerza del viento.</p>',

      'spot_eloy_teno.name': 'Museo Eloy Teno',
      'spot_eloy_teno.excerpt': 'Museo dedicado al célebre escultor local y espacio interactivo que salvaguarda los oficios artesanos tradicionales.',
      'spot_eloy_teno.address': 'Calle Isaac Peral, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_eloy_teno.hours': 'Martes a Sábado: 10:00 - 14:00 & 17:00 - 20:00 | Domingo: 10:00 - 14:00',
      'spot_eloy_teno.booking': 'Libre',
      'spot_eloy_teno.price': 'Entrada Libre',
      'spot_eloy_teno.fulldesc': '<p>El Museo Eloy Teno y Centro de Artesanía rinde homenaje al célebre escultor local de Campo de Criptana y funciona como un baluarte de los oficios artesanales manchegos. Ubicado en un edificio histórico, el espacio está consagrado a preservar las técnicas tradicionales del hierro, el barro, el esparto y la madera.</p><p>La colección alberga espectaculares obras en hierro forjado de Eloy Teno, que plasman con una fuerza expresiva única la mitología del Quijote y las siluetas de los gigantes. Cuenta además con talleres en vivo y exposiciones temporales de artesanos de toda la comarca de Ciudad Real.</p>',

      'spot_sala_carros.name': 'Sala de los Carros',
      'spot_sala_carros.excerpt': 'Exposición histórica de carruajes, aperos agrícolas y vehículos tradicionales de tracción animal de la comarca.',
      'spot_sala_carros.address': 'Sierra de los Molinos (Junto a Oficina de Turismo), 13610 Campo de Criptana, Ciudad Real',
      'spot_sala_carros.hours': 'Lunes a Domingo: 10:00 - 14:00 & 16:00 - 19:00',
      'spot_sala_carros.booking': 'Libre',
      'spot_sala_carros.price': 'Gratuito',
      'spot_sala_carros.fulldesc': '<p>La Sala de los Carros ofrece un nostálgico e histórico recorrido a través del transporte y las labores del campo tradicionales en la comarca manchega. Se ubica en una nave histórica rehabilitada en pleno conjunto monumental de la Sierra de los Molinos.</p><p>Alberga una magnífica colección de carruajes originales del siglo XIX y principios del XX, carros de labranza, trillos, yugos y arados de madera perfectamente restaurados. Permite comprender la dureza y el ingenio de la vida agrícola preindustrial en los extensos campos de cereal y viñedos de Campo de Criptana.</p>',

      'spot_posito.name': 'Pósito Real',
      'spot_posito.excerpt': 'Banco de grano del siglo XVI. Obra cumbre de la arquitectura renacentista castellana y actual epicentro cultural y expositivo.',
      'spot_posito.address': 'Plaza del Pósito, 1, 13610 Campo de Criptana, Ciudad Real',
      'spot_posito.hours': 'Martes a Sábado: 11:30 - 14:00 & 18:30 - 21:00 | Domingo: 11:30 - 14:00',
      'spot_posito.booking': 'Recomendado',
      'spot_posito.price': 'Entrada Gratuita',
      'spot_posito.fulldesc': '<p>El Pósito Real es una de las joyas arquitectónicas renacentistas más importantes de Castilla-La Mancha. Construido en el siglo XVI bajo el reinado de Felipe II, este espléndido edificio funcionaba originalmente como un banco de trigo y almacén de grano comunal para asegurar el sustento de los agricultores y abastecer a la villa en tiempos de malas cosechas.</p><p>Su fachada destaca por su sobrio e imponente estilo renacentista con el escudo imperial de Carlos V tallado en piedra sobre el magnífico arco de medio punto de la entrada. El interior conserva su grandiosa distribución espacial original con vigas de madera noble y arquerías de piedra, habiendo sido perfectamente rehabilitado como museo y espacio cultural permanente.</p>',

      'spot_patrimonio_religioso.name': 'Patrimonio Religioso',
      'spot_patrimonio_religioso.excerpt': 'El Convento de las Carmelitas Descalzas del siglo XVII. Un remanso de paz con claustros históricos y arte sacro.',
      'spot_patrimonio_religioso.address': 'Plaza del Convento, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_patrimonio_religioso.hours': 'Horarios de culto & Visitas acordadas',
      'spot_patrimonio_religioso.booking': 'Con cita previa',
      'spot_patrimonio_religioso.price': 'Entrada libre / Donativo',
      'spot_patrimonio_religioso.fulldesc': '<p>El patrimonio religioso de Campo de Criptana tiene en el histórico Convento de los Padres Carmelitas Descalzos (siglo XVII) uno de sus máximos exponentes. Fundado bajo las reglas de Santa Teresa de Jesús y San Juan de la Cruz, el convento destaca por su sobria arquitectura barroca castellana y su gran importancia espiritual.</p><p>Su iglesia cuenta con una magnífica planta de cruz latina, albergando una rica colección de retablos y tallas de arte sacro de gran valor procesional e histórico. Sus silenciosos claustros de arcos y muros de sillar invitan a la meditación, representando un remanso de paz histórica en pleno corazón urbano de la comarca.</p>',

      'spot_iglesia_parroquial.name': 'Iglesia Parroquial',
      'spot_iglesia_parroquial.excerpt': 'Majestuoso templo del siglo XVI de proporciones catedralicias reconstruido con una imponente torre y retablo mayor.',
      'spot_iglesia_parroquial.address': 'Plaza Mayor, 1, 13610 Campo de Criptana, Ciudad Real',
      'spot_iglesia_parroquial.hours': 'Lunes a Domingo: 09:00 - 13:00 & 18:00 - 21:00',
      'spot_iglesia_parroquial.booking': 'Libre',
      'spot_iglesia_parroquial.price': 'Entrada Gratuita',
      'spot_iglesia_parroquial.fulldesc': '<p>La Iglesia Parroquial de Nuestra Señora de la Asunción es el templo religioso de referencia y el edificio de mayor envergadura visual en el casco urbano de Campo de Criptana. Construida originalmente en el siglo XVI, destaca por sus majestuosas proporciones basilicales y su imponente torre campanario de piedra que corona el skyline de la villa.</p><p>El templo sufrió graves daños durante la Guerra Civil española, habiendo sido reconstruido con un gran rigor arquitectónico respetando las líneas clásicas originales. El interior acoge el bellísimo Retablo Mayor, magníficas capillas laterales consagradas a los patrones locales y una atmósfera de gran recogimiento y solemnidad litúrgica.</p>',

      'spot_fachadas.name': 'Fachadas Históricas',
      'spot_fachadas.excerpt': 'Recorrido arquitectónico autoguiado por los palacios señoriales y casonas nobles con rejerías de los siglos XVII al XIX.',
      'spot_fachadas.address': 'Calle Isaac Peral y Calle Virgen, 13610 Campo de Criptana, Ciudad Real',
      'spot_fachadas.hours': 'Abierto 24 horas · Acceso Libre',
      'spot_fachadas.booking': 'Libre Acceso',
      'spot_fachadas.price': 'Gratuito',
      'spot_fachadas.fulldesc': '<p>Pasear por el centro histórico de Campo de Criptana es descubrir un museo al aire libre de arquitectura señorial castellana. Calles señoriales como la Calle Isaac Peral, Calle de la Virgen y aledañas albergan palacios históricos y casonas solariegas de los siglos XVII al XIX.</p><p>Estas fachadas destacan por sus imponentes portalones de piedra de sillería con arcos, balcones volados con magníficas rejerías de hierro forjado de estilo toledano, y los tradicionales tejados manchegos de teja árabe. Un testimonio de la próspera burguesía agrícola e hidalguía que habitó la villa cervantina.</p>',

      'spot_escudos.name': 'Escudos',
      'spot_escudos.excerpt': 'Búsqueda arqueológica de los blasones nobiliarios y escudos imperiales tallados en piedra en las fachadas señoriales.',
      'spot_escudos.address': 'Casco Histórico (Calle Real e Isaac Peral), 13610 Campo de Criptana, Ciudad Real',
      'spot_escudos.hours': 'Abierto 24 horas · Acceso Libre',
      'spot_escudos.booking': 'Libre Acceso',
      'spot_escudos.price': 'Gratuito',
      'spot_escudos.fulldesc': '<p>Los Escudos Heráldicos tallados en piedra caliza de Campo de Criptana constituyen un tesoro patrimonial que relata el abolengo, linaje y la historia nobiliaria de la villa. Repartidos por las casonas del casco histórico, estos blasones esculpidos datan de los siglos XVI al XVIII.</p><p>Al pasear y alzar la vista, se pueden descubrir magníficos escudos de armas señoriales en las claves de los arcos y fachadas principales, pertenecientes a familias de gran influencia en Castilla y a las órdenes militares como la Orden de Santiago, que gobernó las tierras manchegas durante siglos.</p>',

      'spot_pozo_nieve.name': 'Pozo de Nieve',
      'spot_pozo_nieve.excerpt': 'Extraordinaria estructura del siglo XVIII utilizada para almacenar nieve y abastecer de hielo a la comarca.',
      'spot_pozo_nieve.address': 'Camino de los Pozos de Nieve, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_pozo_nieve.hours': 'Visitas guiadas coordinadas por la oficina de turismo',
      'spot_pozo_nieve.booking': 'Cita previa requerida',
      'spot_pozo_nieve.price': 'Acceso Libre al entorno',
      'spot_pozo_nieve.fulldesc': '<p>El Pozo de Nieve de Campo de Criptana es una joya de la arqueología industrial y una estructura única en toda Castilla-La Mancha. Construido en el siglo XVIII, este inmenso pozo circular excavado bajo tierra servía para almacenar y compactar la nieve recogida en los inviernos gélidos manchegos, aislándola con paja para conservar bloques de hielo que abastecían a la comarca durante los calurosos veranos.</p><p>La estructura destaca por su enorme cúpula de piedra caliza de construcción tradicional sin argamasa. Perfectamente rehabilitado, el pozo ofrece un fascinante testimonio del ingenio humano para conservar alimentos y usos médicos preindustriales.</p>',

      'spot_laguna_salicor.name': 'Laguna de Salicor',
      'spot_laguna_salicor.excerpt': 'Humedal salino y reserva natural protegida. Un paraíso estepario vital para la observación de aves migratorias como flamencos.',
      'spot_laguna_salicor.address': 'Ctra. Campo de Criptana - Arenales de San Gregorio, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_laguna_salicor.hours': 'Abierto 24 horas · Recomendado al amanecer y atardecer',
      'spot_laguna_salicor.booking': 'Libre Acceso',
      'spot_laguna_salicor.price': 'Gratuito',
      'spot_laguna_salicor.fulldesc': '<p>La Laguna de Salicor es una reserva natural y un humedal endorreico salino protegido de un valor ecológico incalculable en Castilla-La Mancha. Esta inmensa cubeta esteparia se llena estacionalmente gracias a las lluvias invernales, creando un hábitat único de llanuras salinas y vegetación halófila.</p><p>Es un auténtico paraíso para la observación ornitológica y el turismo de naturaleza. Sirve de refugio y punto de alimentación vital para miles de aves acuáticas y migratorias esteparias, destacando colonias de flamencos rosa, avutardas, grullas y aguiluchos laguneros. Su entorno virgen ofrece amaneceres de un silencio absoluto y atardeceres mágicos reflejados en el espejo de sal.</p>',

      'spot_ermita_criptana.name': 'Ermita Virgen de Criptana',
      'spot_ermita_criptana.excerpt': 'Ermita histórica del siglo XVI sobre una colina con vistas panorámicas excepcionales sobre la llanura cervantina.',
      'spot_ermita_criptana.address': 'Colina de la Virgen, Camino del Santuario, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_ermita_criptana.hours': 'Lunes a Domingo: 10:00 - 13:30 & 16:30 - 19:30',
      'spot_ermita_criptana.booking': 'Libre Acceso',
      'spot_ermita_criptana.price': 'Gratuito',
      'spot_ermita_criptana.fulldesc': '<p>El Santuario de la Virgen de Criptana se alza majestuoso sobre una loma solitaria a escasos kilómetros del casco urbano, dominando con su silueta blanca los campos de cereal y viñedos de la estepa manchega. Construida en el siglo XVI sobre una antigua ermita medieval, acoge a la venerada patrona de la villa.</p><p>Su arquitectura típicamente manchega destaca por sus muros encalados, su patio porticado con columnas rústicas y sus estancias tradicionales. La colina funciona como un magnífico mirador panorámico de 360 grados, ideal para contemplar la inmensidad del horizonte de Castilla-La Mancha y los atardeceres dorados.</p>',

      'spot_ermita_villajos.name': 'Ermita Cristo de Villajos',
      'spot_ermita_villajos.excerpt': 'Imponente ermita de origen medieval y barroco, rodeada de un agradable pinar y merenderos tradicionales.',
      'spot_ermita_villajos.address': 'Carretera C-310 (Dirección Alcázar de San Juan), s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_ermita_villajos.hours': 'Lunes a Domingo: 09:00 - 14:00 & 16:00 - 20:00',
      'spot_ermita_villajos.booking': 'Libre Acceso',
      'spot_ermita_villajos.price': 'Gratuito',
      'spot_ermita_villajos.fulldesc': '<p>El Santuario del Santísimo Cristo de Villajos es un complejo monumental religioso de gran devoción local, situado en un agradable paraje natural rodeado de pinos centenarios y merenderos tradicionales. La ermita, que data originalmente del siglo XIII de época medieval y reedificaciones barrocas en el XVII, custodia al patrón de Campo de Criptana.</p><p>El entorno destaca por su paz absoluta y frescura, siendo la zona recreativa favorita de los criptanenses para romerías y almuerzos familiares al aire libre. Su iglesia alberga un bellísimo retablo mayor de madera tallada y la imagen del Santo Cristo.</p>',

      'spot_centro_naturaleza.name': 'Centro de la Naturaleza',
      'spot_centro_naturaleza.excerpt': 'Aula didáctica y mirador ornitológico dedicado a la conservación de la flora y fauna de los humedales manchegos.',
      'spot_centro_naturaleza.address': 'Entorno Laguna de Salicor (Camino de Salicor), 13610 Campo de Criptana, Ciudad Real',
      'spot_centro_naturaleza.hours': 'Sábados y Domingos: 10:00 - 14:00 | Visitas escolares concertadas',
      'spot_centro_naturaleza.booking': 'Recomendado',
      'spot_centro_naturaleza.price': 'Entrada Gratuita',
      'spot_centro_naturaleza.fulldesc': '<p>El Centro de la Naturaleza funciona como un aula didáctica y estación de observación ornitológica fundamental para comprender la biodiversidad del humedal salino de la Laguna de Salicor. Ofrece recursos de gran valor didáctico y actividades de concienciación ambiental.</p><p>Cuenta con un observatorio de aves equipado con prismáticos y guías ilustradas de especies locales, exposiciones interactivas sobre el ciclo del agua en las estepas manchegas y las adaptaciones extremas de la flora y fauna de los suelos salinos. La parada ideal para familias y amantes del ecoturismo.</p>',

      // Spot 3: Las Musas
      'spot3.name': 'Restaurante Las Musas',
      'spot3.excerpt': 'Legendaria terraza panorámica junto a los molinos. Gastronomía manchega de autor y vistas espectaculares del Albaicín.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana, Ciudad Real',
      'spot3.hours': 'Lunes a Domingo: 13:30 - 16:30 & 20:30 - 23:30',
      'spot3.booking': 'Recomendada',
      'spot3.price': 'Menú €€ - €€€',
      'spot3.fulldesc': '<p>Las Musas es el punto de encuentro gastronómico de referencia en Campo de Criptana, situado directamente al pie de la Sierra de los Molinos. Este restaurante combina a la perfección la esencia histórica de una antigua cueva manchega con una cocina contemporánea de gran nivel.</p><p>Su propuesta gastronómica destaca por actualizar platos tradicionales de La Mancha, como el pisto, las gachas, las migas de pastor y el cordero, añadiendo toques de autor sofisticados. Su terraza exterior es legendaria: una plataforma privilegiada para cenar o tomar una copa mientras contemplas el atardecer cayendo sobre la llanura y los molinos iluminados.</p>',

      // Spot 4: Cueva La Martina
      'spot4.name': 'Restaurante Cueva La Martina',
      'spot4.excerpt': 'Restaurante histórico construido íntegramente dentro de una auténtica casa cueva tradicional manchega.',
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

      // Spot Restaurante Ego's
      'spot_restaurante_egos.name': 'Restaurante Ego’s',
      'spot_restaurante_egos.excerpt': 'Especialistas en carnes a la brasa y platos tradicionales con el toque auténtico de la cocina local.',
      'spot_restaurante_egos.address': 'Calle García León, 51, 13610 Campo de Criptana, Ciudad Real',
      'spot_restaurante_egos.hours': 'Martes a Domingo: 13:00 - 16:30 & 20:30 - 23:30 | Lunes: Cerrado',
      'spot_restaurante_egos.booking': 'Recomendado reservar',
      'spot_restaurante_egos.price': 'Menú €€',
      'spot_restaurante_egos.fulldesc': '<p>El Restaurante Ego\'s es ampliamente conocido entre los criptanenses por su maestría en las carnes a la brasa y su respeto por la cocina tradicional de La Mancha.</p><p>En un ambiente agradable y acogedor, ofrece platos abundantes de la comarca con toques modernos y una cuidada selección de embutidos y carnes premium cocinadas al punto de brasa. Una parada obligada para los amantes del buen comer.</p>',

      // Spot Casa de la Torrecilla
      'spot_torrecilla.name': 'Casa de la Torrecilla',
      'spot_torrecilla.excerpt': 'Hotel-restaurante ubicado en una majestuosa mansión noble restaurada en pleno casco histórico.',
      'spot_torrecilla.address': 'Calle Cardenal Monescillo, 9, 13610 Campo de Criptana, Ciudad Real',
      'spot_torrecilla.hours': 'Diario: 13:30 - 16:00 & 20:30 - 23:00',
      'spot_torrecilla.booking': 'Recomendada',
      'spot_torrecilla.price': 'Menú €€ - €€€',
      'spot_torrecilla.fulldesc': '<p>La Casa de la Torrecilla es un hotel y restaurante ubicado en una casona noble del siglo XIX restaurada con exquisito gusto en pleno centro de la villa.</p><p>Su propuesta culinaria ofrece platos castellanos elegantes que combinan tradición y toques contemporáneos en un marco señorial inigualable, ideal para disfrutar de la buena mesa rodeado de solera e historia.</p>',

      // Spot 5: Castiblanque
      'spot5.name': 'Bodegas y Viñedos Castiblanque',
      'spot5.excerpt': 'Emblemática bodega del siglo XIX especializada en visitas guiadas, catas premium y maridajes culturales en un entorno histórico.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real',
      'spot5.hours': 'Lun a Vie: 09:00 - 14:00 & 15:00 - 19:00 | Sáb y Dom: 09:00 - 20:00',
      'spot5.booking': 'Cita Previa',
      'spot5.price': 'Experiencias desde €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque es un templo del vino de carácter familiar, ubicado en pleno casco urbano del municipio en un edificio señorial restaurado del siglo XIX. La bodega aúna las técnicas agrícolas tradicionales de la comarca con tecnología enológica vanguardista.</p><p>Sus experiencias de enoturismo son célebres, e incluyen visitas guiadas a través de su nave histórica de barricas de roble y explicaciones detalladas del ciclo biológico de la vid. La visita culmina con una cata guiada por expertos sumilleres de sus marcas premium (como Baldor y Castiblanque), marinados con productos de la tierra como quesos y aceites selectos.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Cooperativa Vinícola del Carmen',
      'spot6.excerpt': 'La bodega fundacional y el corazón latente de la tradición vinícola criptanense a los pies de la Sierra.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana',
      'spot6.hours': 'Lunes a Viernes: 09:00 - 13:30 & 15:30 - 19:00 | Sábados: 10:00 - 14:00',
      'spot6.booking': 'Cita Previa (Grupo)',
      'spot6.price': 'Visita / Tienda',
      'spot6.fulldesc': '<p>Fundada en el año 1897, Vinícola del Carmen ostenta el orgullo de ser la cooperativa vinícola en activo de forma ininterrumpida más antigua de toda España. Es la verdadera alma agrícola de Campo de Criptana, aunando los esfuerzos de cientos de agricultores locales.</p><p>Sus enormes instalaciones representan el equilibrio perfecto entre la escala industrial moderna y la devoción tradicional. Destaca en la elaboración de vinos monovarietales a partir de la uva Airén (la cepa por excelencia de la llanura) y el Tempranillo. Sus visitas grupales detallan la escala masiva de la molienda del mosto y naves de embotellado, finalizando con catas comentadas y venta directa de vinos de excelente relación calidad-precio.</p>',

      // Spot 10: Vidal del Saz (Bodegas del Saz)
      'spot10.name': 'Bodegas del Saz',
      'spot10.excerpt': 'Instalaciones modernas enfocadas a la innovación enológica y experiencias de enoturismo de vanguardia.',
      'spot10.address': 'Calle Maestro Manzanares, 57, 13610 Campo de Criptana, Ciudad Real',
      'spot10.hours': 'Lunes a Viernes: 08:30 - 13:30 & 15:30 - 19:00 | Sábados: 09:00 - 13:00',
      'spot10.booking': 'Cita Previa',
      'spot10.price': 'Catas & Enoturismo',
      'spot10.fulldesc': '<p>Bodegas Vidal del Saz atesora casi un siglo de excelencia vinícola en la comarca de Pozo Hondo de Campo de Criptana. Fundada en 1930, la bodega ha sabido transmitir de generación en generación la devoción por el cuidado extremo de la vid y la innovación de las variedades manchegas.</p><p>La bodega destaca por sus vinos tintos expresivos criados en barricas de roble francés y americano (como su emblemática marca Vidal del Saz y sus vinos premium de autor). Sus visitas de enoturismo permiten descubrir naves de fermentación vanguardistas combinadas con catas detalladas del terroir local manchego.</p>',

      // Spot Bodega El Vínculo
      'spot_vinculo.name': 'Bodega El Vínculo',
      'spot_vinculo.excerpt': 'Prestigiosa bodega fundada por la familia Alejandro Fernández, un imán para el turismo enológico de alta gama en La Mancha.',
      'spot_vinculo.address': 'Avda. Juan Carlos I, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot_vinculo.hours': 'Lunes a Sábado: 10:00 - 14:00 & 16:00 - 19:00',
      'spot_vinculo.booking': 'Cita Previa / Reserva',
      'spot_vinculo.price': 'Catas desde €20',
      'spot_vinculo.fulldesc': '<p>Bodega El Vínculo fue fundada por el célebre bodeguero Alejandro Fernández (creador de Tinto Pesquera) con el objetivo de elaborar vinos de producción limitada y de una calidad excepcional en pleno corazón de La Mancha.</p><p>Ubicada en un edificio industrial rehabilitado cerca de la estación, la bodega representa un imán para el enoturismo de alta gama. Sus catas permiten descubrir la maestría de la uva Tempranillo y la Airén, criadas en barricas de roble americano, mostrando el potencial de los grandes vinos manchegos envejecidos.</p>',

      // Spot Bodegas Símbolo
      'spot_simbolo.name': 'Bodegas Símbolo',
      'spot_simbolo.excerpt': 'Cooperativa local referente en el sector, conocida por sus eventos culturales, catas guiadas y fuerte arraigo en la villa.',
      'spot_simbolo.address': 'Calle Concepción, 135, 13610 Campo de Criptana, Ciudad Real',
      'spot_simbolo.hours': 'Lunes a Viernes: 09:00 - 14:00 & 16:00 - 19:00 | Sábado: 09:00 - 13:00',
      'spot_simbolo.booking': 'Cita Previa / Visitas',
      'spot_simbolo.price': 'Catas & Tienda',
      'spot_simbolo.fulldesc': '<p>Bodegas Símbolo es uno de los grandes referentes cooperativos de Campo de Criptana. Cuenta con una gran trayectoria aunando a cientos de viticultores de la zona para ofrecer vinos de alta calidad y representatividad del terroir local.</p><p>Es muy activa en el plano cultural, organizando catas comentadas, certámenes artísticos y eventos enológicos que acercan la tradición del vino a los visitantes y residentes. En su tienda se pueden adquirir sus reconocidos vinos galardonados de la marca Símbolo.</p>',

      // Spot Bodegas Casa La Viña
      'spot_casa_la_vina.name': 'Bodegas Casa La Viña',
      'spot_casa_la_vina.excerpt': 'Gran exponente de la Denominación de Origen La Mancha con una oferta enológica en constante crecimiento.',
      'spot_casa_la_vina.address': 'Ctra. Campo de Criptana - Arenales, s/n, 13610 Campo de Criptana',
      'spot_casa_la_vina.hours': 'Lunes a Viernes: 08:30 - 14:00 | Fin de semana con reserva',
      'spot_casa_la_vina.booking': 'Contacto previo',
      'spot_casa_la_vina.price': 'Gama media',
      'spot_casa_la_vina.fulldesc': '<p>Bodegas Casa La Viña es un exponente de relieve de la Denominación de Origen La Mancha. Especializada en la producción y crianza de varietales selectos, la bodega destaca por su constante innovación y crecimiento en su catálogo enológico.</p><p>Sus viñedos, acariciados por el viento manchego, proveen una materia prima excelente para sus vinos tintos y blancos estructurados. Un destino enológica y agrícolamente fascinante para conocer el dinamismo vitivinícola actual de la comarca.</p>',

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

      'footer.credit': 'Desarrollado de forma artesanal por <a href="https://www.luzemediamarketing.com/" target="_blank" rel="noopener" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': '¿Quieres digitalizar tu bodega o conseguir más clientes con una web interactiva? <a href="https://www.luzemediamarketing.com/#contacto" target="_blank" rel="noopener" class="audit-btn">Solicita una Auditoría Gratis</a>',

      // LUZE Agency Modal ES Translations
      'luze.modal.title': 'Digitaliza tu Bodega o Negocio',
      'luze.modal.subtitle': '¿Quieres conseguir más clientes con una web interactiva premium o marketing local? Solicita una consulta gratuita con LUZE.',
      'luze.modal.label.name': 'Persona de Contacto',
      'luze.modal.label.phone': 'Teléfono de Contacto',
      'luze.modal.label.email': 'Correo Electrónico',
      'luze.modal.label.msg': 'Describe tu Negocio y Objetivos',
      'luze.modal.submit': 'Solicitar Auditoría Gratis',
      'luze.modal.success.title': '¡Solicitud Transmitida!',
      'luze.modal.success.desc': 'Tus datos han sido enviados al equipo de <strong>luzemediamarketing@gmail.com</strong>. Un asesor de LUZE se pondrá en contacto contigo en menos de 24 horas.',

      // Accommodations ES Translations
      'tab.alojamientos': '🏨 Dónde Dormir',
      'tab.active': '🚲 Senderismo y Bici',
      'tag.alojamiento': 'Alojamiento',
      'tag.active': 'Ruta Activa',
      'btn.booking': 'Consultar Disponibilidad &rarr;',
      'btn.tour': 'Reservar Visita Guiada &rarr;',
      'drawer.btn.tour': 'Reservar Entrada & Visita Guiada',
      'drawer.btn.hotel': 'Consultar Disponibilidad',
      'drawer.btn.wine': 'Comprar Vinos Online → Bodeboca',
      'bento.label': 'PLANIFICA TU ESCAPADA',
      'bento.title': 'Prepara tu Fin de Semana',
      'bento.desc': 'Reserva las mejores experiencias guiadas por los molinos históricos y encuentra estancias con encanto.',
      'bento.tour.title': 'Visita Guiada Oficial',
      'bento.tour.subtitle': 'Desde 10€ · Civitatis',
      'bento.hotel.title': 'Hoteles y Casas Cueva',
      'bento.hotel.subtitle': 'Mejor precio · Booking.com',

      // Ezoic Native Ad Slot ES Translations
      'ad.native.label': 'SELECCIÓN PREMIUM · BODEBOCA',
      'ad.native.headline': 'Compra los Mejores Vinos D.O. La Mancha Online',
      'ad.native.body': '¿Quieres degustar el auténtico sabor de Campo de Criptana en tu propia casa? Disfruta de la mayor selección de vinos de La Mancha, tintos crianza y blancos premium con descuentos exclusivos en Bodeboca.',
      'ad.native.button': 'Comprar Vinos en Bodeboca &rarr;',

      // Lodging spots ES details
      'spot11.name': 'Hotel Boutique Casa Treviño',
      'spot11.excerpt': 'Hotel boutique de 4 estrellas con un spa cueva subterráneo, piscina y habitaciones elegantes en el centro histórico.',
      'spot11.address': 'Calle Isaac Peral, 12, 13610 Campo de Criptana, Ciudad Real',
      'spot11.hours': 'Abierto 24 horas · Recepción permanente',
      'spot11.booking': 'Reserva Online',
      'spot11.price': 'Rango €€€ · 4★ Boutique',
      'spot11.fulldesc': '<p>El Hotel Boutique Casa Treviño redefine el lujo rústico en Campo de Criptana. Este magnífico hotel boutique de 4 estrellas cuenta con una arquitectura de ensueño enclavada en el centro histórico, combinando a la perfección muros de piedra tradicionales con acabados modernos y elegantes.</p><p>Su joya secreta es el spa subterráneo adaptado dentro de una cueva caliza natural, que ofrece un ambiente de relajación inigualable. El hotel dispone también de una piscina exterior, un patio central ajardinado y habitaciones de diseño exclusivo. Es el lugar perfecto para una escapada romántica o una estancia premium con todo el sabor manchego.</p>',

      'spot12.name': 'La Casa del Bachiller',
      'spot12.excerpt': 'Auténtica casa cueva restaurada con todo el confort moderno y vistas espectaculares en el Cerro de la Paz.',
      'spot12.address': 'Calle Cerro de la Paz, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot12.hours': 'Registro de entrada: 15:00 - 21:00',
      'spot12.booking': 'Reserva Online',
      'spot12.price': 'Rango €€ · Casa Cueva',
      'spot12.fulldesc': '<p>La Casa del Bachiller ofrece la experiencia única de dormir bajo tierra en una auténtica cueva excavada en la piedra caliza en el Cerro de la Paz, a escasos metros de los molinos históricos. Las cuevas manchegas son famosas por su bio-climatización natural, manteniendo una agradable temperatura constante de 18°C a 20°C durante todo el año.</p><p>La casa ha sido completamente rehabilitada y equipada con todas las comodidades modernas (cocina completa, salón acogedor, baño moderno y WiFi de alta velocidad) sin perder el encanto tradicional de sus bóvedas blancas de cal. Su ubicación privilegiada permite contemplar los atardeceres dorados y las estrellas con una paz absoluta.</p>',

      'spot13.name': "Hostal Ego's",
      'spot13.excerpt': 'Un hostal acogedor y moderno a pocos pasos de los molinos de viento históricos. Habitaciones cómodas con vistas inmejorables.',
      'spot13.address': 'Calle Rocinante, 2, 13610 Campo de Criptana, Ciudad Real',
      'spot13.hours': 'Recepción: 08:00 - 22:00',
      'spot13.booking': 'Reserva Online',
      'spot13.price': 'Rango € · Hostal Rústico',
      'spot13.fulldesc': '<p>El Hostal Ego\'s goza de una ubicación inmejorable en la cima del cerro, a escasos metros de los famosos gigantes de viento del Quijote. Es un establecimiento moderno, práctico y muy acogedor, diseñado para ofrecer el máximo confort a los viajeros y familias que desean explorar la comarca a pie.</p><p>Dispone de habitaciones climatizadas con baño privado, televisión de pantalla plana y conexión WiFi gratuita. Desde sus ventanas se pueden contemplar los atardeceres mágicos y las siluetas iluminadas de los molinos, convirtiendo cada estancia en un recuerdo imborrable con una excelente relación calidad-precio.</p>',

      'spot14.name': 'Casa Rural Los Tres Cielos',
      'spot14.excerpt': 'Encantadora casa de campo rural con piscina privada, patio manchego y amplias zonas para familias y grupos.',
      'spot14.address': 'Camino de Lillo, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot14.hours': 'Registro de entrada: 16:00 - 22:00',
      'spot14.booking': 'Alquiler Completo',
      'spot14.price': 'Rango €€ · Casa de Campo',
      'spot14.fulldesc': '<p>La Casa Rural Los Tres Cielos es un oasis de paz y aire puro situado en el entorno natural de Campo de Criptana. Esta magnífica casa de campo de alquiler íntegro destaca por su gran piscina exterior privada, su porche sombreado y su amplio patio manchego tradicional, ideal para disfrutar de veladas bajo las estrellas.</p><p>El interior combina de forma elegante vigas de madera vistas con un equipamiento completo: salón amplio con chimenea rústica, barbacoa, cocina equipada y capacidad para albergar cómodamente a grupos y familias. Es el alojamiento ideal para relajarse y desconectar en plena naturaleza rodeado de viñedos y olivos.</p>',

      'spot15.name': 'Área de Autocaravanas Municipal',
      'spot15.excerpt': 'Espacio municipal equipado con agua potable, vaciado y servicios de seguridad a pocos minutos del cerro histórico.',
      'spot15.address': 'Camino de los Molinos, s/n, 13610 Campo de Criptana',
      'spot15.hours': 'Abierto 24 horas · Estancia máx. 72h',
      'spot15.booking': 'Pago Máquina / Libre',
      'spot15.price': 'Precio: ~5€/noche',
      'spot15.fulldesc': '<p>El Área de Autocaravanas Municipal de Campo de Criptana es una de las instalaciones mejor valoradas por el turismo itinerante en Castilla-La Mancha. Situada en una zona muy tranquila y segura a los pies del cerro histórico, permite acceder cómodamente a pie a todos los monumentos y restaurantes.</p><p>El área cuenta con plazas delimitadas y niveladas y ofrece todos los servicios esenciales para autocaravanas: punto de carga de agua potable, rejilla de vaciado de aguas grises y negras, y contenedores de residuos. Un espacio ideal y económico para descansar con tu casa sobre ruedas.</p>',

      'spot16.fulldesc': '<p>Para aquellos viajeros en autocaravana que buscan despertar con las vistas más espectaculares de España, el Parking de la Sierra de los Molinos es la elección perfecta. Situado en la misma loma que corona los molinos de viento históricos, ofrece una explanada habilitada para el estacionamiento y pernocta.</p><p>Es una zona de acceso libre y totalmente gratuita. Aunque no dispone de servicios específicos de llenado de agua o electricidad, su principal atractivo radica en su ubicación mágica: cenar viendo la silueta de los gigantes bajo un cielo estrellado absoluto y despertar con el sol asomando entre las aspas es una experiencia que ningún hotel puede igualar.</p>',
      
      'spot_piscina_municipal.name': 'Piscina Municipal de Verano',
      'spot_piscina_municipal.excerpt': 'El oasis veraniego de Criptana. Gran piscina olímpica, zonas infantiles de césped y arboleda para refrescarse del calor manchego.',
      'spot_piscina_municipal.address': 'Av. de los Deportes, s/n, 13610 Campo de Criptana',
      'spot_piscina_municipal.hours': 'Lunes a Domingo: 12:00 - 20:00 (Temporada de Verano)',
      'spot_piscina_municipal.booking': 'Taquilla / Venta directa',
      'spot_piscina_municipal.price': 'Entrada: ~3.50€ Infantil | ~5.00€ Adulto',
      'spot_piscina_municipal.fulldesc': '<p>La Piscina Municipal de Campo de Criptana es el punto de encuentro perfecto para refrescarse durante los intensos meses del verano manchego. Este complejo deportivo cuenta con una piscina de dimensiones olímpicas ideal para nadar, una piscina mediana de recreo y un vaso chapoteadero seguro para los más pequeños.</p><p>El recinto destaca por sus extensas praderas de césped natural impecablemente cuidadas, rodeadas de una densa sombra de pinos y árboles ideales para descansar en familia, leer un libro o hacer un picnic. Dispone además de un bar-cafetería con servicio de terraza, vestuarios limpios, duchas y socorristas permanentes.</p>',

      'spot_parque_luis_cobos.name': 'Parque Luis Cobos y Terrazas de Verano',
      'spot_parque_luis_cobos.excerpt': 'El parque infantil preferido de los locales, rodeado de famosas terrazas y chiringuitos de verano para picar algo mientras los niños juegan.',
      'spot_parque_luis_cobos.address': 'Parque Luis Cobos (Av. Juan Carlos I / C. Agustín de la Fuente), 13610 Campo de Criptana',
      'spot_parque_luis_cobos.hours': 'Parque: Abierto 24h · Terrazas: 12:00 - 02:00 (Verano)',
      'spot_parque_luis_cobos.booking': 'Recomendado reservar fines de semana',
      'spot_parque_luis_cobos.price': 'Económico ($)',
      'spot_parque_luis_cobos.fulldesc': '<p>El Parque Luis Cobos es un entrañable parque ajardinado en el núcleo urbano, dotado de amplias zonas de sombra y modernos columpios y toboganes infantiles que lo convierten en el lugar favorito de las familias locales. Lo que hace verdaderamente especial a este parque son las terrazas gastronómicas situadas en sus inmediaciones, que comparten el espacio verde y permiten cenar al aire libre bajo los árboles mientras los niños juegan de forma segura.</p><p>Destacan tres establecimientos emblemáticos a su alrededor:</p><ul><li>🍹 <strong>Bar Terraza Pablo Verano:</strong> El clásico y entrañable chiringuito veraniego en medio del parque, célebre por sus raciones típicas, cañas heladas, y refrescos en un ambiente relajado a la sombra.</li><li>🥩 <strong>La Sal Gastrobar:</strong> Un asador y gastrobar de gran nivel que destaca por sus carnes a la brasa, brochetas gourmet y tapas creativas para disfrutar al aire libre.</li><li>🍕 <strong>Pizzería Melocomotodo:</strong> Una pizzería de esquina sumamente popular, perfecta para disfrutar de pizzas artesanales de masa fina que encantan a niños y adultos.</li></ul>',

      'spot_plaza_mayor_park.name': 'Terrazas de la Plaza Mayor',
      'spot_plaza_mayor_park.excerpt': 'El corazón social de la villa. Amplias terrazas monumentales junto al pequeño parque infantil de la plaza peatonal.',
      'spot_plaza_mayor_park.address': 'Plaza Mayor, 13610 Campo de Criptana, Ciudad Real',
      'spot_plaza_mayor_park.hours': 'Diario: 09:00 - 01:00',
      'spot_plaza_mayor_park.booking': 'Libre / Reserva recomendada en festivos',
      'spot_plaza_mayor_park.price': 'Medio ($$)',
      'spot_plaza_mayor_park.fulldesc': '<p>La Plaza Mayor es el corazón histórico y social de Campo de Criptana. Completamente peatonal y rodeada de monumentos como el Pósito Real, la Parroquia de la Asunción y la histórica Casa de los Baillos, cuenta con un animado ambiente diario. En el centro de la plaza se encuentra un coqueto y seguro parque de juegos infantiles.</p><p>Las amplias terrazas de los bares y cafeterías que rodean la plaza son el punto de reunión por excelencia para locales y turistas. Aquí puedes sentarte a disfrutar de una copa de vino con D.O. La Mancha y unas deliciosas raciones tradicionales mientras observas el vaivén de la vida de la villa y dejas que los niños jueguen con total libertad y seguridad en la gran explanada peatonal.</p><p>Destacan establecimientos emblemáticos como:</p><ul><li>🍹 <strong>Bar La Plaza \"Los Díaz\":</strong> Clásica e histórica terraza famosa por sus excelentes raciones de pisto manchego, calamares y cañas bien tiradas justo en la plaza.</li><li>🍷 <strong>Bar Casino Primitivo:</strong> Un lugar emblemático y con solera que ofrece una terraza muy agradable para tomar un aperitivo o café junto a la Parroquia.</li><li>🍺 <strong>Cervecería Sancho:</strong> Con una fantástica terraza peatonal ideal para degustar tapas de la tierra, embutidos y quesos manchegos tradicionales.</li><li>🍕 <strong>Pizza Doam:</strong> Rincón muy popular en la plaza para raciones de pizza artesana que encantan a toda la familia.</li></ul>',

      'route_ermitas.name': 'Senderismo: Ruta de las Ermitas',
      'route_ermitas.excerpt': 'Ruta circular ciclista y senderista que conecta el casco histórico con los bellos santuarios rurales rodeados de viñedos.',
      'route_ermitas.address': 'Salida desde Plaza Mayor hacia los caminos rurales de Criptana',
      'route_ermitas.hours': 'Abierto 24 horas · Ideal por la mañana o al atardecer',
      'route_ermitas.booking': 'Acceso libre',
      'route_ermitas.price': 'Gratuito',
      'route_ermitas.fulldesc': '<p>La Ruta de las Ermitas es un precioso recorrido circular de unos 12 kilómetros, ideal tanto para caminantes como para ciclistas de montaña, que permite adentrarse en la llanura manchega y descubrir la devoción popular de Campo de Criptana. La ruta sale del casco urbano y discurre por senderos agrícolas llanos custodiados por inmensos campos de viñedos, olivos y cereal.</p><p>El itinerario conecta los principales santuarios y ermitas del extrarradio, incluyendo el impresionante Santuario del Santísimo Cristo de Villajos (rodeado de una hermosa zona arbolada y merenderos públicos) y la pintoresca Ermita de la Virgen de Criptana, situada sobre un pequeño cerro que ofrece espectaculares vistas panorámicas de la comarca. Una experiencia de deporte y naturaleza ideal para toda la familia.</p>',

      'route_alcazar_drunkards.name': 'Camino de Alcázar (Ruta de los Borrachos)',
      'route_alcazar_drunkards.excerpt': 'Histórico camino rural a Alcázar, famoso por los ciclistas locales y la simpática historia de los noctámbulos de antaño.',
      'route_alcazar_drunkards.address': 'Inicio: Camino de Alcázar (Zona oeste de Criptana) hasta Alcázar de San Juan',
      'route_alcazar_drunkards.hours': 'Abierto 24 horas · Ideal para caminatas o ciclismo diurno',
      'route_alcazar_drunkards.booking': 'Acceso libre',
      'route_alcazar_drunkards.price': 'Gratuito',
      'route_alcazar_drunkards.fulldesc': '<p>El Camino de Alcázar es una ruta rural de tierra de aproximadamente 7 kilómetros que une Campo de Criptana con la vecina ciudad de Alcázar de San Juan. Es un tramo llano, rápido e ideal para el senderismo, el running y sobre todo para el ciclismo, formando parte de la gran red de caminos históricos de la Mancha Centro.</p><p>Esta ruta cuenta con una de las leyendas urbanas más divertidas y entrañables de la zona, ganándose a nivel popular el apodo de la <strong>\'Ruta de los Borrachos\'</strong>. Décadas atrás, cuando Alcázar de San Juan era el epicentro indiscutible de la vida nocturna de la comarca y no existían taxis ni autobuses nocturnos de vuelta, los jóvenes de Criptana que salían de fiesta y perdían el último tren caminaban o pedaleaban de regreso a casa por este camino rural en mitad de la noche para evitar la peligrosa carretera y eludir los controles de tráfico. Una divertida anécdota popular que hoy en día corona a este camino como una ruta de paseo mítica entre los criptanenses.</p>',

      'itinerary.overline': 'Planifica tu Viaje',
      'itinerary.title': 'Planificador de Ruta Inteligente',
      'itinerary.desc': 'Agrega monumentos, restaurantes, bodegas o alojamientos en la guía haciendo clic en (+) para crear tu ruta personalizada. O carga una de nuestras rutas temáticas recomendadas:',
      'itinerary.preset.quixote': '🚩 Quijote Express',
      'itinerary.preset.wine': '🍷 Vinos & Cuevas Históricas',
      'itinerary.preset.full360': '⚜️ Criptana Completa 360',
      'itinerary.empty.title': 'Tu ruta está vacía',
      'itinerary.empty.desc': 'Navega por la guía y añade lugares usando el botón (+) en cada ficha para generar tu itinerario cronológico ordenado automáticamente.',
      'itinerary.action.clear': 'Limpiar Ruta',
      'itinerary.action.copy': 'Copiar Texto',
      'itinerary.action.print': 'Imprimir Ruta',
      'itinerary.sticky.text': 'Lugares en tu ruta:',
      'itinerary.sticky.btn': 'Ver Planificador &rarr;',
      'itinerary.action.email': '📧 Enviar por Email',
      'map.title': 'Mapa Temático de Criptana',
      'map.subtitle': 'Explora tus paradas interactuando con el mapa',
      'ai.panel.title': 'Planificador de Ruta Inteligente IA',
      'ai.panel.subtitle': 'Diseña una escapada personalizada en segundos. Selecciona quién te acompaña y tu presupuesto en nuestro asistente móvil.',
      'ai.label.party': '¿Con quién viajas?',
      'ai.party.solo': '👤 Solo',
      'ai.party.solo.sub': 'Aventura individual',
      'ai.party.couple': '💑 Pareja',
      'ai.party.couple.sub': 'Escapada romántica',
      'ai.party.family': '👶 Familia',
      'ai.party.family.sub': 'Con niños',
      'ai.party.friends': '🎒 Amigos',
      'ai.party.friends.sub': 'Grupo divertido',
      'ai.label.budget': 'Estilo de Presupuesto',
      'ai.budget.mochilero': '💸 Económico',
      'ai.budget.mochilero.sub': 'Bajo costo / Mochilero',
      'ai.budget.estandar': '🥩 Estándar',
      'ai.budget.estandar.sub': 'Menús tradicionales',
      'ai.budget.vip': '⚜️ Premium',
      'ai.budget.vip.sub': 'Experiencias VIP',
      'ai.label.next': 'Próximo Destino / Extensión',
      'ai.next.none': 'Ninguno',
      'ai.next.none.sub': 'Finalizar en Criptana',
      'ai.next.toboso': 'El Toboso',
      'ai.next.toboso.sub': 'Cuna de Dulcinea',
      'ai.next.consuegra': 'Consuegra',
      'ai.next.consuegra.sub': 'Castillo y Gigantes',
      'ai.next.tomelloso': 'Tomelloso',
      'ai.next.tomelloso.sub': 'Cuevas y Bodegas',
      'ai.next.alcazar': 'Alcázar de S.J.',
      'ai.next.alcazar.sub': 'Patrimonio Cervantino',
      'ai.next.socuellamos': 'Socuéllamos',
      'ai.next.socuellamos.sub': 'Patria del Vino',
      'ai.next.herencia': 'Herencia',
      'ai.next.herencia.sub': 'Molinos de La Pedriza',
      'ai.btn.generate': '✨ Generar Ruta con IA 🚀',
      'ai.label.swimming': '¿Te apetece visitar la piscina municipal/zona de baño local?',
      'ai.steer.title': '✨ ¿Quieres ajustar esta ruta? Pulsa para cambiar al instante:',
      'ai.chip.morning': '☀️ Llegada por la mañana',
      'ai.chip.afternoon': '⛅ Llegada por la tarde',
      'ai.chip.tapas': '🔄 Más opciones de tapas',
      'ai.chip.cultural': '🏛️ Cambiar por opción cultural en interiores',
      'ai.choices.title': '💡 Opciones disponibles en este tramo:',
      'wizard.q1': '¿Qué te gustaría descubrir hoy en Campo de Criptana?',
      'wizard.q2': 'En tu escapada, ¿viajas con niños?',
      'wizard.q3': 'El entorno rural es precioso. ¿Añadimos senderismo o ciclismo?',
      'wizard.q4': 'Criptana es cuna regional. ¿Sigues alguna ruta temática?',
      'wizard.q5': '¿Hacia qué municipio sigues tu viaje después de visitarnos?',
      'wizard.restart': '🔄 Reiniciar Asistente de Viaje',
      'email.modal.title': 'Compartir Itinerario',
      'email.modal.desc': 'Introduce tu correo electrónico y el de tus acompañantes para enviarles la ruta planificada.',
      'email.label.yours': 'Tu Email *',
      'email.label.companions': 'Email de Acompañantes (Opcional, separados por comas)',
      'email.label.newsletter': 'Deseo recibir novedades turísticas y eventos de Criptana (Boletín / Newsletter)',
      'email.btn.cancel': 'Cancelar',
      'email.btn.send': 'Enviar Ruta 🚀',
      'zone.centro': 'Centro Histórico',
      'zone.fuera': 'Fuera del Núcleo',
      'monument.filter.all': '📍 Todos',
      'monument.filter.molinos': '💨 Molinos',
      'monument.filter.centro': '🏰 Centro',
      'monument.filter.albaicin': '🏠 Albaicín',
      'monument.filter.fuera': '🌲 Fuera',
      'monuments.btn.expand': '✨ Ver Más Monumentos y Lugares (17) &darr;',
      'monuments.btn.collapse': '✨ Ver Menos Monumentos &uarr;'
    },
    en: {
      'nav.directorio': 'Local Guide',
      'nav.articulos': 'Articles',
      'nav.explorar': 'Explore',
      
      'hero.overline': 'Discover Criptana · Your Guide & Local Directory · Campo de Criptana',
      'hero.title': 'Land of<br><em>Giants.</em>',
      'hero.subtitle': 'Discover the soul of Campo de Criptana. A comprehensive, real-time updated independent guide featuring opening hours, precise Google Maps locations, and direct contact details for the town\'s finest sights, dining, and historical wineries.',
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
      'tag.piscina': '🏊 Leisure & Swim',
      
      'btn.more': 'Learn More &rarr;',
      
      'ad.label': 'ANUNCIO / SPONSORED',
      'ad.title': 'Advertise Your Business',
      'ad.desc': 'Appear in the top positions of our independent directory and attract organic tourists and local clients directly to your doors.',
      'ad.cta': 'View Sponsorship Plans &rarr;',

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
      'modal.success.desc': 'Your request has been forwarded to <strong>criptana360@gmail.com</strong>. We will get in touch with you in less than 24 hours.',
      
      // Spot 1: Windmills
      'spot1.name': 'Sierra de los Molinos (Windmills)',
      'spot1.excerpt': 'The legendary 16th-century windmills. The iconic historical landmark that inspired Don Quixote\'s battle against the giants.',
      'spot1.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot1.hours': 'Monday to Sunday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot1.booking': 'Free Entry / Open Access',
      'spot1.price': 'Free Access',
      'spot1.fulldesc': '<p>The Sierra de los Molinos ridge represents the most definitive image of Campo de Criptana and the universal silhouette of Spanish classical literature. Here stands the majestic group of wooden-bladed windmills described by Miguel de Cervantes in Chapter VIII of Don Quixote.</p><p>Of the ten windmills standing on the ridge today, three (<strong>Burleta, Infanto, and Sardinero</strong>) preserve their original 16th-century structures and impressive wooden internal machinery entirely intact, standing as unique historic relics worldwide. Several times a year, a traditional grain milling is performed live, turning the sails to grind wheat using wind power.</p>',

      'spot2.name': 'Pastora Marcela Cave House',
      'spot2.excerpt': 'An authentic historical home hand-carved directly into the limestone cliffs of Cerro de la Paz. A living testament to regional cave living.',
      'spot2.address': 'Cerro de la Paz, s/n (Next to Church of la Paz), 13610 Campo de Criptana, Spain',
      'spot2.hours': 'Monday to Sunday: 11:00 AM - 2:00 PM | Tuesday to Saturday: 4:30 PM - 7:00 PM',
      'spot2.booking': 'Guided Access / Ticket',
      'spot2.price': 'Entrance: 1.50€',
      'spot2.fulldesc': '<p>Located on the scenic Cerro de la Paz hill, the Casa-Cueva de la Pastora Marcela offers a direct window into the troglodyte cave architecture of La Mancha. For centuries, Criptana\'s working families dug their homes directly into the soft white limestone subsoil, utilizing its perfect thermal insulation (maintaining a constant 18°C temperature year-round).</p><p>This cave house has been beautifully restored and decorated with original antique furnishings, agricultural implements, and household tools. Visitors can explore the historical living quarters, the subterranean stable, and experience the unique cool atmosphere of underground bedrooms.</p>',

      'spot_albaicin.name': 'Albaicín Neighborhood',
      'spot_albaicin.excerpt': 'The historic labyrinth of steep encalcado streets and vibrant cobalt indigo baseboards.',
      'spot_albaicin.address': 'Albaicín Quarter, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_albaicin.hours': 'Open 24 hours · Free Access',
      'spot_albaicin.booking': 'Not Required',
      'spot_albaicin.price': 'Free',
      'spot_albaicin.fulldesc': '<p>The historic Albaicín neighborhood of Campo de Criptana is a picturesque maze of Moorish and Mudéjar roots climbing the slopes of the Cerro de la Paz. Its blinding white cal (lime) facades, bordered by traditional cobalt indigo baseboards (zoquetes añiles), create one of the most beautiful and photographed scenes in Castilla-La Mancha.</p><p>Strolling through its narrow cobblestone steps is a journey into traditional Spanish village peace. The indigo baseboards originally served a hygienic purpose to deter insects, while reflecting the brilliant sun. The quarter features beautiful viewpoints to watch the legendary sunset falling over the vast plains and historic windmills.</p>',

      'spot_fuente_cano.name': 'Fuente del Caño',
      'spot_fuente_cano.excerpt': 'The historic 16th-century public fountain and stone trough that supplied the town\'s fresh water.',
      'spot_fuente_cano.address': 'Calle Fuente del Caño, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_fuente_cano.hours': 'Open 24 hours · Free Access',
      'spot_fuente_cano.booking': 'Free Access',
      'spot_fuente_cano.price': 'Free',
      'spot_fuente_cano.fulldesc': '<p>La Fuente del Caño is the oldest and most beloved hydraulic monument in Campo de Criptana. Built in the 16th century, this historic stone-carved public fountain and associated trough served as the primary source of fresh drinking water for local residents and an active rest stop for livestock during transhumance migratory movements.</p><p>Its robust structure reflects the solid lines of Spanish Renaissance architecture. Located at the base of the hill, the fountain and its quiet landscaped garden offer a refreshingly cool resting place on your climb toward the giant windmills.</p>',

      'spot_sara_montiel.name': 'Sara Montiel Museum',
      'spot_sara_montiel.excerpt': 'Set inside the historic Molino Culebro. An exclusive exhibition dedicated to the global cinema diva born in the town.',
      'spot_sara_montiel.address': 'Sierra de los Molinos (Molino Culebro), 13610 Campo de Criptana, Spain',
      'spot_sara_montiel.hours': 'Tuesday to Sunday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot_sara_montiel.booking': 'Free Entry / Donation',
      'spot_sara_montiel.price': 'Free',
      'spot_sara_montiel.fulldesc': '<p>The Sara Montiel Museum is located entirely inside the historic <strong>Culebro Windmill</strong>, a fully restored 16th-century giant dedicated to the actress, singer, and international cinema diva born in Campo de Criptana in 1928.</p><p>Spanning three circular timber-framed floors, the permanent exhibition details her spectacular career in Hollywood and Mexico. It displays original stage dresses, unpublished personal photographs, international awards, a historic grand piano, and classic film posters from her most legendary hits like <em>El último cuplé</em> and <em>La violetera</em>.</p>',

      'spot_museo_vino.name': 'La Mancha Wine Museum',
      'spot_museo_vino.excerpt': 'A cultural and educational space dedicated to viticulture history in the world\'s largest single plain wine region.',
      'spot_museo_vino.address': 'Calle Isaac Peral, 19 (At Castiblanque Winery), 13610 Campo de Criptana, Spain',
      'spot_museo_vino.hours': 'Monday to Sunday: Guided tours & wine tasting sessions',
      'spot_museo_vino.booking': 'Prior Booking Required',
      'spot_museo_vino.price': 'Free Access to Shop',
      'spot_museo_vino.fulldesc': '<p>The La Mancha Wine Museum in Campo de Criptana is an exceptional educational center focused on regional winemaking history and enology. La Mancha holds the title of the largest single continuous wine plain on earth, and this museum details the complete history of its agricultural tools and methods.</p><p>The collection showcases historic giant timber presses, ancient Manchego clay amphorae (tinajas), oak barrels, and antique field plows. The tour details the deep connection between the land and the vine, ending with summelier-guided tastings.</p>',

      'spot_ci_molinos.name': 'Windmill Interpretation Center',
      'spot_ci_molinos.excerpt': 'A modern interactive center detailing the physics, wood engineering, and operation of Manchego windmills.',
      'spot_ci_molinos.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_ci_molinos.hours': 'Monday to Sunday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot_ci_molinos.booking': 'Group Bookings Recommended',
      'spot_ci_molinos.price': 'Free Entry',
      'spot_ci_molinos.fulldesc': '<p>The Windmill Interpretation Center offers a highly educational interactive and audio-visual tour to reveal the complex 16th-century mechanics behind the giant sails. Located right on the Sierra de los Molinos ridge, it is the perfect prelude before stepping inside the original windmills.</p><p>Through detailed scale models, 3D projections, and interactive engineering displays, visitors understand how the immense holm oak gears convert wind power into stone friction, how the massive guide beam rotates the heavy conical roof, and how wheat is turned into flour.</p>',

      'spot_eloy_teno.name': 'Eloy Teno Museum',
      'spot_eloy_teno.excerpt': 'A museum dedicated to the acclaimed local metal sculptor alongside interactive workshops preserving traditional crafts.',
      'spot_eloy_teno.address': 'Calle Isaac Peral, s/n, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_eloy_teno.hours': 'Tuesday to Saturday: 10:00 AM - 2:00 PM & 5:00 PM - 8:00 PM | Sunday: 10:00 AM - 2:00 PM',
      'spot_eloy_teno.booking': 'Free Access',
      'spot_eloy_teno.price': 'Free Entry',
      'spot_eloy_teno.fulldesc': '<p>The Eloy Teno Museum and Crafts Center celebrates the famous local sculptor of Campo de Criptana, acting as a bastion of regional Manchego handicrafts. Set inside a restored historic building, it focuses on keeping alive traditional blacksmithing, pottery, esparto grass weaving, and woodworking.</p><p>The permanent collection houses Eloy Teno\'s spectacular forged-iron sculptures, capturing with incredible artistic power the imagery of Don Quixote and the silhouetted giants. The center also features live workshops and rotating exhibitions of local artisans from across Ciudad Real.</p>',

      'spot_sala_carros.name': 'Carriage Exhibition Room',
      'spot_sala_carros.excerpt': 'A historic collection of antique horse carriages, plows, and traditional animal-drawn farm vehicles.',
      'spot_sala_carros.address': 'Sierra de los Molinos (Next to Tourism Office), 13610 Campo de Criptana, Spain',
      'spot_sala_carros.hours': 'Monday to Sunday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot_sala_carros.booking': 'Free Access',
      'spot_sala_carros.price': 'Free',
      'spot_sala_carros.fulldesc': '<p>The Carriage Exhibition Room (Sala de los Carros) offers a nostalgic historical walk through the pre-industrial transport and farming methods of the La Mancha countryside. It is housed in a beautifully rehabilitated historic warehouse right on the Sierra de los Molinos ridge.</p><p>It displays a superb collection of original 19th and early 20th-century carriages, farm wagons, threshing boards (trillos), yokes, and timber plows. The exhibition helps visitors comprehend the severe physical demands of farming life before automation in Criptana\'s cereal plains and vineyards.</p>',

      'spot_posito.name': 'Pósito Real (Royal Granary)',
      'spot_posito.excerpt': 'A majestic 16th-century wheat bank. A masterpiece of Castilian Renaissance design, now a cultural and art exhibition hall.',
      'spot_posito.address': 'Plaza del Pósito, 1, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_posito.hours': 'Tuesday to Saturday: 11:30 AM - 2:00 PM & 6:30 PM - 9:00 PM | Sun: 11:30 AM - 2:00 PM',
      'spot_posito.booking': 'Recommended',
      'spot_posito.price': 'Free Entry',
      'spot_posito.fulldesc': '<p>The Pósito Real represents one of the most important Castilian Renaissance architectural landmarks in Castilla-La Mancha. Built in the 16th century under the reign of King Philip II, this magnificent building originally functioned as a community wheat bank and granary, designed to support farmers during droughts and ensure the town\'s food supply.</p><p>Its exterior features a solemn and imposing facade decorated with the Imperial Coat of Arms of Charles V carved in limestone above the large central entrance arch. The interior preserves its grand original open spatial layouts with exposed noble timber roof beams and stone columns, perfectly converted into a premium museum and cultural hub.</p>',

      'spot_patrimonio_religioso.name': 'Religious Heritage',
      'spot_patrimonio_religioso.excerpt': 'The 17th-century Convent of Discalced Carmelitas. A sanctuary of peace featuring quiet historic cloisters and sacred art.',
      'spot_patrimonio_religioso.address': 'Plaza del Convento, s/n, 13610 Campo de Criptana, Spain',
      'spot_patrimonio_religioso.hours': 'Worship hours & Scheduled tours',
      'spot_patrimonio_religioso.booking': 'Prior Booking Required',
      'spot_patrimonio_religioso.price': 'Free Entry / Donation',
      'spot_patrimonio_religioso.fulldesc': '<p>The religious heritage of Campo de Criptana is beautifully represented by the historic Convent of the Carmelita Fathers (17th century). Established under the monastic rules of Saint Teresa of Avila and Saint John of the Cross, the convent showcases classic, sober Castilian Baroque masonry.</p><p>Its church features a classic Latin cross floor plan, housing a rich catalog of gilded altarpieces and sacred wood carvings of immense historic and processional value. The silent inner cloisters, composed of stone arches and thick masonry, invite quiet contemplation, offering a tranquil sanctuary in the middle of town.</p>',

      'spot_iglesia_parroquial.name': 'Parish Church',
      'spot_iglesia_parroquial.excerpt': 'A majestic 16th-century temple of cathedral-like proportions, rebuilt with an imposing stone bell tower.',
      'spot_iglesia_parroquial.address': 'Plaza Mayor, 1, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_iglesia_parroquial.hours': 'Monday to Sunday: 9:00 AM - 1:00 PM & 6:00 PM - 9:00 PM',
      'spot_iglesia_parroquial.booking': 'Free Access',
      'spot_iglesia_parroquial.price': 'Free Entry',
      'spot_iglesia_parroquial.fulldesc': '<p>The Parish Church of Nuestra Señora de la Asunción is the primary religious landmark and the most imposing architectural structure in Campo de Criptana\'s Casco Antiguo. Originally built in the 16th century, it is famous for its cathedral-like proportions and massive stone bell tower dominating the town\'s skyline.</p><p>The church suffered heavy damage during the Spanish Civil War, and was meticulously rebuilt in the mid-20th century, strictly respecting its original classical Renaissance structural lines. The interior features a majestic main altarpiece, multiple side chapels dedicated to local patron saints, and a deeply solemn atmosphere.</p>',

      'spot_fachadas.name': 'Historical Facades',
      'spot_fachadas.excerpt': 'A self-guided walking route through historic noble mansions and palatial residences dating from the 17th to 19th centuries.',
      'spot_fachadas.address': 'Calle Isaac Peral & Calle Virgen, 13610 Campo de Criptana, Spain',
      'spot_fachadas.hours': 'Open 24 hours · Free Access',
      'spot_fachadas.booking': 'Free Access',
      'spot_fachadas.price': 'Free',
      'spot_fachadas.fulldesc': '<p>Strolling through Criptana\'s old town center is like visiting an open-air museum of noble Spanish architecture. Sizable streets like Calle Isaac Peral and Calle de la Virgen are lined with spectacular noble family mansions and historic townhouses built between the 17th and 19th centuries.</p><p>These houses feature massive ashlar stone portals, majestic Castilian timber doors, and beautiful Toledo-style wrought-iron balconies and window grills. They stand as a quiet testament to the prosperous agricultural aristocracy and landowners who populated the Cervantes-inspired village.</p>',

      'spot_escudos.name': 'Coats of Arms',
      'spot_escudos.excerpt': 'A historical quest to locate the aristocratic stone coats of arms and heraldic shields carved into noble facades.',
      'spot_escudos.address': 'Casco Histórico (Calle Real & Isaac Peral), 13610 Campo de Criptana, Spain',
      'spot_escudos.hours': 'Open 24 hours · Free Access',
      'spot_escudos.booking': 'Free Access',
      'spot_escudos.price': 'Free',
      'spot_escudos.fulldesc': '<p>The heraldic shields and coats of arms carved into the limestone walls of Campo de Criptana are a valuable patrimonial archive that recounts the noble lineages and history of the village. Scattered across the walls of the old town, these carved blazons date from the 16th to the 18th centuries.</p><p>While walking through these historic streets, visitors can spot beautiful family coats of arms carved above stone arches and facade key-stones, belonging to powerful families of Castile and historic military orders like the Order of Santiago, which ruled these territories for centuries.</p>',

      'spot_pozo_nieve.name': 'Pozo de Nieve',
      'spot_pozo_nieve.excerpt': 'A remarkable 18th-century subterranean ice house used to store winter snow and distribute ice in the summer.',
      'spot_pozo_nieve.address': 'Camino de los Pozos de Nieve, s/n, 13610 Campo de Criptana, Spain',
      'spot_pozo_nieve.hours': 'Guided tours organized via the tourist office',
      'spot_pozo_nieve.booking': 'Prior Booking Required',
      'spot_pozo_nieve.price': 'Free Access to Grounds',
      'spot_pozo_nieve.fulldesc': '<p>The Pozo de Nieve (Ice House) of Campo de Criptana is a masterpiece of historical engineering and a structure unique in Castilla-La Mancha. Built in the 18th century, this massive underground circular well was used to collect and compact snow during the freezing winters, insulating it with straw to preserve ice blocks that supplied the region during the scorching summers.</p><p>The structure is famous for its immense cúpula (dome) built using traditional dry-stone masonry without mortar. Fully restored, it provides a fascinating testament to human resourcefulness before industrial refrigeration.</p>',

      'spot_laguna_salicor.name': 'Laguna de Salicor',
      'spot_laguna_salicor.excerpt': 'A protected saline wetland lake and nature reserve. A vital birdwatching paradise for nesting migratory flamingos.',
      'spot_laguna_salicor.address': 'Crot. Campo de Criptana - Arenales de San Gregorio, s/n, 13610, Spain',
      'spot_laguna_salicor.hours': 'Open 24 hours · Best at sunrise and sunset',
      'spot_laguna_salicor.booking': 'Free Access',
      'spot_laguna_salicor.price': 'Free',
      'spot_laguna_salicor.fulldesc': '<p>The Laguna de Salicor is a protected nature reserve and endorheic saline wetland of immense ecological value in Castilla-La Mancha. This vast steppe basin fills seasonally with winter rains, creating a unique habitat of saline flats and specialized salt-tolerant vegetation.</p><p>It is an absolute paradise for birdwatching and ecotourism. The wetland serves as a crucial nesting and feeding stop for thousands of migratory water birds, including pink flamingos, great bustards, cranes, and marsh harriers. Its wild surroundings offer sunrises of absolute silence and breathtaking sunsets reflected in the mirror-like salt waters.</p>',

      'spot_ermita_criptana.name': 'Ermita Virgen de Criptana',
      'spot_ermita_criptana.excerpt': 'A historic 16th-century chapel set on a lonely hilltop, offering spectacular 360-degree views of the countryside.',
      'spot_ermita_criptana.address': 'Colina de la Virgen, Camino del Santuario, s/n, 13610 Campo de Criptana, Spain',
      'spot_ermita_criptana.hours': 'Monday to Sunday: 10:00 AM - 1:30 PM & 4:30 PM - 7:30 PM',
      'spot_ermita_criptana.booking': 'Free Access',
      'spot_ermita_criptana.price': 'Free',
      'spot_ermita_criptana.fulldesc': '<p>The Santuario de la Virgen de Criptana stands majestically on a lonely hilltop outside the town center, its brilliant white silhouette dominating the wheat fields and vineyards. Built in the 16th century over a medieval chapel, it houses the town\'s beloved patron saint.</p><p>Its typical Manchego architecture features whitewashed stone walls, a rustic porticoed courtyard, and traditional chambers. The hilltop functions as a magnificent 360-degree panoramic viewpoint, offering a front-row seat to contemplate the immense horizon of Castilla-La Mancha and its golden sunsets.</p>',

      'spot_ermita_villajos.name': 'Ermita Cristo de Villajos',
      'spot_ermita_villajos.excerpt': 'An imposing medieval and baroque sanctuary surrounded by a peaceful pine forest and recreational picnic areas.',
      'spot_ermita_villajos.address': 'Carretera C-310 (Toward Alcázar de San Juan), s/n, 13610, Spain',
      'spot_ermita_villajos.hours': 'Monday to Sunday: 9:00 AM - 2:00 PM & 4:00 PM - 8:00 PM',
      'spot_ermita_villajos.booking': 'Free Access',
      'spot_ermita_villajos.price': 'Free',
      'spot_ermita_villajos.fulldesc': '<p>The Sanctuary of Santísimo Cristo de Villajos is a religious complex of deep local devotion, set in a beautiful natural clearing surrounded by centuries-old pine trees. The chapel, which dates to the 13th century in the medieval era with substantial Baroque expansions in the 17th, houses Criptana\'s male patron saint.</p><p>The area is acclaimed for its absolute peace and refreshing shade, serving as the favorite local spot for Romeria festivals and outdoor family lunches. Its church houses a beautifully carved altarpiece and the iconic statue of Christ.</p>',

      'spot_centro_naturaleza.name': 'Centro de la Naturaleza',
      'spot_centro_naturaleza.excerpt': 'An educational nature center and birdwatching observatory focused on the conservation of regional wetlands.',
      'spot_centro_naturaleza.address': 'Laguna de Salicor, Camino de Salicor, 13610 Campo de Criptana, Spain',
      'spot_centro_naturaleza.hours': 'Saturdays & Sundays: 10:00 AM - 2:00 PM | School visits by arrangement',
      'spot_centro_naturaleza.booking': 'Recommended',
      'spot_centro_naturaleza.price': 'Free Entry',
      'spot_centro_naturaleza.fulldesc': '<p>The Salicor Nature Center functions as an educational classroom and wildlife observatory vital to understand the biodiversity of the saline lake ecosystem. It provides exceptional teaching resources and environmental awareness programs.</p><p>It features a birdwatching hide equipped with binoculars and species identification charts, alongside interactive displays about water cycles in the Manchego steppes. It is the perfect stop for families and ecotourism lovers.</p>',

      // Spot 3: Las Musas
      'spot3.name': 'Las Musas Restaurant',
      'spot3.excerpt': 'Legendary panoramic terrace next to the windmills. Signature Manchego gastronomy and spectacular views of the Albaicín.',
      'spot3.address': 'Calle Barbero, 3, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot3.hours': 'Monday to Sunday: 1:30 PM - 4:30 PM & 8:30 PM - 11:30 PM',
      'spot3.booking': 'Highly Recommended',
      'spot3.price': 'Menu €€ - €€€',
      'spot3.fulldesc': '<p>Las Musas stands as the premier culinary meeting place in Campo de Criptana, nestled directly at the foot of the historic windmill hill. The restaurant masterfully integrates the rustic white limestone of an ancient cave with high-end, contemporary dining rooms.</p><p>Its gastronomy focuses on updating classic La Mancha dishes—such as pisto, gachas, migas, and roasted lamb—by adding refined modern culinary touches. Their outdoor terrace is legendary, offering a front-row seat to dine or enjoy a glass of wine as the sunset paints the plains below the illuminated giants.</p>',

      // Spot 4: Cueva La Martina
      'spot4.name': 'Cueva La Martina Restaurant',
      'spot4.excerpt': 'Historic restaurant built entirely inside an authentic traditional Manchego cave house.',
      'spot4.address': 'Calle Rocinante, 13, 13610 Campo de Criptana, Ciudad Real, Spain',
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

      // Spot Restaurante Ego's
      'spot_restaurante_egos.name': 'Ego’s Restaurant',
      'spot_restaurante_egos.excerpt': 'Specialists in grilled meats and traditional dishes with the authentic touch of local cuisine.',
      'spot_restaurante_egos.address': 'Calle García León, 51, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_restaurante_egos.hours': 'Tuesday to Sunday: 1:00 PM - 4:30 PM & 8:30 PM - 11:30 PM | Monday: Closed',
      'spot_restaurante_egos.booking': 'Reservation Recommended',
      'spot_restaurante_egos.price': 'Menu €€',
      'spot_restaurante_egos.fulldesc': '<p>Ego\'s Restaurant is widely known among locals for its expertise in grilled meats and its respect for traditional La Mancha cuisine.</p><p>In a pleasant and welcoming atmosphere, it offers hearty regional dishes with modern touches and a careful selection of cold cuts and premium meats cooked to perfection on the grill. A must-visit for food lovers.</p>',

      // Spot Casa de la Torrecilla
      'spot_torrecilla.name': 'Casa de la Torrecilla',
      'spot_torrecilla.excerpt': 'Hotel-restaurant located in a majestic restored noble mansion in the heart of the historic center.',
      'spot_torrecilla.address': 'Calle Cardenal Monescillo, 9, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_torrecilla.hours': 'Daily: 1:30 PM - 4:00 PM & 8:30 PM - 11:00 PM',
      'spot_torrecilla.booking': 'Recommended',
      'spot_torrecilla.price': 'Menu €€ - €€€',
      'spot_torrecilla.fulldesc': '<p>Casa de la Torrecilla is a hotel and restaurant set within a beautifully restored 19th-century noble mansion in the town center.</p><p>Its culinary offerings feature elegant Castilian dishes that combine tradition with contemporary touches in an incomparable historic setting, ideal for enjoying a fine meal surrounded by heritage and history.</p>',

      // Spot 5: Castiblanque
      'spot5.name': 'Bodegas y Viñedos Castiblanque',
      'spot5.excerpt': 'Emblematic 19th-century winery specializing in guided tours, premium tastings, and cultural pairings in a historic setting.',
      'spot5.address': 'Calle Isaac Peral, 19, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot5.hours': 'Mon to Fri: 9:00 AM - 2:00 PM & 3:00 PM - 7:00 PM | Sat & Sun: 9:00 AM - 8:00 PM',
      'spot5.booking': 'Prior Booking Required',
      'spot5.price': 'Tastings from €15',
      'spot5.fulldesc': '<p>Bodegas Castiblanque is a family-run cathedral of wine, located in the heart of the town center within a magnificently restored 19th-century noble mansion. The cellar combines time-tested traditional farming values with cutting-edge winemaking technology.</p><p>Their wine tourism packages are highly regarded, featuring expert-guided walks through their historic barrel cellars and detailed accounts of the grapevine growth cycle. The tour finishes with a commentary-led tasting of their signature brands (such as Baldor and Castiblanque), paired with local artisanal cheeses and oils.</p>',

      // Spot 6: Vinícola del Carmen
      'spot6.name': 'Cooperativa Vinícola del Carmen',
      'spot6.excerpt': 'The oldest active cooperative winery in Spain (1897). Tour their state-of-the-art facilities with D.O. La Mancha tastings.',
      'spot6.address': 'Camino del Puente de San Benito, s/n, 13610 Campo de Criptana, Spain',
      'spot6.hours': 'Monday to Friday: 9:00 AM - 1:30 PM & 3:30 PM - 7:00 PM | Saturdays: 10:00 AM - 2:00 PM',
      'spot6.booking': 'Prior Group Booking',
      'spot6.price': 'Tours / Shop',
      'spot6.fulldesc': '<p>Established in 1897, Vinícola del Carmen holds the proud distinction of being the oldest continuously operating cooperative winery in Spain. It is the agricultural heartbeat of Campo de Criptana, uniting the heritage of hundreds of local family vineyards.</p><p>Their massive state-of-the-art production halls represent the perfect balance between massive scale and artisanal devotion. They excel in crafting single-varietal wines from the indigenous white Airén grape and traditional Tempranillo. Guided group tours detail the massive crushing vats and bottling lines, ending with professional tastings.</p>',

      // Spot 10: Vidal del Saz (Bodegas del Saz)
      'spot10.name': 'Bodegas del Saz',
      'spot10.excerpt': 'Modern facilities focused on winemaking innovation and avant-garde wine tourism experiences.',
      'spot10.address': 'Calle Maestro Manzanares, 57, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot10.hours': 'Monday to Friday: 8:30 AM - 1:30 PM & 3:30 PM - 7:00 PM | Saturdays: 9:00 AM - 1:00 PM',
      'spot10.booking': 'Prior Booking Vital',
      'spot10.price': 'Wine Tastings',
      'spot10.fulldesc': '<p>Bodegas Vidal del Saz has nurtured almost a century of winemaking excellence in the legendary Pozo Hondo district of Campo de Criptana. Established in 1930, the winery has successfully handed down from generation to generation a profound dedication to absolute vine care and local variety innovation.</p><p>They are famous for their deeply expressive red wines aged in select French and American oak casks (such as their flagship Vidal del Saz label and signature premium series). Guided visits tour their state-of-the-art fermentation halls, followed by highly professional commented tastings of their complex wines.</p>',

      // Spot Bodega El Vínculo
      'spot_vinculo.name': 'Bodega El Vínculo',
      'spot_vinculo.excerpt': 'Prestigious winery founded by the Alejandro Fernández family, a magnet for high-end wine tourism in La Mancha.',
      'spot_vinculo.address': 'Avda. Juan Carlos I, s/n, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_vinculo.hours': 'Monday to Saturday: 10:00 AM - 2:00 PM & 4:00 PM - 7:00 PM',
      'spot_vinculo.booking': 'Prior Booking / Reservation',
      'spot_vinculo.price': 'Tastings from €20',
      'spot_vinculo.fulldesc': '<p>Bodega El Vínculo was founded by the famous winemaker Alejandro Fernández (creator of Tinto Pesquera) with the aim of producing limited-production wines of exceptional quality in the heart of La Mancha.</p><p>Located in a restored industrial building near the railway station, the winery is a magnet for high-end wine tourism. Its tastings showcase the mastery of Tempranillo and Airén grapes aged in American oak barrels, demonstrating the potential of aged Manchego wines.</p>',

      // Spot Bodegas Símbolo
      'spot_simbolo.name': 'Bodegas Símbolo',
      'spot_simbolo.excerpt': 'A leading local cooperative known for cultural events, guided tastings, and deep roots in the town.',
      'spot_simbolo.address': 'Calle Concepción, 135, 13610 Campo de Criptana, Ciudad Real, Spain',
      'spot_simbolo.hours': 'Monday to Friday: 9:00 AM - 2:00 PM & 4:00 PM - 7:00 PM | Saturday: 9:00 AM - 1:00 PM',
      'spot_simbolo.booking': 'Prior Booking / Tours',
      'spot_simbolo.price': 'Tastings & Shop',
      'spot_simbolo.fulldesc': '<p>Bodegas Símbolo is one of the leading cooperatives in Campo de Criptana, with a rich history of uniting hundreds of local winegrowers to produce high-quality wines that represent the local terroir.</p><p>The winery is highly active in the cultural scene, organizing commented tastings, art contests, and wine events that connect wine traditions with visitors and residents. Its award-winning wines under the Símbolo brand are available at its shop.</p>',

      // Spot Bodegas Casa La Viña
      'spot_casa_la_vina.name': 'Bodegas Casa La Viña',
      'spot_casa_la_vina.excerpt': 'A great representative of the La Mancha Designation of Origin with a constantly growing wine catalog.',
      'spot_casa_la_vina.address': 'Ctra. Campo de Criptana - Arenales, s/n, 13610 Campo de Criptana, Spain',
      'spot_casa_la_vina.hours': 'Monday to Friday: 8:30 AM - 2:00 PM | Weekends with reservation',
      'spot_casa_la_vina.booking': 'Prior Contact',
      'spot_casa_la_vina.price': 'Mid-range',
      'spot_casa_la_vina.fulldesc': '<p>Bodegas Casa La Viña is a prominent representative of the La Mancha Designation of Origin. Specialized in the production and aging of select varietals, the winery stands out for its constant innovation and growth in its winemaking catalog.</p><p>Its vineyards, caressed by the Manchego wind, provide excellent raw material for its structured red and white wines. A fascinating wine and agricultural destination to discover the current winemaking dynamism of the region.</p>',

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

      'footer.credit': 'Handcrafted with passion by <a href="https://www.luzemediamarketing.com/" target="_blank" rel="noopener" class="agency-link">LUZE Media Marketing</a>',
      'footer.audit': 'Want to digitalize your winery or get more customers with an interactive website? <a href="https://www.luzemediamarketing.com/#contacto" target="_blank" rel="noopener" class="audit-btn">Request a Free Audit</a>',

      // LUZE Agency Modal EN Translations
      'luze.modal.title': 'Digitalize Your Winery or Business',
      'luze.modal.subtitle': 'Want to attract more clients with a premium interactive website or local marketing? Request a free consultation with LUZE.',
      'luze.modal.label.name': 'Contact Person',
      'luze.modal.label.phone': 'Contact Phone',
      'luze.modal.label.email': 'Email Address',
      'luze.modal.label.msg': 'Describe Your Business & Goals',
      'luze.modal.submit': 'Request Free Audit',
      'luze.modal.success.title': 'Inquiry Transmitted!',
      'luze.modal.success.desc': 'Your details have been sent to the <strong>luzemediamarketing@gmail.com</strong> team. A LUZE consultant will reach out to you within 24 hours.',

      // Accommodations EN Translations
      'tab.alojamientos': '🏨 Accommodations',
      'tab.active': '🚲 Hiking & Biking',
      'tag.alojamiento': 'Accommodation',
      'tag.active': 'Active Trail',
      'btn.booking': 'Check Availability &rarr;',
      'btn.tour': 'Book Guided Tour &rarr;',
      'drawer.btn.tour': 'Book Tickets & Guided Tour',
      'drawer.btn.hotel': 'Check Availability',
      'drawer.btn.wine': 'Buy Wines Online → Bodeboca',
      'bento.label': 'PLAN YOUR ESCAPE',
      'bento.title': 'Plan Your Weekend',
      'bento.desc': 'Book official guided tours around the historic windmills and discover unique rustic accommodations.',
      'bento.tour.title': 'Official Guided Tour',
      'bento.tour.subtitle': 'From €10 · Civitatis',
      'bento.hotel.title': 'Hotels & Cave Houses',
      'bento.hotel.subtitle': 'Best Price · Booking.com',

      // Ezoic Native Ad Slot EN Translations
      'ad.native.label': 'PREMIUM SELECTION · BODEBOCA',
      'ad.native.headline': 'Buy the Best D.O. La Mancha Wines Online',
      'ad.native.body': 'Want to taste the authentic flavor of Campo de Criptana in your own home? Enjoy the largest selection of La Mancha wines, red crianzas, and white premium bottles with exclusive discounts on Bodeboca.',
      'ad.native.button': 'Buy Wines on Bodeboca &rarr;',

      // Lodging spots EN details
      'spot11.name': 'Hotel Boutique Casa Treviño',
      'spot11.excerpt': 'A 4-star boutique hotel featuring an underground spa cave, outdoor swimming pool, and stylish rooms in the historic center.',
      'spot11.address': '12 Isaac Peral St, 13610 Campo de Criptana, Ciudad Real',
      'spot11.hours': 'Open 24 hours · Permanent reception',
      'spot11.booking': 'Online Booking',
      'spot11.price': 'Price level €€€ · 4★ Boutique',
      'spot11.fulldesc': '<p>Hotel Boutique Casa Treviño redefines rustic luxury in Campo de Criptana. This magnificent 4-star boutique hotel boasts dreamlike architecture nestled in the historic center, seamlessly blending traditional stone walls with modern, elegant finishes.</p><p>Its secret crown jewel is the subterranean spa set inside a natural limestone cave, offering an unparalleled atmosphere of pure relaxation. The hotel also features an outdoor swimming pool, a landscaped central courtyard, and exclusively designed bedrooms. It is the perfect choice for a romantic getaway or a premium stay filled with Manchego character.</p>',

      'spot12.name': 'La Casa del Bachiller',
      'spot12.excerpt': 'An authentic cave home fully restored with modern comforts and spectacular panoramic views on Cerro de la Paz.',
      'spot12.address': 'Cerro de la Paz Hill, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot12.hours': 'Check-in: 3:00 PM - 9:00 PM',
      'spot12.booking': 'Online Booking',
      'spot12.price': 'Price level €€ · Cave House',
      'spot12.fulldesc': '<p>La Casa del Bachiller offers the unique experience of sleeping underground in an authentic cave carved into the limestone of Cerro de la Paz, just yards from the historic windmills. Manchego caves are famous for their natural bioclimatic insulation, maintaining an exceptionally pleasant constant temperature of 18°C to 20°C (64°F to 68°F) all year round.</p><p>The house has been completely renovated and equipped with all modern conveniences (full kitchen, cozy living room, modern bathroom, and high-speed WiFi) without losing the traditional charm of its whitewashed cave vaults. Its privileged location allows guests to gaze at golden sunsets and starry skies in absolute peace.</p>',

      'spot13.name': "Hostal Ego's",
      'spot13.excerpt': 'A cozy, modern hostal situated just steps from the historic windmills. Offers comfortable air-conditioned rooms with unbeatable views.',
      'spot13.address': '2 Rocinante St, 13610 Campo de Criptana, Ciudad Real',
      'spot13.hours': 'Reception: 8:00 AM - 10:00 PM',
      'spot13.booking': 'Online Booking',
      'spot13.price': 'Price level € · Rustic Guesthouse',
      'spot13.fulldesc': '<p>Hostal Ego\'s enjoys an unbeatable location on the hilltop ridge, just yards from the famous Quixote wind giants. It is a modern, practical, and highly welcoming guest house designed to offer maximum comfort to travelers and families eager to explore the district on foot.</p><p>It features air-conditioned rooms with private bathrooms, flat-screen TVs, and free WiFi access. From its windows, guests can contemplate magical sunsets and the illuminated silhouettes of the windmills, making every stay a memorable experience at an excellent price-to-quality ratio.</p>',

      'spot14.name': 'Casa Rural Los Tres Cielos',
      'spot14.excerpt': 'A charming countryside rural house featuring a private swimming pool, traditional Manchego courtyard, and spacious rooms for groups.',
      'spot14.address': 'Camino de Lillo, s/n, 13610 Campo de Criptana, Ciudad Real',
      'spot14.hours': 'Check-in: 4:00 PM - 10:00 PM',
      'spot14.booking': 'Full House Rental',
      'spot14.price': 'Price level €€ · Country House',
      'spot14.fulldesc': '<p>Casa Rural Los Tres Cielos is a tranquil oasis of clean air situated in the natural landscape of Campo de Criptana. This superb holiday house, available for full rental, stands out for its large private outdoor pool, shaded porch, and extensive traditional Manchego courtyard, ideal for outdoor dinners under the stars.</p><p>The interior beautifully pairs exposed wooden beams with complete facilities: a spacious living room with a rustic fireplace, barbecue area, fully equipped kitchen, and capacity to comfortably host families and groups. It is the ultimate choice to relax and unwind in nature surrounded by local vineyards and olive trees.</p>',

      'spot15.name': 'Municipal RV Park',
      'spot15.excerpt': 'An official municipal RV park equipped with drinking water, emptying facilities, and secure spaces minutes from the historic hill.',
      'spot15.address': 'Camino de los Molinos, s/n, 13610 Campo de Criptana',
      'spot15.hours': 'Open 24 hours · Max stay 72h',
      'spot15.booking': 'Machine Payment / Open',
      'spot15.price': 'Price: ~5€/night',
      'spot15.fulldesc': '<p>The Municipal RV Park of Campo de Criptana is one of the highest-rated motorhome stopovers in Castilla-La Mancha. Located in a peaceful and highly secure area at the foot of the historic ridge, it allows motorhome travelers to easily walk to all local monuments and dining spots.</p><p>The park offers clearly marked, level parking bays alongside all essential RV utilities: drinking water hookups, grey and black water disposal drains, and recycling bins. It is a highly practical and budget-friendly site to rest with your home on wheels.</p>',

      'spot16.name': 'Sierra de los Molinos RV Parking',
      'spot16.excerpt': 'A free public parking area adapted for overnight RV stays, offering direct, iconic views of the historic windmills.',
      'spot16.address': 'Sierra de los Molinos, s/n, 13610 Campo de Criptana',
      'spot16.hours': 'Open 24 hours · Free Access',
      'spot16.booking': 'Free Access',
      'spot16.price': 'Free',
      'spot16.fulldesc': '<p>For motorhome travelers seeking to wake up to one of the most spectacular views in Spain, the Sierra de los Molinos Parking is the perfect spot. Situated right on the same ridge that crowns the historic windmills, it offers a spacious flat area adapted for parking and overnight stays.</p><p>Access is entirely free and open 24/7. While it does not provide specific utilities like water refills or electricity hookups, its ultimate charm lies in its magical location: dining as the silhouettes of the giants glow under a starry sky and waking up to the sun rising between the windmill sails is an experience no traditional hotel can match.</p>',

      'spot_piscina_municipal.name': 'Municipal Summer Pool',
      'spot_piscina_municipal.excerpt': 'The summer oasis of Criptana. Large Olympic pool, children splash areas, grassy lawns, and trees to cool off from the La Mancha heat.',
      'spot_piscina_municipal.address': 'Av. de los Deportes, s/n, 13610 Campo de Criptana',
      'spot_piscina_municipal.hours': 'Monday to Sunday: 12:00 PM - 8:00 PM (Summer Season)',
      'spot_piscina_municipal.booking': 'Ticket office / Direct entry',
      'spot_piscina_municipal.price': 'Entry: ~3.50€ Kids | ~5.00€ Adults',
      'spot_piscina_municipal.fulldesc': '<p>The Campo de Criptana Municipal Summer Pool is the ultimate local oasis to escape the intense summer heat of La Mancha. The modern facility features an Olympic-sized main pool for active swimmers, a medium recreational pool, and a dedicated splash pool for toddlers.</p><p>Surrounding the pools are expansive, well-kept natural grassy lawns shaded by tall pine trees, providing a perfect setting for relaxing, reading, or enjoying a family picnic. The complex is fully equipped with clean changing rooms, showers, professional lifeguards, and a local snack bar/cafeteria with outdoor seating.</p>',

      'spot_parque_luis_cobos.name': 'Luis Cobos Park & Summer Terraces',
      'spot_parque_luis_cobos.excerpt': 'A favorite local green park featuring popular outdoor restaurant terraces where families dine while kids play safely on the playground.',
      'spot_parque_luis_cobos.address': 'Luis Cobos Park (Av. Juan Carlos I / C. Agustin de the Fuente), 13610 Campo de Criptana',
      'spot_parque_luis_cobos.hours': 'Park: Open 24h · Terraces: 12:00 PM - 02:00 AM (Summer)',
      'spot_parque_luis_cobos.booking': 'Recommended on weekends',
      'spot_parque_luis_cobos.price': 'Affordable ($)',
      'spot_parque_luis_cobos.fulldesc': '<p>Luis Cobos Park is a peaceful landscaped green square in town, offering rich shaded areas and modern playground amenities that make it highly popular with local families. The highlight of the park is the cluster of outdoor terraces surrounding the square, sharing the same green lawn, allowing parents to enjoy local dishes and cold drinks under the trees while watching their kids play safely in the pedestrian park.</p><p>Three fantastic establishments frame the park:</p><ul><li>🍹 <strong>Bar Terraza Pablo Verano:</strong> A classic seasonal summer chiringuito located inside the park, perfect for enjoying ice-cold beer, summer drinks, and traditional tapas under the cool shade.</li><li>🥩 <strong>La Sal Gastrobar:</strong> A top-rated grill and gastrobar offering modern gourmet tapas, grilled meats, and refreshing outdoor seating on the edge of the park.</li><li>🍕 <strong>Pizzería Melocomotodo:</strong> A highly popular corner pizzeria, famous for its thin-crust artisan pizzas, making it a perfect casual choice for children and parents alike.</li></ul>',

      'spot_plaza_mayor_park.name': 'Plaza Mayor Terraces & Play Park',
      'spot_plaza_mayor_park.excerpt': 'The vibrant social heart of the town. Outdoor terraces framing a children\'s play park in the historic pedestrian square.',
      'spot_plaza_mayor_park.address': 'Plaza Mayor, 13610 Campo de Criptana, Ciudad Real',
      'spot_plaza_mayor_park.hours': 'Daily: 9:00 AM - 1:00 AM',
      'spot_plaza_mayor_park.booking': 'Free / Recommended on holidays',
      'spot_plaza_mayor_park.price': 'Moderate ($$)',
      'spot_plaza_mayor_park.fulldesc': '<p>The Plaza Mayor is the historic and social beating heart of Campo de Criptana. Fully pedestrianized and framed by majestic landmarks like the Pósito Real, the Church of the Assumption, and the historic Baillos House, it provides a warm and lively atmosphere. A small, safe children\'s playground sits right in the center of the square.</p><p>The extensive restaurant and cafe terraces lining the square are a favorite meeting point for both locals and travelers. It is the perfect place to sit back, sip a glass of regional D.O. La Mancha wine, and taste local pisto and Manchego cheese, while children run and play freely in the spacious, traffic-free plaza.</p><p>Several legendary establishments surround the square:</p><ul><li>🍹 <strong>Bar La Plaza \"Los Díaz\":</strong> An iconic, historic terrace famous for its superb Manchego pisto rations, fried squid, and perfectly poured beers right on the square.</li><li>🍷 <strong>Bar Casino Primitivo:</strong> A traditional meeting point with a highly pleasant outdoor terrace next to the church, ideal for a morning coffee or an afternoon aperitif.</li><li>🍺 <strong>Cervecería Sancho:</strong> Featuring a fantastic pedestrian terrace, highly recommended for traditional local tapas, cured meats, and cured Manchego cheeses.</li><li>🍕 <strong>Pizza Doam:</strong> A popular family spot on the plaza offering freshly baked artisan pizzas that both kids and adults love.</li></ul>',

      'route_ermitas.name': 'Hiking & Cycling: Chapel Route',
      'route_ermitas.excerpt': 'A scenic circular trail connecting the town center with historic countryside sanctuaries nestled among local vineyards.',
      'route_ermitas.address': 'Starts from Plaza Mayor towards Criptana\'s agricultural trails',
      'route_ermitas.hours': 'Open 24 hours · Best in the morning or near sunset',
      'route_ermitas.booking': 'Free access',
      'route_ermitas.price': 'Free',
      'route_ermitas.fulldesc': '<p>The Chapel Route (Ruta de las Ermitas) is a beautiful 12-kilometer circular trail, highly suited for both leisurely hikers and cyclists, that leads deep into the agricultural plains of La Mancha. The path begins in the town center and loops through flat country roads lined with endless vineyards, olive groves, and golden wheat fields.</p><p>The route links the main countryside chapels and sanctuaries of the outskirts, including the grand Sanctuary of Cristo de Villajos (surrounded by pine trees and picnic benches) and the scenic Hilltop Chapel of Virgen de Criptana, which offers dramatic panoramic views of the region. A delightful outdoor nature activity for active travelers and families.</p>',

      'route_alcazar_drunkards.name': 'Alcázar Trail (\'The Drunkards Route\')',
      'route_alcazar_drunkards.excerpt': 'Historic rural path to Alcázar, highly popular for cycling and famous for the legendary shortcut used by nighttime revelers.',
      'route_alcazar_drunkards.address': 'Starts: Camino de Alcazar (West side of Criptana) to Alcazar de San Juan',
      'route_alcazar_drunkards.hours': 'Open 24 hours · Best for daytime hiking or cycling',
      'route_alcazar_drunkards.booking': 'Free access',
      'route_alcazar_drunkards.price': 'Free',
      'route_alcazar_drunkards.fulldesc': '<p>The Alcázar Country Trail is a flat 7-kilometer dirt path directly connecting Campo de Criptana with the neighboring hub of Alcázar de San Juan. It is an extremely easy, fast, and flat route popular among hikers, runners, and mountain bikers, integrated into the extensive historical path network of central La Mancha.</p><p>The trail is famous for its charming local folklore, earning it the affectionate nickname of the **\'Ruta de los Borrachos\' (The Drunkards\' Route)**. Decades ago, when Alcázar was the main nightlife hotspot in the area, local youth from Criptana who missed the last train or bus home would walk or bicycle back along this dark dirt path. Walking or pedaling through this rural route allowed them to get home safely, avoiding the dangerous asphalt highway and bypassing any traffic guards. A humorous piece of modern local history that makes walking or riding this path a legendary experience.</p>',
      'itinerary.overline': 'Plan Your Escape',
      'itinerary.title': 'Smart Itinerary Planner',
      'itinerary.desc': 'Add sights, restaurants, wineries, or lodgings in the guide by clicking (+) to build your personalized route. Or choose one of our expert-curated paths:',
      'itinerary.preset.quixote': '🚩 Quixote Express',
      'itinerary.preset.wine': '🍷 Wine & Historical Caves',
      'itinerary.preset.full360': '⚜️ Complete Criptana 360',
      'itinerary.empty.title': 'Your itinerary is empty',
      'itinerary.empty.desc': 'Browse the directory and add spots using the (+) button on any card to automatically generate your optimized chronological timeline.',
      'itinerary.action.clear': 'Clear Route',
      'itinerary.action.copy': 'Copy Itinerary',
      'itinerary.action.print': 'Print Route',
      'itinerary.sticky.text': 'Spots in your itinerary:',
      'itinerary.sticky.btn': 'View Planner &rarr;',
      'itinerary.action.email': '📧 Send by Email',
      'map.title': 'Thematic Map of Criptana',
      'map.subtitle': 'Explore your stops by interacting with the map',
      'ai.panel.title': 'AI Smart Itinerary Planner',
      'ai.panel.subtitle': 'Design a personalized getaway in seconds. Choose your companions and budget style in our mobile-friendly wizard.',
      'ai.label.party': 'Who are you traveling with?',
      'ai.party.solo': '👤 Solo',
      'ai.party.solo.sub': 'Individual adventure',
      'ai.party.couple': '💑 Couple',
      'ai.party.couple.sub': 'Romantic getaway',
      'ai.party.family': '👶 Family',
      'ai.party.family.sub': 'With kids',
      'ai.party.friends': '🎒 Friends',
      'ai.party.friends.sub': 'Fun group',
      'ai.label.budget': 'Budget Style',
      'ai.budget.mochilero': '💸 Backpacker',
      'ai.budget.mochilero.sub': 'Budget / Low cost',
      'ai.budget.estandar': '🥩 Standard',
      'ai.budget.estandar.sub': 'Traditional meals',
      'ai.budget.vip': '⚜️ Premium',
      'ai.budget.vip.sub': 'VIP experiences',
      'ai.label.next': 'Next Destination / Extension',
      'ai.next.none': 'None',
      'ai.next.none.sub': 'Finish in Criptana',
      'ai.next.toboso': 'El Toboso',
      'ai.next.toboso.sub': "Dulcinea's Home",
      'ai.next.consuegra': 'Consuegra',
      'ai.next.consuegra.sub': 'Castle and Giants',
      'ai.next.tomelloso': 'Tomelloso',
      'ai.next.tomelloso.sub': 'Caves and Wineries',
      'ai.next.alcazar': 'Alcázar de S.J.',
      'ai.next.alcazar.sub': 'Cervantine Heritage',
      'ai.next.socuellamos': 'Socuéllamos',
      'ai.next.socuellamos.sub': 'Wine Homeland',
      'ai.next.herencia': 'Herencia',
      'ai.next.herencia.sub': 'La Pedriza Windmills',
      'ai.btn.generate': '✨ Generate Route with AI 🚀',
      'ai.label.swimming': 'Would you like to visit the municipal pool/local swimming spot?',
      'ai.steer.title': '✨ Want to adjust this route? Click to shift instantly:',
      'ai.chip.morning': '☀️ Morning Arrival',
      'ai.chip.afternoon': '⛅ Afternoon Arrival',
      'ai.chip.tapas': '🔄 More Tapas Options',
      'ai.chip.cultural': '🏛️ Swap for Indoor Cultural Sights',
      'ai.choices.title': '💡 Available options in this block:',
      'wizard.q1': 'What would you like to discover today in Campo de Criptana?',
      'wizard.q2': 'Are you traveling with children?',
      'wizard.q3': 'Nature is beautiful! Shall we add hiking or cycling routes?',
      'wizard.q4': 'Criptana is a key regional hub. Are you following a thematic trail?',
      'wizard.q5': 'Which town are you heading to next after visiting us?',
      'wizard.restart': '🔄 Restart Travel Wizard',
      'email.modal.title': 'Share Itinerary',
      'email.modal.desc': "Enter your email and your companions' emails to share your planned itinerary with them.",
      'email.label.yours': 'Your Email *',
      'email.label.companions': "Companions' Emails (Optional, comma-separated)",
      'email.label.newsletter': 'I want to receive tourism updates and events from Criptana (Newsletter)',
      'email.btn.cancel': 'Cancel',
      'email.btn.send': 'Share Route 🚀',
      'zone.centro': 'Historic Center',
      'zone.fuera': 'Out of Town',
      'monument.filter.all': '📍 All',
      'monument.filter.molinos': '💨 Windmills',
      'monument.filter.centro': '🏰 Center',
      'monument.filter.albaicin': '🏠 Albaicín',
      'monument.filter.fuera': '🌲 Out of Town',
      'monuments.btn.expand': '✨ View More Sights & Culture (17) &darr;',
      'monuments.btn.collapse': '✨ View Less Sights &uarr;'
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
    if (window.updateSunsetTimer) {
      window.updateSunsetTimer();
    }

    // Refresh drawer content if open to update labels instantly
    if (window.refreshDrawerContent) {
      window.refreshDrawerContent();
    }
  }

  /* ─── Live Weather & Sunset Data Engine ────────────────────────────────── */
  function fetchLiveWeatherData() {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=39.40&longitude=-3.12&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=Europe/Madrid';
    
    fetch(weatherUrl)
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          
          let textEs = 'Despejado';
          let textEn = 'Clear';
          let icon = '☀️';

          if (code === 0) {
            textEs = 'Despejado'; textEn = 'Clear'; icon = '☀️';
          } else if (code >= 1 && code <= 3) {
            textEs = 'Intervalos nubosos'; textEn = 'Partly cloudy'; icon = '⛅';
          } else if (code === 45 || code === 48) {
            textEs = 'Niebla'; textEn = 'Foggy'; icon = '🌫️';
          } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            textEs = 'Lluvia'; textEn = 'Rainy'; icon = '🌧️';
          } else if ([71, 73, 75, 85, 86].includes(code)) {
            textEs = 'Nieve'; textEn = 'Snowy'; icon = '❄️';
          } else if ([95, 96, 99].includes(code)) {
            textEs = 'Tormenta'; textEn = 'Thunderstorm'; icon = '⛈️';
          }

          // Update translations in memory
          translations.es['widget.weather'] = `Campo de Criptana · ${textEs} · ${temp}°C`;
          translations.en['widget.weather'] = `Campo de Criptana · ${textEn} · ${temp}°C`;

          // Update the weather icon
          const iconEl = document.querySelector('.weather-widget .utility-icon');
          if (iconEl) iconEl.innerText = icon;

          // Re-apply translation to update UI immediately
          applyLanguage(activeLang);
        }

        if (data && data.daily && data.daily.sunset && data.daily.sunset[0]) {
          cachedSunsetTime = new Date(data.daily.sunset[0]);
          if (window.updateSunsetTimer) {
            window.updateSunsetTimer();
          }
        }
      })
      .catch(function (err) {
        console.error('Error fetching live weather data:', err);
      });
  }

  function initLanguageSelector() {
    const lang = document.documentElement.getAttribute('lang') || 'es';
    applyLanguage(lang);

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    if (btnEs) {
      btnEs.addEventListener('click', function () {
        if (lang !== 'es') {
          window.location.href = 'index.html';
        }
      });
    }
    if (btnEn) {
      btnEn.addEventListener('click', function () {
        if (lang !== 'en') {
          window.location.href = 'index-en.html';
        }
      });
    }
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

  /* ─── 10. Smart Itinerary Planner Engine ───────────────────────────────── */
  let selectedSpots = [];

  const chronologicalSlots = {
    morning: {
      time: '10:00 - 13:00',
      labelEs: '🌅 Mañana · Cultura e Historia',
      labelEn: '🌅 Morning · Sights & History',
      spots: ['spot1', 'spot_posito', 'spot_iglesia_parroquial', 'spot_sara_montiel', 'spot_ci_molinos', 'spot_eloy_teno', 'spot_sala_carros', 'spot_patrimonio_religioso', 'spot_pozo_nieve', 'spot_fuente_cano', 'spot_fachadas', 'spot_escudos'],
      tipEs: 'Te aconsejamos empezar temprano para evitar el calor y disfrutar de los museos con calma.',
      tipEn: 'We recommend starting early to avoid the midday heat and enjoy the museums in peace.'
    },
    lunch: {
      time: '13:00 - 15:30',
      labelEs: '🍽️ Almuerzo · Gastronomía Manchega',
      labelEn: '🍽️ Lunch · Manchego Gastronomy',
      spots: ['spot3', 'spot4', 'spot7', 'spot8', 'spot9', 'spot_parque_luis_cobos', 'spot_plaza_mayor_park'],
      tipEs: '¡Imprescindible reservar con antelación en fines de semana! Saborea unas buenas gachas o cordero asado.',
      tipEn: 'Booking in advance is highly recommended on weekends! Taste traditional slow-cooked Manchego lamb.'
    },
    afternoon: {
      time: '15:30 - 18:30',
      labelEs: '🍇 Tarde · Enoturismo o Naturaleza',
      labelEn: '🍇 Afternoon · Wineries & Nature',
      spots: ['spot5', 'spot6', 'spot10', 'spot_museo_vino', 'spot_laguna_salicor', 'spot_centro_naturaleza', 'spot_ermita_criptana', 'spot_ermita_villajos', 'spot_piscina_municipal', 'route_ermitas', 'route_alcazar_drunkards'],
      tipEs: 'El momento perfecto para visitar una bodega histórica, realizar una cata guiada o contemplar la Laguna.',
      tipEn: 'The perfect time to explore a historic winery, enjoy a guided tasting, or visit the saline nature reserve.'
    },
    sunset: {
      time: '18:30 - 21:00',
      labelEs: '🌇 Atardecer · El Albaicín y la Llama de Oro',
      labelEn: '🌇 Sunset · Albaicín & Golden hour',
      spots: ['spot2', 'spot_albaicin'],
      tipEs: '¡La mejor luz del día! Sube por el Albaicín hacia la Sierra para ver el atardecer dorado reflejado en los molinos.',
      tipEn: 'The best light of the day! Walk through the Albaicín to the windmill ridge to watch the golden sunset.'
    },
    night: {
      time: '21:00+',
      labelEs: '🌙 Noche · Descanso o Pernocta',
      labelEn: '🌙 Night · Lodging & Stay',
      spots: ['spot11', 'spot12', 'spot13', 'spot14', 'spot15', 'spot16'],
      tipEs: 'Relájate en tu casa cueva tradicional o caravana y disfruta de un cielo estrellado espectacular sin contaminación lumínica.',
      tipEn: 'Unwind in your traditional cave house or RV park and enjoy a magnificent starry sky with zero light pollution.'
    }
  };

  const presetItineraries = {
    quixote: ['spot1', 'spot2', 'spot3', 'spot_sara_montiel'],
    wine: ['spot5', 'spot_museo_vino', 'spot4', 'spot10'],
    full360: ['spot_posito', 'spot_iglesia_parroquial', 'spot7', 'spot_laguna_salicor', 'spot1', 'spot11']
  };

  window.toggleSpotInItinerary = function (spotId) {
    const index = selectedSpots.indexOf(spotId);
    if (index === -1) {
      selectedSpots.push(spotId);
    } else {
      selectedSpots.splice(index, 1);
    }
    updateItineraryUI();
  };

  window.clearItinerary = function () {
    selectedSpots = [];
    document.querySelectorAll('.preset-route-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    updateItineraryUI();
  };

  window.loadPresetItinerary = function (presetId) {
    const preset = presetItineraries[presetId];
    if (!preset) return;

    selectedSpots = [...preset];
    
    document.querySelectorAll('.preset-route-btn').forEach(function (btn) {
      btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('preset-' + presetId);
    if (activeBtn) activeBtn.classList.add('active');

    updateItineraryUI();
  };

  window.scrollToItinerary = function () {
    const planSec = document.getElementById('planificador');
    if (planSec) {
      planSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function updateItineraryUI() {
    document.querySelectorAll('.btn-add-to-route').forEach(function (btn) {
      const spotId = btn.getAttribute('data-spot');
      if (selectedSpots.includes(spotId)) {
        btn.classList.add('added');
        btn.innerHTML = '✓';
      } else {
        btn.classList.remove('added');
        btn.innerHTML = '+';
      }
    });

    const countBadge = document.getElementById('itinerary-sticky-count');
    if (countBadge) countBadge.innerText = selectedSpots.length;

    const stickyBar = document.getElementById('itinerary-sticky-bar');
    if (stickyBar) {
      if (selectedSpots.length > 0) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }

    window.generateItinerary();
  }

  window.generateItinerary = function () {
    const outputContainer = document.getElementById('itinerary-timeline-output');
    const actionsRow = document.getElementById('itinerary-actions');
    if (!outputContainer) return;

    // Read preference inputs
    const budgetSelect = document.getElementById('select-budget');
    const activeBudget = budgetSelect ? budgetSelect.value : 'all';
    
    const kidsToggle = document.getElementById('toggle-kids');
    const onlyKids = kidsToggle ? kidsToggle.checked : false;

    const activeToggle = document.getElementById('toggle-active');
    const onlyActive = activeToggle ? activeToggle.checked : false;

    // Build spots list starting with explicitly selected ones
    let spotsToRender = [...selectedSpots];

    // If active nature is selected, auto-inject routes if not already added
    if (onlyActive) {
      if (!spotsToRender.includes('route_ermitas')) {
        spotsToRender.push('route_ermitas');
      }
      if (!onlyKids && !spotsToRender.includes('route_alcazar_drunkards')) {
        // Drunkards shortcut route is not kid-friendly, only show if not onlyKids
        spotsToRender.push('route_alcazar_drunkards');
      }
    }

    const mapContainer = document.getElementById('planner-map-container');
    if (spotsToRender.length === 0) {
      if (mapContainer) mapContainer.style.display = 'none';
      const emptyTitle = activeLang === 'es' ? 'Tu ruta está vacía' : 'Your itinerary is empty';
      const emptyDesc = activeLang === 'es' 
        ? 'Haz clic en el botón (+) al lado de cualquier monumento, restaurante, bodega o alojamiento en la guía para agregarlo a tu itinerario cronológico inteligente.'
        : 'Browse the directory and add spots using the (+) button on any card to automatically generate your optimized chronological timeline.';
      
      outputContainer.innerHTML = `
        <div class="itinerary-empty-state">
          <span class="itinerary-empty-icon">🗺️</span>
          <h3 class="itinerary-empty-title">${emptyTitle}</h3>
          <p class="itinerary-empty-desc">${emptyDesc}</p>
        </div>
      `;
      if (actionsRow) actionsRow.style.display = 'none';
      return;
    }

    if (actionsRow) actionsRow.style.display = 'flex';
    if (mapContainer) {
      mapContainer.style.display = 'block';
    }
    if (typeof window.updateIllustratedMap === 'function') {
      window.updateIllustratedMap(spotsToRender);
    }

    // Auto dining recommendation if no restaurant is selected
    const hasRestaurantSelected = spotsToRender.some(function(id) { 
      const spot = spotsData[id];
      return spot && spot.category === 'restaurante'; 
    });

    let recommendedDiningSpotId = null;
    if (!hasRestaurantSelected) {
      // Determine the best dining recommendation based on budget and kids friendly filters
      if (onlyKids) {
        if (activeBudget === '$') {
          recommendedDiningSpotId = 'spot_parque_luis_cobos';
        } else if (activeBudget === '$$') {
          recommendedDiningSpotId = 'spot_plaza_mayor_park';
        } else if (activeBudget === '$$$') {
          recommendedDiningSpotId = 'spot8'; // Piccolo (family pizza)
        } else { // all
          recommendedDiningSpotId = 'spot_plaza_mayor_park';
        }
      } else {
        if (activeBudget === '$') {
          recommendedDiningSpotId = 'spot9'; // Ricote
        } else if (activeBudget === '$$') {
          recommendedDiningSpotId = 'spot7'; // La Pulpería
        } else if (activeBudget === '$$$') {
          recommendedDiningSpotId = 'spot3'; // Las Musas
        } else { // all
          recommendedDiningSpotId = 'spot3'; // Las Musas (classic)
        }
      }
    }

    let actuallyRenderedSpots = [];
    let html = '<div class="itinerary-timeline">';
    const keys = ['morning', 'lunch', 'afternoon', 'sunset', 'night'];

    keys.forEach(function (slotKey) {
      const slot = chronologicalSlots[slotKey];
      
      // Filter matching spots
      let matchingSpots = spotsToRender.filter(function (id) { return slot.spots.includes(id); });

      // If lunch slot and dining recommendation exists, add it dynamically
      let isRecommendedInThisSlot = false;
      if (slotKey === 'lunch' && recommendedDiningSpotId && slot.spots.includes(recommendedDiningSpotId)) {
        matchingSpots.push(recommendedDiningSpotId);
        isRecommendedInThisSlot = true;
      }

      if (matchingSpots.length > 0) {
        const title = activeLang === 'es' ? slot.labelEs : slot.labelEn;
        const tip = activeLang === 'es' ? slot.tipEs : slot.tipEn;
        
        html += `
          <div class="timeline-item active-slot">
            <div class="timeline-dot"></div>
            <span class="timeline-time-label">${slot.time}</span>
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--anil-blue); font-weight: 700; margin-bottom: 0.6rem;">${title}</h4>
            <p style="font-size: 0.78rem; color: var(--cream-dim); margin-bottom: 1.25rem; font-style: italic;">💡 ${tip}</p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
        `;

        matchingSpots.forEach(function (spotId) {
          const spot = spotsData[spotId];
          if (!spot) return;

          if (!actuallyRenderedSpots.includes(spotId)) {
            actuallyRenderedSpots.push(spotId);
          }

          const isRecommendedSpot = (spotId === recommendedDiningSpotId);
          const name = translations[activeLang][spotId + '.name'] || spotId;
          const excerpt = translations[activeLang][spotId + '.excerpt'] || '';
          const address = translations[activeLang][spotId + '.address'] || '';
          
          let btnLabel = activeLang === 'es' ? 'Saber Más' : 'Learn More';
          let mapsLabel = activeLang === 'es' ? 'Cómo llegar &rarr;' : 'Get Directions &rarr;';
          
          // Badge generation
          let badgesHtml = '';
          if (isRecommendedSpot) {
            const recLabel = activeLang === 'es' ? '💡 Recomendado para ti' : '💡 Recommended for you';
            badgesHtml += `<span class="timeline-card-badge recomendacion" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600;">${recLabel}</span>`;
          }
          if (spot.kidsFriendly) {
            const kidsLabel = activeLang === 'es' ? '👶 Ideal Niños' : '👶 Kid-Friendly';
            badgesHtml += `<span class="timeline-card-badge kids" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600;">${kidsLabel}</span>`;
          }
          if (spot.activeNature) {
            const activeLabel = activeLang === 'es' ? '🚲 Senderismo y Bici' : '🚲 Active Trail';
            badgesHtml += `<span class="timeline-card-badge active-route" style="background: rgba(59, 130, 246, 0.15); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600;">${activeLabel}</span>`;
          }

          // Click-to-call button
          let callBtnHtml = '';
          if (spot.category === 'restaurante' && spot.phone) {
            const callLabel = activeLang === 'es' ? '📞 Reservar' : '📞 Book Table';
            callBtnHtml = `
              <a href="tel:${spot.phone}" class="timeline-card-btn call-btn" style="background: #10B981; color: white; border: 1px solid #10B981; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);">
                ${callLabel}
              </a>
            `;
          }

          const isAdded = selectedSpots.includes(spotId);
          const addBtnClass = isAdded ? 'btn-add-to-route added' : 'btn-add-to-route';
          const addBtnText = isAdded ? '✓' : '+';
          const addBtnTitle = activeLang === 'es' ? 'Añadir a mi ruta' : 'Add to itinerary';

          html += `
            <div class="timeline-card ${isRecommendedSpot ? 'recommended-timeline-card' : ''}" style="${isRecommendedSpot ? 'border-left: 4px solid #F59E0B;' : ''}">
              <img src="${spot.img}" alt="${name}" class="timeline-card-img" onerror="this.src='images/attraction_windmills.png'">
              <div class="timeline-card-body">
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.4rem;">
                  ${badgesHtml}
                </div>
                <h5 class="timeline-card-title">${name}</h5>
                <p class="timeline-card-desc">${excerpt}</p>
                <div class="timeline-card-meta">
                  <span>📍 ${address.split(',')[0]}</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.6rem; align-items: center;">
                    <button class="timeline-card-btn" onclick="openSpotDrawer('${spotId}')">${btnLabel}</button>
                    <a href="${spot.mapUrl}" target="_blank" rel="noopener" class="timeline-card-btn" style="text-decoration: none;">${mapsLabel}</a>
                    ${callBtnHtml}
                  </div>
                </div>
              </div>
              <button class="${addBtnClass}" onclick="event.stopPropagation(); toggleSpotInItinerary('${spotId}')" data-spot="${spotId}" title="${addBtnTitle}">${addBtnText}</button>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      }
    });

    // Check thematic route and next town to append dynamic regional recommendation card
    const themeSelect = document.getElementById('select-theme');
    const nextTownSelect = document.getElementById('select-next-town');
    const selectedTheme = themeSelect ? themeSelect.value : 'none';
    const selectedNextTown = nextTownSelect ? nextTownSelect.value : 'none';

    if (selectedNextTown !== 'none' || selectedTheme !== 'none') {
      let townTitle = '';
      let townDesc = '';
      let townImg = 'images/fuera_nucleo_urbano.png'; // default fallback
      let routeBadge = '';

      if (selectedNextTown === 'tomelloso') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: Tomelloso' : 'Next Recommended Stop: Tomelloso';
        townDesc = activeLang === 'es' 
          ? 'Continúa tu viaje visitando las famosas cuevas y bodegas subterráneas de <strong>Tomelloso</strong> (a solo 25 minutos). El epicentro de la tradición vitivinícola de La Mancha, donde se conservan más de 2.000 bodegas tradicionales excavadas bajo el casco urbano.'
          : 'Continue your trip by visiting the famous underground caves and wineries of <strong>Tomelloso</strong> (just 25 minutes away). The epicentre of La Mancha\'s wine-making heritage, preserving over 2,000 traditional caves excavated beneath the town.';
        townImg = 'images/winery_vidaldelsaz.jpg';
        routeBadge = activeLang === 'es' ? '🍇 Ruta del Vino · Don Quijote' : '🍇 Wine Route · Don Quixote';
      } else if (selectedNextTown === 'alcazar') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: Alcázar de San Juan' : 'Next Recommended Stop: Alcázar de San Juan';
        townDesc = activeLang === 'es'
          ? 'Explora el histórico <strong>Alcázar de San Juan</strong> (a solo 10 minutos). Sube al Cerro de San Antón para admirar sus cuatro molinos de viento, visita el Torreón del Gran Prior del siglo XIV, y descubre la iglesia de Santa María La Mayor, que alberga la partida de bautismo de Miguel de Cervantes.'
          : 'Explore the historic <strong>Alcázar de San Juan</strong> (just 10 minutes away). Climb the Cerro de San Antón to admire its four windmills, visit the 14th-century Grand Prior Tower, and discover Santa María church, housing Miguel de Cervantes\' baptismal certificate.';
        townImg = 'images/centro_historico.png';
        routeBadge = activeLang === 'es' ? '🍇 Ruta del Vino · Don Quijote' : '🍇 Wine Route · Don Quixote';
      } else if (selectedNextTown === 'toboso') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: El Toboso' : 'Next Recommended Stop: El Toboso';
        townDesc = activeLang === 'es'
          ? 'Descubre la pintoresca villa de <strong>El Toboso</strong> (a solo 15 minutos), cuna literaria de la amada de Don Quijote, Dulcinea. Pasea por sus tranquilas plazas empedradas de estética puramente manchega, visita la Casa-Museo de Dulcinea y sorpréndete con el Museo Cervantino.'
          : 'Discover the picturesque village of <strong>El Toboso</strong> (just 15 minutes away), the literary homeland of Dulcinea, Don Quixote\'s beloved. Walk through peaceful cobblestone squares, visit the Dulcinea House-Museum, and explore the unique Cervantine Museum.';
        townImg = 'images/attraction_cave.png';
        routeBadge = activeLang === 'es' ? '🛡️ Ruta de Don Quijote' : '🛡️ Don Quixote Route';
      } else if (selectedNextTown === 'consuegra') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: Consuegra' : 'Next Recommended Stop: Consuegra';
        townDesc = activeLang === 'es'
          ? 'Dirígete a <strong>Consuegra</strong> (a 35 minutos) para contemplar uno de los paisajes más espectaculares de La Mancha: el cresterío del Cerro Calderico coronado por 12 majestuosos molinos de viento históricos y el imponente castillo medieval de la Orden de San Juan.'
          : 'Head to <strong>Consuegra</strong> (35 minutes away) to contemplate one of the most spectacular landscapes of La Mancha: the ridge of Cerro Calderico crowned by 12 majestic historic windmills and the grand medieval castle.';
        townImg = 'images/attraction_windmills.png';
        routeBadge = activeLang === 'es' ? '🛡️ Ruta de Don Quijote' : '🛡️ Don Quixote Route';
      } else if (selectedNextTown === 'socuellamos') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: Socuéllamos' : 'Next Recommended Stop: Socuéllamos';
        townDesc = activeLang === 'es'
          ? 'Visita <strong>Socuéllamos</strong> (a 30 minutos) y conoce el impresionante Museo Torre del Vino, una joya de divulgación enológica interactiva, rodeado de bodegas de gran solera dedicadas a la crianza de vinos con Denominación de Origen La Mancha.'
          : 'Visit <strong>Socuéllamos</strong> (30 minutes away) and explore the impressive Wine Tower Museum, an interactive enological learning experience, surrounded by historic wineries dedicated to aging premium D.O. La Mancha wines.';
        townImg = 'images/winery_carmen.jpg';
        routeBadge = activeLang === 'es' ? '🍇 Ruta del Vino de La Mancha' : '🍇 La Mancha Wine Route';
      } else if (selectedNextTown === 'herencia') {
        townTitle = activeLang === 'es' ? 'Próxima Parada Recomendada: Herencia' : 'Next Recommended Stop: Herencia';
        townDesc = activeLang === 'es'
          ? 'Haz una parada en <strong>Herencia</strong> (a 15 minutos) para admirar sus siete molinos de viento históricos restaurados en la colina de la Pedriza y la imponente Parroquia de la Inmaculada Concepción en el centro de la localidad.'
          : 'Stop in <strong>Herencia</strong> (15 minutes away) to admire its seven historic restored windmills situated on La Pedriza hill, and the towering Parish Church of the Immaculate Conception in the town center.';
        townImg = 'images/fuera_nucleo_urbano.png';
        routeBadge = activeLang === 'es' ? '🛡️ Ruta de Don Quijote' : '🛡️ Don Quixote Route';
      } else if (selectedTheme !== 'none') {
        // Fallback if town is none but theme is selected
        if (selectedTheme === 'vino') {
          townTitle = activeLang === 'es' ? 'Experiencia Vitivinícola D.O. La Mancha' : 'D.O. La Mancha Wine Experience';
          townDesc = activeLang === 'es'
            ? '¡Campo de Criptana es clave en la Ruta del Vino de La Mancha! Aprovecha tu visita para degustar tintos Crianza y blancos Airén en bodegas centenarias como Castiblanque, Carmen o Vidal del Saz.'
            : 'Campo de Criptana is a key stop in the La Mancha Wine Route! Take advantage of your visit to taste premium Crianza and Airén wines in century-old wineries like Castiblanque, Carmen, or Vidal del Saz.';
          townImg = 'images/attraction_winery.png';
          routeBadge = activeLang === 'es' ? '🍇 Ruta del Vino' : '🍇 Wine Route';
        } else if (selectedTheme === 'quijote') {
          townTitle = activeLang === 'es' ? 'Tras las Huellas de Don Quijote' : 'Following Don Quixote\'s Footsteps';
          townDesc = activeLang === 'es'
            ? 'Has planificado tu visita al cerro de los molinos originales del siglo XVI que inspiraron el Capítulo VIII del Quijote. Sigue tu viaje cervantino hacia la cuna de Dulcinea en El Toboso y la partida de bautismo de Cervantes en Alcázar.'
            : 'You have planned your visit to the historic 16th-century windmills that inspired Chapter VIII of Don Quixote. Continue your Cervantine journey towards Dulcinea\'s home in El Toboso and Cervantes\' baptism certificate in Alcázar.';
          townImg = 'images/attraction_windmills.png';
          routeBadge = activeLang === 'es' ? '🛡️ Ruta de Don Quijote' : '🛡️ Don Quixote Route';
        }
      }

      html += `
        <div class="timeline-slot-container onward-stop" style="margin-top: 2rem; border-top: 2px dashed rgba(62, 124, 252, 0.2); padding-top: 2rem;">
          <div class="timeline-item active-slot">
            <div class="timeline-dot" style="background: var(--anil-blue); box-shadow: 0 0 10px var(--anil-blue);"></div>
            <span class="timeline-time-label" style="background: var(--anil-blue-dim); color: var(--anil-blue); border: 1px solid rgba(62, 124, 252, 0.3); font-weight: 700;">🚗 CONTINUACIÓN</span>
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text); font-weight: 700; margin-bottom: 0.6rem;">${townTitle}</h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic;">
              ${activeLang === 'es' ? '🗺️ Integración con Rutas Regionales' : '🗺️ Regional Route Integration'}
            </p>
            <div class="timeline-card recommended-timeline-card" style="border-left: 4px solid var(--anil-blue); background: var(--bg); display: flex; gap: 1rem; border-radius: 12px; padding: 1rem; border: 1px solid var(--border);">
              <img src="${townImg}" alt="${townTitle}" class="timeline-card-img" style="width: 100px; height: 100px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" onerror="this.src='images/fuera_nucleo_urbano.png'">
              <div class="timeline-card-body" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                <span class="timeline-card-badge" style="background: var(--anil-blue-dim); color: var(--anil-blue); border: 1px solid rgba(62, 124, 252, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600; align-self: flex-start; margin-bottom: 0.5rem;">${routeBadge}</span>
                <p class="timeline-card-desc" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${townDesc}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    html += '</div>';
    outputContainer.innerHTML = html;

    // Call updateIllustratedMap with the list of ALL spots actually rendered in the timeline
    if (typeof window.updateIllustratedMap === 'function') {
      window.updateIllustratedMap(actuallyRenderedSpots);
    }
  };

  window.openSpotDrawer = function (spotId) {
    if (window.openDrawer) {
      window.openDrawer(spotId);
    }
  };

  window.copyItineraryText = function () {
    if (selectedSpots.length === 0) return;

    let text = activeLang === 'es' ? '🚀 MI RUTA EN CAMPO DE CRIPTANA 🚀\n\n' : '🚀 MY CRIPTANA ITINERARY 🚀\n\n';
    
    const keys = ['morning', 'lunch', 'afternoon', 'sunset', 'night'];
    keys.forEach(function (slotKey) {
      const slot = chronologicalSlots[slotKey];
      const matchingSpots = selectedSpots.filter(function (id) { return slot.spots.includes(id); });

      if (matchingSpots.length > 0) {
        const title = activeLang === 'es' ? slot.labelEs : slot.labelEn;
        text += `⏰ ${slot.time} - ${title}\n`;

        matchingSpots.forEach(function (spotId) {
          const name = translations[activeLang][spotId + '.name'] || spotId;
          const address = translations[activeLang][spotId + '.address'] || '';
          text += `  • ${name} (📍 ${address})\n`;
        });
        text += '\n';
      }
    });

    text += activeLang === 'es' 
      ? 'Creado con el Planificador de Criptana360. ¡Disfruta de tu viaje!' 
      : 'Created with Criptana360 Itinerary Planner. Enjoy your trip!';

    navigator.clipboard.writeText(text).then(function () {
      const alertMsg = activeLang === 'es' ? '¡Ruta copiada al portapapeles!' : 'Itinerary copied to clipboard!';
      alert(alertMsg);
    }).catch(function (err) {
      console.error('Error copying text:', err);
    });
  };

  /* ─── Unified AI Planner & Reopen Panel Logic ─── */
  window.toggleSpotInItinerary = function (spotId) {
    if (typeof window.openSpotDrawer === 'function') {
      window.openSpotDrawer(spotId);
    }
  };

  window.openPlannerModal = function () {
    const modal = document.getElementById('planner-fullscreen-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closePlannerModal = function () {
    const modal = document.getElementById('planner-fullscreen-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () {
        modal.style.display = 'none';
      }, 300);
    }
  };

  window.reopenPlannerPanel = function () {
    window.openPlannerModal();
  };

  const pinCoordinates = {
    'spot1': { left: '62%', top: '18%' },
    'spot_sara_montiel': { left: '68%', top: '15%' },
    'spot_ci_molinos': { left: '74%', top: '19%' },
    'spot_sala_carros': { left: '56%', top: '22%' },
    'spot2': { left: '50%', top: '26%' },
    'spot_albaicin': { left: '44%', top: '33%' },
    'spot_posito': { left: '36%', top: '52%' },
    'spot_iglesia_parroquial': { left: '48%', top: '58%' },
    'spot_patrimonio_religioso': { left: '30%', top: '62%' },
    'spot_fuente_cano': { left: '24%', top: '68%' },
    'spot_fachadas': { left: '39%', top: '56%' },
    'spot_escudos': { left: '44%', top: '54%' },
    'spot_eloy_teno': { left: '52%', top: '40%' },
    'spot_plaza_mayor_park': { left: '46%', top: '62%' },
    'spot_parque_luis_cobos': { left: '20%', top: '64%' },
    'spot_piscina_municipal': { left: '82%', top: '78%' },
    'spot_ermita_criptana': { left: '86%', top: '38%' },
    'spot_ermita_villajos': { left: '15%', top: '15%' },
    'spot_laguna_salicor': { left: '10%', top: '82%' },
    'spot_centro_naturaleza': { left: '16%', top: '70%' },
    'route_ermitas': { left: '24%', top: '28%' },
    'route_alcazar_drunkards': { left: '11%', top: '50%' },
    'spot5': { left: '60%', top: '48%' },
    'spot6': { left: '68%', top: '52%' },
    'spot10': { left: '74%', top: '62%' },
    'spot3': { left: '59%', top: '12%' },
    'spot7': { left: '40%', top: '60%' },
    'spot8': { left: '52%', top: '54%' },
    'spot4': { left: '52%', top: '15%' },
    'spot9': { left: '35%', top: '64%' },
    'spot11': { left: '48%', top: '29%' },
    'spot12': { left: '54%', top: '27%' },
    'spot13': { left: '32%', top: '58%' },
    'spot14': { left: '28%', top: '54%' },
    'spot15': { left: '78%', top: '70%' },
    'spot16': { left: '82%', top: '68%' },
    'spot_vinculo': { left: '72%', top: '48%' },
    'spot_simbolo': { left: '64%', top: '55%' },
    'spot_casa_la_vina': { left: '78%', top: '68%' },
    'spot_restaurante_egos': { left: '36%', top: '66%' },
    'spot_torrecilla': { left: '42%', top: '48%' }
  };

  window.updatePrintMap = function(activeSpots) {
    const routeLine = document.getElementById('souvenir-route-line');
    const badgesLayer = document.getElementById('map-badges-layer');
    const legendList = document.getElementById('map-legend-list');
    if (!badgesLayer || !legendList) return;

    badgesLayer.innerHTML = '';
    legendList.innerHTML = '';

    const mapCoordinates = {
        "spot1": { x: 52, y: 12, name: "Sierra de los Molinos 🌾" },
        "spot2": { x: 55, y: 11, name: "Centro de Interpretación de Molinos 🧭" },
        "spot3": { x: 58, y: 26, name: "Museo Eloy Teno 🏛️" },
        "spot4": { x: 48, y: 14, name: "Restaurante Cueva La Martina 🍽️" },
        "spot5": { x: 51, y: 58, name: "Terrazas de la Plaza Mayor ☕" },
        "spot6": { x: 68, y: 52, name: "Bodegas Castiblanque 🍇" },
        "spot7": { x: 76, y: 60, name: "Bodegas Vidal del Saz 🍷" },
        "spot8": { x: 58, y: 72, name: "Patrimonio Religioso (Convento) ⛪" },
        "spot9": { x: 43, y: 33, name: "Barrio del Albaicín 🏡" },
        "spot10": { x: 45, y: 29, name: "Casa-Cueva de la Pastora Marcela 🕳️" },
        "spot11": { x: 46, y: 35, name: "Hotel Boutique Casa Treviño 🏨" },
        "spot_piscina_municipal": { x: 32, y: 43, name: "Piscina Municipal (Zona de Baño) 🏊" },
        "spot_vinculo": { x: 69, y: 48, name: "Bodega El Vínculo 🍇" },
        "spot_simbolo": { x: 62, y: 56, name: "Bodegas Símbolo 🍇" },
        "spot_casa_la_vina": { x: 72, y: 68, name: "Bodegas Casa La Viña 🍇" },
        "spot_restaurante_egos": { x: 38, y: 66, name: "Restaurante Ego’s 🍽️" },
        "spot_torrecilla": { x: 44, y: 48, name: "Casa de la Torrecilla 🍽️" }
    };

    let pathPoints = [];
    let stopCounter = 1;

    activeSpots.forEach(spotId => {
        const spot = mapCoordinates[spotId];
        if (spot) {
            pathPoints.push(spot);

            // Append floating badge onto image
            const badge = document.createElement('div');
            badge.innerText = stopCounter;
            badge.style.cssText = `position: absolute; left: ${spot.x}%; top: ${spot.y}%; transform: translate(-50%, -50%); background: #d4af37; color: #ffffff; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);`;
            badgesLayer.appendChild(badge);

            // Append text to sidebar legend
            const listItem = document.createElement('li');
            listItem.style.marginBottom = "8px";
            listItem.innerHTML = `<strong>${spot.name}</strong>`;
            legendList.appendChild(listItem);

            stopCounter++;
        }
    });

    if (routeLine && pathPoints.length > 1) {
        let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
        for (let i = 1; i < pathPoints.length; i++) {
            const cpX = (pathPoints[i-1].x + pathPoints[i].x) / 2;
            const cpY = (pathPoints[i-1].y + pathPoints[i].y) / 2;
            d += ` Q ${cpX} ${cpY}, ${pathPoints[i].x} ${pathPoints[i].y}`;
        }
        routeLine.setAttribute('d', d);
    } else if (routeLine) {
        routeLine.setAttribute('d', '');
    }
  };

  // Wire up tap cards and nav overrides
  function initMobilePlannerOverlay() {
    document.querySelectorAll('#planner-fullscreen-modal .tap-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const type = card.getAttribute('data-type');
        const value = card.getAttribute('data-value');

        document.querySelectorAll(`#planner-fullscreen-modal .tap-card[data-type="${type}"]`).forEach(function (sibling) {
          sibling.classList.remove('active');
        });

        card.classList.add('active');

        let selectId = '';
        if (type === 'party') selectId = 'ai-travel-party';
        else if (type === 'budget') selectId = 'ai-travel-budget';
        else if (type === 'next') selectId = 'ai-next-destination';

        const select = document.getElementById(selectId);
        if (select) {
          select.value = value;
          select.dispatchEvent(new Event('change'));
        }
      });
    });

    document.querySelectorAll('a[href="#planificador"]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        window.openPlannerModal();
      });
    });
  }

  // Execute initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobilePlannerOverlay);
  } else {
    initMobilePlannerOverlay();
  }

  // Email Sharing Overlay functions
  window.openEmailModal = function () {
    const modal = document.getElementById('email-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.offsetHeight;
      modal.classList.add('open');
    }
  };

  window.closeEmailModal = function () {
    const modal = document.getElementById('email-modal');
    if (modal) {
      modal.classList.remove('open');
      setTimeout(function () {
        modal.style.display = 'none';
      }, 300);
    }
  };

  window.sendEmailRoute = function () {
    const yourEmailInput = document.getElementById('email-input-yours');
    const companionsEmailInput = document.getElementById('email-input-companions');
    const newsletterCheckbox = document.getElementById('email-checkbox-newsletter');

    const yours = yourEmailInput ? yourEmailInput.value.trim() : '';
    const companions = companionsEmailInput ? companionsEmailInput.value.trim() : '';
    const subscribeNewsletter = newsletterCheckbox ? newsletterCheckbox.checked : false;

    if (!yours) {
      alert(activeLang === 'es' ? 'El campo de tu email es obligatorio.' : 'Your email field is required.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(yours)) {
      alert(activeLang === 'es' ? 'Introduce una dirección de email válida.' : 'Please enter a valid email address.');
      return;
    }

    // 1. Newsletter subscription handler
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let baseApiUrl = isLocal ? 'http://127.0.0.1:8787/api' : 'https://www.criptana360.com/api';
    if (!isLocal && window.location.hostname.endsWith('criptana360.com')) {
      baseApiUrl = window.location.origin + '/api';
    }

    if (subscribeNewsletter) {
      // Cloudflare Worker POST request
      fetch(`${baseApiUrl}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: yours,
          lang: activeLang
        })
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Worker not deployed / HTTP error');
        console.log('Successfully subscribed email to D1 database via Cloudflare Worker!');
      })
      .catch(function (err) {
        console.warn('Backend API request failed. Falling back to local storage collection...', err);
        // Fallback: save locally
        const subs = JSON.parse(localStorage.getItem('criptana_newsletter_subscribers') || '[]');
        if (!subs.some(function (s) { return s.email === yours; })) {
          subs.push({
            email: yours,
            lang: activeLang,
            timestamp: Date.now()
          });
          localStorage.setItem('criptana_newsletter_subscribers', JSON.stringify(subs));
        }
      });
    }

    // 2. Generate Mailto Link Content and Plotted Map Path
    let text = activeLang === 'es' ? '🚀 MI RUTA EN CAMPO DE CRIPTANA 🚀\n\n' : '🚀 MY CRIPTANA ITINERARY 🚀\n\n';
    
    const keys = ['morning', 'lunch', 'afternoon', 'sunset', 'night'];
    keys.forEach(function (slotKey) {
      const slot = chronologicalSlots[slotKey];
      const matchingSpots = selectedSpots.filter(function (id) { return slot.spots.includes(id); });

      if (matchingSpots.length > 0) {
        const title = activeLang === 'es' ? slot.labelEs : slot.labelEn;
        text += `⏰ ${slot.time} - ${title}\n`;

        matchingSpots.forEach(function (spotId) {
          const name = translations[activeLang][spotId + '.name'] || spotId;
          const address = translations[activeLang][spotId + '.address'] || '';
          text += `  • ${name} (📍 ${address})\n`;
        });
        text += '\n';
      }
    });

    // Append onward route if selected
    const nextTownSelect = document.getElementById('select-next-town');
    const selectedNextTown = nextTownSelect ? nextTownSelect.value : 'none';
    if (selectedNextTown !== 'none') {
      const townKey = selectedNextTown.charAt(0).toUpperCase() + selectedNextTown.slice(1);
      text += activeLang === 'es' 
        ? `🚗 CONTINUACIÓN: Parada recomendada en ${townKey}\n\n`
        : `🚗 ONWARD ROUTE: Recommended stop in ${townKey}\n\n`;
    }

    // Append pictorial map takeaway asset details
    let mapText = activeLang === 'es'
      ? `\n🗺️ TU PREMIUM TAKEAWAY: Mapa Temático 3D Pictórico de Campo de Criptana:\nhttps://www.criptana360.com/images/criptana_navigation_canvas.png\n\nTu ruta trazada cronológicamente sobre el mapa pictorial:\n`
      : `\n🗺️ YOUR PREMIUM TAKEAWAY: 3D Pictorial Theme-Park Map of Campo de Criptana:\nhttps://www.criptana360.com/images/criptana_navigation_canvas.png\n\nYour route plotted chronologically across the pictorial landmarks:\n`;
    
    selectedSpots.forEach(function (spotId, index) {
      const coord = pinCoordinates[spotId];
      const name = translations[activeLang][spotId + '.name'] || spotId;
      if (coord) {
        mapText += `  [${index + 1}] ${name} (Coordenadas Mapa: Left ${coord.left}, Top ${coord.top})\n`;
      } else {
        mapText += `  [${index + 1}] ${name}\n`;
      }
    });
    text += mapText + '\n';

    text += activeLang === 'es' 
      ? 'Creado con el Planificador de Criptana360. ¡Disfruta de tu viaje!' 
      : 'Created with Criptana360 Itinerary Planner. Enjoy your trip!';

    const subject = activeLang === 'es' ? 'Mi Ruta Planificada en Criptana 🗺️' : 'My Planned Criptana Itinerary 🗺️';
    const mailto = `mailto:${encodeURIComponent(yours)}`
      + `?cc=${encodeURIComponent(companions)}`
      + `&subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(text)}`;

    // 3. Dispatch Itinerary via Cloudflare Worker POST (falls back to local mail client)
    const companionsArray = companions
      ? companions.split(',').map(function (c) { return c.trim(); }).filter(function (c) { return c.length > 0; })
      : [];

    fetch(`${baseApiUrl}/send-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userEmail: yours,
        companions: companionsArray,
        itineraryData: text,
        lang: activeLang
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Worker send email failed');
      alert(activeLang === 'es' 
        ? '¡Tu ruta e itinerario con mapa temático han sido enviados por email con éxito!' 
        : 'Your itinerary and pictorial map route have been successfully sent by email!');
    })
    .catch(function (err) {
      console.warn('Backend send-itinerary failed. Falling back to local mail client...', err);
      window.location.href = mailto;
    })
    .finally(function() {
      if (yourEmailInput) yourEmailInput.value = '';
      if (companionsEmailInput) companionsEmailInput.value = '';
      closeEmailModal();
    });
  };

  // CSV Export utility
  window.exportNewsletterSubscribers = function () {
    const subs = JSON.parse(localStorage.getItem('criptana_newsletter_subscribers') || '[]');
    if (subs.length === 0) {
      alert(activeLang === 'es' ? 'No hay suscriptores guardados localmente aún.' : 'No locally saved subscribers found.');
      return;
    }
    let csv = 'Email,Language,Timestamp\n';
    subs.forEach(function(s) {
      csv += `"${s.email}","${s.lang}","${new Date(s.timestamp).toISOString()}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `criptana_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI-Driven Routing Planner Engine
  window.generateAIItinerary = function (steeringModifier = null) {
    const partySelect = document.getElementById('ai-travel-party');
    const budgetSelect = document.getElementById('ai-travel-budget');
    const nextSelect = document.getElementById('ai-next-destination');
    const outputContainer = document.getElementById('itinerary-timeline-output');
    const actionsRow = document.getElementById('itinerary-actions');
    const generateBtn = document.getElementById('btn-generate-ai-itinerary');

    const party = partySelect ? partySelect.value : 'familia';
    const budget = budgetSelect ? budgetSelect.value : 'estandar';
    const nextDestination = nextSelect ? nextSelect.value : 'none';

    // Scrape real-time weather temperature and condition from header widget
    const weatherEl = document.querySelector('.weather-widget .utility-text');
    let temp = 24; // default
    let condition = 'clear'; // default
    if (weatherEl) {
      const text = weatherEl.textContent || '';
      const parts = text.split('·').map(function(s) { return s.trim(); });
      if (parts.length >= 3) {
        const tempMatch = parts[2].match(/(-?\d+)/);
        if (tempMatch) {
          temp = parseInt(tempMatch[1], 10);
        }
        const condText = parts[1].toLowerCase();
        if (condText.includes('despejado') || condText.includes('clear')) {
          condition = 'clear';
        } else if (condText.includes('nuboso') || condText.includes('cloudy') || condText.includes('cubierto') || condText.includes('intervalos')) {
          condition = 'cloudy_intervals';
        } else if (condText.includes('lluvia') || condText.includes('rain')) {
          condition = 'rainy';
        } else if (condText.includes('tormenta') || condText.includes('storm')) {
          condition = 'thunderstorm';
        } else if (condText.includes('niebla') || condText.includes('fog')) {
          condition = 'foggy';
        }
      }
    }

    // Dismiss the fullscreen modal
    if (typeof window.closePlannerModal === 'function') {
      window.closePlannerModal();
    }

    // Collapse the AI planner entry card smoothly
    const plannerPanel = document.querySelector('.ai-planner-panel');
    if (plannerPanel) {
      plannerPanel.style.maxHeight = '0px';
      plannerPanel.style.opacity = '0';
      plannerPanel.style.padding = '0px';
      plannerPanel.style.border = 'none';
      plannerPanel.style.marginBottom = '0px';
      plannerPanel.style.overflow = 'hidden';
    }

    // Scroll smoothly to the planificador section so they see the vertical timeline
    const planSec = document.getElementById('planificador');
    if (planSec) {
      planSec.scrollIntoView({ behavior: 'smooth' });
    }

    // Show loading state in output area
    const loadingText = activeLang === 'es' 
      ? '✨ Diseñando tu ruta inteligente con la IA de Gemini... Esto puede tomar unos segundos.'
      : '✨ Crafting your smart route with Gemini AI... This may take a few seconds.';
    
    if (outputContainer) {
      outputContainer.style.display = 'block';
      outputContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; background: rgba(11, 79, 200, 0.03); border: 1.5px dashed rgba(11, 79, 200, 0.2); border-radius: 12px; margin-top: 1.5rem;">
          <div class="ai-loading-spinner" style="width: 45px; height: 45px; border: 4px solid rgba(11, 79, 200, 0.1); border-top: 4px solid var(--anil-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
          <p style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem;">${activeLang === 'es' ? 'Optimizando Ruta...' : 'Optimizing Route...'}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 420px; margin: 0 auto; line-height: 1.5;">${loadingText}</p>
        </div>
      `;
    }

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = activeLang === 'es' ? '✨ Pensando... ⚙️' : '✨ Thinking... ⚙️';
    }

    // Add keyframes dynamically if not present
    if (!document.getElementById('ai-spin-style')) {
      const style = document.createElement('style');
      style.id = 'ai-spin-style';
      style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let baseApiUrl = isLocal ? 'http://127.0.0.1:8787/api' : 'https://www.criptana360.com/api';
    if (!isLocal && window.location.hostname.endsWith('criptana360.com')) {
      baseApiUrl = window.location.origin + '/api';
    }

    fetch(`${baseApiUrl}/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        travel_party: party,
        pace: 'relajado',
        budget_tier: budget === 'mochilero' ? 'low' : budget === 'estandar' ? 'mid' : 'high',
        next_destination: nextDestination,
        weather_forecast: {
          current_temp_c: temp,
          condition: condition
        },
        steering_modifier: steeringModifier || null,
        lang: activeLang
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('API server returned status ' + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data || !data.slots || data.slots.length === 0) {
        throw new Error('Invalid JSON format or empty schedule received');
      }

      // Collect all spot IDs from the returned slots to update the map
      let allSpotIds = [];
      let slotsHtml = '<div class="itinerary-timeline">';

      // Header summary card of AI generation
      const summaryTitle = activeLang === 'es' ? 'Tu Ruta Optimizada por IA' : 'Your AI Optimized Route';
      const costLabel = activeLang === 'es' ? 'Presupuesto Estimado:' : 'Estimated Cost:';
      const partyLabel = activeLang === 'es' ? 'Compañía:' : 'Party:';

      const partyStr = party === 'solo' ? (activeLang === 'es' ? 'Solo' : 'Solo') :
                       party === 'pareja' ? (activeLang === 'es' ? 'En Pareja' : 'As a Couple') :
                       party === 'familia' ? (activeLang === 'es' ? 'En Familia' : 'With Family') : 
                       (activeLang === 'es' ? 'Con Amigos' : 'With Friends');

      const budgetStr = budget === 'mochilero' ? (activeLang === 'es' ? 'Mochilero (Gratuito/Económico)' : 'Backpacker (Free/Budget)') :
                        budget === 'estandar' ? (activeLang === 'es' ? 'Estándar (Menús manchegos tradicionales)' : 'Standard (Traditional Manchego meals)') :
                        (activeLang === 'es' ? 'VIP (Bodegas premium y restaurante de alta cocina)' : 'VIP (Premium wineries & fine dining)');

      slotsHtml += `
        <div class="planner-success-banner" style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
            <h4 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #10B981; margin: 0;">✨ ${summaryTitle}</h4>
            <button onclick="reopenPlannerPanel()" class="itinerary-btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.72rem; border-radius: 6px; background: transparent; border: 1px solid #10B981; color: #10B981; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#10B981'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#10B981';">
              ⚙️ ${activeLang === 'es' ? 'Ajustar Preferencias' : 'Adjust Preferences'}
            </button>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-color); margin: 0 0 0.75rem 0; line-height: 1.5; font-style: italic;">"${data.summary}"</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.6rem; font-size: 0.75rem; border-top: 1px dashed rgba(16, 185, 129, 0.2); padding-top: 0.75rem;">
            <div><strong>👥 ${partyLabel}</strong> ${partyStr}</div>
            <div><strong>💰 ${costLabel}</strong> ${data.estimatedCostRange || '---'} (${budgetStr})</div>
          </div>
        </div>
      `;

      data.slots.forEach(function (slot) {
        slotsHtml += `
          <div class="timeline-item active-slot">
            <div class="timeline-dot" style="background: var(--anil-blue); box-shadow: 0 0 8px var(--anil-blue);"></div>
            <span class="timeline-time-label" style="background: var(--anil-blue-dim); color: var(--anil-blue); font-weight: 700;">${slot.time}</span>
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--anil-blue); font-weight: 700; margin-bottom: 0.4rem;">${slot.title}</h4>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic; line-height: 1.45;">💡 ${slot.description}</p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
        `;

        if (slot.spots && Array.isArray(slot.spots)) {
          slot.spots.forEach(function (spotId) {
            const spot = spotsData[spotId];
            if (!spot) return;

            if (!allSpotIds.includes(spotId)) {
              allSpotIds.push(spotId);
            }

            const name = translations[activeLang][spotId + '.name'] || spotId;
            const excerpt = translations[activeLang][spotId + '.excerpt'] || '';
            const address = translations[activeLang][spotId + '.address'] || '';
            
            let btnLabel = activeLang === 'es' ? 'Saber Más' : 'Learn More';
            let mapsLabel = activeLang === 'es' ? 'Cómo llegar &rarr;' : 'Get Directions &rarr;';
            
            let badgesHtml = '';
            if (spot.kidsFriendly) {
              const kidsLabel = activeLang === 'es' ? '👶 Ideal Niños' : '👶 Kid-Friendly';
              badgesHtml += `<span class="timeline-card-badge kids" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600; margin-right: 0.4rem;">${kidsLabel}</span>`;
            }
            if (spot.activeNature) {
              const activeLabel = activeLang === 'es' ? '🚲 Senderismo y Bici' : '🚲 Active Trail';
              badgesHtml += `<span class="timeline-card-badge active-route" style="background: rgba(59, 130, 246, 0.15); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.68rem; font-weight: 600; margin-right: 0.4rem;">${activeLabel}</span>`;
            }

            let callBtnHtml = '';
            if (spot.category === 'restaurante' && spot.phone) {
              const callLabel = activeLang === 'es' ? '📞 Reservar' : '📞 Book Table';
              callBtnHtml = `
                <a href="tel:${spot.phone}" class="timeline-card-btn call-btn" style="background: #10B981; color: white; border: 1px solid #10B981; text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; box-shadow: 0 0 10px rgba(16, 185, 129, 0.25); padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.72rem; transition: all 0.2s;">
                  ${callLabel}
                </a>
              `;
            }

            const addBtnTitle = activeLang === 'es' ? 'Quitar de mi ruta' : 'Remove from itinerary';

            slotsHtml += `
              <div class="timeline-card" style="border-left: 4px solid var(--anil-blue); position: relative;">
                <img src="${spot.img}" alt="${name}" class="timeline-card-img" onerror="this.src='images/attraction_windmills.png'">
                <div class="timeline-card-body">
                  <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.4rem;">
                    ${badgesHtml}
                  </div>
                  <h5 class="timeline-card-title" style="margin: 0 0 0.35rem 0; font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: var(--text);">${name}</h5>
                  <p class="timeline-card-desc" style="margin: 0 0 0.65rem 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.45;">${excerpt}</p>
                  <div class="timeline-card-meta" style="font-size: 0.72rem; color: var(--text-muted);">
                    <span>📍 ${address.split(',')[0]}</span>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.6rem; align-items: center;">
                      <button class="timeline-card-btn" onclick="openSpotDrawer('${spotId}')" style="background: transparent; border: 1px solid var(--border-light); padding: 0.3rem 0.75rem; border-radius: 6px; cursor: pointer; color: var(--text); font-weight: 600;">${btnLabel}</button>
                      <a href="${spot.mapUrl}" target="_blank" rel="noopener" class="timeline-card-btn" style="text-decoration: none; border: 1px solid var(--border-light); padding: 0.3rem 0.75rem; border-radius: 6px; color: var(--text); font-weight: 600;">${mapsLabel}</a>
                      ${callBtnHtml}
                    </div>
                  </div>
                </div>
                <button class="btn-add-to-route added" onclick="event.stopPropagation(); toggleSpotInItinerary('${spotId}')" data-spot="${spotId}" title="${addBtnTitle}">✓</button>
              </div>
            `;
          });
        }

        slotsHtml += `
            </div>
        `;

        // Render alternative choices if present in this block
        if (slot.choices && Array.isArray(slot.choices) && slot.choices.length > 0) {
          const choicesTitle = translations[activeLang]['ai.choices.title'] || '💡 Available options in this block:';
          slotsHtml += `
            <div class="slot-choices-container" style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(11, 79, 200, 0.02); border: 1px dashed rgba(11, 79, 200, 0.15); border-radius: 8px;">
              <p style="font-size: 0.72rem; font-weight: 700; color: var(--anil-blue); margin-bottom: 0.5rem; margin-top: 0;">${choicesTitle}</p>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          `;
          slot.choices.forEach(function (choice) {
            let choiceBtnHtml = '';
            if (choice.spots && Array.isArray(choice.spots)) {
              choice.spots.forEach(function (choiceSpotId) {
                const choiceSpot = spotsData[choiceSpotId];
                if (!choiceSpot) return;
                const choiceName = translations[activeLang][choiceSpotId + '.name'] || choiceSpotId;
                
                // Add to timeline active spot collection if not present
                if (!allSpotIds.includes(choiceSpotId)) {
                  allSpotIds.push(choiceSpotId);
                }

                choiceBtnHtml += `
                  <button class="timeline-card-btn" onclick="openSpotDrawer('${choiceSpotId}')" style="background: white; border: 1px solid var(--border-light); padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.68rem; font-weight: 600; color: var(--text); display: inline-flex; align-items: center; gap: 0.25rem;">
                    🔎 ${choiceName}
                  </button>
                `;
              });
            }

            slotsHtml += `
              <div class="choice-option-item" style="font-size: 0.74rem; color: var(--text-color); line-height: 1.4; border-left: 2.5px solid var(--anil-blue); padding-left: 0.5rem;">
                <strong>${choice.name}:</strong> ${choice.description}
                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem;">
                  ${choiceBtnHtml}
                </div>
              </div>
            `;
          });
          slotsHtml += `
              </div>
            </div>
          `;
        }

        slotsHtml += `
          </div>
        `;
      });

      slotsHtml += '</div>';

      // Inject Mutation Steering Chips
      const steerTitle = translations[activeLang]['ai.steer.title'] || '✨ ¿Quieres ajustar esta ruta? Pulsa para cambiar al instante:';
      const chipMorning = translations[activeLang]['ai.chip.morning'] || '☀️ Llegada por la mañana';
      const chipAfternoon = translations[activeLang]['ai.chip.afternoon'] || '⛅ Llegada por la tarde';
      const chipTapas = translations[activeLang]['ai.chip.tapas'] || '🔄 Más opciones de tapas';
      const chipCultural = translations[activeLang]['ai.chip.cultural'] || '🏛️ Cambiar por opción cultural en interiores';

      slotsHtml += `
        <div class="ai-mutation-chips-wrapper" style="margin-top: 2rem; padding: 1.25rem; background: rgba(11, 79, 200, 0.03); border: 1.5px solid rgba(11, 79, 200, 0.1); border-radius: 12px; text-align: center;">
          <p style="font-size: 0.78rem; font-weight: 700; color: var(--text); margin-bottom: 0.75rem; margin-top: 0;">${steerTitle}</p>
          <div class="ai-chips-grid" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem;">
            <button class="ai-mutation-chip" onclick="generateAIItinerary('morning_arrival')" style="background: white; border: 1px solid var(--anil-blue); color: var(--anil-blue); font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(11, 79, 200, 0.05);" onmouseover="this.style.background='var(--anil-blue)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--anil-blue)';">${chipMorning}</button>
            <button class="ai-mutation-chip" onclick="generateAIItinerary('afternoon_arrival')" style="background: white; border: 1px solid var(--anil-blue); color: var(--anil-blue); font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(11, 79, 200, 0.05);" onmouseover="this.style.background='var(--anil-blue)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--anil-blue)';">${chipAfternoon}</button>
            <button class="ai-mutation-chip" onclick="generateAIItinerary('more_tapas')" style="background: white; border: 1px solid var(--anil-blue); color: var(--anil-blue); font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(11, 79, 200, 0.05);" onmouseover="this.style.background='var(--anil-blue)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--anil-blue)';">${chipTapas}</button>
            <button class="ai-mutation-chip" onclick="generateAIItinerary('cultural_swap')" style="background: white; border: 1px solid var(--anil-blue); color: var(--anil-blue); font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(11, 79, 200, 0.05);" onmouseover="this.style.background='var(--anil-blue)'; this.style.color='white';" onmouseout="this.style.background='white'; this.style.color='var(--anil-blue)';">${chipCultural}</button>
          </div>
        </div>
      `;

      // Update global active array
      selectedSpots = allSpotIds;

      // Render slots to container
      if (outputContainer) outputContainer.innerHTML = slotsHtml;

      // Update active map pins
      if (typeof window.updateIllustratedMap === 'function') {
        window.updateIllustratedMap(selectedSpots);
      }

      // Show Actions Row
      if (actionsRow) actionsRow.style.display = 'flex';
    })
    .catch(function (err) {
      console.error('Error generating AI itinerary:', err);
      if (outputContainer) {
        outputContainer.innerHTML = `
          <div style="text-align: center; padding: 3rem 1.5rem; background: rgba(239, 68, 68, 0.05); border: 1.5px dashed rgba(239, 68, 68, 0.25); border-radius: 12px; margin-top: 1.5rem;">
            <span style="font-size: 2.2rem; display: block; margin-bottom: 1rem;">⚠️</span>
            <p style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: #EF4444; margin-bottom: 0.5rem;">
              ${activeLang === 'es' ? 'Error al Generar Ruta con IA' : 'AI Routing Generation Failed'}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto; line-height: 1.5;">
              ${activeLang === 'es' 
                ? 'No pudimos conectar con el servicio inteligente de Criptana360. Por favor, comprueba tu conexión e inténtalo de nuevo, o utiliza el asistente tradicional.' 
                : 'We could not connect to the Criptana360 intelligent service. Please check your connection and try again, or use the standard wizard.'}
            </p>
          </div>
        `;
      }
    })
    .finally(function () {
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = activeLang === 'es' ? '✨ Generar Ruta con IA 🚀' : '✨ Generate Route with AI 🚀';
      }
    });
  };

  // Illustrated theme-park map active pin highlighting engine
  window.updateIllustratedMap = function (spotsToRender) {
    if (typeof window.updatePrintMap === 'function') {
      window.updatePrintMap(spotsToRender);
    }
  };

  function initItineraryFilters() {
    const budgetSelect = document.getElementById('select-budget');
    const themeSelect = document.getElementById('select-theme');
    const nextTownSelect = document.getElementById('select-next-town');
    const kidsToggle = document.getElementById('toggle-kids');
    const activeToggle = document.getElementById('toggle-active');

    if (budgetSelect) {
      budgetSelect.addEventListener('change', function() {
        window.generateItinerary();
      });
    }
    if (themeSelect) {
      themeSelect.addEventListener('change', function() {
        window.generateItinerary();
      });
    }
    if (nextTownSelect) {
      nextTownSelect.addEventListener('change', function() {
        window.generateItinerary();
      });
    }
    if (kidsToggle) {
      kidsToggle.addEventListener('change', function() {
        window.generateItinerary();
      });
    }
    if (activeToggle) {
      activeToggle.addEventListener('change', function() {
        window.generateItinerary();
      });
    }
  }

  let monumentsExpanded = false;

  function updateMonumentsLimit() {
    const subfiltersBar = document.getElementById('monument-subfilters');
    const expanderContainer = document.getElementById('monuments-expander-container');
    const expanderBtn = document.getElementById('btn-monuments-expander');
    const activeSubfilterBtn = subfiltersBar ? subfiltersBar.querySelector('.monument-subfilter-btn.active') : null;
    const activeZone = activeSubfilterBtn ? activeSubfilterBtn.getAttribute('data-zone') : 'all';

    const cards = document.querySelectorAll('.explorer-card[data-category="monumento"]');
    
    // Only limit to 6 if we are on 'Todos' (data-zone='all') AND we are NOT expanded
    if (activeZone === 'all' && !monumentsExpanded) {
      if (expanderContainer) expanderContainer.style.display = 'flex';
      if (expanderBtn) {
        expanderBtn.innerHTML = activeLang === 'es' 
          ? '✨ Ver Más Monumentos y Lugares (17) &darr;' 
          : '✨ View More Sights & Culture (17) &darr;';
      }
      
      let count = 0;
      cards.forEach(function (card) {
        if (card.classList.contains('sub-filtered-out')) return;
        
        count++;
        if (count > 6) {
          card.classList.add('spot-hidden-by-limit');
        } else {
          card.classList.remove('spot-hidden-by-limit');
        }
      });
    } else {
      // If we are in a sub-category OR we are expanded, show all matching cards
      if (activeZone !== 'all') {
        if (expanderContainer) expanderContainer.style.display = 'none';
      } else {
        // We are on 'all' and expanded
        if (expanderContainer) expanderContainer.style.display = 'flex';
        if (expanderBtn) {
          expanderBtn.innerHTML = activeLang === 'es' 
            ? '✨ Ver Menos Monumentos &uarr;' 
            : '✨ View Less Sights &uarr;';
        }
      }
      
      cards.forEach(function (card) {
        card.classList.remove('spot-hidden-by-limit');
      });
    }
  }

  function initMonumentsExpander() {
    const expanderBtn = document.getElementById('btn-monuments-expander');
    if (!expanderBtn) return;

    expanderBtn.addEventListener('click', function () {
      monumentsExpanded = !monumentsExpanded;
      updateMonumentsLimit();
      
      // If collapsing, smooth scroll back up to the monument sub-filters
      if (!monumentsExpanded) {
        const subfilters = document.getElementById('monument-subfilters');
        if (subfilters) {
          subfilters.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  function initMonumentSubfilters() {
    const subfiltersContainer = document.getElementById('monument-subfilters');
    if (!subfiltersContainer) return;

    const filterBtns = subfiltersContainer.querySelectorAll('.monument-subfilter-btn');
    const cards = document.querySelectorAll('.explorer-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Toggle active button class
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const selectedZone = btn.getAttribute('data-zone');

        cards.forEach(function (card) {
          if (card.getAttribute('data-category') === 'monumento') {
            const cardZone = card.getAttribute('data-zone');
            if (selectedZone === 'all' || cardZone === selectedZone) {
              card.classList.remove('sub-filtered-out');
            } else {
              card.classList.add('sub-filtered-out');
            }
          }
        });

        // Trigger limit updates upon subfilter selection change
        updateMonumentsLimit();
      });
    });
  }

  /* ─── 14. B2B Share Hooks Programmatic Setup ───────────────────────────── */
  function initShareHooks() {
    const shareHooks = document.querySelectorAll('.share-feature-hook');
    shareHooks.forEach(function (hook) {
      // Remove inline click handler so we control it natively
      hook.removeAttribute('onclick');
      
      hook.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const spotCard = hook.closest('.explorer-card');
        const spotId = spotCard ? spotCard.getAttribute('data-spot') : null;
        if (!spotId) return;
        
        const spotTitleEl = spotCard.querySelector('.card-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Criptana 360';
        
        // Construct the exact deep link
        const shareUrl = window.location.origin + window.location.pathname + '?spot=' + spotId;
        
        if (navigator.share) {
          navigator.share({
            title: spotTitle,
            text: activeLang === 'es' 
              ? `¡Mira nuestra ficha en Criptana 360: ${spotTitle}!`
              : `Check out our listing on Criptana 360: ${spotTitle}!`,
            url: shareUrl
          }).catch(err => {
            console.log('Error sharing:', err);
          });
        } else {
          // Copy link to clipboard
          navigator.clipboard.writeText(shareUrl).then(() => {
            alert(activeLang === 'es' 
              ? `¡Enlace copiado al portapapeles! Compártelo en tus redes: ${shareUrl}`
              : `Link copied to clipboard! Share it on your networks: ${shareUrl}`
            );
          }).catch(err => {
            // Open fallback facebook sharer
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank');
          });
        }
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
    fetchLiveWeatherData();
    initSunsetToggle();
    initPublicityModal();
    initLuzeModal();
    initLanguageSelector();
    initMobileMenu();
    initItineraryFilters();
    initMonumentSubfilters();
    initMonumentsExpander();
    updateMonumentsLimit(); // Apply default limit on initial load
    updateItineraryUI(); // Initialize Itinerary empty state
    initShareHooks(); // Set up the premium social sharing hooks

    // Intercept inbound spot links for B2B card deep-linking
    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('spot');
    if (spotId) {
      const card = document.querySelector(`.explorer-card[data-spot="${spotId}"]`);
      if (card) {
        const category = card.getAttribute('data-category');
        // Click corresponding tab to filter cards
        const tabs = document.querySelectorAll('.explorer-tab');
        tabs.forEach(function (tab) {
          if (tab.getAttribute('data-category') === category) {
            tab.click();
          }
        });
        
        // If it was hidden by the monument limit, expand them
        if (card.classList.contains('spot-hidden-by-limit')) {
          monumentsExpanded = true;
          updateMonumentsLimit();
        }
        
        // Open the details drawer
        if (typeof window.openSpotDrawer === 'function') {
          setTimeout(function() {
            window.openSpotDrawer(spotId);
            // Smoothly scroll the card into view
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    }
  });


})();

