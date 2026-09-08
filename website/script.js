const photos = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

const counter = document.getElementById("lightbox-counter");

let currentIndex = 0;

function openGallery(index) {
    currentIndex = index;

    lightboxImage.src = photos[currentIndex].src;
    lightboxImage.alt = photos[currentIndex].alt;

    counter.textContent = `${currentIndex + 1} / ${photos.length}`;

    lightbox.classList.add("active");
}

photos.forEach((photo, index) => {
    photo.addEventListener("click", () => {
        openGallery(index);
    });
});

closeButton.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }
});

nextButton.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= photos.length) {
        currentIndex = 0;
    }

    openGallery(currentIndex);
});

prevButton.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = photos.length - 1;
    }

    openGallery(currentIndex);
});

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }

    if (event.key === "ArrowRight") {
        nextButton.click();
    }

    if (event.key === "ArrowLeft") {
        prevButton.click();
    }
});

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

lightbox.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    
    if (Math.abs(swipeDistance) < 50) {
        return;
    }

   
    if (swipeDistance < 0) {
        nextPhoto();
    }

   
    if (swipeDistance > 0) {
        previousPhoto();
    }
}

// Друга галерея

const photosSecond = document.querySelectorAll(".gallery-second img");
const lightboxSecond = document.getElementById("lightboxSecond");

const lightboxImageSecond =
    document.getElementById("lightboxImageSecond");

const closeButtonSecond =
    document.getElementById("lightboxCloseSecond");

const prevButtonSecond =
    document.getElementById("lightboxPrevSecond");

const nextButtonSecond =
    document.getElementById("lightboxNextSecond");

const counterSecond =
    document.getElementById("lightboxCounterSecond");

let currentIndexSecond = 0;

function openGallerySecond(index) {
    currentIndexSecond = index;

    lightboxImageSecond.src =
        photosSecond[currentIndexSecond].src;

    lightboxImageSecond.alt =
        photosSecond[currentIndexSecond].alt;

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




document.addEventListener("keydown", (event) => {
    if (!lightboxSecond.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        lightboxSecond.classList.remove("active");
    }

    if (event.key === "ArrowRight") {
        nextButtonSecond.click();
    }

    if (event.key === "ArrowLeft") {
        prevButtonSecond.click();
    }
});




let touchStartXSecond = 0;

lightboxSecond.addEventListener("touchstart", (event) => {
    touchStartXSecond = event.changedTouches[0].screenX;
}, { passive: true });

lightboxSecond.addEventListener("touchend", (event) => {
    const touchEndXSecond =
        event.changedTouches[0].screenX;

    const swipeDistance =
        touchEndXSecond - touchStartXSecond;

    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    if (swipeDistance < 0) {
        nextButtonSecond.click();
    } else {
        prevButtonSecond.click();
    }
});