import type { Participante } from "../models/Participante";
import { useParticipantes } from "../context/ParticipantesContext";

const colorNivel = (nivel: string) => {
  if (nivel === "Principiante") return "bg-green-100 text-green-700";
  if (nivel === "Intermedio") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

function ParticipanteCard({ participante }: { participante: Participante }) {
  const { eliminar, setEditando } = useParticipantes();
  const p = participante;

  return (
    <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{p.nombre}</h3>

      <p>{p.email}</p>
      <p>Edad: {p.edad}</p>
      <p>País: {p.pais}</p>

      {/* 🔥 MODALIDAD */}
      <p>Modalidad: {p.modalidad}</p>

      {/* 🔥 NIVEL */}
      <div className="mb-2">
        <span className="font-medium">Nivel: </span>
        <span className={`px-2 py-1 rounded text-sm ${colorNivel(p.nivel)}`}>
          {p.nivel}
        </span>
      </div>

      {/* 🔥 TECNOLOGÍAS */}
      <div className="mb-2">
        <span className="font-medium">Tecnologías: </span>
        {p.tecnologias.length > 0
          ? p.tecnologias.join(" - ")
          : "No indicó"}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setEditando(p)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Editar
        </button>

        <button
          onClick={() => eliminar(p.id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ParticipanteCard;