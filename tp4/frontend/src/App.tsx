import { useMemo, useState } from "react";
import { useParticipantes } from "./context/ParticipantesContext";
import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import ParticipanteCard from "./components/ParticipanteCard";
 
function App() {
  const { participantes, cargando, error, eliminar, resetear } = useParticipantes();
 
  const [buscarNombre, setBuscarNombre]       = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("Todas");
  const [filtroNivel, setFiltroNivel]         = useState("Todos");
 
  const limpiarFiltros = () => {
    setBuscarNombre("");
    setFiltroModalidad("Todas");
    setFiltroNivel("Todos");
  };
 
  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre    = p.nombre.toLowerCase().includes(buscarNombre.toLowerCase());
      const coincideModalidad = filtroModalidad === "Todas" || p.modalidad === filtroModalidad;
      const coincideNivel     = filtroNivel === "Todos"     || p.nivel     === filtroNivel;
      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, buscarNombre, filtroModalidad, filtroNivel]);
 
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">
        Registro de Participantes
      </h1>
 
      {/* ⚠️ Error de conexión */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4 mb-4">
          {error}
        </div>
      )}
 
      {/* 📝 Formulario — usa el contexto directamente */}
      <Formulario />
 
      {/* 🔎 Filtros */}
      <Filtros
        buscarNombre={buscarNombre}
        filtroModalidad={filtroModalidad}
        filtroNivel={filtroNivel}
        onBuscarNombre={setBuscarNombre}
        onFiltroModalidad={setFiltroModalidad}
        onFiltroNivel={setFiltroNivel}
        onLimpiarFiltros={limpiarFiltros}
      />
 
      {/* 📋 Lista */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lista de participantes</h2>
          <button
            onClick={resetear}
            className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm"
          >
            Resetear datos
          </button>
        </div>
 
        {/* 📊 Contador */}
        <p className="text-center mb-6 text-gray-600">
          Mostrando{" "}
          <span className="font-bold text-blue-600">{participantesFiltrados.length}</span>
          {" "}de{" "}
          <span className="font-bold">{participantes.length}</span> participantes
        </p>
 
        {cargando ? (
          <div className="bg-white shadow rounded p-6 text-center text-gray-500">
            Cargando participantes...
          </div>
        ) : participantesFiltrados.length === 0 ? (
          <div className="bg-white shadow rounded p-6 text-center text-gray-500 italic">
            No hay participantes para mostrar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantesFiltrados.map((p) => (
              <ParticipanteCard
                key={p.id}
                participante={p}
                onEliminar={eliminar}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
 
export default App;