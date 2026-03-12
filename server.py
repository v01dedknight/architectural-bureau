import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Загрузка переменных из .env
load_dotenv()

# Конфигурация из переменных окружения
TARGET_EMAIL = os.getenv("TARGET_EMAIL")
MAIL_RU_PASSWORD = os.getenv("MAIL_RU_PASSWORD")

# Инициализация FastAPI
app = FastAPI()

# Разрешается CORS для всех источников (можно сузить при необходимости)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Отправка письма с данными из формы
@app.post("/send")
async def send_message(request: Request):
    try:
        data = await request.json()
        print(f"Заявка получена для: {TARGET_EMAIL}", flush=True)

        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()
        email_client = data.get("email", "").strip()
        message_text = data.get("message", "").strip()

        if not name or not phone or not message_text:
            return JSONResponse({"ok": False, "error": "Поля не заполнены"}, status_code=400)

        # Формировка письма
        subject = f"SITE: Заявка от {name}"
        body = f"""
        <html>
          <body style="font-family: sans-serif; line-height: 1.6;">
            <h2 style="background: #333; color: #fff; padding: 10px;">Новая заявка с сайта</h2>
            <p><strong>Имя:</strong> {name}</p>
            <p><strong>Телефон:</strong> {phone}</p>
            <p><strong>Email:</strong> {email_client if email_client else 'не указан'}</p>
            <p><strong>Сообщение:</strong></p>
            <div style="border-left: 4px solid #333; padding-left: 10px; font-style: italic;">
                {message_text}
            </div>
          </body>
        </html>
        """

        msg = MIMEMultipart()
        msg['From'] = TARGET_EMAIL
        msg['To'] = TARGET_EMAIL
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        # Отправка на почту
        try:
            with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
                server.login(TARGET_EMAIL, MAIL_RU_PASSWORD)
                server.send_message(msg)
            return {"ok": True}
            
        except smtplib.SMTPException as e:
            print(f"SMTP Error: {e}", flush=True)
            return JSONResponse({"ok": False, "error": "Email error"}, status_code=500)

    except Exception as e:
        print(f"Server Error: {e}", flush=True)
        return JSONResponse({"ok": False, "error": "Server error"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    # Получение хоста и порта из переменных окружения с дефолтными значениями
    host = os.getenv("SERVER_HOST", "127.0.0.1")
    port = int(os.getenv("SERVER_PORT", 8000))
    
    print(f"Запуск сервера на http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=True)