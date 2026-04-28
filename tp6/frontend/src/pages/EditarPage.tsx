import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import Formulario from "../components/Formulario";
import ThemeToggle from "../components/ThemeToggle";
import { Link } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto p-6">
      <ThemeToggle />
      
      <div className="flex justify-between items-center mb-6 mt-12">
        <h1 className="text-2xl font-bold">
          Editar Participante
        </h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Volver al inicio
        </Link>
      </div>

      <Formulario onSuccess={() => navigate("/")} onCancel={() => navigate("/")} />
    </div>
  );
}