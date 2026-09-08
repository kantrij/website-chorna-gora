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