document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    // Header (Плавное появление/скрытие)
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeaderVisibility() {
        if (!header) return;
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
            header.classList.add('visible');
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Скролл вниз - скрывается
            header.classList.remove('visible');
        } else if (currentScrollY < lastScrollY) {
            // Скролл вверх - показывается
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

    // Показывает хедер сразу при загрузке
    if(header) {
        header.classList.add('visible');
    }

    // Триггер для показа хедера при наведении наверх экрана
    const trigger = document.querySelector('.header__trigger');
    if (trigger && header) {
        trigger.addEventListener('mouseenter', function() {
            header.classList.add('visible');
        });
        header.addEventListener('mouseenter', function() {
            header.classList.add('visible');
        });
    }

    // Стрелочка скролла вниз на главном экране
    const scrollBtn = document.querySelector('.hero__scroll');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Form (Модальное окно заявки)
    const openBtn = document.getElementById('open-form-btn');
    let modalContainer = document.getElementById('modal-container');

    if (openBtn && modalContainer) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Если форма ещё не создана внутри контейнера - создаётся
            if (!modalContainer.innerHTML.trim()) {
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
                    </div>
                `;

                const form = modalContainer.querySelector('.contact-form');

                // Обработчик отправки формы на сервер
                form.addEventListener('submit', async (submitEvent) => {
                    submitEvent.preventDefault();

                    const name = form.name.value.trim();
                    const phone = form.phone.value.trim();
                    const email = form.email.value.trim();
                    const message = form.message.value.trim();

                    try {
                        const response = await fetch('/send', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ name, phone, email, message })
                        });
                        const data = await response.json();

                        if (data.ok) {
                            alert("Заявка отправлена!");
                            form.reset();
                            closeModal(form);
                        } else {
                            alert("Ошибка отправки, попробуйте позже");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Ошибка отправки, попробуйте позже");
                    }
                });

                // Обработчики закрытия (крестики и фон)
                modalContainer.querySelectorAll('.contact-form__close').forEach(btn => {
                    btn.addEventListener('click', () => closeModal(form));
                });
                
                modalContainer.addEventListener('click', (clickEvent) => {
                    // Закрывает только если клик был по самому фону (modalContainer), а не внутри формы
                    if (clickEvent.target === modalContainer) {
                        closeModal(form);
                    }
                });
            }

            // Демонстрация формы (работает и при первом создании, и при повторных открытиях)
            modalContainer.style.display = 'flex';
            const formElement = modalContainer.querySelector('.contact-form');
            if (formElement) {
                // Небольшая задержка для срабатывания CSS-анимации появления
                setTimeout(() => formElement.classList.add('show'), 10);
            }
        });
    }

    // Вспомогательная функция для плавного закрытия
    function closeModal(form) {
        if (form) form.classList.remove('show');
        // 400ms должно совпадать со временем transition в CSS
        setTimeout(() => modalContainer.style.display = 'none', 400);
    }

});