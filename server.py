import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from dotenv import load_dotenv


#
#   TO LOUNCH, PRINT IT IN CONSOLE    --->    uvicorn server:app --reload
#


# We are loading the token and chat ID from the .env file
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

app = FastAPI()

# We are enabling CORS for all domains (it can be restricted to specific ones)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send")
async def send_message(request: Request):
    # We are retrieving data from the request
    data = await request.json()
    print("Получены данные:", data)
    
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    # Checking required fields
    if not name or not phone or not message:
        return JSONResponse({"ok": False, "error": "Не заполнены обязательные поля"}, status_code=400)

    # We are creating text for Telegram
    text = f"Новая заявка:\nИмя: {name}\nТелефон: {phone}\n"
    if email:
        text += f"E-mail: {email}\n"
    text += f"Суть заявки: {message}"

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text}

    # Asynchronous POST request to Telegram
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            resp_json = resp.json()
            if not resp_json.get("ok"):
                return JSONResponse(
                    {"ok": False, "error": resp_json.get("description", "Unknown error")},
                    status_code=500
                )
            return {"ok": True, "result": resp_json}
        except httpx.RequestError as e:
            return JSONResponse({"ok": False, "error": str(e)}, status_code=500)
        except httpx.HTTPStatusError as e:
            return JSONResponse({"ok": False, "error": str(e)}, status_code=500)

# Launching the server for development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=5000, reload=True)