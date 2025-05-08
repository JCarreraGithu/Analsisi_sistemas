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
    doc.text("Lista de Tipos de Multas", pageWidth / 2, 20, { align: "center" });

    const startY = 40;
    const encabezados = [["No. Multa", "Nombre de la Multa", "Monto (Q)"]];
    const datos = multas.map((m) => [m.TIP_MUL_ID, m.TIP_MULTA_NOMBRE, m.TIP_MUL_MONTO]);

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

    doc.save("TiposDeMultas-MIUMG.pdf");
  };

  const generarReportePowerBI = () => {
    window.open("https://app.powerbi.com/view?r=tu_reporte_id", "_blank");
  };

  return (
    <div>
      <h2>Listado de Tipos de Multas</h2>
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
      <button className="generar-reporte" onClick={generarReportePowerBI}>
        Generar Reporte Power BI
      </button>
    </div>
  );
};

export default ComponenteMultas;