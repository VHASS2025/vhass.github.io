/* ============================================
   VHASS - Works Filter & Search JavaScript
   Category filtering + search functionality
   ============================================ */

(function() {
    'use strict';

    // Get DOM elements
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('worksSearch');
    const worksGrid = document.getElementById('worksGrid');
    const workCards = Array.from(document.querySelectorAll('.work-card'));
    const emptyState = document.getElementById('emptyState');
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');

    // State
    let currentCategory = 'all';
    let currentSort = 'newest';
    let currentSearch = '';

    // Set total count
    if (totalCountEl) totalCountEl.textContent = workCards.length;

    /* ============================================
       CATEGORY FILTER
       ============================================ */
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentCategory = this.value;
            applyFiltersAndSort();
        });
    }

    /* ============================================
       SORT FUNCTIONALITY
       ============================================ */
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentSort = this.value;
            applyFiltersAndSort();
        });
    }

    /* ============================================
       SEARCH FUNCTIONALITY
       ============================================ */
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearch = this.value.toLowerCase().trim();
                applyFiltersAndSort();
            }, 300);
        });
    }

    /* ============================================
       APPLY FILTERS AND SORT
       ============================================ */
    function applyFiltersAndSort() {
        // Filter cards
        let filteredCards = workCards.filter(card => {
            const category = card.dataset.category;
            const title = (card.dataset.title || '').toLowerCase();
            const description = (card.dataset.description || '').toLowerCase();

            const categoryMatch = currentCategory === 'all' || category === currentCategory;
            const searchMatch = !currentSearch || title.includes(currentSearch) || description.includes(currentSearch);

            return categoryMatch && searchMatch;
        });

        // Sort cards
        filteredCards.sort((a, b) => {
            switch(currentSort) {
                case 'newest':
                    return new Date(b.dataset.date || '2024-01-01') - new Date(a.dataset.date || '2024-01-01');
                case 'oldest':
                    return new Date(a.dataset.date || '2024-01-01') - new Date(b.dataset.date || '2024-01-01');
                case 'title-asc':
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '');
                case 'title-desc':
                    return (b.dataset.title || '').localeCompare(a.dataset.title || '');
                default:
                    return 0;
            }
        });

        // Hide all cards first
        workCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        });

        // Show filtered and sorted cards
        filteredCards.forEach((card, index) => {
            card.style.display = 'flex';
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50);
            worksGrid.appendChild(card); // Re-append in sorted order
        });

        // Update count
        if (visibleCountEl) visibleCountEl.textContent = filteredCards.length;

        // Empty state
        if (emptyState) {
            emptyState.style.display = filteredCards.length === 0 ? 'block' : 'none';
        }
    }

    // Initialize
    applyFiltersAndSort();
    console.log('✓ Works filter initialized');

})();