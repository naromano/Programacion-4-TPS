import { useMemo, useState } from "react";

type Participante = {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean;
};

const tecnologiasDisponibles = [
  "React",
  "Angular",
  "Vue",
  "Node",
  "Python",
  "Java",
];

function App() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [modalidad, setModalidad] =
    useState<Participante["modalidad"]>("Presencial");
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState<Participante["nivel"]>("Principiante");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [buscarNombre, setBuscarNombre] = useState("");
  const [filtroModalidad, setFiltroModalidad] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");

  const manejarTecnologia = (tecnologia: string) => {
    if (tecnologias.includes(tecnologia)) {
      setTecnologias(tecnologias.filter((t) => t !== tecnologia));
    } else {
      setTecnologias([...tecnologias, tecnologia]);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setEdad("");
    setPais("Argentina");
    setModalidad("Presencial");
    setTecnologias([]);
    setNivel("Principiante");
    setAceptaTerminos(false);
  };

  const agregarParticipante = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !email.trim() ||
      !edad ||
      !pais ||
      !modalidad ||
      !nivel ||
      !aceptaTerminos
    ) {
      alert("Completá todos los campos obligatorios y aceptá los términos.");
      return;
    }

    const nuevoParticipante: Participante = {
      id: Date.now(),
      nombre: nombre.trim(),
      email: email.trim(),
      edad: Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos,
    };

    setParticipantes([...participantes, nuevoParticipante]);
    limpiarFormulario();
  };

  const eliminarParticipante = (id: number) => {
    setParticipantes(participantes.filter((p) => p.id !== id));
  };

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((p) => {
      const coincideNombre = p.nombre
        .toLowerCase()
        .includes(buscarNombre.toLowerCase());

      const coincideModalidad =
        filtroModalidad === "Todas" || p.modalidad === filtroModalidad;

      const coincideNivel = filtroNivel === "Todos" || p.nivel === filtroNivel;

      return coincideNombre && coincideModalidad && coincideNivel;
    });
  }, [participantes, buscarNombre, filtroModalidad, filtroNivel]);

  const colorNivel = (nivel: Participante["nivel"]) => {
    if (nivel === "Principiante") return "bg-green-100 text-green-700";
    if (nivel === "Intermedio") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Registro de Participantes
      </h1>

      <p className="text-center mb-6">
        Participantes registrados:{" "}
        <span className="font-bold">{participantes.length}</span>
      </p>

      <section className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Formulario de inscripción</h2>

        <form
          onSubmit={agregarParticipante}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input
              type="text"
              placeholder="Ingrese su nombre"
              className="w-full border rounded p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Ingrese su email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Edad</label>
            <input
              type="number"
              placeholder="Ingrese su edad"
              className="w-full border rounded p-2"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">País</label>
            <select
              className="w-full border rounded p-2"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
            >
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Uruguay">Uruguay</option>
              <option value="México">México</option>
              <option value="España">España</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Modalidad de asistencia
            </label>

            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modalidad"
                  value="Presencial"
                  checked={modalidad === "Presencial"}
                  onChange={(e) =>
                    setModalidad(e.target.value as Participante["modalidad"])
                  }
                />
                Presencial
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modalidad"
                  value="Virtual"
                  checked={modalidad === "Virtual"}
                  onChange={(e) =>
                    setModalidad(e.target.value as Participante["modalidad"])
                  }
                />
                Virtual
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modalidad"
                  value="Híbrido"
                  checked={modalidad === "Híbrido"}
                  onChange={(e) =>
                    setModalidad(e.target.value as Participante["modalidad"])
                  }
                />
                Híbrido
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Tecnologías conocidas
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tecnologiasDisponibles.map((tec) => (
                <label key={tec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tecnologias.includes(tec)}
                    onChange={() => manejarTecnologia(tec)}
                  />
                  {tec}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Nivel de experiencia
            </label>
            <select
              className="w-full border rounded p-2"
              value={nivel}
              onChange={(e) =>
                setNivel(e.target.value as Participante["nivel"])
              }
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              Acepto los términos y condiciones del evento
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Registrar Participante
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white shadow rounded p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Filtros de búsqueda</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full border rounded p-2"
              value={buscarNombre}
              onChange={(e) => setBuscarNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Filtrar por modalidad
            </label>
            <select
              className="w-full border rounded p-2"
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
            >
              <option value="Todas">Todas</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Filtrar por nivel</label>
            <select
              className="w-full border rounded p-2"
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Lista de participantes</h2>

        {participantesFiltrados.length === 0 ? (
          <div className="bg-white shadow rounded p-4">
            No hay participantes para mostrar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantesFiltrados.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow rounded p-4 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{p.nombre}</h3>
                <p className="mb-1">{p.email}</p>
                <p className="mb-1">Edad: {p.edad}</p>
                <p className="mb-1">{p.pais}</p>
                <p className="mb-1">Modalidad: {p.modalidad}</p>

                <div className="mb-2">
                  <span className="font-medium">Nivel: </span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${colorNivel(p.nivel)}`}
                  >
                    {p.nivel}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="font-medium mb-1">Tecnologías:</p>
                  {p.tecnologias.length > 0 ? (
                    <p>{p.tecnologias.join(" - ")}</p>
                  ) : (
                    <p>No indicó tecnologías</p>
                  )}
                </div>

                <button
                  onClick={() => eliminarParticipante(p.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
