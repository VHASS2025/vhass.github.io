/* ============================================
   VHASS BLOG POST - INTERACTIVE FEATURES
   ============================================ */

(function() {
    'use strict';

    /* ===== SHARE FUNCTIONALITY ===== */
    const shareButtons = document.querySelectorAll('[data-share]');
    const copyNotification = document.getElementById('copyNotification');

    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const shareType = this.dataset.share;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl;
                
                switch(shareType) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${title}&body=Check out this article: ${url}`;
                        break;
                    case 'copy':
                        copyToClipboard(window.location.href);
                        return;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    function showCopyNotification() {
        if (copyNotification) {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
        }
    }

    /* ===== TABLE OF CONTENTS - ACTIVE LINK (FIXED) ===== */
const tocLinks = document.querySelectorAll('.toc-link');
const sections = document.querySelectorAll('.content-main h2[id]');

if (tocLinks.length && sections.length) {
    let currentActiveId = null;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                if (id === currentActiveId) return;

                currentActiveId = id;

                tocLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(
                    `.toc-link[href="#${id}"]`
                );
                if (activeLink) activeLink.classList.add('active');
            });
        },
        {
            root: null,
            rootMargin: '-120px 0px -60% 0px',
            threshold: 0
        }
    );

    sections.forEach(section => observer.observe(section));
}


    /* ===== SMOOTH SCROLL FOR TOC LINKS ===== */
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 100; // Account for sticky header
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===== READING TIME CALCULATION ===== */
    const readTimeElement = document.getElementById('readTime');
    const contentMain = document.querySelector('.content-main');
    
    if (readTimeElement && contentMain) {
        const text = contentMain.textContent || contentMain.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const wordsPerMinute = 200;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        
        readTimeElement.textContent = `${readTime} min read`;
    }

    /* ===== NEWSLETTER FORM ===== */
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would normally send to your newsletter service
            console.log('Newsletter signup:', email);
            
            // Show success message
            alert('Thank you for subscribing! Check your email to confirm.');
            this.reset();
        });
    }

    /* ===== CODE BLOCK COPY (if needed) ===== */
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const header = block.querySelector('.code-header');
        if (header) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
            copyBtn.style.cssText = 'background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0.25rem; display: flex; align-items: center; transition: color 0.2s;';
            
            copyBtn.addEventListener('mouseenter', function() {
                this.style.color = '#ffffff';
            });
            
            copyBtn.addEventListener('mouseleave', function() {
                this.style.color = '#9ca3af';
            });
            
            copyBtn.addEventListener('click', function() {
                const code = block.querySelector('code');
                if (code) {
                    copyToClipboard(code.textContent);
                }
            });
            
            header.appendChild(copyBtn);
        }
    });

    console.log('✓ Blog post initialized');

})();
