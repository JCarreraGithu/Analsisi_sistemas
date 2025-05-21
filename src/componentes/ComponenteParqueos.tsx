import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { obtenerParqueos } from "../Services/ServiceParqueo";

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
  const [filtroSeccion, setFiltroSeccion] = useState<string>("todos");
  const [filtroJornada, setFiltroJornada] = useState<string>("todos");

  const logoURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/512px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png";
  const marcaAguaURL =
    "https://assets.isu.pub/document-structure/221119120331-2636df8d77a0399b11446057db0bdd7d/v1/ee86784e8c89885cab00d66e46522eaf.jpeg";

  useEffect(() => {
    const fetchParqueos = async () => {
      const data = await obtenerParqueos();
      setParqueos(data);
    };
    fetchParqueos();
  }, []);

  const parqueosFiltrados = parqueos.filter(
    (p) =>
      (filtroSeccion === "todos" || p.PAR_SECCION === filtroSeccion) &&
      (filtroJornada === "todos" || p.JOR_TIPO === filtroJornada)
  );

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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
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

      const encabezados = [
        ["ID Estudiante", "Número Parqueo", "Tipo Jornada", "Estado Jornada", "Sección", "Usuario Reservó", "Reservación"],
      ];
      const datos = parqueosFiltrados.map((p) => [
        p.JOR_JORNADA_ID,
        p.PAR_NUMERO_PARQUEO,
        p.JOR_TIPO,
        p.EJOR_ESTADO_ID,
        p.PAR_SECCION,
        p.RES_ID_USUARIO,
        p.RES_RESERVACION_ID,
      ]);

      autoTable(doc, {
        startY: 40,
        head: encabezados,
        body: datos,
        styles: { fontSize: 8, textColor: "#000000" },
        headStyles: { fillColor: "#704a35", textColor: "#ffffff", halign: "center" },
        alternateRowStyles: { fillColor: "#edbc8b" },
        theme: "striped",
      });

      doc.save("Lista_Parqueos.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#4a4a4a" }}>Lista de Parqueos</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <label><strong>Sección:</strong></label>
        <select onChange={(e) => setFiltroSeccion(e.target.value)} style={{ padding: "5px" }}>
          <option value="todos">Todos</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <label><strong>Jornada:</strong></label>
        <select onChange={(e) => setFiltroJornada(e.target.value)} style={{ padding: "5px" }}>
          <option value="todos">Todos</option>
          <option value="MATUTINA">MATUTINA</option>
          <option value="VESPERTINA">VESPERTINA</option>
          <option value="NOCTURNA">NOCTURNA</option>
          <option value="COMPLETA SABADO">COMPLETA SABADO</option>
          <option value="COMPLETA DOMINGO">COMPLETA DOMINGO</option>
        </select>
      </div>

      <table border={1} width="100%" style={{ borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr style={{ backgroundColor: "#4a90e2", color: "#fff" }}>
            <th>ID Estudiante</th>
            <th>Número Parqueo</th>
            <th>Tipo Jornada</th>
            <th>Estado Jornada</th>
            <th>Sección</th>
            <th>Usuario</th>
            <th>Reservación</th>
          </tr>
        </thead>
        <tbody>
          {parqueosFiltrados.length > 0 ? (
            parqueosFiltrados.map((p) => (
              <tr key={p.JOR_JORNADA_ID}>
                <td>{p.JOR_JORNADA_ID}</td>
                <td>{p.PAR_NUMERO_PARQUEO}</td>
                <td>{p.JOR_TIPO}</td>
                <td>{p.EJOR_ESTADO_ID}</td>
                <td>{p.PAR_SECCION}</td>
                <td>{p.RES_ID_USUARIO}</td>
                <td>{p.RES_RESERVACION_ID}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={generarPDF} style={{ padding: "10px 20px", backgroundColor: "#704a35", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Generar PDF con Formato
        </button>
      </div>
    </div>
  );
};

export default ComponenteParqueo;
