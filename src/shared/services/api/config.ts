export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw || typeof raw !== "string") {
    throw new Error("Falta VITE_API_BASE_URL en .env");
  }
  //TODO : Deuda técnica - `.replace(/\/api$/, "")` quita el sufijo "/api" de la URL. Si alguien configura `VITE_API_BASE_URL=http://localhost:8000/api/v1`, el resultado sería `http://localhost:8000/v1` que es incorrecto. La lógica de normalización de URL debería ser más robusta o eliminarse.
  return raw.replace(/\/$/, "").replace(/\/api$/, "");
}