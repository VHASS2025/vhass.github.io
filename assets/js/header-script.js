/* ============================================
   RESPONSIVE HEADER - VANILLA JAVASCRIPT
   Mobile Menu Toggle with Accessibility
   ============================================ */

(function() {
    'use strict';

    // Get DOM elements
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Check if elements exist
    if (!menuToggle || !mainNav) {
        console.error('Menu toggle or navigation not found');
        return;
    }

    /* ============================================
       MOBILE MENU TOGGLE
       ============================================ */
    menuToggle.addEventListener('click', function() {
        toggleMenu();
    });

    function toggleMenu() {
        // Toggle active class on button
        menuToggle.classList.toggle('active');
        
        // Toggle active class on nav
        mainNav.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open', isExpanded);
        
        // Focus management
        if (isExpanded) {
            // Focus first nav link when menu opens
            const firstNavLink = mainNav.querySelector('.nav-link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }
    }

    /* ============================================
       CLOSE MENU WHEN NAV LINK IS CLICKED (MOBILE)
       ============================================ */
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close on mobile (when menu toggle is visible)
            if (window.getComputedStyle(menuToggle).display !== 'none') {
                closeMenu();
            }
            
            // Update active state
            updateActiveLink(this);
        });
    });

    function closeMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    /* ============================================
       UPDATE ACTIVE NAVIGATION LINK
       ============================================ */
    function updateActiveLink(clickedLink) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active');
        clickedLink.setAttribute('aria-current', 'page');
    }

    /* ============================================
       CLOSE MENU ON ESCAPE KEY
       ============================================ */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
            menuToggle.focus(); // Return focus to toggle button
        }
    });

    /* ============================================
       CLOSE MENU WHEN CLICKING OUTSIDE
       ============================================ */
    document.addEventListener('click', function(e) {
        const isClickInsideNav = mainNav.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });

    /* ============================================
       HANDLE WINDOW RESIZE
       ============================================ */
    let resizeTimer;
    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu if window is resized to desktop
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });

    /* ============================================
       KEYBOARD NAVIGATION (TAB TRAP IN MOBILE MENU)
       ============================================ */
    mainNav.addEventListener('keydown', function(e) {
        // Only apply tab trapping on mobile when menu is open
        if (window.innerWidth <= 768 && mainNav.classList.contains('active')) {
            trapTabKey(e);
        }
    });

    function trapTabKey(e) {
        if (e.key !== 'Tab') return;

        const focusableElements = mainNav.querySelectorAll(
            'a[href], button:not([disabled])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    /* ============================================
       INITIALIZE - SET ACTIVE LINK BASED ON CURRENT PAGE
       ============================================ */
    function initializeActiveLink() {
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Initialize on page load
    initializeActiveLink();

    /* ============================================
       CONSOLE MESSAGE
       ============================================ */
    console.log('✓ Responsive header initialized');

})();
