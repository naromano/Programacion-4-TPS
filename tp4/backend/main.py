from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ARRAY
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import os

# ─── Base de datos ──────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Nicolasxd22@localhost:5432/registro_eventos"
)

engine = create_engine("postgresql://postgres:Nicolasxd22@localhost:5432/registro_eventos")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Modelo ORM ─────────────────────────────────────────────────────────────────
class ParticipanteDB(Base):
    __tablename__ = "participantes"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String, nullable=False)
    email       = Column(String, nullable=False)
    edad        = Column(Integer, nullable=False)
    pais        = Column(String, nullable=False)
    modalidad   = Column(String, nullable=False)
    tecnologias = Column(ARRAY(String), default=[])
    nivel       = Column(String, nullable=False)
    acepta_terminos = Column(Boolean, default=False)


# Crear tablas al arrancar
Base.metadata.create_all(bind=engine)


# ─── Schemas Pydantic ────────────────────────────────────────────────────────────
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

    class Config:
        from_attributes = True
# ─── App ─────────────────────────────────────────────────────────────────────────
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


# ─── Endpoints ───────────────────────────────────────────────────────────────────
from fastapi import Depends

@app.get("/participantes", response_model=List[ParticipanteResponse])
def obtener_participantes(db: Session = Depends(get_db)):
    participantes = db.query(ParticipanteDB).all()
    return [ParticipanteResponse.from_orm_custom(p) for p in participantes]

@app.post("/participantes", response_model=ParticipanteResponse, status_code=201)
def crear_participante(datos: ParticipanteCreate, db: Session = Depends(get_db)):
    nuevo = ParticipanteDB(
        nombre=datos.nombre,
        email=datos.email,
        edad=datos.edad,
        pais=datos.pais,
        modalidad=datos.modalidad,
        tecnologias=datos.tecnologias,
        nivel=datos.nivel,
        acepta_terminos=datos.aceptaTerminos,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return ParticipanteResponse.from_orm_custom(nuevo)


@app.delete("/participantes/{id}", status_code=204)
def eliminar_participante(id: int, db: Session = Depends(get_db)):
    """DELETE /participantes/{id} — Elimina un participante por ID"""
    participante = db.query(ParticipanteDB).filter(ParticipanteDB.id == id).first()
    if not participante:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    db.delete(participante)
    db.commit()
