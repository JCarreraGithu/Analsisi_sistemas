import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerClientes } from "../Services/ServiceCliente";

interface Cliente {
  Carnet_Cliente: string;
  Teléfono: string;
  Dirección: string;
}

const abrirReportePowerBI = () => {
  // URL del reporte de Power BI
  const reportUrl = 'https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID';
  window.open(reportUrl, '_blank');  // Abre el reporte en una nueva pestaña
};
const ComponenteClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await obtenerClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 10, 10); // Título

    // Agregar contenido de la tabla
    let y = 20;
    doc.text("Carnet Cliente   Teléfono   Dirección", 10, y);
    y += 10;

    clientes.forEach((cliente) => {
      doc.text(`${cliente.Carnet_Cliente}   ${cliente.Teléfono}   ${cliente.Dirección}`, 10, y);
      y += 10;
    });

    // Descargar el PDF
    doc.save("Clientes.pdf");
  };

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightgreen" }}>
            <th>Carnet Cliente</th>
            <th>Teléfono</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.Carnet_Cliente}>
                <td>{cliente.Carnet_Cliente}</td>
                <td>{cliente.Teléfono}</td>
                <td>{cliente.Dirección}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón para generar PDF */}
      <button className="generar-pdf" onClick={generarPDF}>
        Generar PDF
      </button>
      <button className="generar-Reporte" onClick={abrirReportePowerBI}>
  Generar Reporte Power BI
     </button>
      
    </div>
  );
};

export default ComponenteClientes;
