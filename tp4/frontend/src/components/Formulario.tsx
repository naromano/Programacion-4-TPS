import { useState } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import type { ParticipanteNuevo } from "../models/Participante";
const tecnologiasDisponibles = ["React", "Angular", "Vue", "Node", "Python", "Java"];

// ✅ Ya no recibe props — consume el contexto directamente
function Formulario() {
  const { agregar } = useParticipantes();

  const [nombre,        setNombre]        = useState("");
  const [email,         setEmail]         = useState("");
  const [edad,          setEdad]          = useState("");
  const [pais,          setPais]          = useState("Argentina");
  const [modalidad,     setModalidad]     = useState("Presencial");
  const [tecnologias,   setTecnologias]   = useState<string[]>([]);
  const [nivel,         setNivel]         = useState("Principiante");
  const [aceptaTerminos,setAceptaTerminos]= useState(false);
  const [enviando,      setEnviando]      = useState(false);

  const manejarTecnologia = (tec: string) => {
    setTecnologias((prev) =>
      prev.includes(tec) ? prev.filter((t) => t !== tec) : [...prev, tec]
    );
  };

  const limpiarFormulario = () => {
    setNombre(""); setEmail(""); setEdad(""); setPais("Argentina");
    setModalidad("Presencial"); setTecnologias([]); setNivel("Principiante");
    setAceptaTerminos(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !edad || !aceptaTerminos) {
      alert("Completá todos los campos obligatorios y aceptá los términos.");
      return;
    }

    const nuevo: ParticipanteNuevo = {
      nombre: nombre.trim(),
      email: email.trim(),
      edad: Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos,
    };

    try {
      setEnviando(true);
      await agregar(nuevo);  // 🔥 llama a la API mediante el contexto
      limpiarFormulario();
    } catch {
      alert("Error al registrar el participante. Verificá que el backend esté corriendo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Formulario de inscripción</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input type="text" placeholder="Ingrese su nombre"
            className="w-full border rounded p-2"
            value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" placeholder="Ingrese su email"
            className="w-full border rounded p-2"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Edad</label>
          <input type="number" placeholder="Ingrese su edad"
            className="w-full border rounded p-2"
            value={edad} onChange={(e) => setEdad(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">País</label>
          <select className="w-full border rounded p-2" value={pais} onChange={(e) => setPais(e.target.value)}>
            <option>Argentina</option>
            <option>Chile</option>
            <option>Uruguay</option>
            <option>México</option>
            <option>España</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Modalidad de asistencia</label>
          <div className="flex gap-4 flex-wrap">
            {["Presencial", "Virtual", "Híbrido"].map((mod) => (
              <label key={mod} className="flex items-center gap-2">
                <input type="radio" name="modalidad" value={mod}
                  checked={modalidad === mod} onChange={(e) => setModalidad(e.target.value)} />
                {mod}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Tecnologías conocidas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tecnologiasDisponibles.map((tec) => (
              <label key={tec} className="flex items-center gap-2">
                <input type="checkbox" checked={tecnologias.includes(tec)}
                  onChange={() => manejarTecnologia(tec)} />
                {tec}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nivel de experiencia</label>
          <select className="w-full border rounded p-2" value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)} />
            Acepto los términos y condiciones del evento
          </label>
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={enviando}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {enviando ? "Registrando..." : "Registrar Participante"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Formulario;
