import type { Participante } from "../models/Participante";

type Props = {
  participante: Participante;
  onEliminar: (id: number) => void;
};

const colorNivel = (nivel: string) => {
  if (nivel === "Principiante") return "bg-green-100 text-green-700";
  if (nivel === "Intermedio")   return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

function ParticipanteCard({ participante, onEliminar }: Props) {
  const p = participante;
  return (
    <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{p.nombre}</h3>
      <p className="mb-1">{p.email}</p>
      <p className="mb-1">Edad: {p.edad}</p>
      <p className="mb-1">{p.pais}</p>
      <p className="mb-1">Modalidad: {p.modalidad}</p>

      <div className="mb-2">
        <span className="font-medium">Nivel: </span>
        <span className={`px-2 py-1 rounded text-sm ${colorNivel(p.nivel)}`}>{p.nivel}</span>
      </div>

      <div className="mb-4">
        <p className="font-medium mb-1">Tecnologías:</p>
        {p.tecnologias.length > 0 ? (
          <p>{p.tecnologias.join(" - ")}</p>
        ) : (
          <p className="text-gray-400 italic">No indicó tecnologías</p>
        )}
      </div>

      <button
        onClick={() => onEliminar(p.id)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Eliminar
      </button>
    </div>
  );
}

export default ParticipanteCard;
