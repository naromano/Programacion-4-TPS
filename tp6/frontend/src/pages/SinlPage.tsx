import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function SinlPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <ThemeToggle />
      <h1 className="text-3xl font-bold">Página Pública</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Esta página no requiere autenticación.
      </p>
      <Link to="/login" className="text-blue-600 hover:underline font-medium">
        Ir al Login →
      </Link>
    </div>
  );
}