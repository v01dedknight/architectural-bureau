import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Загрузка переменных
load_dotenv()

TARGET_EMAIL = os.getenv("TARGET_EMAIL")
MAIL_RU_PASSWORD = os.getenv("MAIL_RU_PASSWORD")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель данных для валидации (FastAPI сам проверит поля)
class FeedbackForm(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: str

@app.post("/send")
def send_message(data: FeedbackForm):
    """
    Убрали async, чтобы smtplib не блокировал сервер.
    FastAPI выполнит эту функцию в отдельном потоке (threadpool).
    """
    
    if not TARGET_EMAIL or not MAIL_RU_PASSWORD:
        print("Ошибка: Не настроены переменные окружения (.env)")
        raise HTTPException(status_code=500, detail="Server config error")

    # Формируем письмо
    subject = f"SITE: Заявка от {data.name}"
    body = f"""
    <html>
      <body style="font-family: sans-serif;">
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> {data.name}</p>
        <p><strong>Телефон:</strong> {data.phone}</p>
        <p><strong>Email:</strong> {data.email or 'не указан'}</p>
        <p><strong>Сообщение:</strong></p>
        <div style="border-left: 4px solid #333; padding-left: 10px;">{data.message}</div>
      </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = TARGET_EMAIL
    msg['To'] = TARGET_EMAIL
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        print(f"Попытка отправки письма на {TARGET_EMAIL}...")
        
        # Настройка тайм-аута, чтобы не ждать вечно
        with smtplib.SMTP_SSL('smtp.mail.ru', 465, timeout=10) as server:
            server.login(TARGET_EMAIL, MAIL_RU_PASSWORD)
            server.send_message(msg)
            
        print("Письмо успешно отправлено!")
        return {"ok": True}

    except smtplib.SMTPAuthenticationError:
        print("Ошибка: Неверный логин или пароль (нужен пароль для приложений!)")
        return {"ok": False, "error": "Auth error"}
    except Exception as e:
        print(f"Ошибка при отправке: {type(e).__name__}: {e}")
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    # Запуск
    uvicorn.run(app, host="127.0.0.1", port=8000)