/* ============================================
   VHASS - Gallery & Lightbox JavaScript
   Image lightbox, zoom, keyboard & touch navigation
   ============================================ */

(function() {
    'use strict';

    let currentImageIndex = 0;
    let galleryImages = [];

    /* ============================================
       LIGHTBOX INITIALIZATION
       ============================================ */
    function initLightbox() {
        // Get all gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (galleryItems.length === 0) return;

        // Create lightbox if it doesn't exist
        if (!document.getElementById('lightbox')) {
            createLightboxHTML();
        }

        const lightbox = document.getElementById('lightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        // Populate gallery images array
        galleryImages = Array.from(galleryItems).map(item => {
            return {
                src: item.querySelector('img')?.src || item.querySelector('.gallery-image')?.style.backgroundImage,
                alt: item.querySelector('img')?.alt || '',
                caption: item.dataset.caption || ''
            };
        });

        // Add click event to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });

        // Close lightbox
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation
        prevBtn.addEventListener('click', showPreviousImage);
        nextBtn.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next image
                showNextImage();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }

    /* ============================================
       CREATE LIGHTBOX HTML
       ============================================ */
    function createLightboxHTML() {
        const lightboxHTML = `
            <div class="lightbox" id="lightbox">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-prev" aria-label="Previous image">❮</button>
                <button class="lightbox-next" aria-label="Next image">❯</button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    /* ============================================
       OPEN LIGHTBOX
       ============================================ */
    function openLightbox(index) {
        currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');

        // Set image
        const imageData = galleryImages[currentImageIndex];
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        lightboxCaption.textContent = imageData.caption;

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update navigation buttons
        updateNavigationButtons();
    }

    /* ============================================
       CLOSE LIGHTBOX
       ============================================ */
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ============================================
       NAVIGATION FUNCTIONS
       ============================================ */
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');

        const imageData = galleryImages[currentImageIndex];
        
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.alt;
            lightboxCaption.textContent = imageData.caption;
            
            // Fade in
            lightboxImage.style.opacity = '1';
        }, 200);

        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const lightbox = document.getElementById('lightbox');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        // Show/hide buttons based on gallery length
        if (galleryImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    /* ============================================
       KEYBOARD NAVIGATION
       ============================================ */
    function handleKeyboard(e) {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    /* ============================================
       IMAGE ZOOM FUNCTIONALITY
       ============================================ */
    function initImageZoom() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImage = lightbox.querySelector('.lightbox-image');
        let scale = 1;
        let isPanning = false;
        let startX, startY;

        lightboxImage.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            scale += delta;
            scale = Math.min(Math.max(1, scale), 3); // Limit zoom between 1x and 3x
            
            lightboxImage.style.transform = `scale(${scale})`;
            
            // Reset to center if zoomed out to 1x
            if (scale === 1) {
                lightboxImage.style.cursor = 'default';
            } else {
                lightboxImage.style.cursor = 'move';
            }
        }, { passive: false });

        // Pan on drag when zoomed
        lightboxImage.addEventListener('mousedown', function(e) {
            if (scale > 1) {
                isPanning = true;
                startX = e.clientX;
                startY = e.clientY;
                lightboxImage.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (!isPanning) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            lightboxImage.style.transform = `scale(${scale}) translate(${deltaX}px, ${deltaY}px)`;
        });

        document.addEventListener('mouseup', function() {
            if (isPanning) {
                isPanning = false;
                lightboxImage.style.cursor = scale > 1 ? 'move' : 'default';
            }
        });

        // Double-click to zoom
        lightboxImage.addEventListener('dblclick', function(e) {
            if (scale === 1) {
                scale = 2;
                lightboxImage.style.cursor = 'move';
            } else {
                scale = 1;
                lightboxImage.style.cursor = 'default';
            }
            lightboxImage.style.transform = `scale(${scale})`;
        });
    }

    /* ============================================
       MASONRY LAYOUT (OPTIONAL)
       ============================================ */
    function initMasonryLayout() {
        const gallery = document.querySelector('.gallery-grid');
        if (!gallery || !gallery.classList.contains('masonry')) return;

        // Simple masonry layout using CSS Grid
        // Already handled by CSS, but can add dynamic adjustments here if needed
    }

    /* ============================================
       INITIALIZE
       ============================================ */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runGallery);
        } else {
            runGallery();
        }
    }

    function runGallery() {
        initLightbox();
        initImageZoom();
        initMasonryLayout();
        
        console.log('%c Gallery Initialized ', 'background: #00D9FF; color: #000; padding: 3px 8px;');
    }

    // Start initialization
    init();

    /* ============================================
       EXPORT TO GLOBAL SCOPE
       ============================================ */
    window.VHASSGallery = {
        openLightbox,
        closeLightbox,
        showNextImage,
        showPreviousImage
    };

})();
