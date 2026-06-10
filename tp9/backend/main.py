from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ARRAY
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
import logging

# basic logging for debugging and production insights
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger(__name__)

try:
    import mercadopago
except Exception:
    mercadopago = None


SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://postgres:postgres@localhost:5432/tp7")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UsuarioDB(Base):
    __tablename__ = "usuarios_db"

    id       = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  
    rol      = Column(String, nullable=False)   


class ParticipanteDB(Base):
    __tablename__ = "participantes"

    id              = Column(Integer, primary_key=True, index=True)
    nombre          = Column(String, nullable=False)
    email           = Column(String, nullable=False)
    edad            = Column(Integer, nullable=False)
    pais            = Column(String, nullable=False)
    modalidad       = Column(String, nullable=False)
    tecnologias     = Column(ARRAY(String), default=[])
    nivel           = Column(String, nullable=False)
    acepta_terminos = Column(Boolean, default=False)


Base.metadata.create_all(bind=engine)



class LoginRequest(BaseModel):
    usuario: str
    password: str

class TokenResponse(BaseModel):
    token: str
    rol: str

class ParticipanteCreate(BaseModel):
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str] = []
    nivel: str
    aceptaTerminos: bool

class ParticipanteResponse(BaseModel):
    id: int
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool

    @classmethod
    def from_orm_custom(cls, obj):
        return cls(
            id=obj.id,
            nombre=obj.nombre,
            email=obj.email,
            edad=obj.edad,
            pais=obj.pais,
            modalidad=obj.modalidad,
            tecnologias=obj.tecnologias or [],
            nivel=obj.nivel,
            aceptaTerminos=obj.acepta_terminos,
        )


app = FastAPI(title="Registro de Eventos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def crear_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload 
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")


def seed_usuarios():
    try:
        db = SessionLocal()
        print(">>> COUNT:", db.query(UsuarioDB).count())
        if db.query(UsuarioDB).count() == 0:
            usuarios = [
                UsuarioDB(username="admin", password=pwd_context.hash("admin123"), rol="ADMIN"),
                UsuarioDB(username="cliente", password=pwd_context.hash("cliente123"), rol="CONSULTA"),
            ]
            db.add_all(usuarios)
            db.commit()
            print(">>> Usuarios creados OK")
        db.close()
    except Exception as e:
        print(">>> ERROR en seed:", e)

seed_usuarios()

@app.post("/login", response_model=TokenResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(UsuarioDB).filter(UsuarioDB.username == datos.usuario).first()

    if not usuario or not pwd_context.verify(datos.password, usuario.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = crear_token({"sub": usuario.username, "rol": usuario.rol})
    return { "token": token, "rol": usuario.rol }


@app.get("/participantes", response_model=List[ParticipanteResponse])
def obtener_participantes(
    db: Session = Depends(get_db),
    payload = Depends(verificar_token)  
):
    return [ParticipanteResponse.from_orm_custom(p) for p in db.query(ParticipanteDB).all()]


@app.post("/participantes", response_model=ParticipanteResponse, status_code=201)
def crear_participante(
    datos: ParticipanteCreate,
    db: Session = Depends(get_db),
    payload = Depends(verificar_token)   
):
    if payload["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede crear participantes")

    nuevo = ParticipanteDB(
        nombre=datos.nombre, email=datos.email, edad=datos.edad,
        pais=datos.pais, modalidad=datos.modalidad, tecnologias=datos.tecnologias,
        nivel=datos.nivel, acepta_terminos=datos.aceptaTerminos,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return ParticipanteResponse.from_orm_custom(nuevo)


@app.put("/participantes/{id}", response_model=ParticipanteResponse)
def actualizar_participante(
    id: int,
    datos: ParticipanteCreate,
    db: Session = Depends(get_db),
    payload = Depends(verificar_token)   
):
    if payload["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede editar participantes")

    participante = db.query(ParticipanteDB).filter(ParticipanteDB.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")

    participante.nombre          = datos.nombre
    participante.email           = datos.email
    participante.edad            = datos.edad
    participante.pais            = datos.pais
    participante.modalidad       = datos.modalidad
    participante.tecnologias     = datos.tecnologias
    participante.nivel           = datos.nivel
    participante.acepta_terminos = datos.aceptaTerminos

    db.commit()
    db.refresh(participante)
    return ParticipanteResponse.from_orm_custom(participante)


@app.delete("/participantes/{id}", status_code=204)
def eliminar_participante(
    id: int,
    db: Session = Depends(get_db),
    payload = Depends(verificar_token)   
):
    if payload["rol"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Solo ADMIN puede eliminar participantes")

    participante = db.query(ParticipanteDB).filter(ParticipanteDB.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")

    db.delete(participante)
    db.commit()


# Mercado Pago integration - create a Checkout Pro preference
@app.post("/create_preference")
def create_preference(data: dict):
    if mercadopago is None:
        raise HTTPException(status_code=500, detail="mercadopago SDK no instalado")

    access_token = os.getenv("MP_ACCESS_TOKEN")
    if not access_token:
        raise HTTPException(status_code=500, detail="MP_ACCESS_TOKEN no configurado en el servidor")

    mp = mercadopago.SDK(access_token)

    title = data.get("title", "Curso")
    price = float(data.get("price", 0))

    ngrok_url = os.getenv("NGROK_URL", "http://localhost:8000")
    preference_data = {
        "items": [
            {
                "title": title,
                "quantity": 1,
                "unit_price": price,
            }
        ],
        "back_urls": {
            "success": f"{ngrok_url}/redirect/success",
            "failure": f"{ngrok_url}/redirect/failure",
            "pending": f"{ngrok_url}/redirect/pending",
        },
        "notification_url": os.getenv("MP_WEBHOOK_URL", ""),
        "auto_return": "approved",
    }

    preference = mp.preference().create(preference_data)
    status_code = preference.get("status")
    resp = preference.get("response", {})
    init_point = resp.get("init_point")

    logger.info("Mercado Pago preference status=%s id=%s", status_code, resp.get("id"))
    logger.debug("Mercado Pago preference full response: %s", resp)

    if status_code not in (200, 201) or not init_point:
        error_detail = resp.get("message") or resp.get("error") or "No se pudo crear la preferencia de pago"
        logger.error("Fallo al crear preferencia Mercado Pago: %s", error_detail)
        raise HTTPException(status_code=500, detail=error_detail)

    return {"init_point": init_point, "preference_id": resp.get("id")}


@app.get("/redirect/{status}")
def redirect_after_pago(status: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return RedirectResponse(url=f"{frontend_url}/?pago={status}")


@app.post("/webhook")
async def webhook(request: Request):
    try:
        body = {}
        if request.headers.get("content-type", "").startswith("application/json"):
            body = await request.json()
        logger.info("Webhook MP recibido: %s", body)
        return {"status": "ok"}
    except Exception as e:
        logger.exception("Error procesando webhook MP")
        return {"status": "error", "reason": str(e)}