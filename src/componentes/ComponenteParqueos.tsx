import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerParqueos } from "../Services/ServiceParqueo";

interface Parqueo {
  PAR_PARQUEO_ID: number;
  PAR_NUMERO_PARQUEO: number;
  TIP_TIPO_USUARIO_ID: number;
  PAR_SECCION: string;
  EPAR_ESTADO_ID: number;
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

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Parqueos", 10, 10); // Título

    let y = 20;
    doc.text("ID  Número  Tipo Usuario  Sección  Estado", 10, y);
    y += 10;

    parqueos.forEach((parqueo) => {
      doc.text(
        `${parqueo.PAR_PARQUEO_ID}  ${parqueo.PAR_NUMERO_PARQUEO}  ${parqueo.TIP_TIPO_USUARIO_ID}  ${parqueo.PAR_SECCION}  ${parqueo.EPAR_ESTADO_ID}`,
        10,
        y
      );
      y += 10;
    });

    // Descargar el PDF
    doc.save("Parqueos.pdf");
  };

  return (
    <div>
      <h2>Lista de Parqueos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightgreen" }}>
            <th>ID</th>
            <th>Número Parqueo</th>
            <th>Tipo Usuario</th>
            <th>Sección</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {parqueos.length > 0 ? (
            parqueos.map((parqueo) => (
              <tr key={parqueo.PAR_PARQUEO_ID}>
                <td>{parqueo.PAR_PARQUEO_ID}</td>
                <td>{parqueo.PAR_NUMERO_PARQUEO}</td>
                <td>{parqueo.TIP_TIPO_USUARIO_ID}</td>
                <td>{parqueo.PAR_SECCION}</td>
                <td>{parqueo.EPAR_ESTADO_ID}</td>
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
      <button className="generar-Reporte">Generar Reporte Power BI</button>

    </div>
  );
};

export default ComponenteParqueo;
