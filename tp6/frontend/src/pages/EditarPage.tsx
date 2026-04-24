import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import Formulario from "../components/Formulario";

export default function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { participantes, seleccionar } = useParticipantes();

  useEffect(() => {
    const participante = participantes.find(p => p.id === Number(id));
    if (participante) {
      seleccionar(participante);
    }
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Editar Participante
      </h1>

      <Formulario onSuccess={() => navigate("/")} />
    </div>
  );
}