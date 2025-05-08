import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { obtenerParqueos } from "../Services/ServiceParqueo";

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

  const generarPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");


    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Lista de Parqueos", 15, 15);

    doc.autoTable({
      startY: 25,
      head: [["ID Estudiante", "Número Parqueo", "Tipo Jornada", "Estado Jornada", "Sección"]],
      body: parqueos.map((parqueo) => [
        parqueo.PAR_PARQUEO_ID,
        parqueo.PAR_NUMERO_PARQUEO,
        parqueo.TIP_TIPO_USUARIO_ID,
        parqueo.EPAR_ESTADO_ID,
        parqueo.PAR_SECCION,
      ]),
      theme: "grid",
      styles: {
        fontSize: 12,
        halign: "center",
      },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save("Lista_Parqueos.pdf");
  };

  return (
    <div>
      <h2>Reporte de Parqueos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightgreen", color: "white" }}>
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
