/* 
   LUZE Media Marketing - Client Mockup Core JS
   Client: Hermanos Pintor S.A.
   Logic: Theme toggle, Cookie consent, Form validations & Legal modals
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Management ---
    const themeBtn = document.getElementById('theme-btn');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');
    
    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'light');
        }
    };
    
    // Check stored preference or system default
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- Legal Modals ---
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtns = document.querySelectorAll('.modal-close');
    
    const openModal = (modalId) => {
        const target = document.getElementById(`modal-${modalId}`);
        if (target) {
            modalOverlays.forEach(m => m.classList.remove('active'));
            target.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    const closeModal = () => {
        modalOverlays.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    };
    
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(btn.getAttribute('data-modal'));
        });
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- Cookie Consent Banner (AEPD / LSSI-CE Compliance) ---
    const cookiePopup = document.getElementById('cookie-popup');
    const btnAcceptAll = document.getElementById('cookie-accept-all');
    const btnRejectAll = document.getElementById('cookie-reject-all');
    const btnToggleSettings = document.getElementById('cookie-toggle-settings');
    const settingsPanel = document.getElementById('cookie-settings');
    const optAnalytics = document.getElementById('cookie-opt-analytics');
    
    const showCookiePopup = () => {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 1000);
    };
    
    const saveCookieConsent = (analyticsGranted) => {
        localStorage.setItem('cookie-consent-given', 'true');
        localStorage.setItem('cookie-consent-analytics', analyticsGranted ? 'true' : 'false');
        cookiePopup.classList.remove('active');
        
        // Emulate server-side execution of analytics scripts via Zaraz
        if (analyticsGranted) {
            console.log('Zaraz compliance log: Analytical scripts initialized on the server-side.');
        } else {
            console.log('Zaraz compliance log: Analytical tracking blocked by user consent rejection.');
        }
    };
    
    if (!localStorage.getItem('cookie-consent-given')) {
        showCookiePopup();
    }
    
    btnAcceptAll.addEventListener('click', () => {
        saveCookieConsent(true);
    });
    
    btnRejectAll.addEventListener('click', () => {
        saveCookieConsent(false);
    });
    
    btnToggleSettings.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
        btnToggleSettings.innerText = settingsPanel.classList.contains('active') ? 'Guardar Selección' : 'Configurar';
        
        if (!settingsPanel.classList.contains('active')) {
            saveCookieConsent(optAnalytics.checked);
        }
    });

    // --- HORECA Form Submission & Validation ---
    const b2bForm = document.getElementById('b2b-form');
    const formSuccess = document.getElementById('form-success');
    
    if (b2bForm) {
        b2bForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Remove existing errors
            const errors = b2bForm.querySelectorAll('.form-error');
            errors.forEach(err => err.remove());
            
            let isValid = true;
            
            // Validate required fields
            const requiredInputs = b2bForm.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    if (!input.checked) {
                        isValid = false;
                        showInputError(input, 'Es obligatorio aceptar el Aviso Legal y la Política de Privacidad.');
                    }
                } else {
                    if (!input.value.trim()) {
                        isValid = false;
                        showInputError(input, 'Este campo es obligatorio.');
                    } else if (input.type === 'email' && !validateEmail(input.value)) {
                        isValid = false;
                        showInputError(input, 'Introduzca un email corporativo válido.');
                    }
                }
            });
            
            if (isValid) {
                // Emulate secure serverless database capture
                console.log('Cloudflare Workers trace: Solicitud de alta qualified and sent to ERP.');
                console.log({
                    contacto: document.getElementById('form-name').value,
                    empresa: document.getElementById('form-company').value,
                    email: document.getElementById('form-email').value,
                    telefono: document.getElementById('form-phone').value,
                    cif: document.getElementById('form-nif').value,
                    volumen: document.getElementById('form-volume').value,
                    mensaje: document.getElementById('form-message').value
                });
                
                b2bForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }
        });
    }

    // --- B2B Login Form Submission & Validation ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const errors = loginForm.querySelectorAll('.form-error');
            errors.forEach(err => err.remove());
            
            let isValid = true;
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-pass');
            
            if (!emailInput.value.trim()) {
                isValid = false;
                showInputError(emailInput, 'Introduzca su email corporativo o CIF.');
            }
            if (!passInput.value.trim()) {
                isValid = false;
                showInputError(passInput, 'Introduzca su contraseña.');
            }
            
            if (isValid) {
                console.log('ERP Integration Query: Validating B2B user credentials on Holded/Factusol endpoint.');
                console.log({
                    username: emailInput.value
                });
                
                // Emulate login validation error for mockup validation demo
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.style.color = '#e05353';
                errorDiv.style.fontSize = '0.8rem';
                errorDiv.style.marginTop = '1rem';
                errorDiv.style.fontWeight = '600';
                errorDiv.innerText = 'Error: Credenciales no reconocidas en el ERP. Póngase en contacto con administración.';
                loginForm.appendChild(errorDiv);
            }
        });
    }

    // --- B2B Recovery Form Submission ---
    const recoveryForm = document.getElementById('recovery-form');
    const recoverySuccess = document.getElementById('recovery-success');
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const errors = recoveryForm.querySelectorAll('.form-error');
            errors.forEach(err => err.remove());
            
            const recEmailInput = document.getElementById('recovery-email');
            if (!recEmailInput.value.trim() || !validateEmail(recEmailInput.value)) {
                showInputError(recEmailInput, 'Introduzca un email corporativo válido.');
            } else {
                console.log('ERP Integration trace: Requesting recovery link for ' + recEmailInput.value);
                recoveryForm.style.display = 'none';
                recoverySuccess.style.display = 'block';
            }
        });
    }
    
    const showInputError = (input, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.color = '#e05353';
        errorDiv.style.fontSize = '0.75rem';
        errorDiv.style.marginTop = '4px';
        errorDiv.innerText = message;
        
        if (input.type === 'checkbox') {
            input.closest('.checkbox-group').appendChild(errorDiv);
        } else {
            input.closest('.form-group').appendChild(errorDiv);
        }
    };
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
});
