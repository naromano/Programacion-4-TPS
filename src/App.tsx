import { useEffect, useMemo, useState } from "react";
import { Participante } from "./models/Participante";
import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import ParticipanteCard from "./components/ParticipanteCard";

const STORAGE_KEY = "participantes";

function App() {
  // Cargar desde localStorage directamente
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) return [];

    const parsed = JSON.parse(datos);

    return parsed.map(
      (p: any) =>
        new Participante(
          p.nombre,
          p.email,
          p.edad,
          p.pais,
          p.modalidad,
          p.tecnologias,
          p.nivel,
          p.aceptaTerminos,
          p.id
        )
    );
  });

  const [buscarNombre, setBuscarNombre] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participantes));
  }, [participantes]);

  // ➕ Agregar participante
  const agregarParticipante = (nuevo: Participante) => {
    setParticipantes((prev) => [...prev, nuevo]);
  };

  // Eliminar participante
  const eliminarParticipante = (id: number) => {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  // Resetear todo
  const resetearDatos = () => {
    localStorage.removeItem(STORAGE_KEY);
    setParticipantes([]);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBuscarNombre("");
    setFiltroModalidad("Todas");
    setFiltroNivel("Todos");
  };

  // Estado derivado (filtros combinados)
  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre
        .toLowerCase()
        .includes(buscarNombre.toLowerCase());

      const coincideModalidad =
        filtroModalidad === "Todas" || p.modalidad === filtroModalidad;

      const coincideNivel =
        filtroNivel === "Todos" || p.nivel === filtroNivel;

      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, buscarNombre, filtroModalidad, filtroNivel]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">
        Registro de Participantes
      </h1>

      {/* Formulario */}
      <Formulario onAgregar={agregarParticipante} />

      {/* Filtros */}
      <Filtros
        buscarNombre={buscarNombre}
        filtroModalidad={filtroModalidad}
        filtroNivel={filtroNivel}
        onBuscarNombre={setBuscarNombre}
        onFiltroModalidad={setFiltroModalidad}
        onFiltroNivel={setFiltroNivel}
        onLimpiarFiltros={limpiarFiltros}
      />

      {/* Lista */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lista de participantes</h2>
          <button
            onClick={resetearDatos}
            className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm"
          >
            Resetear datos
          </button>
        </div>
        {/* Contador */}
      <p className="text-center mb-6 text-gray-600">
        Mostrando{" "}
        <span className="font-bold text-blue-600">
          {participantesFiltrados.length}
        </span>{" "}
        de{" "}
        <span className="font-bold">{participantes.length}</span>{" "}
        participantes
      </p>
        {participantesFiltrados.length === 0 ? (
          <div className="bg-white shadow rounded p-6 text-center text-gray-500 italic">
            No hay participantes para mostrar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantesFiltrados.map((p) => (
              <ParticipanteCard
                key={p.id}
                participante={p}
                onEliminar={eliminarParticipante}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;