import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { obtenerParqueos } from "../Services/ServiceParqueo";
import autoTable from "jspdf-autotable";

// Definimos la interfaz para los objetos de parqueo
interface Parqueo {
  JOR_JORNADA_ID: string;
  PAR_NUMERO_PARQUEO: string;
  JOR_TIPO: string;
  EJOR_ESTADO_ID: string;
  PAR_SECCION: string;
  RES_ID_USUARIO: string;
  RES_RESERVACION_ID: string;
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

        // Fondo blanco para evitar fondo negro en JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Usa PNG para mantener transparencia
      };
      img.onerror = () => reject("No se pudo cargar la imagen desde la URL.");
    });
  };

  const generarPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      const [logoBase64, marcaAguaBase64] = await Promise.all([
        cargarImagenComoBase64(logoURL),
        cargarImagenComoBase64(marcaAguaURL),
      ]);

      doc.addImage(logoBase64, "PNG", pageWidth - 30, 10, 20, 20);
      doc.addImage(marcaAguaBase64, "PNG", pageWidth / 2 - 50, pageHeight / 2 - 50, 100, 100);

      doc.setFontSize(18);
      doc.text("Reporte de Parqueos", pageWidth / 2, 20, { align: "center" });

      const startY = 40;
      const encabezados = [["ID Estudiante", "Número Parqueo", "Tipo Jornada", "Estado Jornada", "Sección","Usuario Reservo","Reservacion"]];
      const datos = parqueos.map((p) => [
        p.JOR_JORNADA_ID,
        p.PAR_NUMERO_PARQUEO,
        p.JOR_TIPO,
        p.EJOR_ESTADO_ID,
        p.PAR_SECCION,
        p.RES_ID_USUARIO,
        p.RES_RESERVACION_ID,      ]);

      autoTable(doc, {
        startY,
        head: encabezados,
        body: datos,
        styles: {
          fontSize: 8,
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

      doc.save("Lista_Parqueos.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Parqueos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            <th>ID Estudiante</th>
            <th>Número Parqueo</th>
            <th>Tipo Jornada</th>
            <th>Estado Jornada</th>
            <th>Sección</th>
            <th>Usuario</th>
            <th>Reservacion</th>
          </tr>
        </thead>
        <tbody>
          {parqueos.length > 0 ? (
            parqueos.map((parqueo) => (
              <tr key={parqueo.JOR_JORNADA_ID}>
                <td>{parqueo.JOR_JORNADA_ID}</td>
                <td>{parqueo.PAR_NUMERO_PARQUEO}</td>
                <td>{parqueo.JOR_TIPO}</td>
                <td>{parqueo.EJOR_ESTADO_ID}</td>
                <td>{parqueo.PAR_SECCION}</td>
                <td>{parqueo.RES_ID_USUARIO}</td>
                <td>{parqueo.RES_RESERVACION_ID}</td>
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
