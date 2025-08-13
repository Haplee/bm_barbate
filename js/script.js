/**
 * Script para la interactividad del sitio web del Club de Balonmano.
 *
 * Funcionalidades:
 * 1. Control del menú de navegación móvil (hamburguesa).
 * 2. Efecto de cabecera que cambia de tamaño al hacer scroll.
 * 3. Gestión del banner de consentimiento de cookies.
 *
 * @version 1.0
 */

// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ------------------------------------------------
     * 1. NAVEGACIÓN MÓVIL (MENÚ HAMBURGUESA)
     * ------------------------------------------------
     * Controla la apertura y cierre del menú en dispositivos móviles.
     */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            // Añade o quita la clase 'is-active' para mostrar/ocultar el menú
            hamburgerBtn.classList.toggle('is-active');
            mainNav.classList.toggle('is-active');

            // Actualiza el atributo ARIA para accesibilidad
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        });
    }


    /**
     * ------------------------------------------------
     * 2. CABECERA FIJA (STICKY HEADER)
     * ------------------------------------------------
     * Añade una clase a la cabecera cuando el usuario hace scroll,
     * permitiendo cambiar su estilo (ej. tamaño) con CSS.
     */
    const mainHeader = document.getElementById('main-header');

    if (mainHeader) {
        window.addEventListener('scroll', () => {
            // Si el scroll vertical es mayor a 50px, añade la clase. Si no, la quita.
            if (window.scrollY > 50) {
                mainHeader.classList.add('header-scrolled');
            } else {
                mainHeader.classList.remove('header-scrolled');
            }
        });
    }


    /**
     * ------------------------------------------------
     * 3. BANNER DE COOKIES
     * ------------------------------------------------
     * Muestra un banner de cookies y guarda la preferencia del usuario
     * en el almacenamiento local del navegador para no volver a mostrarlo.
     */
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const rejectBtn = document.getElementById('cookie-reject-btn');

    if (cookieBanner && acceptBtn && rejectBtn) {

        // Comprueba si el usuario ya ha dado su consentimiento previamente
        const cookieConsent = localStorage.getItem('cookieConsent');

        // Si no hay registro del consentimiento, muestra el banner
        if (!cookieConsent) {
            cookieBanner.classList.add('is-visible');
        }

        // Función para ocultar el banner
        const hideCookieBanner = () => {
            cookieBanner.classList.remove('is-visible');
        };

        // Al hacer clic en "Aceptar"
        acceptBtn.addEventListener('click', () => {
            // Guarda la preferencia en localStorage
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
            // Aquí podrías añadir la lógica para activar las cookies de seguimiento
        });

        // Al hacer clic en "Rechazar"
        rejectBtn.addEventListener('click', () => {
            // Guarda la preferencia en localStorage
            localStorage.setItem('cookieConsent', 'rejected');
            hideCookieBanner();
            // Aquí te aseguras de que las cookies no esenciales no se carguen
        });
    }

    /**
     * ------------------------------------------------
     * 4. FILTRADO DE EQUIPOS (PÁGINA DE EQUIPOS)
     * ------------------------------------------------
     * Encapsula la lógica de filtrado para que sea reutilizable.
     */
    const setupTeamFiltering = (filterContainerId, teamsContainerId) => {
        const filterButtons = document.querySelectorAll(`#${filterContainerId} .tab-button`);
        const teamEntries = document.querySelectorAll(`#${teamsContainerId} .team-entry`);

        if (filterButtons.length > 0 && teamEntries.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Gestionar la clase 'active' en los botones
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');

                    const category = this.getAttribute('data-category');

                    // Mostrar u ocultar equipos
                    teamEntries.forEach(entry => {
                        const entryCategory = entry.getAttribute('data-category');
                        if (category === 'all' || entryCategory === category) {
                            entry.classList.remove('hidden');
                        } else {
                            entry.classList.add('hidden');
                        }
                    });
                });
            });
        }
    };

    // Inicializar filtrado para equipos de pista
    setupTeamFiltering('team-filters', 'teams-container');

    // Inicializar filtrado para equipos de playa
    setupTeamFiltering('beach-team-filters', 'beach-teams-container');

    /**
     * ------------------------------------------------
     * 5. GESTIÓN DE VISTAS (PÁGINA DE EQUIPOS)
     * ------------------------------------------------
     * Muestra la vista correcta ('Pista' or 'Playa') basado en el parámetro URL.
     */
    const handleTeamView = () => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') || 'pista'; // Default to 'pista'

        const pistaView = document.getElementById('pista-view');
        const playaView = document.getElementById('playa-view');

        if (pistaView && playaView) {
            if (view === 'playa') {
                pistaView.classList.remove('active');
                playaView.classList.add('active');
            } else {
                pistaView.classList.add('active');
                playaView.classList.remove('active');
            }
        }
    };

    // Si estamos en la página de equipos, gestionar la vista
    if (document.getElementById('pista-view') || document.getElementById('playa-view')) {
        handleTeamView();
    }

    /**
     * ------------------------------------------------
     * 6. DROPDOWN DEL MENÚ DE NAVEGACIÓN
     * ------------------------------------------------
     * Controla el menú desplegable de 'Equipos' para que se abra al hacer clic.
     */
    const dropdown = document.querySelector('.nav-list .dropdown');
    if (dropdown) {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

        dropdownToggle.addEventListener('click', (event) => {
            // No prevenir la navegación en móvil, solo en escritorio
            if (window.innerWidth > 992) {
                event.preventDefault();
            }
            dropdown.classList.toggle('is-open');
        });

        // Cerrar el dropdown si se hace clic fuera de él
        window.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('is-open');
            }
        });
    }

    /**
     * ------------------------------------------------
     * 7. BOTÓN DE SCROLL-TO-TOP
     * ------------------------------------------------
     * Muestra un botón para volver al inicio de la página al hacer scroll.
     */
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('is-visible');
            } else {
                scrollToTopBtn.classList.remove('is-visible');
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * ------------------------------------------------
     * 8. STAGGERED GRID ANIMATION
     * ------------------------------------------------
     * Anima la aparición de los elementos en una parrilla cuando entran en el viewport.
     */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gridItems = entry.target.querySelectorAll('.player-card, .staff-card');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, index * 75); // 75ms de retraso entre cada elemento
                });
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, observerOptions);

    const gridsToAnimate = document.querySelectorAll('.player-grid, .staff-grid');
    if (gridsToAnimate.length > 0) {
        gridsToAnimate.forEach(grid => {
            observer.observe(grid);
        });
    }
});
