import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerClientes } from "../Services/ServiceCliente";

interface Cliente {
  carnet: string;
  nombre: string;
  apellido: string;
  direccion: string;
  carrera: string;
}

const ComponenteClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await obtenerClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  // Función para generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 10, 10);

    let y = 20;
    doc.text("Carnet  Nombre  Apellido  Dirección  Carrera", 10, y);
    y += 10;

    clientes.forEach((cliente) => {
      doc.text(
        `${cliente.carnet}  ${cliente.nombre}  ${cliente.apellido}  ${cliente.direccion}  ${cliente.carrera}`,
        10,
        y
      );
      y += 10;
    });

    doc.save("Clientes.pdf");
  };

  // URL del Reporte de Power BI (Reemplaza con la URL real)
  const generarReportePowerBI = () => {
    window.open("https://app.powerbi.com/view?r=tu_reporte_id", "_blank");
  };

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            <th>Carnet</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Carrera</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.carnet}>
                <td>{cliente.carnet}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.carrera}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="generar-pdf" onClick={generarPDF}>
        Generar PDF
      </button>
      <button className="generar-reporte" onClick={generarReportePowerBI}>
        Generar Reporte Power BI
      </button>
    </div>
  );
};

export default ComponenteClientes;
