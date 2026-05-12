import { useMemo, useState, useEffect } from "react";  // 👈 useEffect
import { useParticipantes } from "../context/ParticipantesContext";
import { useAuth } from "../context/AuthContext";
import Filtros from "../components/Filtros";
import ParticipanteCard from "../components/ParticipanteCard";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { participantes, cargando, error, cargarParticipantes } = useParticipantes();  // 👈

  const [buscarNombre, setBuscarNombre] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");

  useEffect(() => {
    cargarParticipantes();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const limpiarFiltros = () => {
    setBuscarNombre("");
    setFiltroModalidad("Todas");
    setFiltroNivel("Todos");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(buscarNombre.toLowerCase());
      const coincideModalidad = filtroModalidad === "Todas" || p.modalidad === filtroModalidad;
      const coincideNivel = filtroNivel === "Todos" || p.nivel === filtroNivel;
      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, buscarNombre, filtroModalidad, filtroNivel]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ThemeToggle />

      <div className="flex justify-between items-center mb-8 mt-12">
        <h1 className="text-3xl font-bold">Registro de Participantes</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      {user?.rol === "ADMIN" && (
        <Link
          to="/nuevo"
          className="block w-max mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Nuevo participante
        </Link>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 mt-4 rounded-lg">
          {error}
        </div>
      )}

      <Filtros
        buscarNombre={buscarNombre}
        filtroModalidad={filtroModalidad}
        filtroNivel={filtroNivel}
        onBuscarNombre={setBuscarNombre}
        onFiltroModalidad={setFiltroModalidad}
        onFiltroNivel={setFiltroNivel}
        onLimpiarFiltros={limpiarFiltros}
      />

      <section className="mt-6">
        {cargando ? (
          <p className="text-center py-8">Cargando...</p>
        ) : participantesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay participantes para mostrar.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {participantesFiltrados.map((p) => (
              <ParticipanteCard key={p.id} participante={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}