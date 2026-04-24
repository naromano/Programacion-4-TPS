import { createContext, useContext, useEffect, useReducer } from "react";
import type { Participante, ParticipanteNuevo } from "../models/Participante";
import { participantesReducer, initialState } from "./participantesReducer";

const API_URL = "http://127.0.0.1:8000";

interface ContextType {
  participantes: Participante[];
  cargando: boolean;
  error: string | null;
  agregar: (p: ParticipanteNuevo) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  editar: (p: Participante) => Promise<void>;
  editando: Participante | null;
  seleccionar: (p: Participante | null) => void;
}

const ParticipantesContext = createContext<ContextType | null>(null);

export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(participantesReducer, initialState);

  useEffect(() => {
    cargarParticipantes();
  }, []);

  async function cargarParticipantes() {
    dispatch({ type: "LOADING", payload: true });

    try {
      const res = await fetch(`${API_URL}/participantes`);
      const data: Participante[] = await res.json();
      dispatch({ type: "SET", payload: data });
    } catch (e: any) {
      dispatch({ type: "ERROR", payload: e.message });
    } finally {
      dispatch({ type: "LOADING", payload: false });
    }
  }

  async function agregar(nuevo: ParticipanteNuevo) {
    const res = await fetch(`${API_URL}/participantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    const creado: Participante = await res.json();
    dispatch({ type: "AGREGAR", payload: creado });
  }

  async function eliminar(id: number) {
    await fetch(`${API_URL}/participantes/${id}`, {
      method: "DELETE",
    });

    dispatch({ type: "ELIMINAR", payload: id });
  }

  async function editar(p: Participante) {
    const res = await fetch(`${API_URL}/participantes/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });

    const actualizado: Participante = await res.json();
    dispatch({ type: "EDITAR", payload: actualizado });
  }

  // 🔥 Reemplaza setEditando → seleccionar (más claro para rutas)
  const seleccionar = (p: Participante | null) => {
    dispatch({ type: "SET_EDITANDO", payload: p });
  };

  return (
    <ParticipantesContext.Provider
      value={{
        participantes: state.participantes,
        cargando: state.cargando,
        error: state.error,
        agregar,
        eliminar,
        editar,
        editando: state.editando,
        seleccionar,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) {
    throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
  }
  return ctx;
}