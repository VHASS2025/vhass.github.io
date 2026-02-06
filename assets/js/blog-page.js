/* ============================================
   VHASS BLOG PAGE - FILTER & SEARCH SCRIPT
   ============================================ */

(function() {
    'use strict';

    // DOM Elements
    const categorySelect = document.getElementById('blogCategory');
    const sortSelect = document.getElementById('blogSort');
    const searchInput = document.getElementById('blogSearch');
    const blogGrid = document.getElementById('blogGrid');
    const blogCards = Array.from(document.querySelectorAll('.blog-card'));
    const emptyState = document.getElementById('emptyState');
    const visibleCount = document.getElementById('visibleBlogCount');
    const totalCount = document.getElementById('totalBlogCount');

    // State
    let currentCategory = 'all';
    let currentSort = 'newest';
    let currentSearch = '';

    // Initialize
    if (totalCount) {
        totalCount.textContent = blogCards.length;
    }

    /* ===== CATEGORY FILTER ===== */
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentCategory = this.value;
            applyFiltersAndSort();
        });
    }

    /* ===== SORT ===== */
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            applyFiltersAndSort();
        });
    }

    /* ===== SEARCH ===== */
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

    /* ===== APPLY FILTERS & SORT ===== */
    function applyFiltersAndSort() {
        // Filter
        let filtered = blogCards.filter(card => {
            const category = card.dataset.category;
            const title = (card.dataset.title || '').toLowerCase();
            const excerpt = (card.dataset.excerpt || '').toLowerCase();

            const catMatch = currentCategory === 'all' || category === currentCategory;
            const searchMatch = !currentSearch || 
                               title.includes(currentSearch) || 
                               excerpt.includes(currentSearch);

            return catMatch && searchMatch;
        });

        // Sort
        filtered.sort((a, b) => {
            switch(currentSort) {
                case 'newest':
                    return new Date(b.dataset.date || '2024-01-01') - 
                           new Date(a.dataset.date || '2024-01-01');
                case 'oldest':
                    return new Date(a.dataset.date || '2024-01-01') - 
                           new Date(b.dataset.date || '2024-01-01');
                case 'title-asc':
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '');
                case 'title-desc':
                    return (b.dataset.title || '').localeCompare(a.dataset.title || '');
                default:
                    return 0;
            }
        });

        // Hide all
        blogCards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        });

        // Show filtered & sorted
        filtered.forEach((card, index) => {
            card.style.display = 'flex';
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 30);
            blogGrid.appendChild(card);
        });

        // Update count
        if (visibleCount) {
            visibleCount.textContent = filtered.length;
        }

        // Empty state
        if (emptyState && blogGrid) {
            if (filtered.length === 0) {
                emptyState.style.display = 'block';
                blogGrid.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                blogGrid.style.display = 'grid';
            }
        }
    }

    // Initialize on load
    applyFiltersAndSort();
    console.log('✓ Blog page initialized');

})();
