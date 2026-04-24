import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";

export default function FormularioPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Nuevo Participante
      </h1>

      <Formulario onSuccess={() => navigate("/")} />
    </div>
  );
}