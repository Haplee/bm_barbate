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
     * Filtra los equipos por categoría al hacer clic en los botones.
     */
    const filterButtons = document.querySelectorAll('#team-filters .tab-button');
    const teamEntries = document.querySelectorAll('#teams-container .team-entry');

    if (filterButtons.length > 0 && teamEntries.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Gestionar la clase 'active' en los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                // Mostrar u ocultar equipos
                teamEntries.forEach(entry => {
                    if (category === 'all' || entry.getAttribute('data-category') === category) {
                        entry.classList.remove('hidden');
                    } else {
                        entry.classList.add('hidden');
                    }
                });
            });
        });
    }
});
