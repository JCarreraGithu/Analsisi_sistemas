import axios from "axios";

const API_URL = "http://localhost:8090/api/all"; 

export const obtenerPagos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve los datos de la API
  } catch (error) {
    console.error("Error obteniendo pagos:", error);
    return [];
  }
};
