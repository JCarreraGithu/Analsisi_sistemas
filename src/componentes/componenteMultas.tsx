import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerMultas } from "../Services/ServiceMultas.ts";
import autoTable from "jspdf-autotable";

// Adaptado a la estructura real del backend
interface Multa {
  TIP_MUL_ID: number;
  TIP_MULTA_NOMBRE: string;
  TIP_MUL_MONTO: number;
}

const ComponenteMultas = () => {
  const [multas, setMultas] = useState<Multa[]>([]);

  useEffect(() => {
    const fetchMultas = async () => {
      const data = await obtenerMultas();
      setMultas(data);
    };
    fetchMultas();
  }, []);

  const logoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1200px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL =
    "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";

  const cargarImagenComoBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No se pudo obtener el contexto del canvas.");
        ctx.fillStyle = "#ffffff"; // Fondo blanco para evitar fondo negro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject("Error al cargar la imagen: " + url);
    });
  };

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
    doc.text("Reporte de Tipos de Multas", pageWidth / 2, 20, { align: "center" });

    const encabezados = [["No. Multa", "Nombre de la Multa", "Monto (Q)"]];
    const datos = multas.map((m) => [m.TIP_MUL_ID, m.TIP_MULTA_NOMBRE, m.TIP_MUL_MONTO]);

    autoTable(doc, {
      startY: 40,
      head: encabezados,
      body: datos,
      styles: { fontSize: 10, textColor: "#000000" },
      headStyles: { fillColor: "#704a35", textColor: "#ffffff", halign: "center" },
      alternateRowStyles: { fillColor: "#edbc8b" },
      theme: "striped",
    });

    doc.save("TiposDeMultas-MIUMG.pdf");
  };

 

  return (
    <div>
      <h2>Reporte de Tipos de Multas</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            <th>No. Multa</th>
            <th>Nombre de la Multa</th>
            <th>Monto (Q)</th>
          </tr>
        </thead>
        <tbody>
          {multas.length > 0 ? (
            multas.map((multa) => (
              <tr key={multa.TIP_MUL_ID}>
                <td>{multa.TIP_MUL_ID}</td>
                <td>{multa.TIP_MULTA_NOMBRE}</td>
                <td>{multa.TIP_MUL_MONTO}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="generar-pdf" onClick={generarPDF}>
        Generar PDF
      </button>
    
    </div>
  );
};

export default ComponenteMultas;
