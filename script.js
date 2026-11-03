/**
 * ЗАГАДКА ЧОРНОЇ ГОРИ — APPLICATION SCRIPTS
 * 1. Mobile navigation drawer toggle
 * 2. Sticky header scroll effect
 * 3. Interactive Leaflet.js Trail Map
 * 4. Cave Video: IntersectionObserver scroll autoplay & fullscreen modal on click
 * 5. Unified, responsive photo lightbox with swipe & keyboard support
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sticky Header ---
    const siteHeader = document.getElementById('site-header');
    const onScroll = () => {
        if (window.scrollY > 30) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- 2. Mobile Drawer Navigation ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (hamburgerBtn && mobileDrawer) {
        const toggleDrawer = (forceClose = false) => {
            const isCurrentlyOpen = mobileDrawer.classList.contains('is-open') || mobileDrawer.classList.contains('active');
            const openState = forceClose ? false : !isCurrentlyOpen;

            mobileDrawer.classList.toggle('is-open', openState);
            mobileDrawer.classList.toggle('active', openState);
            hamburgerBtn.classList.toggle('is-active', openState);
            hamburgerBtn.classList.toggle('active', openState);
            hamburgerBtn.setAttribute('aria-expanded', openState.toString());
            mobileDrawer.setAttribute('aria-hidden', (!openState).toString());

            // Prevent background scrolling while mobile drawer is open
            document.body.style.overflow = openState ? 'hidden' : '';
        };

        // Open/Close toggle on hamburger button click
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDrawer();
        });

        // Automatically close when clicking any anchor/nav link inside the drawer
        const drawerLinks = mobileDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleDrawer(true);
            });
        });

        // Close when clicking outside of the drawer
        document.addEventListener('click', (e) => {
            if (mobileDrawer.classList.contains('is-open') || mobileDrawer.classList.contains('active')) {
                if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    toggleDrawer(true);
                }
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && (mobileDrawer.classList.contains('is-open') || mobileDrawer.classList.contains('active'))) {
                toggleDrawer(true);
            }
        });
    }

    // --- 3. Interactive Leaflet Map ---
    const initRouteMap = () => {
        const mapContainer = document.getElementById('route-map');
        if (!mapContainer || typeof L === 'undefined') return;

        const map = L.map('route-map', {
            center: [48.1436, 23.0485],
            zoom: 14,
            scrollWheelZoom: false
        });

        // Clean OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
        }).addTo(map);

        // Minimalist circular marker generator
        const createMarker = (symbol, color) => {
            return L.divIcon({
                className: 'custom-trail-marker',
                html: `
                    <div style="
                        background: ${color};
                        color: #121c17;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        box-shadow: 0 3px 12px rgba(0,0,0,0.45);
                        border: 2px solid #ffffff;
                    ">${symbol}</div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16]
            });
        };

        const waypoints = [
            {
                name: 'Точка 1: Замок «Канків»',
                desc: 'Руїни замку XIII–XV ст. Початок пішохідного маршруту.',
                coords: [48.140833, 23.039167],
                symbol: '🏰',
                color: '#e5a93b',
                link: '#castle'
            },
            {
                name: 'Точка 2: Заказник «Чорна гора»',
                desc: 'Вулканічні схили та реліктові дубові ліси (508 м).',
                coords: [48.146944, 23.058333],
                symbol: '🌳',
                color: '#2ecc71',
                link: '#reserve'
            },
            {
                name: 'Точка 3: Печера «Морське око»',
                desc: 'Рукотворна скельна печера завдовжки 30 м з незмінним рівнем води.',
                coords: [48.143611, 23.051944],
                symbol: '🕳️',
                color: '#3498db',
                link: '#cave'
            }
        ];

        waypoints.forEach(pt => {
            const marker = L.marker(pt.coords, {
                icon: createMarker(pt.symbol, pt.color)
            }).addTo(map);

            const popupHtml = `
                <div class="map-popup-card">
                    <h4>${pt.name}</h4>
                    <p>${pt.desc}</p>
                    <a href="${pt.link}">Читати далі →</a>
                </div>
            `;
            marker.bindPopup(popupHtml);
        });

        // Hiking Trail Path
        const trailCoordinates = [
            [48.139450, 23.035200],
            [48.140200, 23.037100],
            [48.140833, 23.039167], // Castle
            [48.141900, 23.042300],
            [48.143100, 23.046500],
            [48.144800, 23.051200],
            [48.146200, 23.055500],
            [48.146944, 23.058333], // Reserve Peak
            [48.145800, 23.056000],
            [48.144700, 23.053800],
            [48.143611, 23.051944], // Cave
            [48.142200, 23.047500],
            [48.140700, 23.041000],
            [48.139450, 23.035200]
        ];

        L.polyline(trailCoordinates, {
            color: '#e5a93b',
            weight: 3.5,
            opacity: 0.9,
            dashArray: '6, 6',
            lineJoin: 'round'
        }).addTo(map);
    };

    initRouteMap();

    // --- 4. Cave Video: Native HTML5 Background Loop & Fullscreen 4K Lightbox ---
    const caveVideoTrigger = document.getElementById('cave-video-trigger');
    const cavePreviewVideo = document.getElementById('cave-preview-video');
    const videoLightbox = document.getElementById('video-lightbox');
    const modalYoutubeIframe = document.getElementById('modal-youtube-iframe');
    const videoLightboxClose = document.getElementById('video-lightbox-close');
    const videoLightboxOverlay = document.getElementById('video-lightbox-overlay');

    const YOUTUBE_MODAL_URL = 'https://www.youtube-nocookie.com/embed/zCry8ZBFiYk?autoplay=1&mute=0&controls=1&rel=0&playsinline=1';

    let isVideoInView = false;

    // Autoplay inline preview when scrolled into view, pause when out of view
    if (cavePreviewVideo && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVideoInView = entry.isIntersecting;
                if (entry.isIntersecting) {
                    if (!videoLightbox || !videoLightbox.classList.contains('active')) {
                        cavePreviewVideo.play().catch(() => { });
                    }
                } else {
                    cavePreviewVideo.pause();
                }
            });
        }, { threshold: 0.2 });

        videoObserver.observe(caveVideoTrigger || cavePreviewVideo);
    }

    const openVideoModal = () => {
        if (!videoLightbox || !modalYoutubeIframe) return;

        // Pause muted background video loop
        if (cavePreviewVideo) {
            cavePreviewVideo.pause();
        }

        // Open full 4K YouTube video with sound and controls
        modalYoutubeIframe.src = YOUTUBE_MODAL_URL;
        videoLightbox.classList.add('active');
        videoLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        if (!videoLightbox || !modalYoutubeIframe) return;

        // Reset src to stop playback and audio immediately
        modalYoutubeIframe.src = '';
        videoLightbox.classList.remove('active');
        videoLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Resume silent background loop if in view
        if (isVideoInView && cavePreviewVideo) {
            cavePreviewVideo.play().catch(() => { });
        }
    };

    if (caveVideoTrigger) {
        caveVideoTrigger.addEventListener('click', openVideoModal);
        caveVideoTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVideoModal();
            }
        });
    }

    if (videoLightboxClose) videoLightboxClose.addEventListener('click', closeVideoModal);
    if (videoLightboxOverlay) videoLightboxOverlay.addEventListener('click', closeVideoModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoLightbox && videoLightbox.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // --- 5. Unified Photo Lightbox System (Grouped Section Galleries) ---
    const lightbox = document.getElementById('site-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxOverlay = document.getElementById('lightbox-overlay');

    // Full photo collections for each section
    const sectionGalleries = {
        castle: [
            {
                src: 'images/замок/замок з висоти.webp',
                alt: 'Севлюшський замок «Канків» з висоти пташиного польоту',
                caption: 'Севлюшський замок «Канків» з висоти пташиного польоту'
            },
            {
                src: 'images/замок/зпроектований уявний вигляд замку.webp',
                alt: 'Архітектурна реконструкція укріплень замку',
                caption: 'Архітектурна реконструкція укріплень замку'
            },
            {
                src: 'images/замок/архівне фото замку.webp',
                alt: 'Архівне фото замку «Канків»',
                caption: 'Архівне фото замку «Канків»'
            },
            {
                src: 'images/замок/архівне фото замку2.webp',
                alt: 'Історичний вигляд замкових мурів',
                caption: 'Історичний вигляд замкових мурів'
            },
            {
                src: 'images/замок/ескіз уявного вигляду замку.webp',
                alt: 'Ескіз уявного первісного вигляду замку',
                caption: 'Ескіз уявного первісного вигляду замку'
            },
            {
                src: 'images/замок/Візуалізація.webp',
                alt: 'Візуалізація реконструкції замку «Канків»',
                caption: 'Візуалізація реконструкції замку «Канків»'
            },
            {
                src: 'images/замок/Капличка.webp',
                alt: 'Замкова капличка',
                caption: 'Замкова капличка'
            }
        ],
        reserve: [
            {
                src: 'images/заказник/Chorna_Hora_(Wynohradiw).webp',
                alt: 'Ботанічний заказник «Чорна гора» та панорама міста',
                caption: 'Ботанічний заказник «Чорна гора»'
            },
            {
                src: 'images/заказник/Відслонення виходу вулканічних порід - андезити, ліпарити, туфи.webp',
                alt: 'Скельні виходи вулканічних порід (андезити, ліпарити, туфи)',
                caption: 'Скельні виходи вулканічних порід (андезити, ліпарити, туфи)'
            },
            {
                src: 'images/заказник/Шафран банатського.webp',
                alt: 'Шафран банатський (Crocus banaticus)',
                caption: 'Шафран банатський'
            },
            {
                src: 'images/заказник/Білоцвіт весняний.webp',
                alt: 'Білоцвіт весняний (Leucojum vernum)',
                caption: 'Білоцвіт весняний'
            },
            {
                src: 'images/заказник/Булатка довголиста.webp',
                alt: 'Булатка довголиста (Cephalanthera longifolia)',
                caption: 'Булатка довголиста'
            },
            {
                src: 'images/заказник/Аспленій чорний.webp',
                alt: 'Аспленій чорний (Asplenium adiantum-nigrum)',
                caption: 'Аспленій чорний'
            },
            {
                src: 'images/заказник/Гніздівка звичайна.webp',
                alt: 'Гніздівка звичайна (Neottia nidus-avis)',
                caption: 'Гніздівка звичайна'
            },
            {
                src: 'images/заказник/Сугайник угорський.webp',
                alt: 'Сугайник угорський (Doronicum hungaricum)',
                caption: 'Сугайник угорський'
            }
        ],
        cave: [
            {
                src: 'images/печера/p1.webp',
                alt: 'Вхід до скельної печери «Морське око»',
                caption: 'Вхід до скельної печери «Морське око»'
            },
            {
                src: 'images/печера/p2.webp',
                alt: 'Підземна водойма в печері «Морське око»',
                caption: 'Підземна водойма в печері «Морське око»'
            },
            {
                src: 'images/печера/p3.webp',
                alt: 'Скельні склепіння підземелля',
                caption: 'Скельні склепіння підземелля'
            },
            {
                src: 'images/печера/p4.webp',
                alt: 'Внутрішній кам’яний коридор печери',
                caption: 'Внутрішній кам’яний коридор печери'
            },
            {
                src: 'images/печера/IMG_6169 1.webp',
                alt: 'Дослідження кам’яних галерей печери',
                caption: 'Дослідження кам’яних галерей печери'
            },
            {
                src: 'images/печера/IMG_6185 1.webp',
                alt: 'Скельний прохід у підземеллі',
                caption: 'Скельний прохід у підземеллі'
            },
            {
                src: 'images/печера/IMG_7290 1.webp',
                alt: 'Таємничі гроти печери',
                caption: 'Таємничі гроти печери'
            },
            {
                src: 'images/печера/IMG_7306 1.webp',
                alt: 'Скельні породи підземного тунелю',
                caption: 'Скельні породи підземного тунелю'
            }
        ],
        route: [
            {
                src: 'images/Маршрут.webp',
                alt: 'Карта маршруту «Загадка Чорної гори»',
                caption: 'Карта маршруту «Загадка Чорної гори»'
            },
            {
                src: 'images/Умовні_позначення.webp',
                alt: 'Умовні позначення маршруту',
                caption: 'Умовні позначення'
            },
            {
                src: 'images/Профіль_висот.webp',
                alt: 'Профіль висот маршруту',
                caption: 'Профіль висот'
            }
        ]
    };

    let currentItems = [];
    let currentIndex = 0;

    const openLightbox = (items, index) => {
        if (!items || items.length === 0) return;
        currentItems = items;
        currentIndex = (index >= 0 && index < items.length) ? index : 0;
        renderLightboxItem();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const renderLightboxItem = () => {
        if (!currentItems || currentItems.length === 0) return;
        const item = currentItems[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt || '';
        if (lightboxCaption) {
            lightboxCaption.textContent = item.caption || item.alt || '';
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentItems.length}`;
        }

        // Preload adjacent images
        if (currentItems.length > 1) {
            const nextIdx = (currentIndex + 1) % currentItems.length;
            const prevIdx = (currentIndex - 1 + currentItems.length) % currentItems.length;
            const preloadNext = new Image();
            preloadNext.src = currentItems[nextIdx].src;
            const preloadPrev = new Image();
            preloadPrev.src = currentItems[prevIdx].src;
        }
    };

    const nextPhoto = () => {
        if (currentItems.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentItems.length;
        renderLightboxItem();
    };

    const prevPhoto = () => {
        if (currentItems.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        renderLightboxItem();
    };

    // Attach click handlers to all editorial grid photos
    const gridPhotos = document.querySelectorAll('.editorial-grid-photo, .editorial-image-frame');
    gridPhotos.forEach(photo => {
        const galleryKey = photo.getAttribute('data-gallery');
        const initialIdx = parseInt(photo.getAttribute('data-index') || '0', 10);
        const galleryItems = sectionGalleries[galleryKey];
        if (galleryItems) {
            photo.setAttribute('role', 'button');
            photo.setAttribute('tabindex', '0');
            photo.addEventListener('click', () => {
                openLightbox(galleryItems, initialIdx);
            });
            photo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(galleryItems, initialIdx);
                }
            });
        }
    });

    // Attach click handlers to route graphic cards (Map, Markings, Elevation)
    const routeGraphicCards = document.querySelectorAll('.route-graphic-card');
    routeGraphicCards.forEach((card, idx) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            openLightbox(sectionGalleries.route, idx);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(sectionGalleries.route, idx);
            }
        });
    });

    // Fallback click handler for any remaining .zoomable elements outside frames
    const zoomableImgs = document.querySelectorAll('.zoomable');
    zoomableImgs.forEach((imgEl, idx) => {
        imgEl.addEventListener('click', (e) => {
            if (imgEl.closest('.editorial-image-frame') || imgEl.closest('.route-graphic-card')) {
                return;
            }
            const fallbackList = Array.from(zoomableImgs).map(img => ({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt'),
                caption: img.getAttribute('alt')
            }));
            openLightbox(fallbackList, idx);
        });
    });

    // Lightbox Event Listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
    });

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
                nextPhoto();
            } else {
                prevPhoto();
            }
        }
    }, { passive: true });
});
