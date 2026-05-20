import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Participante } from "../models/Participante";
import { useParticipantes } from "../context/ParticipantesContext";
import { useAuth } from "../context/AuthContext";

const colorNivel = (nivel: string) => {
  if (nivel === "Principiante") return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400";
  if (nivel === "Intermedio") return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400";
};

const colorModalidad = (modalidad: string) => {
  if (modalidad === "Presencial") return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400";
  if (modalidad === "Virtual") return "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400";
  return "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400";
};

function ParticipanteCard({ participante }: { participante: Participante }) {
  const { eliminar } = useParticipantes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eliminando, setEliminando] = useState(false);
  const p = participante;

  const handleEliminar = async () => {
    if (window.confirm(`¿Eliminar a ${p.nombre}?`)) {
      setEliminando(true);
      await eliminar(p.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{p.nombre}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorNivel(p.nivel)}`}>
          {p.nivel}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {p.email}
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {p.edad} años
        </p>
        <p className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {p.pais}
        </p>
        <p className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorModalidad(p.modalidad)}`}>
            {p.modalidad}
          </span>
        </p>
      </div>

      <div className="mt-3 pt-3 border-t dark:border-gray-700">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tecnologías: </span>
        {p.tecnologias.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {p.tecnologias.map((tec) => (
              <span key={tec} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {tec}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No indicó</span>
        )}
      </div>

      {user?.rol === "ADMIN" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/editar/${p.id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
          >
            Editar
          </button>

          <button
            onClick={handleEliminar}
            disabled={eliminando}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {eliminando ? "..." : "Eliminar"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ParticipanteCard;