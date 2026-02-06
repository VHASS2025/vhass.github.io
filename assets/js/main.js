/* ============================================
   VHASS - Main JavaScript
   Navigation, Menu, Smooth Scroll, Active Links
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       NAVIGATION SCROLL BEHAVIOR
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.site-header');
  const scrollThreshold = 100;

  if (!navbar) {
    console.error('Navbar element not found');
    return;
  }

  function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollTop = scrollTop;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
});

    /* ============================================
       MOBILE MENU TOGGLE
       ============================================ */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navbar.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ============================================
       ACTIVE NAVIGATION LINK
       ============================================ */
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

/* ============================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================ */

const navbar = document.querySelector('.navbar');

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight -
            20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});


    /* ============================================
       LAZY LOADING IMAGES
       ============================================ */
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }

    /* ============================================
       YOUTUBE VIDEO LAZY LOADING
       ============================================ */
    function setupYouTubeLazyLoad() {
        const videoContainers = document.querySelectorAll('.youtube-embed');
        
        videoContainers.forEach(container => {
            const videoId = container.dataset.videoId;
            if (!videoId) return;
            
            // Create thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            thumbnail.alt = 'Video thumbnail';
            thumbnail.className = 'youtube-thumbnail';
            
            // Create play button
            const playButton = document.createElement('div');
            playButton.className = 'youtube-play-button';
            playButton.innerHTML = `
                <svg width="68" height="48" viewBox="0 0 68 48">
                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
            `;
            
            container.appendChild(thumbnail);
            container.appendChild(playButton);
            
            // Load video on click
            container.addEventListener('click', function() {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                
                container.innerHTML = '';
                container.appendChild(iframe);
            });
        });
    }

    setupYouTubeLazyLoad();

    /* ============================================
       BACK TO TOP BUTTON
       ============================================ */
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(button);
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
        
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Uncomment to enable back to top button
    // createBackToTopButton();

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /* ============================================
       FORM VALIDATION (IF NEEDED)
       ============================================ */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }

    // Export utility functions to global scope
    window.VHASS = {
        debounce,
        throttle,
        isInViewport,
        validateEmail,
        validatePhone
    };

    /* ============================================
       ACCESSIBILITY ENHANCEMENTS
       ============================================ */

    // Keyboard navigation for menu
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            const focusableElements = navMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Escape') {
                menuToggle.click();
                menuToggle.focus();
            }

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /* ============================================
       CONSOLE LOG - DEVELOPMENT
       ============================================ */
    console.log('%c VHASS Website Loaded ', 'background: #0071CE; color: #fff; padding: 5px 10px; font-weight: bold;');
    console.log('Versatile Hardware and Software Solutions');

})();
