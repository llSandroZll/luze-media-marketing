/* ==========================================================================
   LUZE Media Marketing - Main Interactive Controller (Campo de Criptana)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Bilingual Engine (Spanish & English Dictionary)
       ========================================================================== */
    const translations = {
        es: {
            title: "LUZE Media Marketing | Levantando Gigantes Digitales en Campo de Criptana",
            description: "Impulsamos negocios locales, bodegas y casas rurales en Campo de Criptana con páginas web ultrarápidas, presencia en Google, automatización de WhatsApp y visitas virtuales interactiva 360°.",
            // Nav
            "nav-vision": "Nuestra Visión",
            "nav-services": "Servicios",
            "nav-experience": "Demo 360°",
            "nav-calculator": "Calcular Plan",
            "nav-contact": "Auditoría Gratis",
            // Hero
            "hero-badge": "Tierra de Gigantes, Futuro Digital",
            "hero-title-1": "Levantamos Gigantes",
            "hero-title-2": "Digitales en La Mancha",
            "hero-subtitle": "Ayudamos a los comercios locales, bodegas tradicionales y alojamientos rurales de Campo de Criptana a dominar internet de forma rápida, económica y con tecnología visual 360° de última generación.",
            "hero-btn-primary": "Configurar Mi Plan",
            "hero-btn-secondary": "Ver Tour 360°",
            // Stats & Mockup
            "stat-title-1": "Fichas de Google",
            "stat-desc-1": "Visibilidad Local",
            "stat-title-2": "Reservas Web",
            "stat-desc-2": "Bodegas & Alojamientos",
            "chat-bubble-1": "¡Hola! Me gustaría reservar una cata premium de vuestro vino con visita a la cueva 360°.",
            "chat-bubble-2": "¡Por supuesto! Reserva confirmada al instante. ¡Nos vemos en Criptana! 🍇",
            // Vision
            "vision-title": "La Realidad de Nuestro Pueblo",
            "vision-subtitle": "Campo de Criptana es un lugar emblemático de España, famoso por sus molinos de viento. Pero hoy, la batalla no es contra molinos gigantes, sino contra el olvido digital.",
            "vision-card-title-1": "Comercio de Confianza",
            "vision-card-desc-1": "Tu panadería, carnicería o bar de siempre no necesita una web corporativa carísima que nadie visite. Lo que necesita es estar en Google Maps, tener un menú digital y que sus clientes le compren directamente por WhatsApp en un clic.",
            "vision-card-title-2": "Enoturismo Internacional",
            "vision-card-desc-2": "Nuestras bodegas locales producen vinos reconocidos mundialmente. El turismo de fin de semana busca experiencias auténticas en internet. Mostremos tu bodega, tu historia y tu cueva subterránea de crianza con imágenes que cautiven.",
            "vision-card-title-3": "Casas Rurales que Enamoran",
            "vision-card-desc-3": "El turismo rural vive de las imágenes. Si tus fotos de Airbnb o Booking se ven oscuras o planas, estás perdiendo reservas. Un tour interactivo en 360° permite al viajero de Madrid caminar por tu casa rural antes de llegar.",
            // Services
            "services-title": "Servicios que Hacen Crecer Criptana",
            "services-subtitle": "Sin jerga tecnológica complicada. Ofrecemos tres soluciones directas, de rápida implementación y con precios adaptados a la economía real de nuestro pueblo.",
            "service-tag-1": "Popular & Económico",
            "service-title-1": "Comercio Local Exprés",
            "service-desc-1": "Ideal para carnicerías, panaderías, bares, peluquerías y pequeños comercios que quieren ventas directas sin complicaciones.",
            "s1-f1": "Optimización de Google Maps (¡Para que te encuentren!)",
            "s1-f2": "WhatsApp Business con catálogo de productos",
            "s1-f3": "Página Web Tarjeta de 1 sección ultrarrápida",
            "s1-f4": "Diseño de QR Físico para tu escaparate",
            "setup-label-1": "Desde 149€ de alta",
            
            "service-tag-2": "Turismo & Real Estate",
            "service-title-2": "Alojamientos & Inmobiliaria 360°",
            "service-desc-2": "Perfecto para casas rurales, casas cueva turísticas, apartamentos y agencias inmobiliarias que quieren destacar y vender a distancia.",
            "s2-f1": "Sesión fotográfica profesional de interiores (HDR)",
            "s2-f2": "Tour Virtual Interactivo en 360° de alta definición",
            "s2-f3": "Integración en tu web, Booking, Airbnb o Idealista",
            "s2-f4": "Optimización de ficha para captar turismo nacional",
            "setup-label-2": "Pago único por propiedad",
            
            "service-tag-3": "Criptana Premium",
            "service-title-3": "Enoturismo & Marca Industrial",
            "service-desc-3": "Diseñado para bodegas locales D.O. La Mancha y fábricas agroalimentarias que quieren exportar y captar turismo corporativo premium.",
            "s3-f1": "Web con Motor de Reservas integrado para catas",
            "s3-f2": "Visita Virtual 360° de cuevas y naves de barricas",
            "s3-f3": "Producción de Video (Reels/TikTok) para marca",
            "s3-f4": "Campañas publicitarias en Madrid y provincias limítrofes",
            "setup-label-3": "Proyecto a medida",
            
            // 360 Showcase
            "showcase-title": "Camina Por Una Cueva Tradicional",
            "showcase-subtitle": "Prueba nuestra tecnología interactiva. Haz clic y arrastra con el ratón o desliza con el dedo para explorar esta hermosa bodega/cueva manchega en 360° reales. Esto es lo que verán tus clientes.",
            "viewer-instruction": "Arrastra para explorar la bodega cueva en 360°",
            "hs-title-1": "Crianza Tradicional",
            "hs-desc-1": "Barricas de roble americano donde reposan los mejores caldos bajo la temperatura constante de la cueva manchega.",
            "hs-title-2": "Arquitectura Excavada",
            "hs-desc-2": "Cueva natural excavada a mano en la roca de Campo de Criptana, conservando la humedad y el encanto ancestral.",
            
            // Calculator
            "calc-title": "Calcula el Presupuesto de tu Negocio",
            "calc-subtitle": "Transparencia absoluta. Selecciona los servicios digitales que necesita tu negocio y obtén una estimación de precios al instante. Sin sorpresas.",
            "calc-options-title": "1. Selecciona tus Servicios",
            "calc-item-web-title": "Página Web Tarjeta / Catálogo Express",
            "calc-item-web-desc": "Web de alta velocidad, adaptada a móviles con hosting anual incluido.",
            "calc-item-google-title": "Google Maps & SEO Local",
            "calc-item-google-desc": "Creación o saneamiento de tu ficha de Google Maps para búsquedas locales.",
            "calc-item-wa-title": "WhatsApp Business & QR Menú",
            "calc-item-wa-desc": "Catálogo digital estructurado en WhatsApp + Stands QR físicos para tus mesas o vitrinas.",
            "calc-item-tour-title": "Sesión Fotográfica & Tour Virtual 360°",
            "calc-item-tour-desc": "Visita inmersiva en 360° para tu negocio, bodega, cueva o casa rural (HDR).",
            "calc-item-social-title": "Gestión de Redes Sociales (1 mes)",
            "calc-item-social-desc": "Cuentas puestas al día con publicaciones semanales enfocadas en Criptana y comarca.",
            "calc-result-title": "Estimación de Inversión",
            "calc-setup-label": "Pago Único (Configuración)",
            "calc-setup-desc": "Diseño, programación y puesta en marcha inicial.",
            "calc-monthly-label": "Suscripción Mensual",
            "calc-monthly-desc": "Hosting web, mantenimiento de Maps y soporte directo.",
            "calc-cta": "Solicitar esta Combinación",
            
            // Contact Form
            "contact-badge": "¿Hablamos?",
            "contact-panel-title": "Hagamos Despegar tu Negocio",
            "contact-panel-desc": "No importa si eres una pequeña tienda familiar en la plaza, una bodega con solera o una casa cueva turística en la sierra. Estudiamos tu caso y te proponemos soluciones reales.",
            "contact-loc-title": "Ubicación Local",
            "contact-wa-title": "WhatsApp Directo",
            "contact-mail-title": "Correo Electrónico",
            "form-title": "Consigue una Auditoría Digital Gratis",
            "form-subtitle": "Analizamos la visibilidad actual de tu negocio en Google Maps, fotos y redes sin coste alguno.",
            "form-label-name": "Nombre / Negocio",
            "form-label-phone": "Teléfono (WhatsApp)",
            "form-label-email": "Email (Opcional)",
            "form-label-type": "Tipo de Negocio",
            "opt-1": "Pequeño Comercio / Bar / Tienda",
            "opt-2": "Bodega de Vino (D.O. La Mancha)",
            "opt-3": "Casa Rural / Casa Cueva / Alojamiento",
            "opt-4": "Agencia Inmobiliaria",
            "form-label-msg": "¿En qué podemos ayudarte?",
            "form-btn": "Solicitar Auditoría Gratuita",
            "success-title": "¡Auditoría Solicitada!",
            "success-desc": "Nos pondremos en contacto contigo por WhatsApp en menos de 24 horas para entregarte tu informe de visibilidad local gratis.",
            "success-close": "Entendido",
            "footer-privacy": "Privacidad",
            "footer-legal": "Aviso Legal"
        },
        en: {
            title: "LUZE Media Marketing | Raising Digital Giants in Campo de Criptana",
            description: "We boost local businesses, wineries, and cottages in Campo de Criptana with high-speed websites, Google presence, WhatsApp automation, and interactive 360° virtual tours.",
            // Nav
            "nav-vision": "Our Vision",
            "nav-services": "Services",
            "nav-experience": "360° Demo",
            "nav-calculator": "Plan Calculator",
            "nav-contact": "Free Audit",
            // Hero
            "hero-badge": "Land of Giants, Digital Future",
            "hero-title-1": "We Raise Digital",
            "hero-title-2": "Giants in La Mancha",
            "hero-subtitle": "We help local shops, traditional wineries, and rural cottages in Campo de Criptana dominate the internet quickly, affordably, and with cutting-edge 360° visual technology.",
            "hero-btn-primary": "Configure My Plan",
            "hero-btn-secondary": "View 360° Tour",
            // Stats & Mockup
            "stat-title-1": "Google Listings",
            "stat-desc-1": "Local Visibility",
            "stat-title-2": "Web Bookings",
            "stat-desc-2": "Wineries & Lodgings",
            "chat-bubble-1": "Hello! I would love to book a premium wine tasting including a 360° tour of the cave cellar.",
            "chat-bubble-2": "Of course! Booking confirmed instantly. See you in Campo de Criptana! 🍇",
            // Vision
            "vision-title": "Our Town's Reality",
            "vision-subtitle": "Campo de Criptana is an iconic town in Spain, famous for its windmills. But today's battle is not against giant windmills, but against digital oblivion.",
            "vision-card-title-1": "Trusted Local Shops",
            "vision-card-desc-1": "Your local bakery, butcher, or favorite bar doesn't need an expensive website that nobody visits. They need to be visible on Google Maps, have a digital menu, and receive WhatsApp orders in a single click.",
            "vision-card-title-2": "International Wineries",
            "vision-card-desc-2": "Our local wineries produce globally recognized wines. Weekend tourists search for authentic experiences online. Let's showcase your bodega and subterranean aging cellars with captivating media.",
            "vision-card-title-3": "Cottages You'll Love",
            "vision-card-desc-3": "Rural tourism lives or dies by pictures. If your Airbnb or Booking.com photos look dark or flat, you are losing reservations. A 360° interactive tour lets travelers walk through your cottage from Madrid.",
            // Services
            "services-title": "Services Raising Campo de Criptana",
            "services-subtitle": "No complex tech jargon. We offer three straightforward, fast-to-implement solutions priced fairly for our town's local economy.",
            "service-tag-1": "Popular & Affordable",
            "service-title-1": "Local Commerce Express",
            "service-desc-1": "Ideal for butchers, bakeries, bars, salons, and small shops wanting direct sales and local calls without complications.",
            "s1-f1": "Google Maps Optimization (Get found locally!)",
            "s1-f2": "WhatsApp Business with custom product catalogs",
            "s1-f3": "Ultra-fast 1-page Digital Business Card site",
            "s1-f4": "Physical QR Code standee designed for your counter",
            "setup-label-1": "From €149 setup fee",
            
            "service-tag-2": "Tourism & Real Estate",
            "service-title-2": "Lodging & Real Estate 360°",
            "service-desc-2": "Perfect for holiday cottages, tourist cave houses, apartments, and real estate agencies wanting to stand out and sell remotely.",
            "s2-f1": "Professional high-dynamic interior photography (HDR)",
            "s2-f2": "High-definition Interactive 360° Virtual Tour",
            "s2-f3": "Direct integration on your site, Booking, Airbnb, or portals",
            "s2-f4": "Listing optimization to capture nationwide tourists",
            "setup-label-2": "One-time fee per property",
            
            "service-tag-3": "Criptana Premium",
            "service-title-3": "Winery & Agro-Industry",
            "service-desc-3": "Designed for local D.O. La Mancha wineries and food factories looking to export and capture premium corporate tourism.",
            "s3-f1": "Website with fully integrated Tasting Reservation Engine",
            "s3-f2": "360° Virtual Visit of caves and oak barrel cellars",
            "s3-f3": "Video Production (Reels/TikTok) for social storytelling",
            "s3-f4": "Targeted ad campaigns in Madrid and surrounding provinces",
            "setup-label-3": "Bespoke custom project",
            
            // 360 Showcase
            "showcase-title": "Walk Through A Subterranean Cave",
            "showcase-subtitle": "Try our interactive technology. Click and drag with your mouse or swipe with your finger to explore this beautiful winery cueva in 360°. This is exactly what your clients will experience.",
            "viewer-instruction": "Drag to explore the historic cellar cueva in 360°",
            "hs-title-1": "Traditional Oak Aging",
            "hs-desc-1": "American oak barrels aging our finest wines under the constant natural temperature of the subterranean La Mancha cave.",
            "hs-title-2": "Hand-Excavated Architecture",
            "hs-desc-2": "Natural cave excavated entirely by hand in Campo de Criptana's stone, preserving history and perfect structural humidity.",
            
            // Calculator
            "calc-title": "Calculate Your Business Digital Budget",
            "calc-subtitle": "Absolute transparency. Select the digital services your business needs and get an instant cost estimate. No surprises.",
            "calc-options-title": "1. Select Your Services",
            "calc-item-web-title": "Digital Business Card Web / Express Catalog",
            "calc-item-web-desc": "High-speed, mobile-optimized landing page with annual hosting included.",
            "calc-item-google-title": "Google Maps & Local SEO",
            "calc-item-google-desc": "Creation or optimization of your Google Maps listing for local search dominance.",
            "calc-item-wa-title": "WhatsApp Business & QR Menu Setup",
            "calc-item-wa-desc": "Structured WhatsApp business catalog + physical QR standees for storefronts.",
            "calc-item-tour-title": "Professional Photography & 360° Virtual Tour",
            "calc-item-tour-desc": "Immersive 360° walkthrough of your shop, winery, cueva, or holiday lodging (HDR).",
            "calc-item-social-title": "Social Media Management (1 Month)",
            "calc-item-social-desc": "Updated social profiles with weekly localized posts focusing on Criptana and regional markets.",
            "calc-result-title": "Investment Estimate",
            "calc-setup-label": "One-Time Setup Fee",
            "calc-setup-desc": "Design, setup, engineering, and initial deployment.",
            "calc-monthly-label": "Monthly Subscription",
            "calc-monthly-desc": "Web hosting, Google Maps upkeep, and direct tech support.",
            "calc-cta": "Request This Combination",
            
            // Contact Form
            "contact-badge": "Let's Talk",
            "contact-panel-title": "Let's Elevate Your Local Brand",
            "contact-panel-desc": "Whether you are a small family shop in the town square, a historic winery, or a boutique cave house in the hills. We study your case and suggest real, cost-effective growth solutions.",
            "contact-loc-title": "Local Office",
            "contact-wa-title": "Direct WhatsApp",
            "contact-mail-title": "Direct Email",
            "form-title": "Get a Free Digital Audit",
            "form-subtitle": "We will analyze your current Google Maps presence, photography, and social media at zero cost.",
            "form-label-name": "Name / Business",
            "form-label-phone": "Phone (WhatsApp)",
            "form-label-email": "Email (Optional)",
            "form-label-type": "Business Type",
            "opt-1": "Small Retailer / Bar / Local Shop",
            "opt-2": "Wine Bodega (D.O. La Mancha)",
            "opt-3": "Holiday Cottage / Cave House / Lodging",
            "opt-4": "Real Estate Agency",
            "form-label-msg": "How can we help you?",
            "form-btn": "Request Free Digital Audit",
            "success-title": "Audit Requested Successfully!",
            "success-desc": "We will reach out to you via WhatsApp within 24 hours to deliver your free local visibility report.",
            "success-close": "Got it",
            "footer-privacy": "Privacy Policy",
            "footer-legal": "Legal Notice"
        }
    };

    let currentLanguage = 'es'; // Spanish is default for Campo de Criptana

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLanguage = lang;
        
        // Update elements with data-key attributes
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                // If it's a form input button or button element
                if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
                    el.value = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Update document metadata
        document.title = translations[lang].title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', translations[lang].description);
        }

        // Update form placeholders
        const inputName = document.getElementById('client-name');
        const inputPhone = document.getElementById('client-phone');
        const inputMsg = document.getElementById('client-message');
        
        if (lang === 'es') {
            if (inputName) inputName.placeholder = "Ej. Bar Castillo / Bodega Vidal";
            if (inputPhone) inputPhone.placeholder = "600 000 000";
            if (inputMsg) inputMsg.placeholder = "Me gustaría digitalizar mi carta de vinos, optimizar mi ficha de Google Maps, hacer fotos de mi casa rural...";
        } else {
            if (inputName) inputName.placeholder = "e.g., Bar Castillo / Bodega Vidal";
            if (inputPhone) inputPhone.placeholder = "+34 600 000 000";
            if (inputMsg) inputMsg.placeholder = "I would like to digitalize my wine list, optimize my Google Maps profile, get photos of my cottage...";
        }

        // Keep button active states in UI
        document.getElementById('lang-es').classList.toggle('active', lang === 'es');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        
        // Save preference
        localStorage.setItem('luze-lang', lang);
    }

    // Language switch click events
    document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

    // Check for saved language
    const savedLang = localStorage.getItem('luze-lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        setLanguage('es');
    }


    /* ==========================================================================
       2. Responsive Navigation & Mobile Menu
       ========================================================================== */
    const mainHeader = document.querySelector('.main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    // Sticky scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    /* ==========================================================================
       3. Interactive Pricing Plan Calculator
       ========================================================================== */
    const calcWeb = document.getElementById('calc-web');
    const calcGoogle = document.getElementById('calc-google');
    const calcWa = document.getElementById('calc-whatsapp');
    const calcTour = document.getElementById('calc-tour');
    const calcSocial = document.getElementById('calc-social');
    
    const setupCostEl = document.getElementById('setup-cost');
    const monthlyCostEl = document.getElementById('monthly-cost');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    // Services pricing formulas:
    // Web: Setup 149, Monthly 19
    // Google Maps: Setup 79, Monthly 0
    // WhatsApp catalog & QR physical standee: Setup 99, Monthly 10
    // 360 Virtual Tour session (flat per session): Setup 349, Monthly 0
    // Redes Sociales: Setup 0, Monthly 199

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculatePrice() {
        let setupTotal = 0;
        let monthlyTotal = 0;
        
        let selectedServices = [];

        if (calcWeb.checked) {
            setupTotal += 149;
            monthlyTotal += 19;
            selectedServices.push(currentLanguage === 'es' ? "Web Tarjeta" : "Digital Business Card");
        }
        if (calcGoogle.checked) {
            setupTotal += 79;
            selectedServices.push(currentLanguage === 'es' ? "Google Maps" : "Google Maps");
        }
        if (calcWa.checked) {
            setupTotal += 99;
            monthlyTotal += 10;
            selectedServices.push(currentLanguage === 'es' ? "WhatsApp & QR Físico" : "WhatsApp & Storefront QR");
        }
        if (calcTour.checked) {
            setupTotal += 349;
            selectedServices.push(currentLanguage === 'es' ? "Sesión 360°" : "360° Virtual Tour");
        }
        if (calcSocial.checked) {
            monthlyTotal += 199;
            selectedServices.push(currentLanguage === 'es' ? "Gestión Redes" : "Social Media Retainer");
        }

        // Animate price values change smoothly
        const currentSetupVal = parseInt(setupCostEl.innerText) || 0;
        const currentMonthlyVal = parseInt(monthlyCostEl.innerText) || 0;
        
        animateValue(setupCostEl, currentSetupVal, setupTotal, 350);
        animateValue(monthlyCostEl, currentMonthlyVal, monthlyTotal, 350);

        // Update CTA link parameters to fill form later
        const messageText = currentLanguage === 'es' 
            ? `Hola, me interesa calcular presupuesto para: ${selectedServices.join(', ')}.`
            : `Hello, I'm interested in a budget for: ${selectedServices.join(', ')}.`;
            
        calcCtaBtn.addEventListener('click', (e) => {
            const clientMsg = document.getElementById('client-message');
            if (clientMsg) {
                clientMsg.value = messageText;
                
                // Select matching option
                const clientType = document.getElementById('client-type');
                if (clientType) {
                    if (calcTour.checked) {
                        clientType.value = "alojamiento";
                    } else if (calcSocial.checked) {
                        clientType.value = "comercio";
                    }
                }
            }
        });
    }

    // Set calculator listeners
    [calcWeb, calcGoogle, calcWa, calcTour, calcSocial].forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });

    // Run initial calculator math
    calculatePrice();


    /* ==========================================================================
       4. Silky Smooth Procedural 3D Wine Cellar 360° Viewer (No Three.js required!)
       ========================================================================== */
    const panoViewer = document.getElementById('pano-viewer');
    const panoCanvas = document.getElementById('pano-canvas');
    const viewerOverlay = document.getElementById('viewer-overlay');
    const ctx = panoCanvas.getContext('2d');

    // Pan camera variables
    let yaw = 0; // horizontal angle
    let pitch = 0; // vertical angle
    let fov = 75; // field of view (zoom)
    
    let isDragging = false;
    let startMouseX = 0;
    let startMouseY = 0;
    let startYaw = 0;
    let startPitch = 0;
    
    let isIdle = true;
    let idleRotationTimer = null;

    // Offscreen Canvas to procedurally paint a stunning, high-def Spanish cueva/wine cellar equirectangular panorama texture!
    const textureCanvas = document.createElement('canvas');
    const texWidth = 2048;
    const texHeight = 1024;
    textureCanvas.width = texWidth;
    textureCanvas.height = texHeight;
    const tCtx = textureCanvas.getContext('2d');

    function createProceduralCellarTexture() {
        // 1. Cozy background sky/vault
        tCtx.fillStyle = '#06080D';
        tCtx.fillRect(0, 0, texWidth, texHeight);

        // 2. Earthy brick-stone pattern (vault arch)
        tCtx.fillStyle = '#110C0A';
        for (let y = 0; y < texHeight; y += 16) {
            let rowShift = (Math.floor(y / 16) % 2) * 20;
            for (let x = 0; x < texWidth; x += 40) {
                // Stone block highlights
                tCtx.fillStyle = (Math.random() > 0.5) ? '#181210' : '#140D0B';
                tCtx.fillRect(x + rowShift, y, 38, 14);
            }
        }

        // 3. Draw architectural brick pillars & arches
        tCtx.lineWidth = 12;
        for (let a = 0; a < 4; a++) {
            let centerX = (texWidth / 4) * a + (texWidth / 8);
            
            // Draw arch shadow
            tCtx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            tCtx.beginPath();
            tCtx.arc(centerX, texHeight / 2 - 100, 160, Math.PI, 0);
            tCtx.stroke();
            
            // Draw brick arch
            tCtx.strokeStyle = '#2D1B13';
            tCtx.beginPath();
            tCtx.arc(centerX, texHeight / 2 - 100, 150, Math.PI, 0);
            tCtx.stroke();

            // Arched cave niches (with glowing candles)
            tCtx.fillStyle = '#090605';
            tCtx.beginPath();
            tCtx.arc(centerX, texHeight / 2 + 50, 60, Math.PI, 0);
            tCtx.lineTo(centerX + 60, texHeight / 2 + 250);
            tCtx.lineTo(centerX - 60, texHeight / 2 + 250);
            tCtx.closePath();
            tCtx.fill();

            // Candle fire glowing in niche
            let fireGlow = tCtx.createRadialGradient(centerX, texHeight / 2 + 180, 2, centerX, texHeight / 2 + 180, 60);
            fireGlow.addColorStop(0, '#FFEAA7');
            fireGlow.addColorStop(0.2, '#FF9F43');
            fireGlow.addColorStop(0.5, 'rgba(255, 159, 67, 0.25)');
            fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            tCtx.fillStyle = fireGlow;
            tCtx.beginPath();
            tCtx.arc(centerX, texHeight / 2 + 180, 60, 0, Math.PI * 2);
            tCtx.fill();
            
            // Small candle wick
            tCtx.fillStyle = '#FF7675';
            tCtx.fillRect(centerX - 4, texHeight / 2 + 195, 8, 15);
            tCtx.fillStyle = '#000';
            tCtx.fillRect(centerX - 1, texHeight / 2 + 190, 2, 6);
        }

        // 4. Large Oak Barrels (Toneles de Barricas) - Left & Right
        const barrelCoordinates = [
            { x: 150, y: texHeight / 2 + 120, r: 85 },
            { x: 330, y: texHeight / 2 + 130, r: 95 },
            { x: 670, y: texHeight / 2 + 120, r: 90 },
            { x: 860, y: texHeight / 2 + 135, r: 100 },
            { x: 1180, y: texHeight / 2 + 120, r: 85 },
            { x: 1360, y: texHeight / 2 + 130, r: 95 },
            { x: 1700, y: texHeight / 2 + 120, r: 90 },
            { x: 1890, y: texHeight / 2 + 135, r: 100 }
        ];

        barrelCoordinates.forEach(bar => {
            // Shadow behind barrel
            tCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            tCtx.beginPath();
            tCtx.arc(bar.x + 8, bar.y + 10, bar.r, 0, Math.PI * 2);
            tCtx.fill();

            // Barrel body gradient
            let barGlow = tCtx.createRadialGradient(bar.x - bar.r/3, bar.y - bar.r/3, 10, bar.x, bar.y, bar.r);
            barGlow.addColorStop(0, '#5C3826');
            barGlow.addColorStop(0.5, '#3D2214');
            barGlow.addColorStop(1, '#1A0E08');
            
            tCtx.fillStyle = barGlow;
            tCtx.beginPath();
            tCtx.arc(bar.x, bar.y, bar.r, 0, Math.PI * 2);
            tCtx.fill();
            
            // Wooden circular segments
            tCtx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
            tCtx.lineWidth = 3;
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
                tCtx.beginPath();
                tCtx.moveTo(bar.x, bar.y);
                tCtx.lineTo(bar.x + Math.cos(angle) * bar.r, bar.y + Math.sin(angle) * bar.r);
                tCtx.stroke();
            }

            // Metal concentric hoops
            tCtx.strokeStyle = '#27170F';
            tCtx.lineWidth = 6;
            tCtx.beginPath();
            tCtx.arc(bar.x, bar.y, bar.r - 10, 0, Math.PI * 2);
            tCtx.stroke();
            
            tCtx.strokeStyle = 'rgba(255, 159, 67, 0.1)';
            tCtx.lineWidth = 2;
            tCtx.beginPath();
            tCtx.arc(bar.x, bar.y, bar.r - 20, 0, Math.PI * 2);
            tCtx.stroke();

            // Barrel plug (bitoque)
            tCtx.fillStyle = '#000';
            tCtx.beginPath();
            tCtx.arc(bar.x, bar.y - bar.r/2, 6, 0, Math.PI * 2);
            tCtx.fill();
        });

        // 5. Traditional La Mancha Cave window showing Campo de Criptana Sunset & Windmills!
        // This is placed at a dedicated yaw zone (x: 1024 represents center of panorama)
        const windowCenterX = 1024;
        const windowCenterY = texHeight / 2 - 80;
        
        // Window arch background (sunset sky)
        tCtx.fillStyle = '#1D0D08';
        tCtx.beginPath();
        tCtx.arc(windowCenterX, windowCenterY, 110, Math.PI, 0);
        tCtx.lineTo(windowCenterX + 110, windowCenterY + 120);
        tCtx.lineTo(windowCenterX - 110, windowCenterY + 120);
        tCtx.closePath();
        tCtx.fill();

        // Sunset gradient overlay
        let skyGlow = tCtx.createLinearGradient(0, windowCenterY - 110, 0, windowCenterY + 120);
        skyGlow.addColorStop(0, '#5D1933'); // twilight plum
        skyGlow.addColorStop(0.4, '#D35400'); // orange sunset
        skyGlow.addColorStop(0.7, '#F39C12'); // golden sun
        skyGlow.addColorStop(1, '#F1C40F');
        
        tCtx.fillStyle = skyGlow;
        tCtx.beginPath();
        tCtx.arc(windowCenterX, windowCenterY, 105, Math.PI, 0);
        tCtx.lineTo(windowCenterX + 105, windowCenterY + 120);
        tCtx.lineTo(windowCenterX - 105, windowCenterY + 120);
        tCtx.closePath();
        tCtx.fill();

        // Starry sky particles in window top
        tCtx.fillStyle = '#FFF';
        for (let s = 0; s < 15; s++) {
            let starX = windowCenterX - 90 + Math.random() * 180;
            let starY = windowCenterY - 100 + Math.random() * 80;
            // check distance to make sure it's inside window arch
            let dx = starX - windowCenterX;
            let dy = starY - windowCenterY;
            if (dx*dx + dy*dy < 95*95) {
                tCtx.fillRect(starX, starY, 1.5, 1.5);
            }
        }

        // Draw Windmill silhouettes in the sunset!
        tCtx.fillStyle = '#130A07';
        
        // Windmill 1 (Center)
        let wX = windowCenterX - 30;
        let wY = windowCenterY + 40;
        tCtx.beginPath();
        tCtx.moveTo(wX, wY);
        tCtx.lineTo(wX + 16, wY - 45); // tapered wall
        tCtx.lineTo(wX + 30, wY);
        tCtx.closePath();
        tCtx.fill();
        
        // Dome cap (chapitel)
        tCtx.beginPath();
        tCtx.arc(wX + 8, wY - 44, 8, Math.PI, 0);
        tCtx.closePath();
        tCtx.fill();
        
        // Windmill sails (Aspas)
        tCtx.strokeStyle = '#130A07';
        tCtx.lineWidth = 2.5;
        tCtx.beginPath();
        // Diagonal sails
        tCtx.moveTo(wX + 8 - 30, wY - 44 - 15);
        tCtx.lineTo(wX + 8 + 30, wY - 44 + 15);
        tCtx.moveTo(wX + 8 - 15, wY - 44 + 30);
        tCtx.lineTo(wX + 8 + 15, wY - 44 - 30);
        tCtx.stroke();

        // Windmill 2 (Right, smaller silhouette)
        let wX2 = windowCenterX + 45;
        let wY2 = windowCenterY + 70;
        tCtx.beginPath();
        tCtx.moveTo(wX2, wY2);
        tCtx.lineTo(wX2 + 10, wY2 - 28);
        tCtx.lineTo(wX2 + 18, wY2);
        tCtx.closePath();
        tCtx.fill();
        
        tCtx.beginPath();
        tCtx.arc(wX2 + 5, wY2 - 27, 5, Math.PI, 0);
        tCtx.closePath();
        tCtx.fill();

        tCtx.strokeStyle = '#130A07';
        tCtx.lineWidth = 1.5;
        tCtx.beginPath();
        tCtx.moveTo(wX2 + 5 - 18, wY2 - 27);
        tCtx.lineTo(wX2 + 5 + 18, wY2 - 27);
        tCtx.moveTo(wX2 + 5, wY2 - 27 - 18);
        tCtx.lineTo(wX2 + 5, wY2 - 27 + 18);
        tCtx.stroke();

        // Ground hill silhouette inside window
        tCtx.fillStyle = '#0B0503';
        tCtx.beginPath();
        tCtx.moveTo(windowCenterX - 105, windowCenterY + 120);
        tCtx.quadraticCurveTo(windowCenterX, windowCenterY + 60, windowCenterX + 105, windowCenterY + 120);
        tCtx.closePath();
        tCtx.fill();

        // 6. Floor rustic tiles with reflections
        let floorGrad = tCtx.createLinearGradient(0, texHeight / 2 + 250, 0, texHeight);
        floorGrad.addColorStop(0, '#0F0906');
        floorGrad.addColorStop(1, '#050302');
        tCtx.fillStyle = floorGrad;
        tCtx.fillRect(0, texHeight / 2 + 250, texWidth, texHeight / 2 - 250);
        
        // Procedural floor perspective lines
        tCtx.strokeStyle = 'rgba(255, 159, 67, 0.03)';
        tCtx.lineWidth = 1.5;
        for (let x = 0; x < texWidth; x += 60) {
            tCtx.beginPath();
            tCtx.moveTo(x, texHeight / 2 + 250);
            tCtx.lineTo(x + (x - texWidth/2) * 0.4, texHeight);
            tCtx.stroke();
        }

        // Add brand stamp: "LUZE CELLARS"
        tCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        tCtx.font = 'bold 22px Outfit, sans-serif';
        tCtx.textAlign = 'center';
        tCtx.fillText('LUZE MEDIA 360° DEMO', windowCenterX, windowCenterY + 160);
    }

    // Paint the initial texture canvas
    createProceduralCellarTexture();

    // Resize canvas to match container bounds
    function resizeViewerCanvas() {
        const rect = panoViewer.getBoundingClientRect();
        panoCanvas.width = rect.width;
        panoCanvas.height = rect.height;
        renderPano();
    }

    // Mathematical projection of equirectangular coordinates
    // We map viewport pixels (x, y) to spherical angles, then read from the 2D texture.
    function renderPano() {
        const w = panoCanvas.width;
        const h = panoCanvas.height;
        if (w === 0 || h === 0) return;

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        // Map projection slices
        // We divide the screen into columns and rows for fast CPU projection
        const cols = w;
        const halfW = w / 2;
        const halfH = h / 2;
        
        // Convert fov (zoom) to focal length
        const focal = halfW / Math.tan((fov * Math.PI / 180) / 2);

        // Pitch clipping limits to prevent infinite poles wrapping
        pitch = Math.max(-45, Math.min(45, pitch));

        const radYaw = yaw * Math.PI / 180;
        const radPitch = pitch * Math.PI / 180;

        const sinP = Math.sin(radPitch);
        const cosP = Math.cos(radPitch);
        const sinY = Math.sin(radYaw);
        const cosY = Math.cos(radYaw);

        // Highly optimized grid column scanner drawing:
        // We draw vertical columns of the texture onto the screen using drawImage slices.
        // It provides a perfect cylindrical immersive feel at 60fps with zero latency.
        for (let screenX = 0; screenX < w; screenX += 1.5) {
            // Direction vector of the screen column
            const vx = screenX - halfW;
            const vy = focal;
            
            // Sphere ray direction projection
            const rx = vx * cosY - vy * sinY;
            const ry = vx * sinY + vy * cosY;
            
            // Calculate longitude yaw angle on texture
            let longitude = Math.atan2(rx, ry);
            if (longitude < 0) longitude += Math.PI * 2;
            
            const texX = (longitude / (Math.PI * 2)) * texWidth;

            // Pitch displacement formula:
            // High speed coordinate vertical shift simulating pitch tilt and lens compression
            const screenYOffset = halfH + (pitch * 4.5);

            // Draw a slice of the offscreen 360 texture onto the canvas column
            ctx.drawImage(
                textureCanvas,
                Math.floor(texX) % texWidth, 0, 1.5, texHeight, // Src column
                screenX, screenYOffset - halfH * 2.2, 1.5, h * 2.2 // Dst column (scaled vertical)
            );
        }

        // Dynamically position HTML Hotspots on top of canvas using trigonometry!
        positionHotspots(radYaw, radPitch, focal, halfW, halfH);
    }

    function positionHotspots(radYaw, radPitch, focal, halfW, halfH) {
        const hotspots = [
            { id: 'hotspot-crianza', targetYaw: 160, targetPitch: -5 },
            { id: 'hotspot-arquitectura', targetYaw: 220, targetPitch: 15 }
        ];

        hotspots.forEach(hs => {
            const el = document.getElementById(hs.id);
            if (!el) return;

            // Calculate target spherical coordinates angle relative to camera yaw/pitch
            let diffYaw = ((hs.targetYaw - yaw + 180) % 360) - 180;
            if (diffYaw < -180) diffYaw += 360;

            const radDiffY = diffYaw * Math.PI / 180;
            const radDiffP = (hs.targetPitch - pitch) * Math.PI / 180;

            // Check if hotspot is behind camera view (fov threshold)
            if (Math.abs(diffYaw) < 70) {
                // Calculate perspective project on canvas screen
                const projX = halfW + Math.tan(radDiffY) * focal;
                const projY = halfH - Math.tan(radDiffP) * focal + (pitch * 3);

                el.style.left = `${projX}px`;
                el.style.top = `${projY}px`;
                el.style.display = 'block';
                el.style.opacity = '1';
            } else {
                el.style.display = 'none';
                el.style.opacity = '0';
            }
        });
    }

    // 360 Interactive controls (Drag to Pan)
    function onMouseDown(e) {
        isDragging = true;
        isIdle = false;
        viewerOverlay.classList.add('fade-out'); // Remove overlay tutorial
        
        startMouseX = e.clientX || e.touches[0].clientX;
        startMouseY = e.clientY || e.touches[0].clientY;
        startYaw = yaw;
        startPitch = pitch;
        
        if (idleRotationTimer) clearInterval(idleRotationTimer);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const deltaX = clientX - startMouseX;
        const deltaY = clientY - startMouseY;
        
        // Panning drag speeds sensitive to FOV zoom
        yaw = (startYaw - deltaX * 0.18) % 360;
        pitch = startPitch + deltaY * 0.15;
        
        renderPano();
    }

    function onMouseUp() {
        isDragging = false;
        // Start smooth auto-drift timer if left idle
        resetIdleTimer();
    }

    // Register 360 Drag Listeners
    panoViewer.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobiles
    panoViewer.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Zoom Buttons
    document.getElementById('ctrl-zoom-in').addEventListener('click', () => {
        fov = Math.max(40, fov - 8);
        renderPano();
    });
    document.getElementById('ctrl-zoom-out').addEventListener('click', () => {
        fov = Math.min(100, fov + 8);
        renderPano();
    });

    // Rotation Buttons
    document.getElementById('ctrl-left').addEventListener('click', () => {
        isIdle = false;
        yaw = (yaw - 15) % 360;
        renderPano();
        resetIdleTimer();
    });
    document.getElementById('ctrl-right').addEventListener('click', () => {
        isIdle = false;
        yaw = (yaw + 15) % 360;
        renderPano();
        resetIdleTimer();
    });

    // Auto-drift idle system
    function resetIdleTimer() {
        if (idleRotationTimer) clearInterval(idleRotationTimer);
        idleRotationTimer = setInterval(() => {
            yaw = (yaw + 0.05) % 360; // Soft continuous drift
            renderPano();
        }, 16);
    }

    // Set initial size and start render loop
    window.addEventListener('resize', resizeViewerCanvas);
    
    // Defer initial render slightly to ensure full container dimensions are loaded in DOM
    setTimeout(() => {
        resizeViewerCanvas();
        resetIdleTimer();
    }, 150);


    /* ==========================================================================
       5. Audit Form Handler (Confetti & Success overlay)
       ========================================================================== */
    const auditForm = document.getElementById('audit-form');
    const formSuccess = document.getElementById('form-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form details
            const name = document.getElementById('client-name').value;
            const phone = document.getElementById('client-phone').value;
            const type = document.getElementById('client-type').value;
            const msg = document.getElementById('client-message').value;

            // Trigger premium success glass overlay
            formSuccess.classList.add('show');
            
            // Console details for developer checking
            console.log("FREE AUDIT REQUESTED:", { name, phone, type, msg });

            // Reset form
            auditForm.reset();
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            formSuccess.classList.remove('show');
        });
    }
});
