import axios from "axios";

const API_URL = "http://192.168.0.200:3000/api/parusuario/reporte"; 

export const obtenerClientes = async () => {
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
    console.error("Error obteniendo Clientes:", error);
    return [];
  }
};


/*import axios from "axios";

const API_URL = "http://192.168.0.200:3000/api/parusuario/reporte"; 

export const obtenerClientes = async () => {
  try {
    const response = await axios.get(API_URL);
    if (Array.isArray(response.data.clientes)) {
      return response.data.clientes; // Devuelve el array de clientes
    } else {
      console.error("La respuesta no contiene un array válido:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo Clientes:", error);
    return [];
  }
};

*/