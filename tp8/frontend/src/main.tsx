import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ParticipantesProvider } from './context/ParticipantesContext'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>              
        <ParticipantesProvider>
          <App />
        </ParticipantesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);