import { useState, useEffect } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import type { ParticipanteNuevo } from "../models/Participante";

const tecnologiasDisponibles = ["React", "Angular", "Vue", "Node", "Python", "Java"];

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function Formulario({ onSuccess, onCancel }: Props) {
  const { agregar, editar, editando, seleccionar } = useParticipantes();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [modalidad, setModalidad] = useState("Presencial");
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState("Principiante");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [enviando, setEnviando] = useState(false);

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
    seleccionar(null);
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
      onSuccess?.();

    } catch {
      alert("Error al guardar el participante.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-xl p-8 mb-8 mt-4">
      <h2 className="text-2xl font-bold mb-6 border-b dark:border-gray-700 pb-2">
        {editando ? "Editar participante" : "Formulario de inscripción"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-semibold text-sm">Nombre *</label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">Email *</label>
          <input
            type="email"
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@email.com"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">Edad *</label>
          <input
            type="number"
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            placeholder="25"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">País</label>
          <select
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
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
          <label className="block mb-3 font-semibold text-sm">Modalidad</label>
          <div className="flex gap-4">
            {["Presencial", "Virtual", "Híbrido"].map((mod) => (
              <label key={mod} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={modalidad === mod}
                  onChange={() => setModalidad(mod)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-sm">{mod}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-3 font-semibold text-sm">Tecnologías</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tecnologiasDisponibles.map((tec) => (
              <label key={tec} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={tecnologias.includes(tec)}
                  onChange={() => manejarTecnologia(tec)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-sm">{tec}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-sm">Nivel</label>
          <select
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm">Acepto los términos y condiciones *</span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
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
              onClick={() => {
                limpiarFormulario();
                onCancel?.();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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