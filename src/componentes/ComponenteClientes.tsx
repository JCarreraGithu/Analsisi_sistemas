import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerClientes } from "../Services/ServiceCliente.ts";
import autoTable from "jspdf-autotable";

// Adaptado a la estructura real del backend
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

const logoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/512px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL =
    "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(logoURL, "JPEG", pageWidth - 30, 10, 20, 20);
    doc.addImage(marcaAguaURL, "JPEG", pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100);

    

    doc.setFontSize(18);
    doc.text("Lista de Clientes", pageWidth / 2, 20, { align: "center" });

    const encabezados = [["Carnet", "Nombre", "Apellido", "Dirección", "Carrera"]];
    const datos = clientes.map((cliente) => [
      cliente.carnet,
      cliente.nombre,
      cliente.apellido,
      cliente.direccion,
      cliente.carrera,
    ]);

    autoTable(doc, {
      startY: 40,
      head: encabezados,
      body: datos,
      styles: { fontSize: 10 },
      headStyles: { fillColor: "#704a35", textColor: "#ffffff", halign: "center" },
      alternateRowStyles: { fillColor: "#edbc8b" },
      theme: "striped",
    });

    doc.save("Clientes.pdf");
  };

  const generarReportePowerBI = () => {
    window.open("https://app.powerbi.com/view?r=tu_reporte_id", "_blank");
  };

  return (
    <div>
      <h2>Reporte de Clientes</h2>
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
