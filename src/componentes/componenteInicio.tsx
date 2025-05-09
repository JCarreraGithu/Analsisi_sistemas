import React from "react";

const ComponenteInicio: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <div
        style={{
          backgroundColor: "#e6e6e6", // Color beige claro
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg/1024px-Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg.png"
          alt="Logo UMG"
          style={{ width: "100px", marginBottom: "20px" }}
        />
        <h2 style={{ color: "#352112", marginBottom: "10px" }}>
          Bienvenido al Modulo de reporteria - UMG
        </h2>
        <p style={{ color: "#352112", fontSize: "18px", lineHeight: "1.6" }}>
                Podras visualizar informacion sobre Parqueos, Multas, Clientes y Pagos realizados. En la parte superior podras ver el 
          <strong> control de parqueos, clientes, pagos y multas</strong> dentro de la Universidad Mariano Gálvez.
        </p>
        <p style={{ marginTop: "20px", color: "#704a35", fontWeight: "bold" }}>
          Selecciona una pestaña en el menú superior para comenzar.
        </p>
      </div>
    </div>
  );
};

export default ComponenteInicio;
