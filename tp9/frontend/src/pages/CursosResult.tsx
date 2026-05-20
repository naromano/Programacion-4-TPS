import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function CursosSuccess() {
  const q = useQuery();
  return (
    <div style={{ padding: 20 }}>
      <h2>Pago exitoso</h2>
      <p>Pago aprobado. Detalles:</p>
      <pre>{JSON.stringify(Object.fromEntries(q.entries()), null, 2)}</pre>
    </div>
  );
}

export function CursosFailure() {
  const q = useQuery();
  return (
    <div style={{ padding: 20 }}>
      <h2>Pago fallido o cancelado</h2>
      <pre>{JSON.stringify(Object.fromEntries(q.entries()), null, 2)}</pre>
    </div>
  );
}

export function CursosPending() {
  const q = useQuery();
  return (
    <div style={{ padding: 20 }}>
      <h2>Pago pendiente</h2>
      <pre>{JSON.stringify(Object.fromEntries(q.entries()), null, 2)}</pre>
    </div>
  );
}

export default null;
