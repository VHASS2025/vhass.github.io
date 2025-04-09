document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in effect for sections
    gsap.from(".fade-in", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".fade-in",
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    });

    // Continuous scrolling animation
    gsap.to(".scroll-move", {
        y: -100,
        duration: 2,
        ease: "linear",
        repeat: -1,
        scrollTrigger: {
            trigger: ".scroll-move",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Parallax effect
    gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: ".parallax-bg",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});
