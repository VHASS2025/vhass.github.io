/* ============================================
   VHASS - Blog JavaScript
   Category filtering, sorting, and search
   ============================================ */

(function() {
    'use strict';

    let allBlogPosts = [];
    let currentCategory = 'all';
    let currentSort = 'date';

    /* ============================================
       BLOG FILTER INITIALIZATION
       ============================================ */
    function initBlogFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');

        if (filterButtons.length === 0 || blogCards.length === 0) return;

        // Store all blog posts
        allBlogPosts = Array.from(blogCards).map(card => {
            return {
                element: card,
                category: card.dataset.category || 'all',
                date: card.dataset.date || '',
                title: card.querySelector('.blog-title')?.textContent.toLowerCase() || ''
            };
        });

        // Add click event to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get category
                currentCategory = this.dataset.category;
                
                // Filter posts
                filterPosts();
            });
        });
    }

    /* ============================================
       FILTER POSTS
       ============================================ */
    function filterPosts() {
        allBlogPosts.forEach(post => {
            const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
            
            if (matchesCategory) {
                post.element.style.display = 'block';
                // Add fade in animation
                post.element.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                post.element.style.display = 'none';
            }
        });

        // Update result count
        updateResultCount();
    }

    /* ============================================
       SORT POSTS
       ============================================ */
    function initSortFunctionality() {
        const sortSelect = document.getElementById('blogSort');
        if (!sortSelect) return;

        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortPosts();
        });
    }

    function sortPosts() {
        const container = document.querySelector('.blog-grid');
        if (!container) return;

        // Sort the posts array
        allBlogPosts.sort((a, b) => {
            if (currentSort === 'date') {
                // Sort by date (newest first)
                return new Date(b.date) - new Date(a.date);
            } else if (currentSort === 'title') {
                // Sort alphabetically by title
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        // Reorder DOM elements
        allBlogPosts.forEach(post => {
            container.appendChild(post.element);
        });

        // Re-apply filters
        filterPosts();
    }

    /* ============================================
       SEARCH FUNCTIONALITY
       ============================================ */
    function initSearchFunctionality() {
        const searchInput = document.getElementById('blogSearch');
        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                searchPosts(searchTerm);
            }, 300);
        });
    }

    function searchPosts(searchTerm) {
        if (!searchTerm) {
            // If search is empty, show filtered posts
            filterPosts();
            return;
        }

        allBlogPosts.forEach(post => {
            const postTitle = post.title;
            const postExcerpt = post.element.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            const postContent = postTitle + ' ' + postExcerpt;
            
            const matchesSearch = postContent.includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
            
            if (matchesSearch && matchesCategory) {
                post.element.style.display = 'block';
                post.element.style.animation = 'fadeIn 0.5s ease-in';
                
                // Highlight search terms (optional)
                highlightSearchTerm(post.element, searchTerm);
            } else {
                post.element.style.display = 'none';
            }
        });

        updateResultCount();
    }

    /* ============================================
       HIGHLIGHT SEARCH TERM
       ============================================ */
    function highlightSearchTerm(element, term) {
        if (!term) return;

        const title = element.querySelector('.blog-title');
        const excerpt = element.querySelector('.blog-excerpt');

        if (title) {
            const titleText = title.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            title.innerHTML = titleText.replace(regex, '<mark>$1</mark>');
        }

        if (excerpt) {
            const excerptText = excerpt.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            excerpt.innerHTML = excerptText.replace(regex, '<mark>$1</mark>');
        }
    }

    /* ============================================
       UPDATE RESULT COUNT
       ============================================ */
    function updateResultCount() {
        const visiblePosts = allBlogPosts.filter(post => 
            post.element.style.display !== 'none'
        ).length;

        const countElement = document.getElementById('resultCount');
        if (countElement) {
            countElement.textContent = `Showing ${visiblePosts} of ${allBlogPosts.length} posts`;
        }
    }

    /* ============================================
       PAGINATION (OPTIONAL)
       ============================================ */
    function initPagination() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        const postsPerPage = 9;
        let currentPage = 1;

        function showPage(page) {
            currentPage = page;
            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage;

            allBlogPosts.forEach((post, index) => {
                if (index >= start && index < end) {
                    post.element.style.display = 'block';
                } else {
                    post.element.style.display = 'none';
                }
            });

            updatePaginationButtons();
        }

        function updatePaginationButtons() {
            const totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
            const paginationHTML = generatePaginationHTML(currentPage, totalPages);
            paginationContainer.innerHTML = paginationHTML;

            // Add event listeners to pagination buttons
            paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const page = parseInt(this.dataset.page);
                    showPage(page);
                });
            });
        }

        function generatePaginationHTML(current, total) {
            let html = '';
            
            // Previous button
            html += `<button class="page-btn" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>Previous</button>`;
            
            // Page numbers
            for (let i = 1; i <= total; i++) {
                html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            
            // Next button
            html += `<button class="page-btn" data-page="${current + 1}" ${current === total ? 'disabled' : ''}>Next</button>`;
            
            return html;
        }

        // Initialize first page
        showPage(1);
    }

    /* ============================================
       LOAD MORE (ALTERNATIVE TO PAGINATION)
       ============================================ */
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const postsPerLoad = 6;
        let visibleCount = postsPerLoad;

        // Initially hide posts beyond the first set
        allBlogPosts.forEach((post, index) => {
            if (index >= visibleCount) {
                post.element.style.display = 'none';
            }
        });

        loadMoreBtn.addEventListener('click', function() {
            visibleCount += postsPerLoad;
            
            allBlogPosts.forEach((post, index) => {
                if (index < visibleCount) {
                    post.element.style.display = 'block';
                    post.element.style.animation = 'fadeIn 0.5s ease-in';
                }
            });

            // Hide button if all posts are visible
            if (visibleCount >= allBlogPosts.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    /* ============================================
       READING TIME CALCULATOR
       ============================================ */
    function calculateReadingTime() {
        const blogContent = document.querySelector('.blog-post-content');
        if (!blogContent) return;

        const text = blogContent.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);

        const readingTimeElement = document.getElementById('readingTime');
        if (readingTimeElement) {
            readingTimeElement.textContent = `${readingTime} min read`;
        }
    }

    /* ============================================
       SHARE FUNCTIONALITY
       ============================================ */
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('[data-share]');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.dataset.share;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareURL = '';
                
                switch(platform) {
                    case 'twitter':
                        shareURL = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'facebook':
                        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'whatsapp':
                        shareURL = `https://wa.me/?text=${title}%20${url}`;
                        break;
                }
                
                if (shareURL) {
                    window.open(shareURL, '_blank', 'width=600,height=400');
                }
            });
        });

        // Native Web Share API (if available)
        const nativeShareBtn = document.getElementById('nativeShare');
        if (nativeShareBtn && navigator.share) {
            nativeShareBtn.style.display = 'block';
            
            nativeShareBtn.addEventListener('click', async function() {
                try {
                    await navigator.share({
                        title: document.title,
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            });
        }
    }

    /* ============================================
       INITIALIZE
       ============================================ */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runBlog);
        } else {
            runBlog();
        }
    }

    function runBlog() {
        initBlogFilters();
        initSortFunctionality();
        initSearchFunctionality();
        // initPagination(); // Use either pagination OR load more
        initLoadMore();
        calculateReadingTime();
        initShareButtons();
        
        console.log('%c Blog Features Initialized ', 'background: #FF6B35; color: #fff; padding: 3px 8px;');
    }

    // Start initialization
    init();

    /* ============================================
       EXPORT TO GLOBAL SCOPE
       ============================================ */
    window.VHASSBlog = {
        filterPosts,
        sortPosts,
        searchPosts
    };

})();
