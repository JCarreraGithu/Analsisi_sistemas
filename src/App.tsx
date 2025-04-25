  import React, { useState } from "react";
  import ComponentClientes from "./componentes/ComponenteClientes";
  import ComponenteParqueo from "./componentes/ComponenteParqueos";
  import ComponentePagos from "./componentes/ComponentePagos";
  import ComponenteMultas from "./componentes/ComponenteMultas.tsx";

  import "./App.css"
  const App = () => {
    const [activeTab, setActiveTab] = useState("Clientes"); // Estado de la pestaña activa

    const renderContent = () => {
      switch (activeTab) {
        case "Parqueos":
          return <ComponenteParqueo />;
        case "Ingresos":
          return <div>Componente de Ingresos</div>;
        case "Permanencia":
          return <div>Componente de Permanencia</div>;
        case "Multas":
          return <ComponenteMultas />;
        case "Clientes":
          return <ComponentClientes />;
        case "Pagos":
           return <ComponentePagos />;
        default:
          return <div>Seleccione una pestaña</div>;
      }
    };

    return (
      <div className="container">
        <h1>PARQUEO-UMG</h1>
        <div className="tabs">
          {["Parqueos", "Multas", "Clientes", "Pagos"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? "active" : ""}>
              {tab}
            </button>
          ))}
        </div>
        <div className="content-box">{renderContent()}</div>
      </div>
    );
  };

  export default App;
