import axios from "axios";

export const obtenerClientes = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/parusuario/reporte");
    const datos = response.data;

    // Transformar array de arrays a array de objetos
    const clientes = datos.map((item: any[]) => ({
      Nombre: item[0],
      Apellido: item[1],
      Carnet: item[2],
      Teléfono: item[3],
      Email: item[4],
      Dirección: item[5],
      Placa: item[6],
      Marca: item[7],
      Modelo: item[8],
      Color: item[9],
    }));

    return clientes;
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return [];
  }
};
