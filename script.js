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
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (hamburgerBtn && mobileDrawer) {
        const toggleDrawer = (forceClose = false) => {
            const isOpen = forceClose ? false : !mobileDrawer.classList.contains('is-open');
            mobileDrawer.classList.toggle('is-open', isOpen);
            hamburgerBtn.classList.toggle('is-active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
            mobileDrawer.setAttribute('aria-hidden', (!isOpen).toString());
        };

        hamburgerBtn.addEventListener('click', () => toggleDrawer());

        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => toggleDrawer(true));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
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
                name: 'Точка 2: Заказник «Чорна Гора»',
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
                        cavePreviewVideo.play().catch(() => {});
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
            cavePreviewVideo.play().catch(() => {});
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

    // --- 5. Unified Photo Lightbox System ---
    const lightbox = document.getElementById('site-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxOverlay = document.getElementById('lightbox-overlay');

    let currentItems = [];
    let currentIndex = 0;

    const openLightbox = (items, index) => {
        currentItems = items;
        currentIndex = index;
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
        lightboxCaption.textContent = item.caption || item.alt || '';
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentItems.length}`;

        // Preload next image
        if (currentItems.length > 1) {
            const nextIdx = (currentIndex + 1) % currentItems.length;
            const preload = new Image();
            preload.src = currentItems[nextIdx].src;
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

    // Attach click handlers to photo galleries
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    galleryGrids.forEach(grid => {
        const items = Array.from(grid.querySelectorAll('.gallery-item')).map(el => {
            const img = el.querySelector('img');
            const desc = el.querySelector('.gallery-desc');
            return {
                src: img ? img.getAttribute('src') : '',
                alt: img ? img.getAttribute('alt') : '',
                caption: desc ? desc.textContent.trim() : (img ? img.alt : '')
            };
        });

        grid.querySelectorAll('.gallery-item').forEach((itemEl, idx) => {
            itemEl.addEventListener('click', () => {
                openLightbox(items, idx);
            });
        });
    });

    // Attach click handlers to zoomable route graphics (Map, Markings, Elevation)
    const zoomableImgs = document.querySelectorAll('.zoomable');
    const zoomableList = Array.from(zoomableImgs).map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        caption: img.getAttribute('alt')
    }));

    zoomableImgs.forEach((imgEl, idx) => {
        imgEl.addEventListener('click', () => {
            openLightbox(zoomableList, idx);
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
