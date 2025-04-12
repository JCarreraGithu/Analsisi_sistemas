import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerPagos } from "../Services/ServicePago";

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
    doc.text("Lista de Pagos", 10, 10);

    let y = 20;
    doc.text("Boleta  Operación  Correlativo  Fecha  Cliente  Tipo Pago  Moneda  MultaID  Total  Campo", 10, y);
    y += 10;

    pagos.forEach((pago) => {
      doc.text(
        `${pago.noBoleta}  ${pago.noOperacion}  ${pago.correlativo}  ${pago.fecha}  ${pago.cliente}  ${pago.tipPago}  ${pago.moneda}  ${pago.multaId}  ${pago.total}  ${pago.campo}`,
        10,
        y
      );
      y += 10;
    });

    doc.save("Pagos.pdf");
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
