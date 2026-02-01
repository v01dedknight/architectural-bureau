# Rowelltz Arch – Официальный сайт архитектурного бюро

[Посетить официальный сайт](https://rowelltz-arch.ru/)

![Python](https://img.shields.io/badge/python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.101.0-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Официальный сайт архитектурного бюро Rowelltz Arch. Минималистичный, современный и интерактивный веб-ресурс, демонстрирующий портфолио бюро и предоставляющий удобные способы связи с командой.

---

## Основные страницы

### Главная (index.html) – презентация бюро, ключевые услуги, миссия и контактная информация.
### Портфолио (portfolio.html) – галерея реализованных проектов с упором на визуальное качество и детали.

---

## Технологии

- HTML5 / CSS3 – семантическая и адаптивная верстка.
- JavaScript (ES6+) – интерактивные элементы, модальные формы, анимации.
- FastAPI + Uvicorn – backend для обработки заявок с формы и отправки сообщений в Telegram.
- Nginx – reverse proxy, HTTPS, кэширование и безопасность.
- Python + HTTPX + dotenv – асинхронная интеграция с Telegram API.

---

## Особенности проекта

- Адаптивный дизайн: корректная работа на десктопах, планшетах и мобильных устройствах.
- Оптимизация скорости: изображения и скрипты минимизированы для быстрой загрузки.
- Интерактивные элементы: плавные анимации, модальные формы и динамическое отображение контента.
- Автономный backend: сервер работает как служба systemd, принимает заявки даже без активной ssh-сессии.
- Безопасность: CORS настроен корректно, HTTPS через nginx, токены и секреты хранятся в .env.

---

## Установка и локальный запуск

1. Клонируйте репозиторий:
``` bash
git clone https://github.com/v01dedknight/architectural-bureau.git
cd rowelltz-arch
```

2. Создайте виртуальное окружение и установите зависимости:
``` bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Создайте .env с токеном бота и chat_id:
``` css
BOT_TOKEN=<ваш_telegram_bot_token>
CHAT_ID=<ваш_chat_id>
```

4. Запустите сервер локально:

``` bash
python server.py
```

Откройте *http://127.0.0.1:8000* в браузере, чтобы протестировать формы.

---

## Продакшен

- Backend работает через systemd unit (rowelltz-api.service) и nginx проксирует /api/send на FastAPI.
- HTTPS обеспечен сертификатом Let’s Encrypt.
- Все заявки с сайта отправляются напрямую в Telegram через защищённый backend.
- Полная мобильная адаптация: сайт удобно использовать на смартфонах и планшетах.

----

## Структура проекта

``` text
html/
├─ css/
│  ├─ main.css
│  └─ portfolio.css
├─ js/
│  ├─ main.js
│  └─ portfolio.js
├─ projects/
│  ├─ 0.jpg
│  ├─ ...
│  └─ 15.jpg
├─ .env
├─ index.html
├─ portfolio.html
├─ README.md
├─ requirements.txt
├─ server.py
└─ uvicorn
```