import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/ListaPage";
import FormularioPage from "./pages/FormularioPage";
import EditarPage from "./pages/EditarPage";
import LoginPage from "./pages/LoginPage";
import CursosPage from "./pages/CursosPage";
import { CursosSuccess, CursosFailure, CursosPending } from "./pages/CursosResult";
import PrivateRoute from "./Routes/PrivateRoute";
import Sinlogin from "./pages/SinlPage";

function App() {
  return (
    <ThemeProvider>
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