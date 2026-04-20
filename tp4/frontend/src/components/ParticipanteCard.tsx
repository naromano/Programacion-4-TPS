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