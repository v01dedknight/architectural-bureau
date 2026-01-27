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

// Form
const openBtn = document.getElementById('open-form-btn');
const modalContainer = document.getElementById('modal-container');

// A universal code for opening the form on any page
document.addEventListener("DOMContentLoaded", () => {
    // We find all the buttons that open the form
    const openBtns = document.querySelectorAll('.custom-header__btn--cta');
    
    // We create a container for the modal window if it doesn't already exist
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }

    // We set up an event handler for each button
    openBtns.forEach(openBtn => {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // If the form has not yet been created, create it
            if (!modalContainer.innerHTML) {
                modalContainer.innerHTML = `
                    <div class="modal-wrapper">
                        <form id="project-request-form" class="contact-form">
                            <button type="button" class="contact-form__close">&times;</button>
                            <label>
                                Имя *:
                                <input type="text" name="name" placeholder="Ваше имя" required>
                            </label>
                            <label>
                                Телефон *:
                                <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required>
                            </label>
                            <label>
                                E-mail:
                                <input type="email" name="email" placeholder="example@mail.com">
                            </label>
                            <label>
                                Суть заявки *:
                                <textarea name="message" placeholder="Опишите суть заявки" required></textarea>
                            </label>
                            <button type="submit">Отправить</button>
                        </form>
                        <button type="button" class="contact-form__close">&times;</button>
                    </div>
                `;

                const form = modalContainer.querySelector('.contact-form');

                // Form submission handler
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const name = form.name.value.trim();
                    const phone = form.phone.value.trim();
                    const email = form.email.value.trim();
                    const message = form.message.value.trim();

                    try {
                        const response = await fetch('http://127.0.0.1:8000/send', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ name, phone, email, message })
                        });
                        const data = await response.json();

                        if (data.ok) {
                            alert("Заявка отправлена!");
                            form.reset();
                            form.classList.remove('show');
                            setTimeout(() => modalContainer.style.display = 'none', 400);
                        } else {
                            alert("Ошибка отправки, попробуйте позже");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Ошибка отправки, попробуйте позже");
                    }
                });
            }

            // Displaying the modal window
            modalContainer.style.display = 'flex';
            const form = modalContainer.querySelector('.contact-form');
            setTimeout(() => form.classList.add('show'), 10);

            // Closing the form with a cross icon
            modalContainer.querySelectorAll('.contact-form__close').forEach(btn => {
                btn.addEventListener('click', () => {
                    form.classList.remove('show');
                    setTimeout(() => modalContainer.style.display = 'none', 400);
                });
            });

            // Closing when clicking on the background
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    form.classList.remove('show');
                    setTimeout(() => modalContainer.style.display = 'none', 400);
                }
            }, { once: true });
        });
    });
});