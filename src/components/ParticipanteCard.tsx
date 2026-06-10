import { Participante } from "../models/Participante";
 
type Props = {
  participante: Participante;
  onEliminar: (id: number) => void;
};
 
const colorNivel = (nivel: Participante["nivel"]) => {
  if (nivel === "Principiante") return "bg-green-50 border-green-200";
  if (nivel === "Intermedio") return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};
 
function ParticipanteCard({ participante, onEliminar }: Props) {
  const p = participante;
 
  return (
    <div
      key={p.id}
      className={`shadow rounded p-4 hover:shadow-lg transition border ${colorNivel(p.nivel)}`}
    >
      <h3 className="text-xl font-bold mb-2">{p.nombre}</h3>
      <p className="mb-1">{p.email}</p>
      <p className="mb-1">Edad: {p.edad}</p>
      <p className="mb-1">{p.pais}</p>
      <p className="mb-1">Modalidad: {p.modalidad}</p>
 
      <p className="mb-1">Nivel: {p.nivel}</p>
 
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