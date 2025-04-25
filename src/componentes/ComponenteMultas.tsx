import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerMultas } from "../Services/ServiceMultas.ts";
import autoTable from "jspdf-autotable";

interface multa {
  Id_multa: number;
  USU_NombreUsuario: string;
  Placa_Vehiculo: string;
  Nombre_Multa: string;
  Descripcion: string;
  Monto: number;
  Carnet_Cliente: string;
}

const ComponenteMultas = () => {
  const [multas, setMultas] = useState<multa[]>([]);

  useEffect(() => {
    const fetchMultas = async () => {
      const data = await obtenerMultas();
      setMultas(data);
    };
    fetchMultas();
  }, []);



  // Función para generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo de la universidad (si se quiere agregar)
    // doc.addImage(logoURL, "JPEG", 10, 10, 50, 50);

    // Título centrado
    doc.setFontSize(18);
    doc.text("Lista de Multas", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Espacio entre el título y la tabla
    const startY = 40;

    // Cabeceras de la tabla
    const encabezados = [
      [
        "No.Multa",
        "Nombre del Cliente",
        "Placa del Vehiculo",
        "Nombre de la Multa",
        "Descripcion",
        "Monto",
        "Carnet del Cliente",
        
      ],
    ];

    // Cuerpo de la tabla (datos)
    const datos = multas.map((multa) => [
        multa.Id_multa,
        multa.USU_NombreUsuario,
        multa.Placa_Vehiculo,
        multa.Nombre_Multa,
        multa.Descripcion,
        multa.Monto,
        multa.Carnet_Cliente,
    ]);

    // Estilos de la tabla y personalización de colores
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

    doc.save("Multas-MIUMG.pdf");
  };


  // URL del Reporte de Power BI (Reemplaza con la URL real)
  const generarReportePowerBI = () => {
    window.open("https://app.powerbi.com/view?r=tu_reporte_id", "_blank");
  };

  return (
    <div>
      <h2>Lista de Pagos</h2>
      <table border={1} width="100%">
        <thead>
          <tr style={{ backgroundColor: "lightblue" }}>
            <th>No. Multa</th>
            <th>Nombre del usuario</th>
            <th>Placa del Vehiculo</th>
            <th>Nombre de la Multa</th>
            <th>Descripcion</th>
            <th>Monto</th>
            <th>Carnet del Cliente</th>
          </tr>
        </thead>
        <tbody>
          {multas.length > 0 ? (
            multas.map((multa) => (
              <tr key={multa.Id_multa}>
                <td>{multa.USU_NombreUsuario}</td>
                <td>{multa.Placa_Vehiculo}</td>
                <td>{multa.Nombre_Multa}</td>
                <td>{multa.Descripcion}</td>
                <td>{multa.Monto}</td>
                <td>{multa.Carnet_Cliente}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay datos disponibles</td>
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