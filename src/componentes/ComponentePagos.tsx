import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerPagos } from "../Services/ServicePago";
import autoTable from "jspdf-autotable";

interface Pago {
  noBoleta: number;
  noOperacion: number;
  correlativo: string;
  fecha: string;
  cliente: string;
  tipPago: string;
  moneda: string;
  multaId: number;
  total: number;
  campo: string;
}

const ComponentePagos = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    const fetchPagos = async () => {
      const data = await obtenerPagos();
      setPagos(data);
    };
    fetchPagos();
  }, []);



  // Función para generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    // Logo de la universidad (si se quiere agregar)
    // doc.addImage(logoURL, "JPEG", 10, 10, 50, 50);

    // Título centrado
    doc.setFontSize(18);
    doc.text("Lista de Pagos", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    // Espacio entre el título y la tabla
    const startY = 40;

    // Cabeceras de la tabla
    const encabezados = [
      [
        "Boleta",
        "Operación",
        "Correlativo",
        "Fecha",
        "Cliente",
        "Tipo Pago",
        "Moneda",
        "MultaID",
        "Total",
        "Campo",
      ],
    ];

    // Cuerpo de la tabla (datos)
    const datos = pagos.map((pago) => [
      pago.noBoleta,
      pago.noOperacion,
      pago.correlativo,
      pago.fecha,
      pago.cliente,
      pago.tipPago,
      pago.moneda,
      pago.multaId,
      pago.total,
      pago.campo,
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

    doc.save("Pagos-MIUMG.pdf");
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
            <th>No. Boleta</th>
            <th>No. Operación</th>
            <th>Correlativo</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Tipo de Pago</th>
            <th>Moneda</th>
            <th>ID Multa</th>
            <th>Total</th>
            <th>Campo</th>
          </tr>
        </thead>
        <tbody>
          {pagos.length > 0 ? (
            pagos.map((pago) => (
              <tr key={pago.noBoleta}>
                <td>{pago.noBoleta}</td>
                <td>{pago.noOperacion}</td>
                <td>{pago.correlativo}</td>
                <td>{pago.fecha}</td>
                <td>{pago.cliente}</td>
                <td>{pago.tipPago}</td>
                <td>{pago.moneda}</td>
                <td>{pago.multaId}</td>
                <td>{pago.total}</td>
                <td>{pago.campo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>No hay datos disponibles</td>
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
