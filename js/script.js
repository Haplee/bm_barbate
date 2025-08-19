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

    // Si estamos en la página de equipos, gestionar la vista Y LUEGO renderizar el contenido
    if (document.getElementById('pista-view') || document.getElementById('playa-view')) {
        handleTeamView();
        // La renderización de equipos se llama DESPUÉS de que la vista se haya establecido
        renderTeams();
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
            // Prevenir la navegación en todos los dispositivos para abrir el submenú.
            event.preventDefault();
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

    /**
     * ------------------------------------------------
     * 9. CARGA DINÁMICA DE DATOS
     * ------------------------------------------------
     * Carga los datos de los equipos y del personal desde archivos JSON.
     */

    // Función genérica para obtener datos JSON
    async function fetchData(url) {
        try {
            // Añadir un parámetro de cache-busting a la URL
            const cacheBustingUrl = `${url}?v=${new Date().getTime()}`;
            const response = await fetch(cacheBustingUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Could not fetch data from ${url}:`, error);
            return null;
        }
    }

    // Función para crear una tarjeta de jugador
    function createPlayerCard(player) {
        // Sanitizar el nombre para evitar problemas de XSS.
        const playerName = player.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const playerImage = player.image ? player.image : 'https://via.placeholder.com/150';
        return `
            <div class="player-card">
                <img src="${playerImage}" alt="Foto de ${playerName}" loading="lazy">
                <h4>${playerName}</h4>
            </div>
        `;
    }

    // Función para crear una tarjeta de miembro del staff
    function createStaffCard(staffName, staffData) {
        const sanitizedStaffName = staffName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const rolesList = staffData.roles.map(role => `<li>${role.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join('');
        return `
            <div class="staff-card">
                <img src="https://via.placeholder.com/150" alt="Foto de ${sanitizedStaffName}" loading="lazy">
                <h4>${sanitizedStaffName}</h4>
                <div class="staff-hover-info">
                    <h5>Equipos y Roles</h5>
                    <ul>${rolesList}</ul>
                </div>
            </div>
        `;
    }

    // Función para renderizar los equipos y los filtros dinámicamente
    async function renderTeams() {
        const teamsData = await fetchData('data/teams.json');
        if (!teamsData) return;

        const pistaContainer = document.getElementById('teams-container');
        const pistaFilterContainer = document.getElementById('team-filters');
        const playaContainer = document.getElementById('beach-teams-container');
        const playaFilterContainer = document.getElementById('beach-team-filters');

        // Since the data doesn't distinguish between Pista and Playa,
        // we will render all teams in both sections for now.
        // A future improvement would be to add a 'type' field to the JSON data.

        let allTeamsHtml = '';
        const categories = new Set();

        teamsData.forEach(team => {
            // Add category to our set for the filters
            categories.add(JSON.stringify({
                slug: team.category_slug,
                name: team.category_name
            }));

            // Create HTML for each team
            const playersHtml = team.players.map(player => createPlayerCard(player)).join('');
            const coachesHtml = team.coaches.map(coach => `<li>${coach.name} (${coach.role})</li>`).join('');

            allTeamsHtml += `
                <div class="team-entry" data-category="${team.category_slug}">
                    <h3 class="team-name">${team.team_name}</h3>
                    <div class="player-grid">
                        ${playersHtml}
                    </div>
                    ${coachesHtml ? `<h4>Cuerpo Técnico</h4><ul>${coachesHtml}</ul>` : ''}
                </div>
            `;
        });

        // Generate filter buttons dynamically
        let filterHtml = '<button class="tab-button active" data-category="all">Todos</button>';
        const parsedCategories = Array.from(categories).map(cat => JSON.parse(cat));
        parsedCategories.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        parsedCategories.forEach(category => {
            filterHtml += `<button class="tab-button" data-category="${category.slug}">${category.name}</button>`;
        });


        // Render Pista teams
        if (pistaContainer && pistaFilterContainer) {
            pistaFilterContainer.innerHTML = filterHtml;
            pistaContainer.innerHTML = allTeamsHtml;
            setupTeamFiltering('team-filters', 'teams-container');
            const newPistaGrids = pistaContainer.querySelectorAll('.player-grid');
            newPistaGrids.forEach(grid => observer.observe(grid));
        }

        // Render Playa teams
        if (playaContainer && playaFilterContainer) {
            playaFilterContainer.innerHTML = filterHtml;
            playaContainer.innerHTML = allTeamsHtml;
            setupTeamFiltering('beach-team-filters', 'beach-teams-container');
            const newPlayaGrids = playaContainer.querySelectorAll('.player-grid');
            newPlayaGrids.forEach(grid => observer.observe(grid));
        }
    }

    // Función para renderizar el cuerpo técnico
    async function renderStaff() {
        const staffData = await fetchData('data/staff.json');
        if (!staffData) return;

        const staffContainer = document.querySelector('#beach-staff-section .staff-grid');
        if (staffContainer) {
            let staffHtml = '';
            for (const staffName in staffData) {
                staffHtml += createStaffCard(staffName, staffData[staffName]);
            }
            staffContainer.innerHTML = staffHtml;
            // Re-inicializar las animaciones para el contenido dinámico
            observer.observe(staffContainer);
        }
    }

    // Cargar datos según la página actual
    // La llamada a renderTeams() ha sido movida para que se ejecute después de handleTeamView()
    if (document.getElementById('staff-list')) {
        renderStaff();
    }

    /**
     * ------------------------------------------------
     * 10. THEME TOGGLE (DARK/LIGHT MODE)
     * ------------------------------------------------
     * Permite al usuario cambiar entre el tema claro y oscuro.
     * La preferencia se guarda en localStorage.
     */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    if (themeToggleBtn) {
        // Al cargar la página, comprueba la preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }

        // Añade el listener al botón
        themeToggleBtn.addEventListener('click', () => {
            // Alterna la clase en el body
            body.classList.toggle('dark-mode');

            // Guarda la preferencia actual en localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /**
     * ------------------------------------------------
     * 11. NEWS CAROUSEL (SWIPER.JS)
     * ------------------------------------------------
     * Inicializa el carrusel de noticias en la página de inicio.
     */
    const newsCarousel = document.querySelector('.news-carousel');
    if (newsCarousel) {
        const swiper = new Swiper(newsCarousel, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // when window width is >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40
                }
            }
        });
    }

    /**
     * ------------------------------------------------
     * 12. EXIT-INTENT POP-UP
     * ------------------------------------------------
     * Muestra un pop-up cuando el usuario intenta salir de la página.
     */
    const exitPopup = document.getElementById('exit-intent-popup');
    const closePopupBtn = document.getElementById('exit-popup-close');
    const popupForm = document.getElementById('exit-popup-form');

    if (exitPopup && closePopupBtn && popupForm) {
        const showExitPopup = () => {
            if (sessionStorage.getItem('exitPopupShown')) {
                return;
            }
            exitPopup.classList.add('is-visible');
            sessionStorage.setItem('exitPopupShown', 'true');
        };

        const hideExitPopup = () => {
            exitPopup.classList.remove('is-visible');
        };

        // Mostrar al salir del viewport por la parte superior
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0) {
                showExitPopup();
            }
        });

        // Cerrar con el botón
        closePopupBtn.addEventListener('click', hideExitPopup);

        // Cerrar al enviar el formulario
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aquí se podría añadir la lógica para enviar el email a un servicio
            hideExitPopup();
        });
    }

    /**
     * ------------------------------------------------
     * 13. SCROLL-BASED FADE-IN ANIMATIONS
     * ------------------------------------------------
     * Anima elementos para que aparezcan cuando entran en el viewport.
     */
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const elementsToFadeIn = document.querySelectorAll('h2, .footer-section, #club-info p');
    elementsToFadeIn.forEach(el => {
        el.classList.add('fade-in-up'); // Prepare elements for animation
        fadeInObserver.observe(el);
    });
});
