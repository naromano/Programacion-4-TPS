import { useState } from "react";
import { Participante } from "../models/Participante";
 
const tecnologiasDisponibles = [
  "React",
  "Angular",
  "Vue",
  "Node",
  "Python",
  "Java",
];
 
type Props = {
  onAgregar: (participante: Participante) => void;
};
 
function Formulario({ onAgregar }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [modalidad, setModalidad] = useState("Presencial");
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [nivel, setNivel] = useState("Principiante");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
 
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
 
  const handleSubmit = (e: React.FormEvent) => {
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
 
    const nuevo = new Participante(
      nombre.trim(),
      email.trim(),
      Number(edad),
      pais,
      modalidad,
      tecnologias,
      nivel,
      aceptaTerminos
    );
 
    onAgregar(nuevo);
    limpiarFormulario();
  };
 
  return (
    <section className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Formulario de inscripción</h2>
 
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block mb-2 font-medium">Modalidad de asistencia</label>
          <div className="flex gap-4 flex-wrap">
            {["Presencial", "Virtual", "Híbrido"].map((mod) => (
              <label key={mod} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="modalidad"
                  value={mod}
                  checked={modalidad === mod}
                  onChange={(e) => setModalidad(e.target.value)}
                />
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
          <label className="block mb-1 font-medium">Nivel de experiencia</label>
          <select
            className="w-full border rounded p-2"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
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
  );
}
 
export default Formulario;