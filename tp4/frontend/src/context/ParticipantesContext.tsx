import { createContext, useContext, useEffect, useState } from "react";
import type { Participante, ParticipanteNuevo } from "../models/Participante";

const API_URL = "http://127.0.0.1:8000";

// ─── Tipo del contexto ───────────────────────────────────────────────────────
interface ContextType {
  participantes: Participante[];
  cargando: boolean;
  error: string | null;
  agregar: (p: ParticipanteNuevo) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  resetear: () => Promise<void>;
}

// ─── Crear contexto ──────────────────────────────────────────────────────────
const ParticipantesContext = createContext<ContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar participantes al montar
  useEffect(() => {
    cargarParticipantes();
  }, []);

  async function cargarParticipantes() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/participantes`);
      if (!res.ok) throw new Error("Error al obtener participantes");
      const data: Participante[] = await res.json();
      setParticipantes(data);
    } catch (e: any) {
      setError(e.message ?? "Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }

  async function agregar(nuevo: ParticipanteNuevo) {
    setError(null);
    const res = await fetch(`${API_URL}/participantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    if (!res.ok) throw new Error("Error al crear participante");
    const creado: Participante = await res.json();
    setParticipantes((prev) => [...prev, creado]);
  }

  async function eliminar(id: number) {
    setError(null);
    const res = await fetch(`${API_URL}/participantes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar participante");
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  }

  async function resetear() {
    // Eliminar todos uno por uno
    for (const p of participantes) {
      await fetch(`${API_URL}/participantes/${p.id}`, { method: "DELETE" });
    }
    setParticipantes([]);
  }

  return (
    <ParticipantesContext.Provider
      value={{ participantes, cargando, error, agregar, eliminar, resetear }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

// ─── Hook personalizado ──────────────────────────────────────────────────────
export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
  return ctx;
}
