import type { Participante } from "../models/Participante";

export type Action =
  | { type: "SET"; payload: Participante[] }
  | { type: "AGREGAR"; payload: Participante }
  | { type: "ELIMINAR"; payload: number }
  | { type: "EDITAR"; payload: Participante }
  | { type: "LOADING"; payload: boolean }
  | { type: "ERROR"; payload: string | null }
  | { type: "SET_EDITANDO"; payload: Participante | null };

export interface State {
  participantes: Participante[];
  cargando: boolean;
  error: string | null;
  editando: Participante | null;
}

export const initialState: State = {
  participantes: [],
  cargando: false,
  error: null,
  editando: null,
};

export function participantesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET":
      return { ...state, participantes: action.payload };

    case "AGREGAR":
      return {
        ...state,
        participantes: [...state.participantes, action.payload],
      };

    case "ELIMINAR":
      return {
        ...state,
        participantes: state.participantes.filter(p => p.id !== action.payload),
      };

    case "EDITAR":
      return {
        ...state,
        participantes: state.participantes.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        editando: null,
      };

    case "SET_EDITANDO":
      return { ...state, editando: action.payload };

    case "LOADING":
      return { ...state, cargando: action.payload };

    case "ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}