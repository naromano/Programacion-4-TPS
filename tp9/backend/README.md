Backend - TP8 / TP9

Instrucciones rápidas para ejecutar el backend localmente (Windows PowerShell):

1. Crear y activar un virtualenv (opcional si ya existe `.venv`):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate
```

2. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

3. Copiar `.env.example` a `.env` y configurar `MERCADOPAGO_ACCESS_TOKEN` y `FRONTEND_BASE_URL`.

4. Ejecutar la API:

```powershell
uvicorn main:app --reload --port 8000
```

Notas:
- El endpoint `/create_preference` devuelve `{"init_point": "...", "preference_id": "..."}` para redirigir al Checkout Pro de Mercado Pago.
- Durante desarrollo se incluyeron logs para depuración. Para producción, ajuste el nivel de logging.
- CORS está abierto (`allow_origins=['*']`) para desarrollo; restringir en producción.
