import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";
import ThemeToggle from "../components/ThemeToggle";
import { Link } from "react-router-dom";

export default function FormularioPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ThemeToggle />
      
      <div className="flex justify-between items-center mb-6 mt-12">
        <h1 className="text-2xl font-bold">
          Nuevo Participante
        </h1>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Volver al inicio
        </Link>
      </div>

      <Formulario onSuccess={() => navigate("/")} />
    </div>
  );
}