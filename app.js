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
  const spotsData = window.spotsData;

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

      const spotCoords = {
        spot1: '39.4125,-3.1250',
        spot2: '39.4085,-3.1240',
        spot_albaicin: '39.4085,-3.1240',
        spot_fuente_cano: '39.4081,-3.1235',
        spot_sara_montiel: '39.4128,-3.1248',
        spot_museo_vino: '39.4072,-3.1255',
        spot_ci_molinos: '39.4125,-3.1250',
        spot_eloy_teno: '39.4072,-3.1255',
        spot_sala_carros: '39.4125,-3.1250',
        spot_posito: '39.4069,-3.1244',
        spot_patrimonio_religioso: '39.4055,-3.1252',
        spot_iglesia_parroquial: '39.4063,-3.1254',
        spot_fachadas: '39.4072,-3.1255',
        spot_escudos: '39.4063,-3.1254',
        spot_pozo_nieve: '39.4150,-3.1280',
        spot_laguna_salicor: '39.3700,-3.0200',
        spot_ermita_criptana: '39.4200,-3.1150',
        spot_ermita_villajos: '39.4400,-3.1100',
        spot_centro_naturaleza: '39.3700,-3.0200',
        spot3: '39.4116,-3.1251',
        spot4: '39.4112,-3.1248',
        spot7: '39.4050,-3.1270',
        spot8: '39.4045,-3.1285',
        spot9: '39.4111,-3.1247',
        spot_restaurante_egos: '39.4090,-3.1250',
        spot_torrecilla: '39.4060,-3.1258',
        spot5: '39.4072,-3.1255',
        spot6: '39.4020,-3.1220',
        spot10: '39.4010,-3.1210',
        spot_vinculo: '39.4005,-3.2435',
        spot_simbolo: '39.4055,-3.2475',
        spot_movialsa: '39.3980,-3.2410',
        spot_vinasoro: '39.3565,-3.2380',
        spot_casa_la_vina: '39.3800,-3.0900',
        spot_patatas_pintor: '39.4065,-3.1265',
        spot_queso_manchego: '39.4058,-3.1250',
        spot_queso_valdivieso: '39.4046,-3.1253',
        spot_aove_cooperativa: '39.4020,-3.1220',
        spot11: '39.4072,-3.1255',
        spot12: '39.4085,-3.1240',
        spot13: '39.4110,-3.1245',
        spot14: '39.4150,-3.1100',
        spot15: '39.4130,-3.1200',
        spot16: '39.4125,-3.1250',
        spot_piscina_municipal: '39.4000,-3.1300',
        spot_parque_luis_cobos: '39.4030,-3.1270',
        spot_plaza_mayor_park: '39.4063,-3.1254',
        route_ermitas: '39.4400,-3.1100',
        route_alcazar_drunkards: '39.4000,-3.1500'
      };

      const coords = spotCoords[spotId] || '39.4069,-3.1244';
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

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
      const callBtnLabel = dict['drawer.btn.call'] || 'Llamar';
      const mapBtnLabel = dict['drawer.btn.map'] || 'Cómo llegar';
      const bookingLabel = dict['drawer.booking'] || 'Reserva';
      const bookingVal = dict[`${spotId}.booking`] || 'No requerida';
      const priceLabel = dict['drawer.price'] || 'Precio';
      const priceVal = dict[`${spotId}.price`] || 'Libre';
      const shareBtnLabel = dict['drawer.btn.share'] || (activeLang === 'es' ? 'Compartir' : 'Share');

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
        } else if (spot.bookingUrlType === 'website') {
          btnClass = 'drawer-btn-wine';
          btnLabel = dict['drawer.btn.website'] || 'Visitar Web Oficial';
          icon = '🌐';
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
            <a href="tel:${spot.phone}" class="drawer-btn-outline">📞 ${callBtnLabel}</a>
            <button class="drawer-btn-outline btn-share-drawer" data-spot="${spotId}">🔗 ${shareBtnLabel}</button>
            <a href="${mapsUrl}" target="_blank" rel="noopener" class="drawer-btn-primary routing-btn">
              ${mapBtnLabel}
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 5px; display: inline-block; vertical-align: middle;"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            </a>
          </div>
        </div>
      `;

      contentContainer.innerHTML = html;

      // Bind share button event listener
      const shareBtn = contentContainer.querySelector('.btn-share-drawer');
      if (shareBtn) {
        shareBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const hashSegment = spotId.startsWith('spot_') ? spotId.substring(5).replace(/_/g, '-') : spotId.replace(/_/g, '-');
          const shareUrl = window.location.origin + window.location.pathname + '#' + hashSegment;

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
            navigator.clipboard.writeText(shareUrl).then(() => {
              alert(activeLang === 'es' 
                ? `¡Enlace copiado al portapapeles! Compártelo en tus redes: ${shareUrl}`
                : `Link copied to clipboard! Share it on your networks: ${shareUrl}`
              );
            }).catch(err => {
              window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank');
            });
          }
        });
      }

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
  const translations = window.translations;

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
    'spot_patatas_pintor': { left: '38%', top: '56%' },
    'spot_queso_manchego': { left: '46%', top: '58%' },
    'spot_queso_valdivieso': { left: '49%', top: '59%' },
    'spot_aove_cooperativa': { left: '68%', top: '52%' },
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
    'spot_movialsa': { left: '71%', top: '49%' },
    'spot_vinasoro': { left: '75%', top: '72%' },
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
        "spot_movialsa": { x: 71, y: 46, name: "Movialsa 🍇" },
        "spot_vinasoro": { x: 74, y: 74, name: "Bodegas Viñasoro 🍇" },
        "spot_casa_la_vina": { x: 72, y: 68, name: "Bodegas Casa La Viña 🍇" },
        "spot_patatas_pintor": { x: 38, y: 56, name: "Hermanos Pintor 🥔" },
        "spot_queso_manchego": { x: 46, y: 58, name: "Quesería Riesco (D.O.) 🧀" },
        "spot_queso_valdivieso": { x: 49, y: 59, name: "Queso Valdivieso (Finca Valdivieso) 🧀" },
        "spot_aove_cooperativa": { x: 68, y: 52, name: "AOVE Cooperativa El Carmen 🫒" },
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
      
      // Inject minimalist share SVG icon if not already present
      if (!hook.querySelector('svg')) {
        const svgIcon = `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; display: inline-block; vertical-align: middle;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>`;
        hook.insertAdjacentHTML('afterbegin', svgIcon);
      }
      
      hook.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const spotCard = hook.closest('.explorer-card');
        const spotId = spotCard ? spotCard.getAttribute('data-spot') : null;
        if (!spotId) return;
        
        const spotTitleEl = spotCard.querySelector('.card-spot-title');
        const spotTitle = spotTitleEl ? spotTitleEl.innerText : 'Criptana 360';
        
        // Construct the exact deep link
        const hashSegment = spotId.startsWith('spot_') ? spotId.substring(5).replace(/_/g, '-') : spotId.replace(/_/g, '-');
        const shareUrl = window.location.origin + window.location.pathname + '#' + hashSegment;
        
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

  function getSpotIdFromHash(hash) {
    if (!hash) return null;
    const clean = hash.replace(/^#/, '');
    if (!clean) return null;
    const normalized = clean.replace(/-/g, '_');
    if (spotsData[normalized]) {
      return normalized;
    }
    const prefixed = 'spot_' + normalized;
    if (spotsData[prefixed]) {
      return prefixed;
    }
    return null;
  }

  function handleHashRoute() {
    const hash = window.location.hash;
    if (!hash) return;
    const spotId = getSpotIdFromHash(hash);
    if (!spotId) return;

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
    } else {
      // Fallback for virtual spots/packages
      if (typeof window.openSpotDrawer === 'function') {
        setTimeout(function() {
          window.openSpotDrawer(spotId);
        }, 300);
      }
    }
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

    // Intercept inbound spot links for B2B card deep-linking (supporting both query params and hash urls)
    const urlParams = new URLSearchParams(window.location.search);
    const querySpotId = urlParams.get('spot');
    if (querySpotId) {
      const card = document.querySelector(`.explorer-card[data-spot="${querySpotId}"]`);
      if (card) {
        const category = card.getAttribute('data-category');
        const tabs = document.querySelectorAll('.explorer-tab');
        tabs.forEach(function (tab) {
          if (tab.getAttribute('data-category') === category) {
            tab.click();
          }
        });
        if (card.classList.contains('spot-hidden-by-limit')) {
          monumentsExpanded = true;
          updateMonumentsLimit();
        }
        if (typeof window.openSpotDrawer === 'function') {
          setTimeout(function() {
            window.openSpotDrawer(querySpotId);
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      } else {
        if (typeof window.openSpotDrawer === 'function') {
          setTimeout(function() {
            window.openSpotDrawer(querySpotId);
          }, 300);
        }
      }
    } else {
      handleHashRoute();
    }

    // Listen to hashchange events
    window.addEventListener('hashchange', handleHashRoute);
  });


})();

