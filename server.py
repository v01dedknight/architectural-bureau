import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from dotenv import load_dotenv

#
#   TO LAUNCH:
#   uvicorn server:app --reload
#

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send")
async def send_message(request: Request):
    try:
        data = await request.json()
        print("Получены данные:", data, flush=True)

        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()

        # Проверка обязательных полей
        if not name or not phone or not message:
            return JSONResponse(
                {"ok": False, "error": "Не заполнены обязательные поля"},
                status_code=400
            )

        # Формирование данных заявки
        application_data = {
            "name": name,
            "phone": phone,
            "email": email,
            "message": message
        }

        # Отправка в сервис другого разработчика
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                "http://localhost:3000/applications",
                json=application_data
            )

        if response.status_code == 201:
            print("Заявка успешно передана")
            return {"ok": True, "status": "forwarded"}
        else:
            print(f"Ошибка передачи заявки: {response.text}")
            return JSONResponse(
                {
                    "ok": False,
                    "error": "Ошибка передачи заявки",
                    "service_response": response.text
                },
                status_code=500
            )

    except Exception as e:
        print(f"Не удалось отправить заявку: {e}")
        return JSONResponse(
            {"ok": False, "error": str(e)},
            status_code=500
        )

# Dev launch
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)