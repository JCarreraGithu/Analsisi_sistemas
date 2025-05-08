import axios from "axios";

// IP de la API para obtener los pagos
const API_URL = "http://192.168.182.177:3001/pagos"; 

export const obtenerPagos = async () => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data)) {
      return response.data; // Devuelve los datos si es un array
    } else {
      console.error("La respuesta no es un array:", response.data);
      return []; // Retorna un array vacío si no es un array
    }
  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    return [];
  }
};