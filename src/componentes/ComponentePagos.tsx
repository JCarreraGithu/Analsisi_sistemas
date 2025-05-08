import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerPagos } from "../Services/ServicePago.ts";
import autoTable from "jspdf-autotable";

// Adaptado a la estructura real del backend
interface Pago {
  ID_PAGO: number;
  USU_NombreUsuario: string;
  NO_BOLETA: string;
  FECHA: string;
  TIP_PAGO: string;
  TOTAL: number;
}

// Función para cargar imagen desde URL como base64
const cargarImagenComoBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No se pudo obtener el contexto del canvas.");

      // Pintar fondo blanco para evitar fondo negro al exportar JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png")); // PNG mantiene transparencia
    };

    img.onerror = () => reject("Error al cargar la imagen.");
  });
};

const ComponentePagos = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const logoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1024px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL =
    "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";

  useEffect(() => {
    const fetchPagos = async () => {
      const data = await obtenerPagos();
      setPagos(data);
    };
    fetchPagos();
  }, []);

  const generarPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      const logoBase64 = await cargarImagenComoBase64(logoURL);
      const marcaAguaBase64 = await cargarImagenComoBase64(marcaAguaURL);

      doc.addImage(logoBase64, "PNG", pageWidth - 30, 10, 20, 20);
      doc.addImage(marcaAguaBase64, "PNG", pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
    }

    doc.setFontSize(18);
    doc.text("Reporte de Pagos", pageWidth / 2, 20, { align: "center" });

    const startY = 40;
    const encabezados = [["No. Pago", "Nombre del Cliente", "No. Boleta", "Fecha", "Tipo de Pago", "Total (Q)"]];
    const datos = pagos.map((pago) => [
      pago.ID_PAGO,
      pago.USU_NombreUsuario,
      pago.NO_BOLETA,
      pago.FECHA,
      pago.TIP_PAGO,
      pago.TOTAL,
    ]);

    autoTable(doc, {
      startY,
      head: encabezados,
      body: datos,
      styles: {
        fontSize: 10,
        textColor: "#000000",
      },
      headStyles: {
        fillColor: "#704a35",
        textColor: "#ffffff",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: "#edbc8b",
      },
      theme: "striped",
      margin: { top: 20 },
    });

    doc.save("Pagos-MIUMG.pdf");
  };

  const generarReportePowerBI = () => {
    window.open("https://app.powerbi.com/view?r=tu_reporte_id", "_blank");
  };

  return (
    <div>
      <h2>Reporte de Pagos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            <th>No. Pago</th>
            <th>Nombre del Cliente</th>
            <th>No. Boleta</th>
            <th>Fecha</th>
            <th>Tipo de Pago</th>
            <th>Total (Q)</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <tr key={pago.ID_PAGO}>
                <td>{pago.ID_PAGO}</td>
                <td>{pago.USU_NombreUsuario}</td>
                <td>{pago.NO_BOLETA}</td>
                <td>{pago.FECHA}</td>
                <td>{pago.TIP_PAGO}</td>
                <td>{pago.TOTAL}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay datos disponibles</td>
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

export default ComponentePagos;
