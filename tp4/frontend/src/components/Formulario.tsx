import { useState, useEffect } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import type { ParticipanteNuevo } from "../models/Participante";

const tecnologiasDisponibles = ["React", "Angular", "Vue", "Node", "Python", "Java"];

function Formulario() {
  const { agregar, editar, editando, setEditando } = useParticipantes();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [modalidad, setModalidad] = useState("Presencial");
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState("Principiante");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // 🔥 CARGA AUTOMÁTICA AL EDITAR
  useEffect(() => {
    if (editando) {
      setNombre(editando.nombre);
      setEmail(editando.email);
      setEdad(String(editando.edad));
      setPais(editando.pais);
      setModalidad(editando.modalidad);
      setTecnologias(editando.tecnologias || []);
      setNivel(editando.nivel);
      setAceptaTerminos(editando.aceptaTerminos);
    }
  }, [editando]);

  const manejarTecnologia = (tec: string) => {
    setTecnologias((prev) =>
      prev.includes(tec) ? prev.filter((t) => t !== tec) : [...prev, tec]
    );
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
    setEditando(null); // 🔥 IMPORTANTE
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

      if (editando) {
        await editar({
          ...editando,
          ...nuevo,
        });
      } else {
        await agregar(nuevo);
      }

      limpiarFormulario();
    } catch {
      alert("Error al guardar el participante.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {editando ? "Editar participante" : "Formulario de inscripción"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Edad</label>
          <input
            type="number"
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
            <option>Argentina</option>
            <option>Chile</option>
            <option>Uruguay</option>
            <option>México</option>
            <option>España</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Modalidad</label>
          <div className="flex gap-4">
            {["Presencial", "Virtual", "Híbrido"].map((mod) => (
              <label key={mod}>
                <input
                  type="radio"
                  checked={modalidad === mod}
                  onChange={() => setModalidad(mod)}
                />
                {mod}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium">Tecnologías</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tecnologiasDisponibles.map((tec) => (
              <label key={tec}>
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
          <label className="block mb-1 font-medium">Nivel</label>
          <select
            className="w-full border rounded p-2"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>

        <div className="flex items-end">
          <label>
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto términos
          </label>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {enviando
              ? "Guardando..."
              : editando
              ? "Actualizar"
              : "Registrar"}
          </button>

          {editando && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default Formulario;