import { api } from "../services/api";
// estilos incluidos en el mismo archivo (JSX <style>) según preferencia

const cursos = [
  { id: 1, title: "Curso React", price: 25000, desc: "Fundamentos y hooks" },
  { id: 2, title: "Curso DBA", price: 40000, desc: "Diseño y optimización" },
  { id: 3, title: "Curso Node.js", price: 30000, desc: "APIs y backend" },
  { id: 4, title: "Curso Python", price: 28000, desc: "Automatización y data" },
  { id: 5, title: "Curso DevOps", price: 45000, desc: "CI/CD y despliegues" },
  { id: 6, title: "Curso UX/UI", price: 22000, desc: "Diseño centrado en usuario" },
];

export default function CursosPage() {
  async function handleComprar(curso: { title: string; price: number }) {
    try {
      const res = await api.post("/create_preference", {
        title: curso.title,
        price: curso.price,
      });

      if (!res.ok) {
        const txt = await res.text();
        alert("Error creando preferencia: " + txt);
        return;
      }

      const body = await res.json();
      if (body.init_point) {
        window.location.href = body.init_point;
      } else {
        alert("No se recibió init_point desde el servidor");
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar pago");
    }
  }

  return (
    <main className="cursos-wrap">
      <style>{`
        /* Styles for CursosPage - in-file */
        .cursos-wrap { padding: 20px; }
        .cursos-header h2 { margin: 0 0 6px 0; font-size: 28px; }
        .cursos-header .sub { margin: 0 0 18px 0; color: var(--text-secondary); }
        .cursos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .curso-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 6px 18px rgba(16,24,40,0.04); transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .curso-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(2,6,23,0.08); }
        .curso-media { height: 110px; display: flex; align-items: center; justify-content: center; background: linear-gradient(90deg, rgba(59,130,246,0.06), rgba(96,165,250,0.04)); }
        .curso-thumb { width: 76px; height: 76px; border-radius: 10px; background: linear-gradient(135deg, var(--accent), rgba(59,130,246,0.6)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .curso-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; flex: 1 1 auto; }
        .curso-title { font-size: 18px; margin: 0; }
        .curso-desc { margin: 0; color: var(--text-secondary); font-size: 14px; }
        .curso-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .precio { font-weight:700; color:var(--text-primary); }
        .btn-primary { background: var(--accent); color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: transform 0.12s ease, box-shadow 0.12s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59,130,246,0.18); }
        @media (max-width: 960px) { .cursos-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .cursos-grid { grid-template-columns: 1fr; } .curso-media { height: 88px; } }
      `}</style>
      <header className="cursos-header">
        <h2>Cursos disponibles</h2>
        <p className="sub">Elige el curso que quieras y comienza hoy mismo.</p>
      </header>

      <section className="cursos-grid">
        {cursos.map((c) => (
          <article className="curso-card" key={c.id}>
            <div className="curso-media" aria-hidden>
              <div className="curso-thumb">{c.title.split(' ')[1] || 'CUR'}</div>
            </div>
            <div className="curso-body">
              <h3 className="curso-title">{c.title}</h3>
              <p className="curso-desc">{c.desc}</p>
              <div className="curso-footer">
                <div className="precio">${c.price.toLocaleString()}</div>
                <button className="btn-primary" onClick={() => handleComprar(c)}>
                  QUIERO ESTE CURSO
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
