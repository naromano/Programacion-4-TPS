import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import "./App.css";

import Home from "./pages/ListaPage";
import FormularioPage from "./pages/FormularioPage";
import EditarPage from "./pages/EditarPage";
import LoginPage from "./pages/LoginPage";
import CursosPage from "./pages/CursosPage";
import { CursosSuccess, CursosFailure, CursosPending } from "./pages/CursosResult";
import PrivateRoute from "./Routes/PrivateRoute";
import Sinlogin from "./pages/SinlPage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const hideNav = location.pathname === "/login" || location.pathname === "/sinlogin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      {!hideNav && (
        <nav className="main-nav">
        <div className="nav-brand">Gestión</div>

        <div className="desktop-links">
          <Link to="/" className="nav-link">
            Registro de Participantes
          </Link>
          <Link to="/cursos" className="nav-link">
            Cursos
          </Link>
          <button type="button" className="nav-link logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button
          type="button"
          className={`menu-button ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/nuevo" className="nav-link" onClick={() => setMenuOpen(false)}>
            Registro de Participantes
          </Link>
          <Link to="/cursos" className="nav-link" onClick={() => setMenuOpen(false)}>
            Cursos
          </Link>
          <button
            type="button"
            className="nav-link logout-button"
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      )}
      <Routes>
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/sinlogin" element={<Sinlogin />} />  


        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>

        <Route path="/nuevo" element={
          <PrivateRoute rol="ADMIN">
            <FormularioPage />
          </PrivateRoute>
        }/>

        <Route path="/editar/:id" element={
          <PrivateRoute rol="ADMIN">
            <EditarPage />
          </PrivateRoute>
        }/>
        <Route path="/cursos" element={
          <PrivateRoute>
            <CursosPage />
          </PrivateRoute>
        }/>

        <Route path="/cursos/success" element={<CursosSuccess />} />
        <Route path="/cursos/failure" element={<CursosFailure />} />
        <Route path="/cursos/pending" element={<CursosPending />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;