import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerClientes } from "../Services/ServiceCliente.ts";
import autoTable from "jspdf-autotable";

// Definición de la interfaz de Cliente
interface Cliente {
  carnet: string;
  nombre: string;
  apellido: string;
  direccion: string;
  carrera: string;
}

// Función auxiliar para convertir imagen desde URL a Base64
const cargarImagenComoBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Necesario para evitar errores CORS
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No se pudo obtener el contexto del canvas.");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png")); // O "image/png" si tu imagen es PNG
    };
    img.onerror = () => reject("Error al cargar la imagen desde URL.");
    img.src = url;
  });
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

  const logoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1200px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL =
    "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";

  const generarPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      const logoBase64 = await cargarImagenComoBase64(logoURL);
      const marcaAguaBase64 = await cargarImagenComoBase64(marcaAguaURL);

      doc.addImage(logoBase64, "JPEG", pageWidth - 30, 10, 20, 20); // Esquina superior derecha
      doc.addImage(marcaAguaBase64, "JPEG", pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100); // Centro como marca de agua
    } catch (error) {
      console.error("Error cargando imágenes:", error);
    }

    doc.setFontSize(18);
    doc.text("Reporte de Clientes", pageWidth / 2, 20, { align: "center" });

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
