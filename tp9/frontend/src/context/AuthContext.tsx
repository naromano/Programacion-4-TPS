import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Rol = "ADMIN" | "CONSULTA";

interface User {
  usuario: string;
  rol: Rol;
}

interface AuthContextType {
  user: User | null;
  login: (usuario: string, password: string) => Promise<boolean>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const saved = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(
    saved ? JSON.parse(saved) : null
  );

  const login = async (usuario: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      const userData: User = { usuario, rol: data.rol };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token); 

      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");  
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}