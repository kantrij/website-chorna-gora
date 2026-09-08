// ==============================
// Перша галерея
// ==============================

const photosFirst = document.querySelectorAll(".gallery-first img");
const lightboxFirst = document.getElementById("lightboxFirst");
const lightboxImageFirst = document.getElementById("lightboxImageFirst");
const closeButtonFirst = document.getElementById("lightboxCloseFirst");
const prevButtonFirst = document.getElementById("lightboxPrevFirst");
const nextButtonFirst = document.getElementById("lightboxNextFirst");
const counterFirst = document.getElementById("lightboxCounterFirst");

let currentIndexFirst = 0;

function openGalleryFirst(index) {
    currentIndexFirst = index;

    lightboxImageFirst.src = photosFirst[currentIndexFirst].src;
    lightboxImageFirst.alt = photosFirst[currentIndexFirst].alt;

    counterFirst.textContent =
        `${currentIndexFirst + 1} / ${photosFirst.length}`;

    lightboxFirst.classList.add("active");
}

photosFirst.forEach((photo, index) => {
    photo.addEventListener("click", () => {
        openGalleryFirst(index);
    });
});

closeButtonFirst.addEventListener("click", () => {
    lightboxFirst.classList.remove("active");
});

nextButtonFirst.addEventListener("click", () => {
    currentIndexFirst++;

    if (currentIndexFirst >= photosFirst.length) {
        currentIndexFirst = 0;
    }

    openGalleryFirst(currentIndexFirst);
});

prevButtonFirst.addEventListener("click", () => {
    currentIndexFirst--;

    if (currentIndexFirst < 0) {
        currentIndexFirst = photosFirst.length - 1;
    }

    openGalleryFirst(currentIndexFirst);
});

lightboxFirst.addEventListener("click", (event) => {
    if (event.target === lightboxFirst) {
        lightboxFirst.classList.remove("active");
    }
});


// ==============================
// Друга галерея
// ==============================

const photosSecond = document.querySelectorAll(".gallery-second img");
const lightboxSecond = document.getElementById("lightboxSecond");
const lightboxImageSecond = document.getElementById("lightboxImageSecond");
const closeButtonSecond = document.getElementById("lightboxCloseSecond");
const prevButtonSecond = document.getElementById("lightboxPrevSecond");
const nextButtonSecond = document.getElementById("lightboxNextSecond");
const counterSecond = document.getElementById("lightboxCounterSecond");

let currentIndexSecond = 0;

function openGallerySecond(index) {
    currentIndexSecond = index;

    lightboxImageSecond.src = photosSecond[currentIndexSecond].src;
    lightboxImageSecond.alt = photosSecond[currentIndexSecond].alt;

    counterSecond.textContent =
        `${currentIndexSecond + 1} / ${photosSecond.length}`;

    lightboxSecond.classList.add("active");
}

photosSecond.forEach((photo, index) => {
    photo.addEventListener("click", () => {
        openGallerySecond(index);
    });
});

closeButtonSecond.addEventListener("click", () => {
    lightboxSecond.classList.remove("active");
});

nextButtonSecond.addEventListener("click", () => {
    currentIndexSecond++;

    if (currentIndexSecond >= photosSecond.length) {
        currentIndexSecond = 0;
    }

    openGallerySecond(currentIndexSecond);
});

prevButtonSecond.addEventListener("click", () => {
    currentIndexSecond--;

    if (currentIndexSecond < 0) {
        currentIndexSecond = photosSecond.length - 1;
    }

    openGallerySecond(currentIndexSecond);
});

lightboxSecond.addEventListener("click", (event) => {
    if (event.target === lightboxSecond) {
        lightboxSecond.classList.remove("active");
    }
});


// ==============================
// Клавіатура
// ==============================

document.addEventListener("keydown", (event) => {

    if (lightboxFirst.classList.contains("active")) {

        if (event.key === "Escape") {
            lightboxFirst.classList.remove("active");
        }

        if (event.key === "ArrowRight") {
            nextButtonFirst.click();
        }

        if (event.key === "ArrowLeft") {
            prevButtonFirst.click();
        }
    }

    if (lightboxSecond.classList.contains("active")) {

        if (event.key === "Escape") {
            lightboxSecond.classList.remove("active");
        }

        if (event.key === "ArrowRight") {
            nextButtonSecond.click();
        }

        if (event.key === "ArrowLeft") {
            prevButtonSecond.click();
        }
    }
});


// ==============================
// Свайп першої галереї
// ==============================

let touchStartXFirst = 0;

lightboxFirst.addEventListener("touchstart", (event) => {
    touchStartXFirst = event.changedTouches[0].screenX;
}, { passive: true });

lightboxFirst.addEventListener("touchend", (event) => {

    const touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartXFirst;

    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    if (swipeDistance < 0) {
        nextButtonFirst.click();
    } else {
        prevButtonFirst.click();
    }
});


// ==============================
// Свайп другої галереї
// ==============================

let touchStartXSecond = 0;

lightboxSecond.addEventListener("touchstart", (event) => {
    touchStartXSecond = event.changedTouches[0].screenX;
}, { passive: true });

lightboxSecond.addEventListener("touchend", (event) => {

    const touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartXSecond;

    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    if (swipeDistance < 0) {
        nextButtonSecond.click();
    } else {
        prevButtonSecond.click();
    }
});