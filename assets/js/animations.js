/* ============================================
   VHASS - Animations JavaScript
   Scroll Reveal, Intersection Observer
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       SCROLL REVEAL ANIMATION
       ============================================ */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support Intersection Observer
            revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optionally unobserve after revealing
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ============================================
       COUNTER ANIMATION
       ============================================ */
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const element = entry.target;
                    const endValue = parseInt(element.dataset.counter);
                    const duration = parseInt(element.dataset.duration) || 2000;
                    
                    element.classList.add('counted');
                    animateCounter(element, 0, endValue, duration);
                    counterObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /* ============================================
       PARALLAX SCROLL EFFECT
       ============================================ */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const offset = scrolled * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
        }
        
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateParallax);
        }, { passive: true });
    }

    /* ============================================
       STAGGER ANIMATION
       ============================================ */
    function initStaggerAnimation() {
        const staggerGroups = document.querySelectorAll('[data-stagger]');
        
        staggerGroups.forEach(group => {
            const children = group.children;
            const delay = parseInt(group.dataset.staggerDelay) || 100;
            
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * delay}ms`;
            });
        });
    }

    /* ============================================
       HOVER TILT EFFECT
       ============================================ */
    function initTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    /* ============================================
       TEXT ANIMATION - TYPING EFFECT
       ============================================ */
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    function initTypeWriterEffect() {
        const typeElements = document.querySelectorAll('[data-typewriter]');
        
        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                    const element = entry.target;
                    const text = element.dataset.typewriter || element.textContent;
                    const speed = parseInt(element.dataset.speed) || 50;
                    
                    element.classList.add('typed');
                    typeWriter(element, text, speed);
                    typeObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5
        });

        typeElements.forEach(el => typeObserver.observe(el));
    }

    /* ============================================
       PROGRESS BAR ANIMATION
       ============================================ */
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const bar = entry.target;
                    const targetWidth = bar.dataset.progress || '0';
                    
                    bar.classList.add('animated');
                    bar.style.width = targetWidth + '%';
                    progressObserver.unobserve(bar);
                }
            });
        }, {
            threshold: 0.5
        });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    /* ============================================
       MAGNETIC BUTTON EFFECT
       ============================================ */
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-btn');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ============================================
       SCROLL PROGRESS INDICATOR
       ============================================ */
    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    /* ============================================
       CURSOR TRAIL EFFECT
       ============================================ */
    function initCursorTrail() {
        if (!document.querySelector('[data-cursor-trail]')) return;
        
        const trail = [];
        const trailLength = 20;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateTrail() {
            let x = mouseX, y = mouseY;
            
            trail.forEach((dot, index) => {
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
                dot.style.opacity = 1 - (index / trailLength);
                
                const nextDot = trail[index + 1] || trail[0];
                x += (parseInt(nextDot.style.left) - x) * 0.3;
                y += (parseInt(nextDot.style.top) - y) * 0.3;
            });
            
            requestAnimationFrame(animateTrail);
        }
        
        animateTrail();
    }

    /* ============================================
       INITIALIZE ALL ANIMATIONS
       ============================================ */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runAnimations);
        } else {
            runAnimations();
        }
    }

    function runAnimations() {
        initScrollReveal();
        initCounters();
        initParallax();
        initStaggerAnimation();
        initTiltEffect();
        initTypeWriterEffect();
        initProgressBars();
        initMagneticButtons();
        initScrollProgress();
        // initCursorTrail(); // Uncomment if needed
        
        console.log('%c Animations Initialized ', 'background: #00D9FF; color: #000; padding: 3px 8px;');
    }

    // Start initialization
    init();

    /* ============================================
       EXPORT TO GLOBAL SCOPE
       ============================================ */
    window.VHASSAnimations = {
        initScrollReveal,
        initCounters,
        initParallax,
        animateCounter,
        typeWriter
    };

})();
