import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { obtenerParqueos } from "../Services/ServiceParqueo";
import autoTable from "jspdf-autotable";

// Definimos la interfaz para los objetos de parqueo
interface Parqueo {
  PAR_PARQUEO_ID: string;
  PAR_NUMERO_PARQUEO: string;
  TIP_TIPO_USUARIO_ID: string;
  EPAR_ESTADO_ID: string;
  PAR_SECCION: string;
}

const ComponenteParqueo = () => {
  const [parqueos, setParqueos] = useState<Parqueo[]>([]);

  useEffect(() => {
    const fetchParqueos = async () => {
      const data = await obtenerParqueos();
      setParqueos(data);
    };
    fetchParqueos();
  }, []);

  const logoURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/512px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL = "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";


  const generarPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.addImage(logoURL, "JPEG", pageWidth - 30, 10, 20, 20);
    doc.addImage(marcaAguaURL, "JPEG", pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100);

    doc.setFontSize(18);
    doc.text("Reporte de Parqueos", pageWidth / 2, 20, { align: "center" });

    const startY = 40;

    const encabezados = [["ID Estudiante", "Número Parqueo", "Tipo Jornada", "Estado Jornada", "Sección",],];

    const datos = parqueos.map((parqueo) => [
        parqueo.PAR_PARQUEO_ID,
        parqueo.PAR_NUMERO_PARQUEO,
        parqueo.TIP_TIPO_USUARIO_ID,
        parqueo.EPAR_ESTADO_ID,
        parqueo.PAR_SECCION,
    ]);

    autoTable(doc, {
      startY,
      head: encabezados,
      body: datos,
      styles: {
        fontSize: 8,
        textColor: "#000000",
      },
      headStyles: {
        fillColor: "#704a35", // Marrón para los encabezados
        textColor: "#ffffff", // Texto blanco
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: "#edbc8b", // Color para filas alternas
      },
      theme: "striped",
      margin: { top: 20 },
    });

    doc.save("Lista_Parqueos.pdf");
  };

  return (
    <div>
      <h2>Lista de Parqueos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue"}}>
            <th>ID Estudiante</th>
            <th>Número Parqueo</th>
            <th>Tipo Jornada</th>
            <th>Estado Jornada</th>
            <th>Sección</th>
          </tr>
        </thead>
        <tbody>
          {parqueos.length > 0 ? (
            parqueos.map((parqueo) => (
              <tr key={parqueo.PAR_PARQUEO_ID}>
                <td>{parqueo.PAR_PARQUEO_ID}</td>
                <td>{parqueo.PAR_NUMERO_PARQUEO}</td>
                <td>{parqueo.TIP_TIPO_USUARIO_ID}</td>
                <td>{parqueo.EPAR_ESTADO_ID}</td>
                <td>{parqueo.PAR_SECCION}</td>
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
        Generar PDF con Formato
      </button>
    </div>
  );
};

export default ComponenteParqueo;