import axios from "axios";

export const obtenerClientes = async () => {
  try {
    const response = await axios.get("http://localhost:3000/getData");
    const datos = response.data;

    // Transformar array de arrays a array de objetos
    const clientes = datos.map((item: any[]) => ({
      Carnet_Cliente: item[0],
      Teléfono: item[1],
      Dirección: item[2],
    }));

    return clientes;
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return [];
  }
};
