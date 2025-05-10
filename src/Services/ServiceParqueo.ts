import axios from "axios";

const API_URL = "http://192.168.0.13:3000/api/disponibilidad_parqueo"; // Ajusta la URL según tu backend

export const obtenerParqueos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve los datos de la API
  } catch (error) {
    console.error("Error obteniendo parqueos:", error);
    return [];
  }
};
