import axios from "axios";

export const obtenerClientes = async () => {
  try {
    const response = await axios.get("http://192.168.0.200:3000/api/parusuario/reporte");
    const datos = response.data;

    // Transformar array de arrays a array de objetos
    const clientes = datos.map((item: any[]) => ({
      NombreUsuario: item[0],
      Nombre: item[1],
      Apellido: item[2],
      Carnet: item[3],
      Teléfono: item[4],
      Email: item[5],
      Dirección: item[6],
      Placa: item[7],
      Marca: item[8],
      Modelo: item[9],
      Color: item[10],
    }));

    return clientes;
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return [];
  }
};
