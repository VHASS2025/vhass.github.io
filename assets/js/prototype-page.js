document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".proto-slider-track");
    const slides = document.querySelectorAll(".proto-slide");
    const nextBtn = document.querySelector(".proto-nav.next");
    const prevBtn = document.querySelector(".proto-nav.prev");

    if (!track || slides.length === 0) return;

    let index = 0;

    function updateSlider() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlider();
    });

    /* Swipe support (mobile) */
    let startX = 0;

    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            index = (index + 1) % slides.length;
        } else if (endX - startX > 50) {
            index = (index - 1 + slides.length) % slides.length;
        }
        updateSlider();
    });
});
