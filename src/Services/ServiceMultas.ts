import axios from "axios";

const API_URL = "http://localhost:3560/getData"; 

export const obtenerMultas = async () => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
        return response.data; // Devuelve los datos si es un array
      } else {
        console.error("La respuesta no es un array:", response.data);
        return []; // Retorna un array vacío si no es un array
      }
    //return response.data; // Devuelve los datos de la API
  } catch (error) {
    console.error("Error obteniendo Multas:", error);
    return [];
  }
};