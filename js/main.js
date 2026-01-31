/*
Header visibility controller
Shows/hides fixed header based on scroll position
 */
(function() {
    'use strict';

    const header = document.querySelector('.header');
    const trigger = document.querySelector('.header__trigger');
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

    function onScroll() {
        if (!window.ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderVisibility();
                window.ticking = false;
            });
            window.ticking = true;
        }
    }

    // Initialize
    if (header && trigger) {
        window.addEventListener('scroll', onScroll, { passive: true });
        header.classList.add('visible');

        // Show header on hover
        trigger.addEventListener('mouseenter', function() {
            header.classList.add('visible');
        });

        header.addEventListener('mouseenter', function() {
            header.classList.add('visible');
        });
    }
})();

/*
Modal form handler
Header Controller
*/
(function() {
    'use strict';

    // Hedder controller
    const header = document.querySelector('.header');
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

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateHeaderVisibility);
    }, { passive: true });

    // Form logic
    document.addEventListener("DOMContentLoaded", () => {
        // Searching for buttons by current class
        const openBtns = document.querySelectorAll('.header__btn--cta');
        let modalContainer = document.getElementById('modal-container');

        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }

        openBtns.forEach(openBtn => {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();

                if (!modalContainer.innerHTML) {
                    modalContainer.innerHTML = `
                        <div class="modal-wrapper">
                            <form id="project-request-form" class="contact-form">
                                <button type="button" class="contact-form__close">&times;</button>
                                <label>Имя *: <input type="text" name="name" placeholder="Ваше имя" required></label>
                                <label>Телефон *: <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required></label>
                                <label>E-mail: <input type="email" name="email" placeholder="example@mail.com"></label>
                                <label>Суть заявки *: <textarea name="message" placeholder="Опишите суть заявки" required></textarea></label>
                                <button type="submit">Отправить</button>
                            </form>
                        </div>
                    `;

                    const form = modalContainer.querySelector('.contact-form');

                    // Backend connection
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const payload = {
                            name: form.name.value.trim(),
                            phone: form.phone.value.trim(),
                            email: form.email.value.trim(),
                            message: form.message.value.trim()
                        };

                        try {
                            // Check out README.md before deploy on server (PORT 8000)
                            const response = await fetch('http://127.0.0.1:8000/send', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(payload)
                            });
                            const data = await response.json();

                            if (data.ok) {
                                alert("Заявка отправлена!");
                                form.reset();
                                closeModal();
                            } else {
                                alert("Ошибка отправки, попробуйте позже");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Ошибка отправки, попробуйте позже");
                        }
                    });
                }

                openModal();
            });
        });

        function openModal() {
            modalContainer.style.display = 'flex';
            const form = modalContainer.querySelector('.contact-form');
            setTimeout(() => form.classList.add('show'), 10);
            
            // Attaching the closing handler (once when creating or opening)
            modalContainer.querySelectorAll('.contact-form__close').forEach(btn => {
                btn.onclick = closeModal;
            });
            modalContainer.onclick = (e) => { if (e.target === modalContainer) closeModal(); };
        }

        function closeModal() {
            const form = modalContainer.querySelector('.contact-form');
            if (form) form.classList.remove('show');
            setTimeout(() => { modalContainer.style.display = 'none'; }, 400);
        }
    });
})();