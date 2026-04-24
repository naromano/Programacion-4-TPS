import { useMemo, useState } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import Filtros from "../components/Filtros";
import ParticipanteCard from "../components/ParticipanteCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { participantes, cargando, error } = useParticipantes();

  const [buscarNombre, setBuscarNombre] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");

  const limpiarFiltros = () => {
    setBuscarNombre("");
    setFiltroModalidad("Todas");
    setFiltroNivel("Todos");
  };

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(buscarNombre.toLowerCase());
      const coincideModalidad =
        filtroModalidad === "Todas" || p.modalidad === filtroModalidad;
      const coincideNivel =
        filtroNivel === "Todos" || p.nivel === filtroNivel;
      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, buscarNombre, filtroModalidad, filtroNivel]);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center mb-4">
        Registro de Participantes
      </h1>

      <Link
        to="/nuevo"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Nuevo participante
      </Link>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mt-4">
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
          <p>Cargando...</p>
        ) : participantesFiltrados.length === 0 ? (
          <p className="text-gray-500 mt-4">
            No hay participantes para mostrar.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {participantesFiltrados.map((p) => (
              <ParticipanteCard
                key={p.id}
                participante={p}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}