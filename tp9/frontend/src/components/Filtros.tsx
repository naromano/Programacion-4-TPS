import { useId, forwardRef } from "react";

type Props = {
  buscarNombre: string;
  filtroModalidad: string;
  filtroNivel: string;
  onBuscarNombre: (valor: string) => void;
  onFiltroModalidad: (valor: string) => void;
  onFiltroNivel: (valor: string) => void;
  onLimpiarFiltros: () => void;
};

const Filtros = forwardRef<HTMLInputElement, Props>(({
  buscarNombre, filtroModalidad, filtroNivel,
  onBuscarNombre, onFiltroModalidad, onFiltroNivel, onLimpiarFiltros,
}, ref) => {
  const buscarNombreId = useId();
  const filtroModalidadId = useId();
  const filtroNivelId = useId();

  return (
    <section className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filtros de búsqueda</h2>
        <button onClick={onLimpiarFiltros}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor={buscarNombreId} className="block mb-2 font-medium text-sm">Buscar por nombre</label>
          <input
            id={buscarNombreId}
            ref={ref}
            type="text"
            placeholder="Buscar..."
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={buscarNombre}
            onChange={(e) => onBuscarNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={filtroModalidadId} className="block mb-2 font-medium text-sm">Filtrar por modalidad</label>
          <select
            id={filtroModalidadId}
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={filtroModalidad}
            onChange={(e) => onFiltroModalidad(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div>
          <label htmlFor={filtroNivelId} className="block mb-2 font-medium text-sm">Filtrar por nivel</label>
          <select
            id={filtroNivelId}
            className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 focus:border-blue-500 transition-colors"
            value={filtroNivel}
            onChange={(e) => onFiltroNivel(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>
    </section>
  );
});

Filtros.displayName = "Filtros";

export default Filtros;