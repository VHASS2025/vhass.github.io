/* ============================================
   VHASS - Blog Filter & Search JavaScript
   Category filtering + search functionality
   ============================================ */

(function() {
    'use strict';

    // Get DOM elements
    const filterButtons = document.querySelectorAll('.filter-section .filter-btn');
    const searchInput = document.getElementById('blogSearch');
    const blogGrid = document.getElementById('blogGrid');
    const workCards = document.querySelectorAll('.blog-card');
    const emptyState = document.getElementById('emptyState');
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');

    // State
    let currentCategory = 'all';
    let currentSearch = '';

    // Check if elements exist
    if (!workCards.length) {
        console.warn('No work cards found');
        return;
    }

    // Set total count
    if (totalCountEl) {
        totalCountEl.textContent = workCards.length;
    }

    /* ============================================
       CATEGORY FILTER
       ============================================ */
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected category
            currentCategory = this.dataset.category;
            
            // Apply filters
            applyFilters();
        });
    });

    /* ============================================
       SEARCH FUNCTIONALITY
       ============================================ */
    if (searchInput) {
        // Debounce search input
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                currentSearch = this.value.toLowerCase().trim();
                applyFilters();
            }, 300);
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                currentSearch = '';
                applyFilters();
            }
        });
    }

    /* ============================================
       APPLY FILTERS
       ============================================ */
    function applyFilters() {
        let visibleCount = 0;

        workCards.forEach((card, index) => {
            const category = card.dataset.category;
            const title = (card.dataset.title || '').toLowerCase();
            const description = (card.dataset.description || '').toLowerCase();

            // Check category match
            const categoryMatch = currentCategory === 'all' || category === currentCategory;

            // Check search match (search in title and description)
            const searchMatch = !currentSearch || 
                                title.includes(currentSearch) || 
                                description.includes(currentSearch);

            // Determine if card should be visible
            const shouldShow = categoryMatch && searchMatch;

            // Animate card visibility
            if (shouldShow) {
                showCard(card, index);
                visibleCount++;
            } else {
                hideCard(card);
            }
        });

        // Update visible count
        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }

        // Show/hide empty state
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
                blogGrid.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                blogGrid.style.display = 'grid';
            }
        }
    }

    /* ============================================
       SHOW CARD WITH ANIMATION
       ============================================ */
    function showCard(card, index) {
        card.classList.remove('fade-out');
        card.style.display = 'flex';
        
        // Trigger reflow for animation
        void card.offsetWidth;
        
        // Add staggered delay for smooth appearance
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 50);
    }

    /* ============================================
       HIDE CARD WITH ANIMATION
       ============================================ */
    function hideCard(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
        
        // Hide after animation completes
        setTimeout(() => {
            if (card.classList.contains('fade-out')) {
                card.style.display = 'none';
            }
        }, 300);
    }

    /* ============================================
       CLEAR FILTERS
       ============================================ */
    function clearFilters() {
        // Reset category
        currentCategory = 'all';
        filterButtons.forEach(btn => {
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Reset search
        if (searchInput) {
            searchInput.value = '';
            currentSearch = '';
        }

        // Apply filters
        applyFilters();
    }

    /* ============================================
       KEYBOARD SHORTCUTS
       ============================================ */
    document.addEventListener('keydown', function(e) {
        // Alt + C = Clear filters
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            clearFilters();
        }

        // Alt + F = Focus search
        if (e.altKey && e.key === 'f' && searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    /* ============================================
       URL PARAMETERS (OPTIONAL)
       ============================================ */
    function initFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Get category from URL
        const urlCategory = params.get('category');
        if (urlCategory) {
            currentCategory = urlCategory;
            filterButtons.forEach(btn => {
                if (btn.dataset.category === urlCategory) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Get search from URL
        const urlSearch = params.get('search');
        if (urlSearch && searchInput) {
            searchInput.value = urlSearch;
            currentSearch = urlSearch.toLowerCase().trim();
        }

        // Apply filters if URL has parameters
        if (urlCategory || urlSearch) {
            applyFilters();
        }
    }

    /* ============================================
       UPDATE URL (OPTIONAL)
       ============================================ */
    function updateURL() {
        const params = new URLSearchParams();
        
        if (currentCategory !== 'all') {
            params.set('category', currentCategory);
        }
        
        if (currentSearch) {
            params.set('search', currentSearch);
        }

        const newURL = params.toString() ? 
                       `?${params.toString()}` : 
                       window.location.pathname;
        
        history.replaceState(null, '', newURL);
    }

    /* ============================================
       INITIALIZE
       ============================================ */
    function init() {
        // Initialize from URL parameters
        initFromURL();
        
        // Show all cards initially
        if (!window.location.search) {
            applyFilters();
        }
        
        console.log('✓ Blog filter initialized');
    }

    // Initialize on load
    init();

    /* ============================================
       EXPORT TO GLOBAL SCOPE (OPTIONAL)
       ============================================ */
    window.VHASSBlogFilter = {
        applyFilters,
        clearFilters,
        setCategory: (category) => {
            currentCategory = category;
            applyFilters();
        },
        setSearch: (search) => {
            currentSearch = search.toLowerCase().trim();
            if (searchInput) searchInput.value = search;
            applyFilters();
        }
    };

})();
