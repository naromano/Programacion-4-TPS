# TP N°4 — Programación 4 | UTN FRM
## Registro de Eventos — Backend FastAPI + PostgreSQL

---

## Estructura del proyecto

```
tp4/
├── backend/
│   ├── main.py            ← API REST con FastAPI
│   ├── requirements.txt   ← Dependencias Python
│   └── .env.example       ← Plantilla de variables de entorno
└── frontend/
    └── src/
        ├── context/
        │   └── ParticipantesContext.tsx   ← Context API + llamadas a la API
        ├── components/
        │   ├── Formulario.tsx             ← Usa useParticipantes()
        │   ├── Filtros.tsx
        │   └── ParticipanteCard.tsx
        ├── models/
        │   └── Participante.ts
        ├── App.tsx
        └── main.tsx                       ← Wrappea con <ParticipantesProvider>
```

---

## 1. Configurar PostgreSQL

Abrí pgAdmin o psql y ejecutá:

```sql
CREATE DATABASE registro_eventos;
```

La tabla `participantes` se crea **automáticamente** al levantar el backend (SQLAlchemy hace el CREATE TABLE solo).

---

## 2. Levantar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env       # Windows
# cp .env.example .env       # Linux/Mac
# Editá .env y ponés tu contraseña de PostgreSQL

# Levantar el servidor
uvicorn main:app --reload
```

El backend queda en: **http://localhost:8000**  
Documentación automática: **http://localhost:8000/docs**

---

## 3. Actualizar el Frontend

Copiá los archivos de la carpeta `frontend/src/` a tu proyecto React existente, reemplazando los originales.

```bash
cd registro-eventos   # tu carpeta del proyecto React
npm install           # por si falta algo
npm run dev
```

El frontend queda en: **http://localhost:5173**

---

## Endpoints de la API

| Método | Ruta                    | Descripción                        |
|--------|-------------------------|------------------------------------|
| GET    | `/participantes`        | Retorna lista completa en JSON     |
| POST   | `/participantes`        | Crea un nuevo participante         |
| DELETE | `/participantes/{id}`   | Elimina participante por ID        |

---

## Cambios realizados respecto al TP anterior

| Archivo                        | Cambio                                               |
|-------------------------------|------------------------------------------------------|
| `main.tsx`                    | Wrappea App con `<ParticipantesProvider>`            |
| `context/ParticipantesContext.tsx` | **NUEVO** — Context + fetch a la API            |
| `models/Participante.ts`      | De clase a interface (id lo asigna la BD)            |
| `App.tsx`                     | Usa `useParticipantes()`, eliminado localStorage     |
| `components/Formulario.tsx`   | Ya no recibe props — consume contexto directamente   |
| `components/ParticipanteCard.tsx` | Actualizado el tipo de Participante              |
| `components/Filtros.tsx`      | Sin cambios (ya estaba bien)                         |
