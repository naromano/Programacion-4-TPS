type Props = {
  buscarNombre: string;
  filtroModalidad: string;
  filtroNivel: string;
  onBuscarNombre: (valor: string) => void;
  onFiltroModalidad: (valor: string) => void;
  onFiltroNivel: (valor: string) => void;
  onLimpiarFiltros: () => void;
};

function Filtros({
  buscarNombre, filtroModalidad, filtroNivel,
  onBuscarNombre, onFiltroModalidad, onFiltroNivel, onLimpiarFiltros,
}: Props) {
  return (
    <section className="bg-white shadow rounded p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Filtros de búsqueda</h2>
        <button onClick={onLimpiarFiltros}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Buscar por nombre</label>
          <input type="text" placeholder="Buscar..." className="w-full border rounded p-2"
            value={buscarNombre} onChange={(e) => onBuscarNombre(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Filtrar por modalidad</label>
          <select className="w-full border rounded p-2" value={filtroModalidad}
            onChange={(e) => onFiltroModalidad(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Filtrar por nivel</label>
          <select className="w-full border rounded p-2" value={filtroNivel}
            onChange={(e) => onFiltroNivel(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default Filtros;
