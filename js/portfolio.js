// All functions
(function() {
    'use strict';

    /**
     * Utilities for working with the DOM
     */
    function t_onReady(func) {
        if (document.readyState !== 'loading') {
            func();
        } else {
            document.addEventListener('DOMContentLoaded', func);
        }
    }

    function t_onFuncLoad(funcName, okFunc, time) {
        if (typeof window[funcName] === 'function') {
            okFunc();
        } else {
            setTimeout(function() {
                t_onFuncLoad(funcName, okFunc, time);
            }, (time || 100));
        }
    }

    /**
     * Animation of elements appearing when scrolling.
     */
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.portfolio-animate');

        if (animateElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('portfolio-animate_visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }

    /**
     * Project filtering
     */
    function initPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.portfolio-filters__item');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length === 0 || portfolioItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Updating the active state of the buttons.
                filterButtons.forEach(btn => btn.classList.remove('portfolio-filters__item_active'));
                this.classList.add('portfolio-filters__item_active');

                // We are filtering the portfolio items.
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    /**
     * All modules are initialized when the page loads.
     */
    function init() {
        initScrollAnimations();
        initPortfolioFilters();
    }

    // We start the initialization when the DOM is ready.
    t_onReady(init);

})();

// Header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.custom-header');
    const trigger = document.querySelector('.custom-header__trigger');
    let lastScrollY = window.scrollY;

    function updateHeaderVisibility() {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
            header.classList.add('visible');
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
            header.classList.remove('visible');
        } else if (currentScrollY < lastScrollY) {
            header.classList.add('visible');
        }

        lastScrollY = currentScrollY;
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    trigger.addEventListener('mouseenter', function() {
        header.classList.add('visible');
    });

    header.addEventListener('mouseenter', function() {
        header.classList.add('visible');
    });

    header.classList.add('visible');
});