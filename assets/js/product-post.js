/* ================= PRODUCT PREVIEW SLIDER (DESKTOP ONLY) ================= */

const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (!isMobile) {
    const slides = document.querySelectorAll('.preview-slide');
    const glow = document.querySelector('.preview-glow');
    const nextBtn = document.querySelector('.nav.next');
    const prevBtn = document.querySelector('.nav.prev');

    let index = 0;

    function showSlide(i) {
        slides.forEach((slide, n) => {
            slide.classList.toggle('active', n === i);
        });

        if (glow) {
            glow.style.opacity = '1';
            setTimeout(() => glow.style.opacity = '0.7', 120);
        }
    }

    nextBtn?.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });

    prevBtn?.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });

    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 6500);

    /* Parallax (desktop only) */
    window.addEventListener('scroll', () => {
        const active = document.querySelector('.preview-slide.active');
        if (!active) return;

        const rect = active.getBoundingClientRect();
        active.style.transform =
            `scale(1) translateY(${rect.top * 0.12}px)`;
    });
}

/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(
    '.detail-item, .usecase-grid div, .product-details p, .usecase-intro'
);

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});
